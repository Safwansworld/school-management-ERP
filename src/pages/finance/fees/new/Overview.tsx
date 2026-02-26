import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Eye,
  Download,
  Plus,
  Loader,
} from 'lucide-react';
import { fetchStudents, fetchFeePayments, fetchFeeStructures } from '../../../../services/feeManagementService';

interface Student {
  student_id: string;
  student_name: string;
  class_name: string;
  academic_year: string;
}

interface FeeBreakdown {
  fee_type: string;
  total_amount: number;
  paid: number;
  balance: number;
}

interface FeePaymentOverviewProps {
  selectedYear: string;
}

const FeePaymentOverview = ({ selectedYear }: FeePaymentOverviewProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [feeBreakdown, setFeeBreakdown] = useState<FeeBreakdown[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStudents();
  }, [selectedYear]);

  useEffect(() => {
    if (selectedStudent) {
      loadFeeBreakdown();
    }
  }, [selectedStudent]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await fetchStudents(selectedYear);
      setStudents(data);
      if (data.length > 0) {
        setSelectedStudent(data[0]);
      }
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFeeBreakdown = async () => {
    try {
      const payments = await fetchFeePayments({ studentId: selectedStudent?.student_id });
      const structures = await fetchFeeStructures(selectedYear);

      // Group payments by fee type
      const breakdown = structures.flatMap(s =>
        s.applicable_classes?.includes(selectedStudent?.class_name || '') || s.applicable_for === 'All'
          ? [
              {
                fee_type: 'Tuition',
                total_amount: s.total_amount * 0.75,
                paid: payments
                  .filter(p => p.fee_type === 'Tuition' && p.student_id === selectedStudent?.student_id)
                  .reduce((sum, p) => sum + p.amount_paid, 0),
                balance: 0,
              },
            ]
          : []
      );

      setFeeBreakdown(breakdown.length > 0 ? breakdown : []);
    } catch (error) {
      console.error('Failed to load fee breakdown:', error);
    }
  };

  const filteredStudents = students.filter(s =>
    s.student_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBalance = feeBreakdown.reduce((sum, item) => sum + (item.total_amount - item.paid), 0);
  const totalAmount = feeBreakdown.reduce((sum, item) => sum + item.total_amount, 0);
  const totalPaid = feeBreakdown.reduce((sum, item) => sum + item.paid, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          {
            label: 'Total Amount',
            value: `₹${totalAmount.toLocaleString()}`,
            color: 'from-blue-500 to-blue-600',
            icon: '💰',
          },
          {
            label: 'Amount Paid',
            value: `₹${totalPaid.toLocaleString()}`,
            color: 'from-green-500 to-green-600',
            icon: '✓',
          },
          {
            label: 'Outstanding',
            value: `₹${totalBalance.toLocaleString()}`,
            color: totalBalance > 0 ? 'from-red-500 to-red-600' : 'from-green-500 to-green-600',
            icon: '!',
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * idx }}
            className={`bg-gradient-to-r ${item.color} rounded-[20px] p-6 text-white shadow-lg`}
          >
            <p className="text-sm font-medium opacity-90">{item.label}</p>
            <p className="text-3xl font-bold mt-2">{item.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 bg-white rounded-[20px] shadow-soft border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Select Student</h3>
            {loading && <Loader className="w-4 h-4 text-[#1E88E5] animate-spin" />}
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search student..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none"
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredStudents.map((student) => (
              <motion.button
                key={student.student_id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedStudent(student)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  selectedStudent?.student_id === student.student_id
                    ? 'bg-[#1E88E5]/10 border-[#1E88E5] shadow-md'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-semibold text-gray-900">{student.student_name}</p>
                <p className="text-sm text-gray-600">{student.class_name}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Fee Breakdown Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-[20px] shadow-soft border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedStudent?.student_name}'s Fee Breakdown
              </h3>
              <button className="w-10 h-10 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center">
                <Download className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fee Type</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Paid</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {feeBreakdown.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No fee data available
                    </td>
                  </tr>
                ) : (
                  feeBreakdown.map((item, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * idx }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.fee_type}</td>
                      <td className="px-6 py-4 text-sm text-right text-gray-700">₹{item.total_amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-right text-green-600 font-medium">₹{item.paid.toLocaleString()}</td>
                      <td className={`px-6 py-4 text-sm text-right font-medium ${
                        item.total_amount - item.paid > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        ₹{(item.total_amount - item.paid).toLocaleString()}
                      </td>
                    </motion.tr>
                  ))
                )}
                {feeBreakdown.length > 0 && (
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-6 py-4 text-sm text-gray-900">Total</td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900">₹{totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-right text-green-600">₹{totalPaid.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-right text-red-600">₹{totalBalance.toLocaleString()}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeePaymentOverview;
