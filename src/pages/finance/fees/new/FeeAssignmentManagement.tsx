import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  CheckCircle,
  Loader,
} from 'lucide-react';
import {
  fetchFeeAssignments,
  unassignFeeStructure,
  assignFeeStructure,
  fetchStudents,
  fetchFeeStructures,
} from '../../../../services/feeManagementService';

interface FeeAssignment {
  id: string;
  student_id: string;
  student_name: string;
  class_name: string;
  fee_structure_name: string;
  total_amount: number;
  assigned_at: string;
}

interface Student {
  student_id: string;
  student_name: string;
  class_name: string;
}

interface FeeAssignmentManagementProps {
  selectedYear: string;
}

const FeeAssignmentManagement = ({ selectedYear }: FeeAssignmentManagementProps) => {
  const [assignments, setAssignments] = useState<FeeAssignment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [structures, setStructures] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [formData, setFormData] = useState({ studentId: '', feeStructureId: '' });

  useEffect(() => {
    loadData();
  }, [selectedYear]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [assignmentsData, studentsData, structuresData] = await Promise.all([
        fetchFeeAssignments(),
        fetchStudents(selectedYear),
        fetchFeeStructures(selectedYear),
      ]);
      setAssignments(assignmentsData);
      setStudents(studentsData);
      setStructures(structuresData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    try {
      await assignFeeStructure(formData.studentId, formData.feeStructureId);
      setFormData({ studentId: '', feeStructureId: '' });
      setShowAssignForm(false);
      loadData();
    } catch (error) {
      console.error('Failed to assign structure:', error);
    }
  };

  const handleUnassign = async (id: string) => {
    if (confirm('Are you sure you want to unassign this fee structure?')) {
      try {
        await unassignFeeStructure(id);
        loadData();
      } catch (error) {
        console.error('Failed to unassign structure:', error);
      }
    }
  };

  const filteredAssignments = assignments.filter(a =>
    a.student_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedClass === '' || a.class_name === selectedClass)
  );

  const uniqueClasses = [...new Set(students.map(s => s.class_name))];

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-xl font-semibold text-gray-900">Fee Assignments</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAssignForm(!showAssignForm)}
          className="px-6 py-2.5 gradient-primary text-white rounded-xl shadow-glow hover:shadow-float flex items-center gap-2 font-medium transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          Assign Structure
        </motion.button>
      </motion.div>

      {/* Assign Form */}
      {showAssignForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Student</label>
              <select
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none"
              >
                <option value="">Choose Student...</option>
                {students.map(s => (
                  <option key={s.student_id} value={s.student_id}>
                    {s.student_name} ({s.class_name})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Fee Structure</label>
              <select
                value={formData.feeStructureId}
                onChange={(e) => setFormData({ ...formData, feeStructureId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none"
              >
                <option value="">Choose Structure...</option>
                {structures.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} (₹{s.total_amount})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={handleAssign}
              className="px-6 py-2.5 gradient-primary text-white rounded-xl font-medium transition-all"
            >
              Assign
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowAssignForm(false)}
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
              placeholder="Search by student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none"
            />
          </div>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none"
          >
            <option value="">All Classes</option>
            {uniqueClasses.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Assignments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[20px] shadow-soft border border-gray-100 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-[#1E88E5] animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Class</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Fee Structure</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Assigned Date</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAssignments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-600">
                      No assignments found
                    </td>
                  </tr>
                ) : (
                  filteredAssignments.map((assignment, idx) => (
                    <motion.tr
                      key={assignment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * idx }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{assignment.student_name}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">{assignment.class_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{assignment.fee_structure_name}</td>
                      <td className="px-6 py-4 text-sm text-right font-bold text-[#1E88E5]">
                        ₹{assignment.total_amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(assignment.assigned_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-semibold border border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUnassign(assignment.id)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-red-50 rounded-lg transition-colors text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
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

export default FeeAssignmentManagement;
