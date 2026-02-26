// components/complaints/ComplaintCard.tsx
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  User, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  ChevronRight 
} from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
//import { Button } from '../ui/button';
import type { Complaint } from '../../../types/complaints';

interface ComplaintCardProps {
  complaint: Complaint;
  index: number;
  onClick: () => void;
  userRole: string;
}

const categoryColors: Record<string, string> = {
  academic: '#1E88E5',
  behaviour: '#E53935',
  safety: '#43A047',
  facility: '#7B1FA2',
  fee: '#F57C00',
  transport: '#00897B',
  other: '#5E35B1',
};

const priorityConfig: Record<string, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-gray-50 text-gray-600 border-gray-200' },
  medium: { label: 'Medium', className: 'bg-orange-50 text-orange-600 border-orange-200' },
  high: { label: 'High', className: 'bg-red-50 text-red-600 border-red-200' },
  critical: { label: 'Critical', className: 'bg-red-100 text-red-700 border-red-300 font-semibold' },
};

const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
  pending: { 
    label: 'Pending', 
    className: 'bg-orange-50 text-orange-600 border-orange-200',
    icon: Clock 
  },
  'in-progress': { 
    label: 'In Progress', 
    className: 'bg-blue-50 text-blue-600 border-blue-200',
    icon: AlertCircle 
  },
  resolved: { 
    label: 'Resolved', 
    className: 'bg-green-50 text-green-600 border-green-200',
    icon: CheckCircle 
  },
  closed: { 
    label: 'Closed', 
    className: 'bg-gray-50 text-gray-600 border-gray-200',
    icon: CheckCircle 
  },
  rejected: { 
    label: 'Rejected', 
    className: 'bg-red-50 text-red-600 border-red-200',
    icon: AlertCircle 
  },
};

export default function ComplaintCard({ complaint, index, onClick, userRole }: ComplaintCardProps) {
  const categoryColor = categoryColors[complaint.complaint_type] || categoryColors.other;
  const priority = priorityConfig[complaint.urgency_level];
  const status = statusConfig[complaint.status];
  const StatusIcon = status.icon;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={onClick}
      className="glass-strong rounded-2xl p-6 shadow-soft hover:shadow-float transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start gap-6">
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${categoryColor}20` }}
        >
          <MessageSquare className="w-7 h-7" style={{ color: categoryColor }} />
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-gray-800">{complaint.title}</h4>
                <span className="text-xs text-gray-500 font-mono">
                  {complaint.complaint_number}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="border-0 text-xs"
                  style={{
                    backgroundColor: `${categoryColor}15`,
                    color: categoryColor,
                  }}
                >
                  {complaint.complaint_type.charAt(0).toUpperCase() + complaint.complaint_type.slice(1)}
                </Badge>
                <Badge variant="outline" className={`text-xs ${priority.className}`}>
                  {priority.label} Priority
                </Badge>
                <Badge variant="outline" className={`text-xs ${status.className}`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {status.label}
                </Badge>
                {complaint.requires_approval && complaint.approved_by === null && (
                  <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-600 border-yellow-200">
                    Pending Approval
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{complaint.description}</p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#1E88E5]" />
                <span>{complaint.complainant_name}</span>
                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                  {complaint.complainant_role}
                </span>
              </div>
              <span className="mx-2">•</span>
              <span>{formatDate(complaint.created_at)}</span>
              {complaint.incident_date && (
                <>
                  <span className="mx-2">•</span>
                  <span className="text-xs">Incident: {formatDate(complaint.incident_date)}</span>
                </>
              )}
            </div>

            <motion.div whileHover={{ x: 5 }}>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </motion.div>
          </div>

          {/* Against Info */}
          {complaint.against_name && (
            <div className="mt-3 pt-3 border-t border-gray-200/50">
              <p className="text-xs text-gray-500">
                Against:{' '}
                <span className="text-gray-700 font-medium">{complaint.against_name}</span>
                <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full">
                  {complaint.against_role}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
