import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  MoreHorizontalIcon,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface FeeStructure {
  id: string;
  name: string;
  academicYear: string;
  applicableFor: 'All' | 'SpecificGrade' | 'StudentGroup';
  applicableGrades?: string[];
  totalAmount: number;
  status: 'Active' | 'Inactive';
  components: FeeComponent[];
}

interface FeeComponent {
  type: string;
  amount: number;
  frequency: string;
  dueDate: string;
}

const FeeStructureTable = ({ selectedYear }: { selectedYear?: string }) => {
  const [structures, setStructures] = useState<FeeStructure[]>([
    {
      id: '1',
      name: 'Standard Fee Structure 2024-25',
      academicYear: '2024-2025',
      applicableFor: 'All',
      totalAmount: 67000,
      status: 'Active',
      components: [
        { type: 'Tuition', amount: 50000, frequency: 'Annually', dueDate: '2024-04-01' },
        { type: 'Transport', amount: 12000, frequency: 'Annually', dueDate: '2024-04-01' },
        { type: 'Activities', amount: 5000, frequency: 'Annually', dueDate: '2024-04-01' },
      ],
    },
    {
      id: '2',
      name: 'Senior Classes Fee Structure',
      academicYear: '2024-2025',
      applicableFor: 'SpecificGrade',
      applicableGrades: ['Grade 10', 'Grade 11', 'Grade 12'],
      totalAmount: 85000,
      status: 'Active',
      components: [
        { type: 'Tuition', amount: 65000, frequency: 'Annually', dueDate: '2024-04-01' },
        { type: 'Lab Fee', amount: 15000, frequency: 'Annually', dueDate: '2024-04-01' },
        { type: 'Transport', amount: 5000, frequency: 'Annually', dueDate: '2024-04-01' },
      ],
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<FeeStructure | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this fee structure?')) {
      setStructures(structures.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-xl font-semibold text-gray-900">Fee Structures</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="px-6 py-2.5 gradient-primary text-white rounded-xl shadow-glow hover:shadow-float flex items-center gap-2 font-medium transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          Add Structure
        </motion.button>
      </motion.div>

      {/* Fee Structures List */}
      <div className="space-y-4">
        {structures.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-[20px] border border-gray-100"
          >
            <p className="text-gray-600 font-medium">No fee structures defined yet</p>
          </motion.div>
        ) : (
          structures.map((structure, index) => (
            <motion.div
              key={structure.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="bg-white rounded-[20px] shadow-soft border border-gray-100 overflow-hidden"
            >
              {/* Structure Header */}
              <div
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between"
                onClick={() => setExpandedId(expandedId === structure.id ? null : structure.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{structure.name}</h3>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${structure.status === 'Active'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                    >
                      {structure.status === 'Active' ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {structure.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {structure.academicYear} •{' '}
                    {structure.applicableFor === 'All'
                      ? 'All Students'
                      : structure.applicableFor === 'SpecificGrade'
                        ? `${structure.applicableGrades?.join(', ')}`
                        : 'Student Group'}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-[#1E88E5]">
                      ₹{structure.totalAmount.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStructure(structure);
                      }}
                      className="w-10 h-10 flex items-center justify-center hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(structure.id);
                      }}
                      className="w-10 h-10 flex items-center justify-center hover:bg-red-50 rounded-lg transition-colors text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Expanded Components */}
              {expandedId === structure.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-100 bg-gray-50 p-6"
                >
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Fee Components</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-700 border-b border-gray-200">
                          <th className="text-left py-2 px-4 font-semibold">Type</th>
                          <th className="text-right py-2 px-4 font-semibold">Amount</th>
                          <th className="text-left py-2 px-4 font-semibold">Frequency</th>
                          <th className="text-left py-2 px-4 font-semibold">Due Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {structure.components.map((component, idx) => (
                          <tr key={idx} className="border-b border-gray-200 hover:bg-white transition-colors">
                            <td className="py-3 px-4 font-medium text-gray-900">{component.type}</td>
                            <td className="py-3 px-4 text-right font-semibold text-gray-900">
                              ₹{component.amount.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-gray-600">{component.frequency}</td>
                            <td className="py-3 px-4 text-gray-600">
                              {new Date(component.dueDate).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeeStructureTable;
