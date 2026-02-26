// pages/Complaints.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Filter, 
  Search, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  X 
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { supabase } from '../../lib/supabase';
import ComplaintCard from './components/ComplaintCard';
import ComplaintForm from './components/ComplaintForm';
import ComplaintDetails from './components/ComplaintDetails';
import StatsCards from './components/StatsCards';
import FilterPanel from './components/FilterPanel';
import { useAuth } from '../../hooks/useAuth';
import type { Complaint, ComplaintStats } from '../../types/complaints';

export default function Complaints() {
  const { user, userRole } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<ComplaintStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchComplaints();
    fetchStats();
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('complaints_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'complaints' },
        () => {
          fetchComplaints();
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, filterStatus, filterPriority, searchTerm]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      // Role-based filtering
      if (userRole === 'student') {
        query = query.eq('complainant_id', user?.id);
      } else if (userRole === 'parent') {
        query = query.eq('complainant_id', user?.id);
      } else if (userRole === 'teacher') {
        query = query.or(
          `complainant_id.eq.${user?.id},assigned_to.eq.${user?.id}`
        );
      }

      // Apply filters
      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      if (filterPriority !== 'all') {
        query = query.eq('urgency_level', filterPriority);
      }

      // Apply search
      if (searchTerm) {
        query = query.or(
          `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,complaint_number.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      let query = supabase.from('complaints').select('status');

      // Role-based stats
      if (userRole === 'student' || userRole === 'parent') {
        query = query.eq('complainant_id', user?.id);
      } else if (userRole === 'teacher') {
        query = query.or(
          `complainant_id.eq.${user?.id},assigned_to.eq.${user?.id}`
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      const statsData: ComplaintStats = {
        open: data?.filter((c) => c.status === 'pending').length || 0,
        inProgress: data?.filter((c) => c.status === 'in-progress').length || 0,
        resolved: data?.filter((c) => c.status === 'resolved' || c.status === 'closed').length || 0,
      };

      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleComplaintCreated = () => {
    setShowForm(false);
    fetchComplaints();
    fetchStats();
  };

  const handleComplaintUpdate = () => {
    setSelectedComplaint(null);
    fetchComplaints();
    fetchStats();
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="mb-2">Complaints & Issues</h1>
          <p className="text-gray-600">Track and resolve student and parent concerns</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setShowForm(true)}
            className="gradient-primary text-white shadow-glow hover:shadow-float rounded-xl h-11 gap-2"
          >
            <Plus className="w-5 h-5" />
            New Complaint
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      {stats && <StatsCards stats={stats} />}

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-strong rounded-2xl p-4 shadow-soft"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, description or complaint number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all"
            />
          </div>

          {/* Filter Button */}
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="rounded-xl h-12 gap-2 bg-white"
          >
            <Filter className="w-5 h-5" />
            Filters
          </Button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <FilterPanel
              filterStatus={filterStatus}
              filterPriority={filterPriority}
              onStatusChange={setFilterStatus}
              onPriorityChange={setFilterPriority}
              onClose={() => setShowFilters(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Complaints List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E88E5]"></div>
        </div>
      ) : complaints.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-12 text-center shadow-soft"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-gray-800 mb-2">No complaints found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
              ? 'Try adjusting your filters or search term'
              : 'Get started by creating your first complaint'}
          </p>
          {!searchTerm && filterStatus === 'all' && filterPriority === 'all' && (
            <Button
              onClick={() => setShowForm(true)}
              className="gradient-primary text-white rounded-xl"
            >
              Create Complaint
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint, index) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              index={index}
              onClick={() => setSelectedComplaint(complaint)}
              userRole={userRole}
            />
          ))}
        </div>
      )}

      {/* Complaint Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ComplaintForm
            onClose={() => setShowForm(false)}
            onSuccess={handleComplaintCreated}
            user={user}
            userRole={userRole}
          />
        )}
      </AnimatePresence>

      {/* Complaint Details Modal */}
      <AnimatePresence>
        {selectedComplaint && (
          <ComplaintDetails
            complaint={selectedComplaint}
            onClose={() => setSelectedComplaint(null)}
            onUpdate={handleComplaintUpdate}
            userRole={userRole}
            userId={user?.id}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
