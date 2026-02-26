// components/complaints/FilterPanel.tsx
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface FilterPanelProps {
  filterStatus: string;
  filterPriority: string;
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
  onClose: () => void;
}

export default function FilterPanel({
  filterStatus,
  filterPriority,
  onStatusChange,
  onPriorityChange,
  onClose,
}: FilterPanelProps) {
  const clearFilters = () => {
    onStatusChange('all');
    onPriorityChange('all');
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 pt-4 border-t border-gray-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-700">Filters</h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <select
            value={filterPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {(filterStatus !== 'all' || filterPriority !== 'all') && (
        <div className="mt-4">
          <Button
            onClick={clearFilters}
            variant="outline"
            size="sm"
            className="rounded-lg"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </motion.div>
  );
}
