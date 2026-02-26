import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Calendar, User, FileText, CheckCircle, XCircle, Clock, 
  Phone, MapPin, Mail, X, Loader2, AlertCircle, Filter
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { useAuth } from '../../context/AuthContext';
import { leaveService, LeaveApplicationWithReviewer } from '../../services/leaveService';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';

const leaveTypes = [
  'Sick Leave',
  'Casual Leave',
  'Personal Leave',
  'Maternity Leave',
  'Paternity Leave',
  'Vacation Leave',
  'Emergency Leave',
  'Bereavement Leave',
  'Unpaid Leave'
];

const leaveTypeColors: { [key: string]: string } = {
  'Sick Leave': '#E53935',
  'Personal Leave': '#1E88E5',
  'Casual Leave': '#43A047',
  'Maternity Leave': '#7B1FA2',
  'Paternity Leave': '#F57C00',
  'Vacation Leave': '#00ACC1',
  'Emergency Leave': '#D32F2F',
  'Bereavement Leave': '#5E35B1',
  'Unpaid Leave': '#757575'
};

interface LeaveFormData {
  leave_type: string;
  from_date: string;
  to_date: string;
  reason: string;
  contact_during_leave: string;
  emergency_contact: string;
  address_during_leave: string;
}

export default function LeaveManagement() {
  const { user, userProfile, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingLeaves, setFetchingLeaves] = useState(true);
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplicationWithReviewer[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveApplicationWithReviewer | null>(null);
  const [reviewComments, setReviewComments] = useState('');
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');

  const [formData, setFormData] = useState<LeaveFormData>({
    leave_type: 'Sick Leave',
    from_date: '',
    to_date: '',
    reason: '',
    contact_during_leave: '',
    emergency_contact: '',
    address_during_leave: ''
  });

  useEffect(() => {
    fetchLeaveApplications();
  }, [user, isAdmin]);

  const fetchLeaveApplications = async () => {
    if (!user) return;

    setFetchingLeaves(true);
    try {
      let result;
      if (isAdmin) {
        result = await leaveService.getAllLeaveApplications();
      } else {
        result = await leaveService.getUserLeaveApplications(user.id);
      }

      if (result.error) {
        toast.error('Failed to fetch leave applications');
        console.error(result.error);
      } else {
        setLeaveApplications(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
      toast.error('An error occurred while fetching leave applications');
    } finally {
      setFetchingLeaves(false);
    }
  };

  const calculateDays = (fromDate: string, toDate: string): number => {
    if (!fromDate || !toDate) return 0;
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmitLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !userProfile) {
      toast.error('User information not found');
      return;
    }

    // Validation
    if (!formData.from_date || !formData.to_date) {
      toast.error('Please select both from and to dates');
      return;
    }

    if (new Date(formData.to_date) < new Date(formData.from_date)) {
      toast.error('End date cannot be before start date');
      return;
    }

    if (!formData.reason.trim()) {
      toast.error('Please provide a reason for leave');
      return;
    }

    setLoading(true);

    try {
      // Fetch additional profile data based on role
      let employeeId = '';
      let department = '';

      if (userProfile.role === 'teacher') {
        const { data: teacherProfile } = await supabase
          .from('teacher_profiles')
          .select('employee_id, subject_specialization')
          .eq('id', user.id)
          .single();
        
        employeeId = teacherProfile?.employee_id || '';
        department = teacherProfile?.subject_specialization || '';
      } else if (userProfile.role === 'staff') {
        const { data: staffProfile } = await supabase
          .from('staff_profiles')
          .select('department, position')
          .eq('id', user.id)
          .single();
        
        department = staffProfile?.department || '';
      }

      const totalDays = calculateDays(formData.from_date, formData.to_date);

      const leaveData = {
        user_id: user.id,
        applicant_name: `${userProfile.first_name} ${userProfile.last_name}`,
        applicant_role: userProfile.role as 'teacher' | 'staff' | 'admin',
        employee_id: employeeId,
        department: department,
        leave_type: formData.leave_type,
        from_date: formData.from_date,
        to_date: formData.to_date,
        total_days: totalDays,
        reason: formData.reason,
        contact_during_leave: formData.contact_during_leave || userProfile.phone_number,
        emergency_contact: formData.emergency_contact,
        address_during_leave: formData.address_during_leave
      };

      const { data, error } = await leaveService.submitLeaveApplication(leaveData);

      if (error) {
        toast.error('Failed to submit leave application');
        console.error(error);
      } else {
        toast.success('Leave application submitted successfully');
        setFormData({
          leave_type: 'Sick Leave',
          from_date: '',
          to_date: '',
          reason: '',
          contact_during_leave: '',
          emergency_contact: '',
          address_during_leave: ''
        });
        fetchLeaveApplications();
      }
    } catch (error) {
      console.error('Error submitting leave:', error);
      toast.error('An error occurred while submitting leave application');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewLeave = async () => {
    if (!selectedLeave || !user) return;

    if (reviewAction === 'reject' && !reviewComments.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setLoading(true);

    try {
      let result;
      if (reviewAction === 'approve') {
        result = await leaveService.approveLeaveApplication(
          selectedLeave.id!,
          user.id,
          reviewComments
        );
      } else {
        result = await leaveService.rejectLeaveApplication(
          selectedLeave.id!,
          user.id,
          reviewComments
        );
      }

      if (result.error) {
        toast.error(`Failed to ${reviewAction} leave application`);
      } else {
        toast.success(`Leave application ${reviewAction}d successfully`);
        setShowReviewModal(false);
        setSelectedLeave(null);
        setReviewComments('');
        fetchLeaveApplications();
      }
    } catch (error) {
      console.error('Error reviewing leave:', error);
      toast.error('An error occurred while processing the request');
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (leave: LeaveApplicationWithReviewer, action: 'approve' | 'reject') => {
    setSelectedLeave(leave);
    setReviewAction(action);
    setShowReviewModal(true);
    setReviewComments('');
  };

  const filteredApplications = leaveApplications.filter(leave => {
    if (filterStatus === 'all') return true;
    return leave.status === filterStatus;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="mb-2">Leave Management</h1>
          <p className="text-gray-600">Manage leave requests and approvals</p>
        </div>
      </motion.div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Apply Leave Form */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong rounded-2xl p-6 shadow-soft"
        >
          <h3 className="text-gray-800 mb-6">Apply for Leave</h3>
          <form onSubmit={handleSubmitLeave} className="space-y-4">
            {/* Leave Type */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Leave Type</label>
              <select 
                value={formData.leave_type}
                onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                className="w-full h-11 px-4 rounded-xl bg-white border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20"
                required
              >
                {leaveTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* From Date */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block">From Date</label>
              <Input 
                type="date" 
                value={formData.from_date}
                onChange={(e) => setFormData({ ...formData, from_date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="bg-white border-gray-200 rounded-xl h-11"
                required
              />
            </div>

            {/* To Date */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block">To Date</label>
              <Input 
                type="date" 
                value={formData.to_date}
                onChange={(e) => setFormData({ ...formData, to_date: e.target.value })}
                min={formData.from_date || new Date().toISOString().split('T')[0]}
                className="bg-white border-gray-200 rounded-xl h-11"
                required
              />
            </div>

            {/* Reason */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Reason</label>
              <Textarea 
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Enter reason for leave..."
                className="bg-white border-gray-200 rounded-xl resize-none"
                rows={4}
                required
              />
            </div>

            {/* Submit Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                type="submit"
                disabled={loading}
                className="w-full gradient-primary text-white shadow-glow rounded-xl h-11"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>

        {/* Right Side - Leave Requests */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-4"
        >
          {fetchingLeaves ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#1E88E5]" />
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="glass-strong rounded-2xl p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-800 mb-2">No leave applications found</h3>
              <p className="text-gray-500">
                {filterStatus === 'all' 
                  ? 'No leave applications to display'
                  : `No ${filterStatus} leave applications`}
              </p>
            </div>
          ) : (
            filteredApplications.map((leave, index) => {
              const typeColor = leaveTypeColors[leave.leave_type] || '#1E88E5';
              
              return (
                <motion.div
                  key={leave.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="glass-strong rounded-2xl p-6 shadow-soft hover:shadow-float transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E88E5] to-[#5B9FFF] flex items-center justify-center text-white font-semibold flex-shrink-0"
                      >
                        {getInitials(leave.applicant_name)}
                      </div>
                      <div>
                        <h4 className="text-gray-800 mb-1">{leave.applicant_name}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-sm text-gray-500">
                            {leave.applicant_role.charAt(0).toUpperCase() + leave.applicant_role.slice(1)}
                          </p>
                          {leave.employee_id && (
                            <>
                              <span className="text-gray-300">•</span>
                              <p className="text-sm text-gray-500">ID: {leave.employee_id}</p>
                            </>
                          )}
                        </div>
                        <Badge 
                          variant="outline" 
                          className="border-0 text-xs"
                          style={{ 
                            backgroundColor: `${typeColor}15`,
                            color: typeColor
                          }}
                        >
                          {leave.leave_type}
                        </Badge>
                      </div>
                    </div>

                    <Badge 
                      variant="outline"
                      className={`
                        ${leave.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-200' : ''}
                        ${leave.status === 'approved' ? 'bg-green-50 text-green-600 border-green-200' : ''}
                        ${leave.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-200' : ''}
                        ${leave.status === 'cancelled' ? 'bg-gray-50 text-gray-600 border-gray-200' : ''}
                      `}
                    >
                      {leave.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                      {leave.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {leave.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </Badge>
                  </div>

                  {/* Leave Duration */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-white/60">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-[#1E88E5]" />
                        <p className="text-xs text-gray-500">From</p>
                      </div>
                      <p className="text-sm font-medium text-gray-800">
                        {new Date(leave.from_date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/60">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-[#1E88E5]" />
                        <p className="text-xs text-gray-500">To</p>
                      </div>
                      <p className="text-sm font-medium text-gray-800">
                        {new Date(leave.to_date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/60">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-[#1E88E5]" />
                        <p className="text-xs text-gray-500">Days</p>
                      </div>
                      <p className="text-sm font-medium text-gray-800">{leave.total_days} days</p>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="p-4 rounded-xl bg-white/60 mb-4">
                    <p className="text-xs text-gray-500 mb-1">Reason:</p>
                    <p className="text-sm text-gray-700">{leave.reason}</p>
                  </div>

                  {/* Review Information */}
                  {leave.status !== 'pending' && leave.reviewer && (
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 mb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-blue-600 mb-1">Reviewed by:</p>
                          <p className="text-sm font-medium text-blue-900">
                            {leave.reviewer.first_name} {leave.reviewer.last_name}
                          </p>
                          {leave.reviewed_at && (
                            <p className="text-xs text-blue-600 mt-1">
                              on {new Date(leave.reviewed_at).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                      {leave.review_comments && (
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <p className="text-xs text-blue-600 mb-1">Comments:</p>
                          <p className="text-sm text-blue-900">{leave.review_comments}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons (Admin Only for Pending Leaves) */}
                  {isAdmin && leave.status === 'pending' && (
                    <div className="flex gap-2">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button 
                          onClick={() => openReviewModal(leave, 'approve')}
                          variant="outline" 
                          className="w-full rounded-xl bg-green-50 hover:bg-green-100 border-green-200 text-green-600 gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button 
                          onClick={() => openReviewModal(leave, 'reject')}
                          variant="outline" 
                          className="w-full rounded-xl bg-red-50 hover:bg-red-100 border-red-200 text-red-600 gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>

      {/* Review Modal (Admin Only) */}
      <AnimatePresence>
        {showReviewModal && selectedLeave && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-strong rounded-2xl p-6 shadow-float max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-800">
                  {reviewAction === 'approve' ? 'Approve' : 'Reject'} Leave Application
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowReviewModal(false)}
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/60">
                  <p className="text-sm text-gray-600 mb-1">Applicant:</p>
                  <p className="text-gray-800 font-medium">{selectedLeave.applicant_name}</p>
                  <p className="text-sm text-gray-600 mt-2">Leave Type:</p>
                  <p className="text-gray-800">{selectedLeave.leave_type}</p>
                  <p className="text-sm text-gray-600 mt-2">Duration:</p>
                  <p className="text-gray-800">
                    {new Date(selectedLeave.from_date).toLocaleDateString()} - {new Date(selectedLeave.to_date).toLocaleDateString()} 
                    ({selectedLeave.total_days} days)
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-2 block">
                    Comments {reviewAction === 'reject' && <span className="text-red-500">*</span>}
                  </label>
                  <Textarea 
                    value={reviewComments}
                    onChange={(e) => setReviewComments(e.target.value)}
                    placeholder={
                      reviewAction === 'approve' 
                        ? 'Add any comments (optional)...' 
                        : 'Please provide a reason for rejection...'
                    }
                    className="bg-white border-gray-200 rounded-xl resize-none"
                    rows={4}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 rounded-xl h-11"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleReviewLeave}
                    className={`flex-1 rounded-xl h-11 ${
                      reviewAction === 'approve'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {reviewAction === 'approve' ? (
                          <><CheckCircle className="w-4 h-4 mr-2" /> Approve</>
                        ) : (
                          <><XCircle className="w-4 h-4 mr-2" /> Reject</>
                        )}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
