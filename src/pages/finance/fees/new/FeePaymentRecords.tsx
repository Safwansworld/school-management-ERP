import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Eye,
  Plus,
  Loader,
} from 'lucide-react';
import {
  fetchFeePayments,
  recordFeePayment,
} from '../../../../services/feeManagementService';

interface FeePayment {
  id: string;
  student_name: string;
  student_id: string;
  class_name: string;
  fee_type: string;
  amount_paid: number;
  payment_mode: string;
  payment_date: string;
  receipt_no: string;
  remarks?: string;
}

interface FeePaymentRecordsProps {
  selectedYear: string;
}

const FeePaymentRecords = ({ selectedYear }: FeePaymentRecordsProps) => {
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentModeFilter, setPaymentModeFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    fee_structure_id: '',
    fee_type: 'Tuition',
    amount_paid: 0,
    payment_mode: 'Online',
    payment_date: new Date().toISOString().split('T')[0],
    receipt_no: `RCP/${new Date().getFullYear()}/${Math.floor(Math.random() * 1000)}`,
    remarks: '',
  });

  useEffect(() => {
    loadPayments();
  }, [selectedYear]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await fetchFeePayments();
      setPayments(data);
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async () => {
    try {
      await recordFeePayment(formData as any);
      setFormData({
        student_id: '',
        fee_structure_id: '',
        fee_type: 'Tuition',
        amount_paid: 0,
        payment_mode: 'Online',
        payment_date: new Date().toISOString().split('T')[0],
        receipt_no: `RCP/${new Date().getFullYear()}/${Math.floor(Math.random() * 1000)}`,
        remarks: '',
      });
      setShowAddForm(false);
      loadPayments();
    } catch (error) {
      console.error('Failed to record payment:', error);
    }
  };

  const filteredPayments = payments.filter(p =>
    (p.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.receipt_no.includes(searchTerm)) &&
    (paymentModeFilter === '' || p.payment_mode === paymentModeFilter)
  );

  const totalPayments = payments.reduce((sum, p) => sum + p.amount_paid, 0);
  const averagePayment = Math.round(totalPayments / (payments.length || 1));

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
            label: 'Total Payments',
            value: `₹${totalPayments.toLocaleString()}`,
            color: 'from-blue-500 to-blue-600',
          },
          {
            label: 'Payments Count',
            value: payments.length.toString(),
            color: 'from-green-500 to-green-600',
          },
          {
            label: 'Average Payment',
            value: `₹${averagePayment.toLocaleString()}`,
            color: 'from-purple-500 to-purple-600',
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * idx }}
            className={`bg-gradient-to-r ${stat.color} rounded-[20px] p-6 text-white shadow-lg`}
          >
            <p className="text-sm font-medium opacity-90">{stat.label}</p>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Add Payment Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-end"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-2.5 gradient-primary text-white rounded-xl shadow-glow hover:shadow-float flex items-center gap-2 font-medium transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          Record Payment
        </motion.button>
      </motion.div>

      {/* Add Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amount Paid</label>
              <input
                type="number"
                value={formData.amount_paid}
                onChange={(e) => setFormData({ ...formData, amount_paid: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Mode</label>
              <select
                value={formData.payment_mode}
                onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none"
              >
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Card">Card</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={handleAddPayment}
              className="px-6 py-2.5 gradient-primary text-white rounded-xl font-medium transition-all"
            >
              Record
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium transition-all"
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name or receipt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none"
            />
          </div>

          <select
            value={paymentModeFilter}
            onChange={(e) => setPaymentModeFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none"
          >
            <option value="">All Payment Modes</option>
            <option value="Cash">Cash</option>
            <option value="Online">Online</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="Cheque">Cheque</option>
          </select>
        </div>
      </motion.div>

      {/* Payments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[20px] shadow-soft border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Payment Records</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-[#1E88E5]/10 text-[#1E88E5] rounded-lg hover:bg-[#1E88E5]/20 flex items-center gap-2 font-medium text-sm transition-all"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-[#1E88E5] animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Receipt No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Fee Type</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment Mode</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-600">
                      No payment records found
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment, idx) => (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * idx }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{payment.student_name}</p>
                        <p className="text-sm text-gray-600">{payment.class_name}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-700">{payment.receipt_no}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{payment.fee_type}</td>
                      <td className="px-6 py-4 text-sm text-right font-bold text-[#1E88E5]">
                        ₹{payment.amount_paid.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#1E88E5]/10 text-[#1E88E5] text-xs font-semibold border border-[#1E88E5]/20">
                          {payment.payment_mode}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="w-10 h-10 flex items-center justify-center hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FeePaymentRecords;
