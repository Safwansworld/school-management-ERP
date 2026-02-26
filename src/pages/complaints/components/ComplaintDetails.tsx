// // pages/complaints/components/ComplaintDetails.tsx
// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import {
//     X,
//     Clock,
//     User,
//     FileText,
//     MessageSquare,
//     Send,
//     CheckCircle,
//     AlertCircle,
//     Download,
//     Loader2,
// } from 'lucide-react';
// import { Button } from '../../../components/ui/button';
// import { Badge } from '../../../components/ui/badge';
// import { supabase } from '../../../lib/supabase';
// import type { Complaint, ComplaintFollowup } from '../../../types/complaints';

// interface ComplaintDetailsProps {
//     complaint: Complaint;
//     onClose: () => void;
//     onUpdate: () => void;
//     userRole: string;
//     userId: string | undefined;
// }

// export default function ComplaintDetails({
//     complaint,
//     onClose,
//     onUpdate,
//     userRole,
//     userId,
// }: ComplaintDetailsProps) {
//     const [followups, setFollowups] = useState<ComplaintFollowup[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [newFollowup, setNewFollowup] = useState('');
//     const [followupType, setFollowupType] = useState<string>('comment');
//     const [submitting, setSubmitting] = useState(false);
//     const [statusUpdate, setStatusUpdate] = useState<'pending' | 'in-progress' | 'resolved' | 'closed' | 'rejected'>(complaint.status);
//     const [assignedTo, setAssignedTo] = useState(complaint.assigned_to || '');
//     const [adminUsers, setAdminUsers] = useState<any[]>([]);

//     const isAdmin = userRole === 'admin';
//     const canResolve = isAdmin || complaint.assigned_to === userId;

//     useEffect(() => {
//         fetchFollowups();
//         if (isAdmin) {
//             fetchAdminUsers();
//         }

//         // Subscribe to real-time followup updates
//         const subscription = supabase
//             .channel(`followups_${complaint.id}`)
//             .on(
//                 'postgres_changes',
//                 {
//                     event: 'INSERT',
//                     schema: 'public',
//                     table: 'complaint_followups',
//                     filter: `complaint_id=eq.${complaint.id}`,
//                 },
//                 () => {
//                     fetchFollowups();
//                 }
//             )
//             .subscribe();

//         return () => {
//             subscription.unsubscribe();
//         };
//     }, [complaint.id]);

//     const fetchFollowups = async () => {
//         try {
//             setLoading(true);
//             const { data, error } = await supabase
//                 .from('complaint_followups')
//                 .select('*')
//                 .eq('complaint_id', complaint.id)
//                 .order('created_at', { ascending: true });

//             if (error) throw error;
//             setFollowups(data || []);
//         } catch (error) {
//             console.error('Error fetching followups:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchAdminUsers = async () => {
//         try {
//             const { data, error } = await supabase
//                 .from('auth.users')
//                 .select('id, raw_user_meta_data')
//                 .eq('raw_user_meta_data->>role', 'admin');

//             if (error) throw error;
//             setAdminUsers(data || []);
//         } catch (error) {
//             console.error('Error fetching admin users:', error);
//         }
//     };

//     const handleSubmitFollowup = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!newFollowup.trim() || !userId) return;

//         try {
//             setSubmitting(true);

//             // Get user info
//             let userName = '';
//             if (userRole === 'student') {
//                 const { data } = await supabase
//                     .from('students')
//                     .select('full_name')
//                     .eq('id', userId)
//                     .single();
//                 userName = data?.full_name || '';
//             } else if (userRole === 'teacher') {
//                 const { data } = await supabase
//                     .from('teachers')
//                     .select('full_name')
//                     .eq('id', userId)
//                     .single();
//                 userName = data?.full_name || '';
//             }

//             const { error } = await supabase.from('complaint_followups').insert({
//                 complaint_id: complaint.id,
//                 followup_type: followupType,
//                 message: newFollowup,
//                 added_by: userId,
//                 added_by_name: userName,
//                 added_by_role: userRole,
//                 next_action_required: false,
//             });

//             if (error) throw error;

//             setNewFollowup('');
//             setFollowupType('comment');
//             fetchFollowups();
//         } catch (error) {
//             console.error('Error submitting followup:', error);
//             alert('Failed to submit followup. Please try again.');
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleStatusUpdate = async () => {
//         if (!isAdmin) return;

//         try {
//             const updateData: any = { status: statusUpdate };

//             if (statusUpdate === 'resolved') {
//                 updateData.resolved_at = new Date().toISOString();
//             } else if (statusUpdate === 'closed') {
//                 updateData.closed_at = new Date().toISOString();
//             }

//             if (assignedTo && assignedTo !== complaint.assigned_to) {
//                 updateData.assigned_to = assignedTo;
//             }

//             const { error } = await supabase
//                 .from('complaints')
//                 .update(updateData)
//                 .eq('id', complaint.id);

//             if (error) throw error;

//             onUpdate();
//         } catch (error) {
//             console.error('Error updating complaint:', error);
//             alert('Failed to update complaint status.');
//         }
//     };

//     const handleApproval = async (approved: boolean) => {
//         if (!isAdmin) return;

//         try {
//             const updateData: any = {
//                 requires_approval: false,
//                 approved_by: userId,
//                 approved_at: new Date().toISOString(),
//             };

//             if (!approved) {
//                 updateData.status = 'rejected';
//             }

//             const { error } = await supabase
//                 .from('complaints')
//                 .update(updateData)
//                 .eq('id', complaint.id);

//             if (error) throw error;

//             onUpdate();
//         } catch (error) {
//             console.error('Error updating approval:', error);
//             alert('Failed to update approval status.');
//         }
//     };

//     const categoryColors: Record<string, string> = {
//         academic: '#1E88E5',
//         behaviour: '#E53935',
//         safety: '#43A047',
//         facility: '#7B1FA2',
//         fee: '#F57C00',
//         transport: '#00897B',
//         other: '#5E35B1',
//     };

//     const categoryColor = categoryColors[complaint.complaint_type] || categoryColors.other;

//     const formatDate = (dateString: string) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             month: 'short',
//             day: 'numeric',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//         });
//     };

//     return (
//         <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
//             onClick={onClose}
//         >
//             <motion.div
//                 initial={{ scale: 0.9, y: 20 }}
//                 animate={{ scale: 1, y: 0 }}
//                 exit={{ scale: 0.9, y: 20 }}
//                 onClick={(e) => e.stopPropagation()}
//                 className="glass-strong rounded-2xl shadow-float max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
//             >
//                 {/* Header */}
//                 <div className="sticky top-0 z-10 glass-strong border-b border-gray-200 px-6 py-4">
//                     <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                             <div className="flex items-center gap-3 mb-2">
//                                 <span className="text-xs text-gray-500 font-mono">
//                                     {complaint.complaint_number}
//                                 </span>
//                                 <Badge
//                                     variant="outline"
//                                     className="border-0 text-xs"
//                                     style={{
//                                         backgroundColor: `${categoryColor}15`,
//                                         color: categoryColor,
//                                     }}
//                                 >
//                                     {complaint.complaint_type}
//                                 </Badge>
//                             </div>
//                             <h2 className="text-gray-800 mb-2">{complaint.title}</h2>
//                         </div>
//                         <button
//                             onClick={onClose}
//                             className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
//                         >
//                             <X className="w-5 h-5 text-gray-500" />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Content */}
//                 <div className="flex-1 overflow-y-auto">
//                     <div className="p-6 space-y-6">
//                         {/* Approval Section */}
//                         {isAdmin && complaint.requires_approval && !complaint.approved_by && (
//                             <div className="glass rounded-xl p-4 bg-yellow-50/50 border border-yellow-200">
//                                 <div className="flex items-center justify-between">
//                                     <div className="flex items-center gap-3">
//                                         <AlertCircle className="w-5 h-5 text-yellow-600" />
//                                         <div>
//                                             <h4 className="text-sm font-semibold text-gray-800">
//                                                 Approval Required
//                                             </h4>
//                                             <p className="text-xs text-gray-600">
//                                                 This complaint needs admin approval before processing
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <div className="flex gap-2">
//                                         <Button
//                                             onClick={() => handleApproval(false)}
//                                             variant="outline"
//                                             size="sm"
//                                             className="rounded-lg bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
//                                         >
//                                             Reject
//                                         </Button>
//                                         <Button
//                                             onClick={() => handleApproval(true)}
//                                             size="sm"
//                                             className="rounded-lg bg-green-600 hover:bg-green-700 text-white"
//                                         >
//                                             Approve
//                                         </Button>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Complaint Details */}
//                         <div className="glass rounded-xl p-6 space-y-4">
//                             <h4 className="text-sm font-semibold text-gray-700">Complaint Details</h4>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="text-xs text-gray-500">Complainant</label>
//                                     <p className="text-sm text-gray-800 font-medium">
//                                         {complaint.complainant_name}
//                                         <span className="ml-2 text-xs text-gray-500">
//                                             ({complaint.complainant_role})
//                                         </span>
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <label className="text-xs text-gray-500">Against</label>
//                                     <p className="text-sm text-gray-800 font-medium">
//                                         {complaint.against_name}
//                                         <span className="ml-2 text-xs text-gray-500">
//                                             ({complaint.against_role})
//                                         </span>
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <label className="text-xs text-gray-500">Incident Date</label>
//                                     <p className="text-sm text-gray-800">
//                                         {new Date(complaint.incident_date).toLocaleDateString()}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <label className="text-xs text-gray-500">Priority</label>
//                                     <p className="text-sm text-gray-800 capitalize">{complaint.urgency_level}</p>
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="text-xs text-gray-500 mb-2 block">Description</label>
//                                 <p className="text-sm text-gray-700 leading-relaxed">
//                                     {complaint.description}
//                                 </p>
//                             </div>

//                             {complaint.attachments && complaint.attachments.length > 0 && (
//                                 <div>
//                                     <label className="text-xs text-gray-500 mb-2 block">Attachments</label>
//                                     <div className="flex flex-wrap gap-2">
//                                         {complaint.attachments.map((url: string, index: number) => (
//                                             <a
//                                                 key={index}
//                                                 href={url}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
//                                             >
//                                                 <Download className="w-4 h-4" />
//                                                 Attachment {index + 1}
//                                             </a>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Admin Controls */}
//                         {isAdmin && (
//                             <div className="glass rounded-xl p-6 space-y-4">
//                                 <h4 className="text-sm font-semibold text-gray-700">Admin Controls</h4>

//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <label className="text-xs text-gray-500 mb-2 block">Status</label>
//                                         <select
//                                             value={statusUpdate}
//                                             onChange={(e) => {
//                                                 const newStatus = e.target.value as 'pending' | 'in-progress' | 'resolved' | 'closed' | 'rejected';
//                                                 setStatusUpdate(newStatus);
//                                             }}
//                                             className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20"
//                                         >
//                                             <option value="pending">Pending</option>
//                                             <option value="in-progress">In Progress</option>
//                                             <option value="resolved">Resolved</option>
//                                             <option value="closed">Closed</option>
//                                             <option value="rejected">Rejected</option>
//                                         </select>
//                                     </div>
//                                     <div>
//                                         <label className="text-xs text-gray-500 mb-2 block">Assign To</label>
//                                         <select
//                                             value={assignedTo}
//                                             onChange={(e) => setAssignedTo(e.target.value)}
//                                             className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20"
//                                         >
//                                             <option value="">Not Assigned</option>
//                                             {adminUsers.map((admin) => (
//                                                 <option key={admin.id} value={admin.id}>
//                                                     {admin.raw_user_meta_data?.full_name || admin.email}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                 </div>

//                                 <Button
//                                     onClick={handleStatusUpdate}
//                                     className="gradient-primary text-white rounded-lg"
//                                     size="sm"
//                                 >
//                                     Update Status
//                                 </Button>
//                             </div>
//                         )}


//                         {/* Follow-ups */}
//                         <div className="glass rounded-xl p-6 space-y-4">
//                             <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                                 <MessageSquare className="w-4 h-4" />
//                                 Follow-ups & Comments ({followups.length})
//                             </h4>

//                             {loading ? (
//                                 <div className="flex justify-center py-8">
//                                     <Loader2 className="w-6 h-6 animate-spin text-[#1E88E5]" />
//                                 </div>
//                             ) : followups.length === 0 ? (
//                                 <p className="text-sm text-gray-500 text-center py-8">
//                                     No follow-ups yet. Be the first to comment!
//                                 </p>
//                             ) : (
//                                 <div className="space-y-3 max-h-80 overflow-y-auto">
//                                     {followups.map((followup) => (
//                                         <div
//                                             key={followup.id}
//                                             className="p-4 bg-gray-50 rounded-lg border border-gray-100"
//                                         >
//                                             <div className="flex items-start justify-between mb-2">
//                                                 <div className="flex items-center gap-2">
//                                                     <User className="w-4 h-4 text-gray-400" />
//                                                     <span className="text-sm font-medium text-gray-800">
//                                                         {followup.added_by_name}
//                                                     </span>
//                                                     <Badge variant="outline" className="text-xs">
//                                                         {followup.added_by_role}
//                                                     </Badge>
//                                                 </div>
//                                                 <span className="text-xs text-gray-500">
//                                                     {formatDate(followup.created_at)}
//                                                 </span>
//                                             </div>
//                                             <p className="text-sm text-gray-700">{followup.message}</p>
//                                             {followup.status_update && (
//                                                 <Badge variant="outline" className="mt-2 text-xs">
//                                                     Status: {followup.status_update}
//                                                 </Badge>
//                                             )}
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}

//                             {/* Add Follow-up Form */}
//                             <form onSubmit={handleSubmitFollowup} className="space-y-3">
//                                 <div>
//                                     <select
//                                         value={followupType}
//                                         onChange={(e) => setFollowupType(e.target.value)}
//                                         className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20"
//                                     >
//                                         <option value="comment">Comment</option>
//                                         <option value="action_taken">Action Taken</option>
//                                         <option value="response">Response</option>
//                                         {isAdmin && <option value="escalation">Escalation</option>}
//                                         {canResolve && <option value="resolution">Resolution</option>}
//                                     </select>
//                                 </div>
//                                 <textarea
//                                     value={newFollowup}
//                                     onChange={(e) => setNewFollowup(e.target.value)}
//                                     placeholder="Add a follow-up or comment..."
//                                     rows={3}
//                                     className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 resize-none"
//                                 />
//                                 <Button
//                                     type="submit"
//                                     disabled={submitting || !newFollowup.trim()}
//                                     className="gradient-primary text-white rounded-lg gap-2"
//                                     size="sm"
//                                 >
//                                     {submitting ? (
//                                         <Loader2 className="w-4 h-4 animate-spin" />
//                                     ) : (
//                                         <Send className="w-4 h-4" />
//                                     )}
//                                     Submit
//                                 </Button>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </motion.div>
//         </motion.div>
//     );
// }
// components/complaints/ComplaintDetails.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Clock,
  User,
  FileText,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Download,
  Loader2,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { supabase } from '../../../lib/supabase';
import { complaintService } from '../../../services/complaintService';
import { useAuth } from '../../../context/AuthContext';
import type { Complaint, ComplaintFollowup } from '../../../types/complaints';

interface ComplaintDetailsProps {
  complaint: Complaint;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ComplaintDetails({
  complaint,
  onClose,
  onUpdate,
}: ComplaintDetailsProps) {
  const { user, userProfile, isAdmin, isTeacher } = useAuth();
  
  const [followups, setFollowups] = useState<ComplaintFollowup[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFollowup, setNewFollowup] = useState('');
  const [followupType, setFollowupType] = useState<string>('comment');
  const [submitting, setSubmitting] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState<string>(complaint.status);
  const [showApproval, setShowApproval] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showAssignment, setShowAssignment] = useState(false);
  const [assignToId, setAssignToId] = useState('');
  const [assignToName, setAssignToName] = useState('');
  const [teachers, setTeachers] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);

  // Debug logging
  useEffect(() => {
    console.log('🔍 ComplaintDetails Debug:', {
      userRole: userProfile?.role,
      isAdmin,
      isTeacher,
      userId: user?.id,
      complaint_status: complaint.status,
      complaint_requires_approval: complaint.requires_approval,
      complaint_approved_by: complaint.approved_by,
      complaint_assigned_to: complaint.assigned_to,
    });
  }, [userProfile, isAdmin, user, complaint]);

  useEffect(() => {
    fetchFollowups();
    if (isAdmin) {
      fetchAssignableUsers();
    }
  }, [complaint.id, isAdmin]);

  const fetchFollowups = async () => {
    try {
      setLoading(true);
      const data = await complaintService.getFollowups(complaint.id);
      setFollowups(data);
    } catch (error) {
      console.error('Error fetching followups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignableUsers = async () => {
    try {
      const [teachersData, staffData] = await Promise.all([
        complaintService.getActiveTeachers(),
        complaintService.getActiveStaff(),
      ]);
      setTeachers(teachersData);
      setStaff(staffData);
    } catch (error) {
      console.error('Error fetching assignable users:', error);
    }
  };

  const handleApprove = async () => {
    if (!user || !isAdmin) {
      alert('Only admins can approve complaints');
      return;
    }

    try {
      setSubmitting(true);
      await complaintService.approveComplaint(complaint.id, user.id);
      
      // Add approval followup
      await complaintService.addFollowup(
        complaint.id,
        {
          followup_type: 'action_taken',
          message: 'Complaint approved and moved to in-progress status',
          status_update: 'in-progress',
        },
        user.id,
        `${userProfile?.first_name} ${userProfile?.last_name}`,
        userProfile?.role || 'admin'
      );

      alert('Complaint approved successfully!');
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error('Error approving complaint:', error);
      alert(error.message || 'Failed to approve complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!user || !isAdmin) {
      alert('Only admins can reject complaints');
      return;
    }

    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setSubmitting(true);
      await complaintService.rejectComplaint(
        complaint.id,
        user.id,
        rejectionReason
      );

      // Add rejection followup
      await complaintService.addFollowup(
        complaint.id,
        {
          followup_type: 'action_taken',
          message: `Complaint rejected. Reason: ${rejectionReason}`,
          status_update: 'rejected',
        },
        user.id,
        `${userProfile?.first_name} ${userProfile?.last_name}`,
        userProfile?.role || 'admin'
      );

      alert('Complaint rejected');
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error('Error rejecting complaint:', error);
      alert(error.message || 'Failed to reject complaint');
    } finally {
      setSubmitting(false);
      setShowApproval(false);
      setRejectionReason('');
    }
  };

  const handleAssign = async () => {
    if (!user || !isAdmin) {
      alert('Only admins can assign complaints');
      return;
    }

    if (!assignToId || !assignToName) {
      alert('Please select a user to assign');
      return;
    }

    try {
      setSubmitting(true);
      await complaintService.assignComplaint(
        complaint.id,
        assignToId,
        assignToName
      );

      // Add assignment followup
      await complaintService.addFollowup(
        complaint.id,
        {
          followup_type: 'action_taken',
          message: `Complaint assigned to ${assignToName}`,
        },
        user.id,
        `${userProfile?.first_name} ${userProfile?.last_name}`,
        userProfile?.role || 'admin'
      );

      alert('Complaint assigned successfully!');
      setShowAssignment(false);
      setAssignToId('');
      setAssignToName('');
      onUpdate();
    } catch (error: any) {
      console.error('Error assigning complaint:', error);
      alert(error.message || 'Failed to assign complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!user || !userProfile) {
      alert('You must be logged in');
      return;
    }

    // Check permissions
    const canChangeStatus =
      isAdmin ||
      isTeacher ||
      (complaint.assigned_to === user.id);

    if (!canChangeStatus) {
      alert('You do not have permission to change status');
      return;
    }

    try {
      setSubmitting(true);
      await complaintService.updateComplaintStatus(
        complaint.id,
        newStatus,
        user.id,
        `${userProfile.first_name} ${userProfile.last_name}`
      );

      // Add status change followup
      await complaintService.addFollowup(
        complaint.id,
        {
          followup_type: 'action_taken',
          message: `Status changed to ${newStatus}`,
          status_update: newStatus,
        },
        user.id,
        `${userProfile.first_name} ${userProfile.last_name}`,
        userProfile.role
      );

      setStatusUpdate(newStatus);
      alert('Status updated successfully!');
      onUpdate();
    } catch (error: any) {
      console.error('Error updating status:', error);
      alert(error.message || 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddFollowup = async () => {
    if (!user || !userProfile) {
      alert('You must be logged in');
      return;
    }

    if (!newFollowup.trim()) {
      alert('Please enter a message');
      return;
    }

    // Check permissions
    const canAddFollowup =
      isAdmin ||
      isTeacher ||
      (complaint.assigned_to === user.id);

    if (!canAddFollowup) {
      alert('You do not have permission to add follow-ups');
      return;
    }

    try {
      setSubmitting(true);
      await complaintService.addFollowup(
        complaint.id,
        {
          followup_type: followupType,
          message: newFollowup,
        },
        user.id,
        `${userProfile.first_name} ${userProfile.last_name}`,
        userProfile.role
      );

      setNewFollowup('');
      setFollowupType('comment');
      await fetchFollowups();
      alert('Follow-up added successfully!');
    } catch (error: any) {
      console.error('Error adding followup:', error);
      alert(error.message || 'Failed to add follow-up');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssigneeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) return;

    const [type, id] = value.split('_');
    
    if (type === 'teacher') {
      const teacher = teachers.find(t => t.id === id);
      if (teacher) {
        setAssignToId(id);
        setAssignToName(teacher.full_name);
      }
    } else if (type === 'staff') {
      const staffMember = staff.find(s => s.id === id);
      if (staffMember) {
        setAssignToId(id);
        setAssignToName(staffMember.staff_name);
      }
    }
  };

  // Check if user can take actions
  const canTakeActions = isAdmin || (complaint.assigned_to === user?.id);
  const needsApproval = complaint.requires_approval && !complaint.approved_by;

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
    resolved: 'bg-green-100 text-green-800 border-green-200',
    closed: 'bg-gray-100 text-gray-800 border-gray-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
  };

  const priorityColors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-orange-100 text-orange-700',
    high: 'bg-red-100 text-red-700',
    critical: 'bg-red-200 text-red-900 font-bold',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#1E88E5] to-[#1976D2] text-white p-6 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">{complaint.complaint_number}</h2>
              <Badge className={`${statusColors[complaint.status]} border`}>
                {complaint.status}
              </Badge>
              <Badge className={priorityColors[complaint.urgency_level]}>
                {complaint.urgency_level}
              </Badge>
            </div>
            <p className="text-white/90">{complaint.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Approval Banner - ADMIN ONLY */}
          {isAdmin && needsApproval && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6"
            >
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900 mb-2">
                    Pending Approval
                  </h3>
                  <p className="text-yellow-800 text-sm mb-4">
                    This complaint requires admin approval before it can be processed
                  </p>
                  
                  {!showApproval ? (
                    <div className="flex gap-3">
                      <Button
                        onClick={handleApprove}
                        disabled={submitting}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Approve Complaint
                      </Button>
                      <Button
                        onClick={() => setShowApproval(true)}
                        disabled={submitting}
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter reason for rejection..."
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                      />
                      <div className="flex gap-3">
                        <Button
                          onClick={handleReject}
                          disabled={submitting || !rejectionReason.trim()}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Rejecting...
                            </>
                          ) : (
                            'Confirm Rejection'
                          )}
                        </Button>
                        <Button
                          onClick={() => {
                            setShowApproval(false);
                            setRejectionReason('');
                          }}
                          variant="outline"
                          disabled={submitting}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Complaint Details */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">
              Complaint Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Complainant Info */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Complainant
                </label>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">
                    {complaint.complainant_name}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {complaint.complainant_role}
                  </span>
                </div>
              </div>

              {/* Against Info */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Against
                </label>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{complaint.against_name}</span>
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {complaint.against_role}
                  </span>
                </div>
              </div>

              {/* Incident Date */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Incident Date
                </label>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">
                    {new Date(complaint.incident_date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Priority
                </label>
                <Badge className={priorityColors[complaint.urgency_level]}>
                  {complaint.urgency_level}
                </Badge>
              </div>

              {/* Type */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Type
                </label>
                <span className="text-gray-900 capitalize">
                  {complaint.complaint_type}
                </span>
              </div>

              {/* Assigned To */}
              {complaint.assigned_to && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">
                    Assigned To
                  </label>
                  <span className="text-gray-900">
                    {complaint.assigned_to_name || 'Assigned'}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Description
              </label>
              <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>

            {/* Attachments */}
            {complaint.attachments && complaint.attachments.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Attachments
                </label>
                <div className="space-y-2">
                  {complaint.attachments.map((url: string, index: number) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#1E88E5] hover:text-[#1976D2] hover:underline"
                    >
                      <Download className="w-4 h-4" />
                      Attachment {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Admin Actions */}
          {isAdmin && !needsApproval && (
            <div className="bg-blue-50 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-lg text-gray-800 mb-4">
                Admin Actions
              </h3>

              {/* Status Change */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Change Status
                </label>
                <div className="flex gap-2 flex-wrap">
                  {['pending', 'in-progress', 'resolved', 'closed'].map((status) => (
                    <Button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      disabled={submitting || complaint.status === status}
                      variant={complaint.status === status ? 'default' : 'outline'}
                      size="sm"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Assignment */}
              {!showAssignment ? (
                <Button
                  onClick={() => setShowAssignment(true)}
                  variant="outline"
                  className="w-full"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  {complaint.assigned_to ? 'Reassign Complaint' : 'Assign Complaint'}
                </Button>
              ) : (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 block">
                    Assign To
                  </label>
                  <select
                    onChange={handleAssigneeSelect}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
                  >
                    <option value="">Select user...</option>
                    <optgroup label="Teachers">
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={`teacher_${teacher.id}`}>
                          {teacher.full_name} - {teacher.subject_specialization}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Staff">
                      {staff.map((s) => (
                        <option key={s.id} value={`staff_${s.id}`}>
                          {s.staff_name} - {s.department}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleAssign}
                      disabled={submitting || !assignToId}
                      className="bg-[#1E88E5]"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Assigning...
                        </>
                      ) : (
                        'Confirm Assignment'
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowAssignment(false);
                        setAssignToId('');
                        setAssignToName('');
                      }}
                      variant="outline"
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Follow-ups Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Follow-ups & Comments ({followups.length})
            </h3>

            {/* Add Follow-up - For admins and assigned users */}
            {canTakeActions && !needsApproval && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Follow-up Type
                  </label>
                  <select
                    value={followupType}
                    onChange={(e) => setFollowupType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
                  >
                    <option value="comment">Comment</option>
                    <option value="action_taken">Action Taken</option>
                    <option value="response">Response</option>
                    <option value="escalation">Escalation</option>
                    <option value="resolution">Resolution</option>
                  </select>
                </div>

                <textarea
                  value={newFollowup}
                  onChange={(e) => setNewFollowup(e.target.value)}
                  placeholder="Add a follow-up or comment..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
                />

                <Button
                  onClick={handleAddFollowup}
                  disabled={submitting || !newFollowup.trim()}
                  className="bg-gradient-to-r from-[#1E88E5] to-[#1976D2]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Follow-up
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Follow-ups List */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-[#1E88E5]" />
              </div>
            ) : followups.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No follow-ups yet. Be the first to comment!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {followups.map((followup) => (
                  <motion.div
                    key={followup.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {followup.added_by_name}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {followup.added_by_role}
                        </span>
                        <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded capitalize">
                          {followup.followup_type.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(followup.created_at).toLocaleString()}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {followup.message}
                    </p>

                    {followup.status_update && (
                      <div className="flex items-center gap-2 mt-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">
                          Status updated to: <strong>{followup.status_update}</strong>
                        </span>
                      </div>
                    )}

                    {followup.attachments && followup.attachments.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {followup.attachments.map((url: string, idx: number) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#1E88E5] hover:underline flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            Attachment {idx + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
