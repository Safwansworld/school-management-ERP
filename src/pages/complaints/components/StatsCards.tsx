// components/complaints/StatsCards.tsx
import { motion } from 'framer-motion';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    open: number;
    inProgress: number;
    resolved: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-strong rounded-2xl p-6 shadow-soft"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center">
            <Clock className="w-7 h-7 text-orange-600" />
          </div>
          <div>
            <h3 className="text-orange-600">{stats.open}</h3>
            <p className="text-sm text-gray-600">Open Issues</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-strong rounded-2xl p-6 shadow-soft"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h3 className="text-blue-600">{stats.inProgress}</h3>
            <p className="text-sm text-gray-600">In Progress</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-strong rounded-2xl p-6 shadow-soft"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
          <div>
            <h3 className="text-green-600">{stats.resolved}</h3>
            <p className="text-sm text-gray-600">Resolved</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
