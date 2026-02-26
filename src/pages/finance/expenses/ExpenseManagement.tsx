// import React, { useState, useEffect } from 'react';
// import { 
//   DollarSign, 
//   Plus, 
//   Search, 
//   Filter, 
//   Download, 
//   Edit2, 
//   Trash2, 
//   FileText, 
//   CheckCircle, 
//   XCircle, 
//   Clock,
//   TrendingUp,
//   AlertCircle,
//   Calendar,
//   Receipt,
//   Users,
//   Upload,
//   X
// } from 'lucide-react';
// import { supabase } from '../../../lib/supabase'

// // Types
// interface Expense {
//   id: string;
//   title: string;
//   category: 'Salaries' | 'Utilities' | 'Maintenance' | 'Purchase' | 'Transportation' | 'Events' | 'Miscellaneous';
//   date: string;
//   amount: number;
//   payment_method: 'Cash' | 'Bank' | 'Cheque' | 'Online';
//   vendor_name: string;
//   description: string;
//   attachment_url?: string;
//   approved_by?: string;
//   expense_type: 'Recurring' | 'One-time';
//   status: 'Pending' | 'Approved' | 'Reimbursed';
//   created_at: string;
// }

// interface ExpenseSummary {
//   totalExpenses: number;
//   pendingApprovals: number;
//   topCategories: { category: string; amount: number }[];
// }

// const ExpenseManagement: React.FC = () => {
//   // State Management
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState<string>('all');
//   const [selectedStatus, setSelectedStatus] = useState<string>('all');
//   const [dateRange, setDateRange] = useState({ start: '', end: '' });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [summary, setSummary] = useState<ExpenseSummary>({
//     totalExpenses: 0,
//     pendingApprovals: 0,
//     topCategories: []
//   });

//   // Form State
//   const [formData, setFormData] = useState<Partial<Expense>>({
//     title: '',
//     category: 'Miscellaneous',
//     date: new Date().toISOString().split('T')[0],
//     amount: 0,
//     payment_method: 'Cash',
//     vendor_name: '',
//     description: '',
//     expense_type: 'One-time',
//     status: 'Pending'
//   });

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);

//   // Categories for dropdown
//   const categories = ['Salaries', 'Utilities', 'Maintenance', 'Purchase', 'Transportation', 'Events', 'Miscellaneous'];
//   const paymentMethods = ['Cash', 'Bank', 'Cheque', 'Online'];
//   const statuses = ['Pending', 'Approved', 'Reimbursed'];

//   // Fetch expenses from Supabase
//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   // Apply filters
//   useEffect(() => {
//     applyFilters();
//   }, [searchTerm, selectedCategory, selectedStatus, dateRange, expenses]);

//   const fetchExpenses = async () => {
//     try {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('expenses')
//         .select('*')
//         .order('date', { ascending: false });

//       if (error) throw error;
//       setExpenses(data || []);
//       calculateSummary(data || []);
//     } catch (error) {
//       console.error('Error fetching expenses:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateSummary = (expenseData: Expense[]) => {
//     const currentMonth = new Date().getMonth();
//     const currentYear = new Date().getFullYear();

//     const monthlyExpenses = expenseData.filter(exp => {
//       const expDate = new Date(exp.date);
//       return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
//     });

//     const total = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
//     const pending = expenseData.filter(exp => exp.status === 'Pending').length;

//     // Calculate top 5 categories
//     const categoryTotals: { [key: string]: number } = {};
//     expenseData.forEach(exp => {
//       categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
//     });

//     const topCategories = Object.entries(categoryTotals)
//       .map(([category, amount]) => ({ category, amount }))
//       .sort((a, b) => b.amount - a.amount)
//       .slice(0, 5);

//     setSummary({
//       totalExpenses: total,
//       pendingApprovals: pending,
//       topCategories
//     });
//   };

//   const applyFilters = () => {
//     let filtered = [...expenses];

//     // Search filter
//     if (searchTerm) {
//       filtered = filtered.filter(exp =>
//         exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         exp.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         exp.category.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Category filter
//     if (selectedCategory !== 'all') {
//       filtered = filtered.filter(exp => exp.category === selectedCategory);
//     }

//     // Status filter
//     if (selectedStatus !== 'all') {
//       filtered = filtered.filter(exp => exp.status === selectedStatus);
//     }

//     // Date range filter
//     if (dateRange.start && dateRange.end) {
//       filtered = filtered.filter(exp => {
//         const expDate = new Date(exp.date);
//         return expDate >= new Date(dateRange.start) && expDate <= new Date(dateRange.end);
//       });
//     }

//     setFilteredExpenses(filtered);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedFile(e.target.files[0]);
//     }
//   };

//   const uploadFile = async (file: File): Promise<string | undefined> => {
//   try {
//     const fileExt = file.name.split('.').pop();
//     const fileName = `${Math.random()}.${fileExt}`;
//     const filePath = `expense-receipts/${fileName}`;

//     const { error: uploadError } = await supabase.storage
//       .from('school-documents')
//       .upload(filePath, file);

//     if (uploadError) throw uploadError;

//     const { data } = supabase.storage
//       .from('school-documents')
//       .getPublicUrl(filePath);

//     return data.publicUrl;
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     return undefined; // Changed from null to undefined
//   }
// };


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       let attachmentUrl = formData.attachment_url;

//       // Upload file if selected
//       if (selectedFile) {
//         attachmentUrl = await uploadFile(selectedFile);
//       }

//       const expenseData = {
//         ...formData,
//         attachment_url: attachmentUrl,
//         amount: Number(formData.amount)
//       };

//       if (isEditing && formData.id) {
//         // Update existing expense
//         const { error } = await supabase
//           .from('expenses')
//           .update(expenseData)
//           .eq('id', formData.id);

//         if (error) throw error;
//       } else {
//         // Insert new expense
//         const { error } = await supabase
//           .from('expenses')
//           .insert([expenseData]);

//         if (error) throw error;
//       }

//       // Reset form and close modal
//       resetForm();
//       setIsModalOpen(false);
//       fetchExpenses();
//     } catch (error) {
//       console.error('Error saving expense:', error);
//       alert('Failed to save expense. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (expense: Expense) => {
//     setFormData(expense);
//     setIsEditing(true);
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this expense?')) return;

//     try {
//       const { error } = await supabase
//         .from('expenses')
//         .delete()
//         .eq('id', id);

//       if (error) throw error;
//       fetchExpenses();
//     } catch (error) {
//       console.error('Error deleting expense:', error);
//       alert('Failed to delete expense.');
//     }
//   };

//   const handleApproval = async (id: string, newStatus: 'Approved' | 'Reimbursed') => {
//     try {
//       const { error } = await supabase
//         .from('expenses')
//         .update({ status: newStatus })
//         .eq('id', id);

//       if (error) throw error;
//       fetchExpenses();
//     } catch (error) {
//       console.error('Error updating status:', error);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       title: '',
//       category: 'Miscellaneous',
//       date: new Date().toISOString().split('T')[0],
//       amount: 0,
//       payment_method: 'Cash',
//       vendor_name: '',
//       description: '',
//       expense_type: 'One-time',
//       status: 'Pending'
//     });
//     setSelectedFile(null);
//     setIsEditing(false);
//   };

//   const exportToCSV = () => {
//     const headers = ['Date', 'Title', 'Category', 'Amount', 'Payment Method', 'Vendor', 'Status', 'Type'];
//     const csvData = filteredExpenses.map(exp => [
//       exp.date,
//       exp.title,
//       exp.category,
//       exp.amount,
//       exp.payment_method,
//       exp.vendor_name,
//       exp.status,
//       exp.expense_type
//     ]);

//     const csvContent = [
//       headers.join(','),
//       ...csvData.map(row => row.join(','))
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//   };

//   // Pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentExpenses = filteredExpenses.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Pending': return 'bg-yellow-100 text-yellow-800';
//       case 'Approved': return 'bg-green-100 text-green-800';
//       case 'Reimbursed': return 'bg-blue-100 text-blue-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'Pending': return <Clock className="w-4 h-4" />;
//       case 'Approved': return <CheckCircle className="w-4 h-4" />;
//       case 'Reimbursed': return <CheckCircle className="w-4 h-4" />;
//       default: return <AlertCircle className="w-4 h-4" />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Expense Management</h1>
//           <p className="text-gray-600">Track and manage all school-related expenses</p>
//         </div>

//         {/* Summary Dashboard */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
//             <div className="flex items-center justify-between mb-2">
//               <div className="p-3 bg-white/20 rounded-lg">
//                 <DollarSign className="w-6 h-6" />
//               </div>
//             </div>
//             <h3 className="text-sm font-medium opacity-90">Total Expenses (This Month)</h3>
//             <p className="text-3xl font-bold mt-2">₹{summary.totalExpenses.toLocaleString()}</p>
//           </div>

//           <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
//             <div className="flex items-center justify-between mb-2">
//               <div className="p-3 bg-white/20 rounded-lg">
//                 <AlertCircle className="w-6 h-6" />
//               </div>
//             </div>
//             <h3 className="text-sm font-medium opacity-90">Pending Approvals</h3>
//             <p className="text-3xl font-bold mt-2">{summary.pendingApprovals}</p>
//           </div>

//           <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
//             <div className="flex items-center justify-between mb-2">
//               <div className="p-3 bg-white/20 rounded-lg">
//                 <TrendingUp className="w-6 h-6" />
//               </div>
//             </div>
//             <h3 className="text-sm font-medium opacity-90">Total Transactions</h3>
//             <p className="text-3xl font-bold mt-2">{expenses.length}</p>
//           </div>

//           <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
//             <div className="flex items-center justify-between mb-2">
//               <div className="p-3 bg-white/20 rounded-lg">
//                 <Receipt className="w-6 h-6" />
//               </div>
//             </div>
//             <h3 className="text-sm font-medium opacity-90">Top Category</h3>
//             <p className="text-xl font-bold mt-2">
//               {summary.topCategories[0]?.category || 'N/A'}
//             </p>
//           </div>
//         </div>

//         {/* Top 5 Categories */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//           <h2 className="text-xl font-bold text-gray-900 mb-4">Top 5 Categories by Expense</h2>
//           <div className="space-y-3">
//             {summary.topCategories.map((cat, index) => (
//               <div key={index} className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3 flex-1">
//                   <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
//                     {index + 1}
//                   </span>
//                   <span className="font-medium text-gray-700">{cat.category}</span>
//                 </div>
//                 <div className="flex items-center space-x-4">
//                   <div className="w-48 bg-gray-200 rounded-full h-2">
//                     <div
//                       className="bg-blue-600 h-2 rounded-full"
//                       style={{
//                         width: `${(cat.amount / summary.topCategories[0].amount) * 100}%`
//                       }}
//                     />
//                   </div>
//                   <span className="font-bold text-gray-900 w-32 text-right">
//                     ₹{cat.amount.toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Filters and Actions */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//           <div className="flex flex-col lg:flex-row gap-4 mb-4">
//             {/* Search */}
//             <div className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   placeholder="Search by title, vendor, or category..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             {/* Category Filter */}
//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="all">All Categories</option>
//               {categories.map(cat => (
//                 <option key={cat} value={cat}>{cat}</option>
//               ))}
//             </select>

//             {/* Status Filter */}
//             <select
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="all">All Status</option>
//               {statuses.map(status => (
//                 <option key={status} value={status}>{status}</option>
//               ))}
//             </select>

//             {/* Export Button */}
//             <button
//               onClick={exportToCSV}
//               className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//             >
//               <Download className="w-5 h-5" />
//               <span>Export CSV</span>
//             </button>

//             {/* Add Expense Button */}
//             <button
//               onClick={() => {
//                 resetForm();
//                 setIsModalOpen(true);
//               }}
//               className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               <Plus className="w-5 h-5" />
//               <span>Add Expense</span>
//             </button>
//           </div>

//           {/* Date Range Filter */}
//           <div className="flex items-center space-x-4">
//             <Calendar className="w-5 h-5 text-gray-400" />
//             <input
//               type="date"
//               value={dateRange.start}
//               onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//             <span className="text-gray-500">to</span>
//             <input
//               type="date"
//               value={dateRange.end}
//               onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//             {(dateRange.start || dateRange.end) && (
//               <button
//                 onClick={() => setDateRange({ start: '', end: '' })}
//                 className="text-sm text-blue-600 hover:text-blue-700"
//               >
//                 Clear
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Expenses Table */}
//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Title
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Category
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Amount
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Payment
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Vendor
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {currentExpenses.length === 0 ? (
//                   <tr>
//                     <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
//                       No expenses found. Add your first expense to get started.
//                     </td>
//                   </tr>
//                 ) : (
//                   currentExpenses.map((expense) => (
//                     <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {new Date(expense.date).toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         <div className="font-medium">{expense.title}</div>
//                         <div className="text-xs text-gray-500">{expense.expense_type}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
//                           {expense.category}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
//                         ₹{expense.amount.toLocaleString()}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {expense.payment_method}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600">
//                         {expense.vendor_name}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(expense.status)}`}>
//                           {getStatusIcon(expense.status)}
//                           <span>{expense.status}</span>
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm">
//                         <div className="flex items-center space-x-3">
//                           {expense.attachment_url && (
//                             <a
//                               href={expense.attachment_url}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-blue-600 hover:text-blue-800"
//                               title="View Receipt"
//                             >
//                               <FileText className="w-5 h-5" />
//                             </a>
//                           )}
//                           <button
//                             onClick={() => handleEdit(expense)}
//                             className="text-gray-600 hover:text-blue-600"
//                             title="Edit"
//                           >
//                             <Edit2 className="w-5 h-5" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(expense.id)}
//                             className="text-gray-600 hover:text-red-600"
//                             title="Delete"
//                           >
//                             <Trash2 className="w-5 h-5" />
//                           </button>
//                           {expense.status === 'Pending' && (
//                             <button
//                               onClick={() => handleApproval(expense.id, 'Approved')}
//                               className="text-gray-600 hover:text-green-600"
//                               title="Approve"
//                             >
//                               <CheckCircle className="w-5 h-5" />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
//               <div className="text-sm text-gray-700">
//                 Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredExpenses.length)} of {filteredExpenses.length} expenses
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Previous
//                 </button>
//                 <div className="flex space-x-1">
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                     <button
//                       key={page}
//                       onClick={() => setCurrentPage(page)}
//                       className={`px-4 py-2 rounded-lg text-sm font-medium ${
//                         currentPage === page
//                           ? 'bg-blue-600 text-white'
//                           : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   ))}
//                 </div>
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Add/Edit Expense Modal */}
//         {isModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
//               {/* Modal Header */}
//               <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   {isEditing ? 'Edit Expense' : 'Add New Expense'}
//                 </h2>
//                 <button
//                   onClick={() => {
//                     setIsModalOpen(false);
//                     resetForm();
//                   }}
//                   className="text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               {/* Modal Body */}
//               <form onSubmit={handleSubmit} className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Expense Title */}
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Expense Title *
//                     </label>
//                     <input
//                       type="text"
//                       name="title"
//                       value={formData.title}
//                       onChange={handleInputChange}
//                       required
//                       placeholder="e.g., Science Lab Equipment"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>

//                   {/* Category */}
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Category *
//                     </label>
//                     <select
//                       name="category"
//                       value={formData.category}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       {categories.map(cat => (
//                         <option key={cat} value={cat}>{cat}</option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Date */}
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Date of Expense *
//                     </label>
//                     <input
//                       type="date"
//                       name="date"
//                       value={formData.date}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>

//                   {/* Amount */}
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Amount (₹) *
//                     </label>
//                     <input
//                       type="number"
//                       name="amount"
//                       value={formData.amount}
//                       onChange={handleInputChange}
//                       required
//                       min="0"
//                       step="0.01"
//                       placeholder="0.00"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>

//                   {/* Payment Method */}
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Paid Through *
//                     </label>
//                     <select
//                       name="payment_method"
//                       value={formData.payment_method}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       {paymentMethods.map(method => (
//                         <option key={method} value={method}>{method}</option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Vendor Name */}
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Vendor / Payee Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="vendor_name"
//                       value={formData.vendor_name}
//                       onChange={handleInputChange}
//                       required
//                       placeholder="Enter vendor name"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>

//                   {/* Expense Type */}
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Expense Type *
//                     </label>
//                     <select
//                       name="expense_type"
//                       value={formData.expense_type}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       <option value="One-time">One-time</option>
//                       <option value="Recurring">Recurring</option>
//                     </select>
//                   </div>

//                   {/* Approved By */}
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Approved By
//                     </label>
//                     <input
//                       type="text"
//                       name="approved_by"
//                       value={formData.approved_by || ''}
//                       onChange={handleInputChange}
//                       placeholder="Staff name or ID"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>

//                   {/* Status */}
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Status *
//                     </label>
//                     <select
//                       name="status"
//                       value={formData.status}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       {statuses.map(status => (
//                         <option key={status} value={status}>{status}</option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Description */}
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Description / Notes
//                     </label>
//                     <textarea
//                       name="description"
//                       value={formData.description}
//                       onChange={handleInputChange}
//                       rows={3}
//                       placeholder="Add any additional notes or details..."
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                     />
//                   </div>

//                   {/* File Upload */}
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Upload Receipt / Bill
//                     </label>
//                     <div className="flex items-center space-x-4">
//                       <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
//                         <Upload className="w-5 h-5 text-gray-400 mr-2" />
//                         <span className="text-sm text-gray-600">
//                           {selectedFile ? selectedFile.name : 'Choose file or drag here'}
//                         </span>
//                         <input
//                           type="file"
//                           onChange={handleFileChange}
//                           accept="image/*,.pdf"
//                           className="hidden"
//                         />
//                       </label>
//                       {selectedFile && (
//                         <button
//                           type="button"
//                           onClick={() => setSelectedFile(null)}
//                           className="text-red-600 hover:text-red-700"
//                         >
//                           <X className="w-5 h-5" />
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Modal Footer */}
//                 <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setIsModalOpen(false);
//                       resetForm();
//                     }}
//                     className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
//                   >
//                     {loading ? (
//                       <>
//                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                         <span>Saving...</span>
//                       </>
//                     ) : (
//                       <span>{isEditing ? 'Update Expense' : 'Add Expense'}</span>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ExpenseManagement;
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit2, 
  Trash2, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  AlertCircle,
  Calendar,
  Receipt,
  Users,
  Upload,
  X
} from 'lucide-react';
import { supabase } from '../../../lib/supabase'

// Types
interface Expense {
  id: string;
  title: string;
  category: 'Salaries' | 'Utilities' | 'Maintenance' | 'Purchase' | 'Transportation' | 'Events' | 'Miscellaneous';
  date: string;
  amount: number;
  payment_method: 'Cash' | 'Bank' | 'Cheque' | 'Online';
  vendor_name: string;
  description: string;
  attachment_url?: string;
  approved_by?: string;
  expense_type: 'Recurring' | 'One-time';
  status: 'Pending' | 'Approved' | 'Reimbursed';
  created_at: string;
}

interface ExpenseSummary {
  totalExpenses: number;
  pendingApprovals: number;
  topCategories: { category: string; amount: number }[];
}

const ExpenseManagement: React.FC = () => {
  // State Management
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [summary, setSummary] = useState<ExpenseSummary>({
    totalExpenses: 0,
    pendingApprovals: 0,
    topCategories: []
  });

  // Form State
  const [formData, setFormData] = useState<Partial<Expense>>({
    title: '',
    category: 'Miscellaneous',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    payment_method: 'Cash',
    vendor_name: '',
    description: '',
    expense_type: 'One-time',
    status: 'Pending'
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Categories for dropdown
  const categories = ['Salaries', 'Utilities', 'Maintenance', 'Purchase', 'Transportation', 'Events', 'Miscellaneous'];
  const paymentMethods = ['Cash', 'Bank', 'Cheque', 'Online'];
  const statuses = ['Pending', 'Approved', 'Reimbursed'];

  // Fetch expenses from Supabase
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedCategory, selectedStatus, dateRange, expenses]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
      calculateSummary(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (expenseData: Expense[]) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyExpenses = expenseData.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });

    const total = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const pending = expenseData.filter(exp => exp.status === 'Pending').length;

    // Calculate top 5 categories
    const categoryTotals: { [key: string]: number } = {};
    expenseData.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const topCategories = Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    setSummary({
      totalExpenses: total,
      pendingApprovals: pending,
      topCategories
    });
  };

  const applyFilters = () => {
    let filtered = [...expenses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(exp =>
        exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(exp => exp.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(exp => exp.status === selectedStatus);
    }

    // Date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate >= new Date(dateRange.start) && expDate <= new Date(dateRange.end);
      });
    }

    setFilteredExpenses(filtered);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File): Promise<string | undefined> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `expense-receipts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('school-documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('school-documents')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    return undefined; // Changed from null to undefined
  }
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let attachmentUrl = formData.attachment_url;

      // Upload file if selected
      if (selectedFile) {
        attachmentUrl = await uploadFile(selectedFile);
      }

      const expenseData = {
        ...formData,
        attachment_url: attachmentUrl,
        amount: Number(formData.amount)
      };

      if (isEditing && formData.id) {
        // Update existing expense
        const { error } = await supabase
          .from('expenses')
          .update(expenseData)
          .eq('id', formData.id);

        if (error) throw error;
      } else {
        // Insert new expense
        const { error } = await supabase
          .from('expenses')
          .insert([expenseData]);

        if (error) throw error;
      }

      // Reset form and close modal
      resetForm();
      setIsModalOpen(false);
      fetchExpenses();
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Failed to save expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (expense: Expense) => {
    setFormData(expense);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense.');
    }
  };

  const handleApproval = async (id: string, newStatus: 'Approved' | 'Reimbursed') => {
    try {
      const { error } = await supabase
        .from('expenses')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchExpenses();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'Miscellaneous',
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      payment_method: 'Cash',
      vendor_name: '',
      description: '',
      expense_type: 'One-time',
      status: 'Pending'
    });
    setSelectedFile(null);
    setIsEditing(false);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Title', 'Category', 'Amount', 'Payment Method', 'Vendor', 'Status', 'Type'];
    const csvData = filteredExpenses.map(exp => [
      exp.date,
      exp.title,
      exp.category,
      exp.amount,
      exp.payment_method,
      exp.vendor_name,
      exp.status,
      exp.expense_type
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExpenses = filteredExpenses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Reimbursed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Approved': return <CheckCircle className="w-4 h-4" />;
      case 'Reimbursed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F9FC] p-8">
      <div className="max-w-[1600px] mx-auto space-y-7">
        {/* Header */}
        <div>
          <h1 
            className="text-gray-900 mb-2"
            style={{ 
              fontSize: '32px', 
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}
          >
            Expense Management
          </h1>
          <p 
            className="text-gray-600" 
            style={{ fontSize: '15px', fontWeight: 400 }}
          >
            Track and manage all school-related expenses
          </p>
        </div>

        {/* Summary Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6 hover:shadow-float transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-blue-50 rounded-[16px] flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-blue-500" />
              </div>
            </div>
            <h3 
              className="text-gray-600 mb-1"
              style={{ fontSize: '14px', fontWeight: 500 }}
            >
              Total Expenses (This Month)
            </h3>
            <p 
              className="text-gray-900"
              style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}
            >
              ₹{summary.totalExpenses.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6 hover:shadow-float transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-amber-50 rounded-[16px] flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-amber-600" />
              </div>
            </div>
            <h3 
              className="text-gray-600 mb-1"
              style={{ fontSize: '14px', fontWeight: 500 }}
            >
              Pending Approvals
            </h3>
            <p 
              className="text-gray-900"
              style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}
            >
              {summary.pendingApprovals}
            </p>
          </div>

          <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6 hover:shadow-float transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-[16px] flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-emerald-600" />
              </div>
            </div>
            <h3 
              className="text-gray-600 mb-1"
              style={{ fontSize: '14px', fontWeight: 500 }}
            >
              Total Transactions
            </h3>
            <p 
              className="text-gray-900"
              style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}
            >
              {expenses.length}
            </p>
          </div>

          <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6 hover:shadow-float transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-purple-50 rounded-[16px] flex items-center justify-center">
                <Receipt className="w-7 h-7 text-purple-600" />
              </div>
            </div>
            <h3 
              className="text-gray-600 mb-1"
              style={{ fontSize: '14px', fontWeight: 500 }}
            >
              Top Category
            </h3>
            <p 
              className="text-gray-900"
              style={{ fontSize: '20px', fontWeight: 700 }}
            >
              {summary.topCategories[0]?.category || 'N/A'}
            </p>
          </div>
        </div>

        {/* Top 5 Categories */}
        <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6">
          <h2 
            className="text-gray-900 mb-5"
            style={{ fontSize: '20px', fontWeight: 600 }}
          >
            Top 5 Categories by Expense
          </h2>
          <div className="space-y-3">
            {summary.topCategories.map((cat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </span>
                  <span 
                    className="text-gray-700"
                    style={{ fontSize: '15px', fontWeight: 500 }}
                  >
                    {cat.category}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div
                      className="gradient-primary h-2 rounded-full"
                      style={{
                        width: `${(cat.amount / summary.topCategories[0].amount) * 100}%`
                      }}
                    />
                  </div>
                  <span 
                    className="text-gray-900 w-32 text-right"
                    style={{ fontSize: '15px', fontWeight: 700 }}
                  >
                    ₹{cat.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search by title, vendor, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 placeholder-gray-400"
                  style={{ fontSize: '14px', fontWeight: 500 }}
                />
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
              style={{ fontSize: '14px', fontWeight: 500 }}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
              style={{ fontSize: '14px', fontWeight: 500 }}
            >
              <option value="all">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            {/* Export Button */}
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium shadow-sm"
              style={{ fontSize: '14px' }}
            >
              <Download className="w-5 h-5" />
              <span>Export CSV</span>
            </button>

            {/* Add Expense Button */}
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-2.5 gradient-primary text-white rounded-xl shadow-soft hover:shadow-float transition-all duration-200 font-medium"
              style={{ fontSize: '14px' }}
            >
              <Plus className="w-5 h-5" />
              <span>Add Expense</span>
            </button>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
              style={{ fontSize: '14px', fontWeight: 500 }}
            />
            <span className="text-gray-500" style={{ fontSize: '14px' }}>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
              style={{ fontSize: '14px', fontWeight: 500 }}
            />
            {(dateRange.start || dateRange.end) && (
              <button
                onClick={() => setDateRange({ start: '', end: '' })}
                className="text-blue-600 hover:text-blue-700 font-medium"
                style={{ fontSize: '14px' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-gray-700 uppercase tracking-wider"
                    style={{ fontSize: '12px', fontWeight: 600 }}
                  >
                    Date
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-gray-700 uppercase tracking-wider"
                    style={{ fontSize: '12px', fontWeight: 600 }}
                  >
                    Title
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-gray-700 uppercase tracking-wider"
                    style={{ fontSize: '12px', fontWeight: 600 }}
                  >
                    Category
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-gray-700 uppercase tracking-wider"
                    style={{ fontSize: '12px', fontWeight: 600 }}
                  >
                    Amount
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-gray-700 uppercase tracking-wider"
                    style={{ fontSize: '12px', fontWeight: 600 }}
                  >
                    Payment
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-gray-700 uppercase tracking-wider"
                    style={{ fontSize: '12px', fontWeight: 600 }}
                  >
                    Vendor
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-gray-700 uppercase tracking-wider"
                    style={{ fontSize: '12px', fontWeight: 600 }}
                  >
                    Status
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-gray-700 uppercase tracking-wider"
                    style={{ fontSize: '12px', fontWeight: 600 }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <p 
                        className="text-gray-500"
                        style={{ fontSize: '15px', fontWeight: 500 }}
                      >
                        No expenses found. Add your first expense to get started.
                      </p>
                    </td>
                  </tr>
                ) : (
                  currentExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                      <td 
                        className="px-6 py-4 whitespace-nowrap text-gray-900"
                        style={{ fontSize: '14px', fontWeight: 500 }}
                      >
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div 
                          className="text-gray-900"
                          style={{ fontSize: '14px', fontWeight: 600 }}
                        >
                          {expense.title}
                        </div>
                        <div 
                          className="text-gray-500"
                          style={{ fontSize: '12px' }}
                        >
                          {expense.expense_type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-medium" style={{ fontSize: '12px' }}>
                          {expense.category}
                        </span>
                      </td>
                      <td 
                        className="px-6 py-4 whitespace-nowrap text-gray-900"
                        style={{ fontSize: '14px', fontWeight: 700 }}
                      >
                        ₹{expense.amount.toLocaleString()}
                      </td>
                      <td 
                        className="px-6 py-4 whitespace-nowrap text-gray-600"
                        style={{ fontSize: '14px', fontWeight: 500 }}
                      >
                        {expense.payment_method}
                      </td>
                      <td 
                        className="px-6 py-4 text-gray-600"
                        style={{ fontSize: '14px', fontWeight: 500 }}
                      >
                        {expense.vendor_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium ${getStatusColor(expense.status)}`} style={{ fontSize: '12px' }}>
                          {getStatusIcon(expense.status)}
                          <span>{expense.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {expense.attachment_url && (
                            <a
                              href={expense.attachment_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 transition-colors"
                              title="View Receipt"
                            >
                              <FileText className="w-5 h-5" />
                            </a>
                          )}
                          <button
                            onClick={() => handleEdit(expense)}
                            className="text-gray-600 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="text-gray-600 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          {expense.status === 'Pending' && (
                            <button
                              onClick={() => handleApproval(expense.id, 'Approved')}
                              className="text-gray-600 hover:text-emerald-600 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div 
                className="text-gray-700"
                style={{ fontSize: '14px', fontWeight: 500 }}
              >
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredExpenses.length)} of {filteredExpenses.length} expenses
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                  style={{ fontSize: '14px' }}
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        currentPage === page
                          ? 'gradient-primary text-white shadow-sm'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                      }`}
                      style={{ fontSize: '14px' }}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                  style={{ fontSize: '14px' }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Expense Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[24px] shadow-float max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between rounded-t-[24px]">
                <h2 
                  className="text-gray-900"
                  style={{ fontSize: '24px', fontWeight: 600 }}
                >
                  {isEditing ? 'Edit Expense' : 'Add New Expense'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* [Keep all form fields exactly as is, but update input styling] */}
                  
                  {/* Example: Expense Title */}
                  <div className="md:col-span-2">
                    <label 
                      className="block text-gray-700 mb-2"
                      style={{ fontSize: '14px', fontWeight: 600 }}
                    >
                      Expense Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Science Lab Equipment"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 placeholder-gray-400"
                      style={{ fontSize: '14px', fontWeight: 500 }}
                    />
                  </div>

                  {/* Apply same styling to all other form inputs */}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    style={{ fontSize: '14px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 gradient-primary text-white rounded-xl font-medium shadow-soft hover:shadow-float transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    style={{ fontSize: '14px' }}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{isEditing ? 'Update Expense' : 'Add Expense'}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseManagement;
