import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertCircle,
  RefreshCwIcon,
  Users,
  FileText,
  Loader,
} from 'lucide-react';
import { fetchFeeAnalytics, fetchFeeStructures } from '../../../../services/feeManagementService';
import FeePaymentOverview from './Overview'
import FeeStructureTable from '../FeeStructureTable';
import FeeAssignmentManagement from './FeeAssignmentManagement';
import FeePaymentRecords from './FeePaymentRecords';

interface FinancialStats {
  totalAssigned: number;
  totalPaid: number;
  outstanding: number;
  overdue: number;
}

export const FeeManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'structures' | 'assignments' | 'payments'>('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<FinancialStats>({
    totalAssigned: 0,
    totalPaid: 0,
    outstanding: 0,
    overdue: 0,
  });
  const [selectedYear, setSelectedYear] = useState<string>('2024-2025');
  const [academicYears, setAcademicYears] = useState<string[]>(['2024-2025', '2023-2024']);

  useEffect(() => {
    loadAnalytics();
  }, [selectedYear]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await fetchFeeAnalytics(selectedYear);
      setStats(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const statCards = [
    {
      id: 'assigned',
      label: 'Total Assigned',
      value: `₹${(stats.totalAssigned / 100000).toFixed(2)}L`,
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      change: '+12.5%',
    },
    {
      id: 'paid',
      label: 'Total Paid',
      value: `₹${(stats.totalPaid / 100000).toFixed(2)}L`,
      icon: CreditCard,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      change: '+8.2%',
    },
    {
      id: 'outstanding',
      label: 'Outstanding',
      value: `₹${(stats.outstanding / 100000).toFixed(2)}L`,
      icon: TrendingUp,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      change: '-3.1%',
    },
    {
      id: 'overdue',
      label: 'Overdue',
      value: `₹${(stats.overdue / 100000).toFixed(2)}L`,
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      change: '+2.4%',
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: CreditCard },
    { id: 'structures', label: 'Fee Structures', icon: FileText },
    { id: 'assignments', label: 'Assignments', icon: Users },
    { id: 'payments', label: 'Payments', icon: DollarSign },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F9FC] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-12 h-12 text-[#1E88E5] animate-spin" />
          <p className="text-gray-600 font-medium">Loading fee management data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F9FC] p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-sm">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-gray-900">Fee Management</h1>
                <p className="text-gray-600 text-sm mt-1">Track and manage student fees and payments</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none font-medium"
              >
                {academicYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-sm font-medium transition-all duration-200"
              >
                <RefreshCwIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="relative bg-white rounded-[20px] shadow-soft border border-gray-100 p-6 hover:shadow-float hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute top-6 right-6 opacity-5 text-gray-300">
                  <Icon className="w-12 h-12" />
                </div>

                <div className="relative z-10">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                  <p className="text-xs text-gray-600 mt-2">{card.change} from last month</p>
                </div>

                <div
                  className={`absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r ${card.color} rounded-[12px] shadow-lg flex items-center justify-center transition-transform duration-300 hover:scale-110`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[20px] shadow-soft border border-gray-100"
        >
          <div className="flex border-b border-gray-100 p-4 gap-2 flex-wrap">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'gradient-primary text-white shadow-glow'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && <FeePaymentOverview selectedYear={selectedYear} />}
            {activeTab === 'structures' && <FeeStructureTable selectedYear={selectedYear} />}
            {activeTab === 'assignments' && <FeeAssignmentManagement selectedYear={selectedYear} />}
            {activeTab === 'payments' && <FeePaymentRecords selectedYear={selectedYear} />}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeeManagementDashboard;
