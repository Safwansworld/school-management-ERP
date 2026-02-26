// // // // // // components/complaints/ComplaintForm.tsx
// // // // // import { useState, useEffect } from 'react';
// // // // // import { motion } from 'framer-motion';
// // // // // import { X, Upload, AlertCircle, Loader2 } from 'lucide-react';
// // // // // import { Button } from '../../../components/ui/button';
// // // // // import { supabase } from '../../../lib/supabase';
// // // // // import type { User } from '@supabase/supabase-js';

// // // // // interface ComplaintFormProps {
// // // // //   onClose: () => void;
// // // // //   onSuccess: () => void;
// // // // //   user: User | null;
// // // // //   userRole: string;
// // // // // }

// // // // // interface FormData {
// // // // //   complainant_role: string;
// // // // //   complainant_name: string;
// // // // //   complainant_email: string;
// // // // //   complainant_phone: string;
// // // // //   against_role: string;
// // // // //   against_id: string;
// // // // //   against_name: string;
// // // // //   department: string;
// // // // //   class_id: string;
// // // // //   class_name: string;
// // // // //   complaint_type: string;
// // // // //   title: string;
// // // // //   description: string;
// // // // //   incident_date: string;
// // // // //   urgency_level: string;
// // // // // }

// // // // // export default function ComplaintForm({ onClose, onSuccess, user, userRole }: ComplaintFormProps) {
// // // // //   const [formData, setFormData] = useState<FormData>({
// // // // //     complainant_role: userRole,
// // // // //     complainant_name: '',
// // // // //     complainant_email: user?.email || '',
// // // // //     complainant_phone: '',
// // // // //     against_role: '',
// // // // //     against_id: '',
// // // // //     against_name: '',
// // // // //     department: '',
// // // // //     class_id: '',
// // // // //     class_name: '',
// // // // //     complaint_type: '',
// // // // //     title: '',
// // // // //     description: '',
// // // // //     incident_date: '',
// // // // //     urgency_level: 'medium',
// // // // //   });


// // // // //   const [students, setStudents] = useState<any[]>([]);
// // // // //   const [teachers, setTeachers] = useState<any[]>([]);
// // // // //   const [classes, setClasses] = useState<any[]>([]);
// // // // //   const [attachments, setAttachments] = useState<File[]>([]);
// // // // //   const [uploading, setUploading] = useState(false);
// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [errors, setErrors] = useState<Record<string, string>>({});


// // // // //   useEffect(() => {
// // // // //     if (user && userRole) {
// // // // //       fetchUserInfo();
// // // // //     }
// // // // //   }, [user, userRole]);

// // // // //   const getCurrentAcademicYear = (): string => {
// // // // //   const today = new Date();
// // // // //   const currentYear = today.getFullYear();
// // // // //   const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
  
// // // // //   // If current month is April (4) or later, academic year is current-next
// // // // //   // Otherwise, it's previous-current
// // // // //   if (currentMonth >= 4) {
// // // // //     return `${currentYear}-${currentYear + 1}`;
// // // // //   } else {
// // // // //     return `${currentYear - 1}-${currentYear}`;
// // // // //   }
// // // // // };

// // // // //   const fetchUserInfo = async () => {
// // // // //     if (!user) {
// // // // //       console.warn('No user found');
// // // // //       return;
// // // // //     }

// // // // //     try {
// // // // //       console.log('👤 Fetching user info for role:', userRole);
// // // // //       let userData;
      
// // // // //       if (userRole === 'student') {
// // // // //         const { data, error } = await supabase
// // // // //           .from('students')
// // // // //           .select('full_name, email, parent_contact')
// // // // //           .eq('id', user.id)
// // // // //           .single();

// // // // //         if (error) {
// // // // //           console.error('Error fetching student data:', error);
// // // // //         } else {
// // // // //           userData = data;
// // // // //           console.log('✅ Student data fetched:', userData);
// // // // //         }
// // // // //       } else if (userRole === 'teacher') {
// // // // //         const { data, error } = await supabase
// // // // //           .from('teachers')
// // // // //           .select('full_name, email, phone_number')
// // // // //           .eq('id', user.id)
// // // // //           .single();

// // // // //         if (error) {
// // // // //           console.error('Error fetching teacher data:', error);
// // // // //         } else {
// // // // //           userData = data;
// // // // //           console.log('✅ Teacher data fetched:', userData);
// // // // //         }
// // // // //       } else if (userRole === 'parent') {
// // // // //         // For parent, try to get from user_profiles or auth metadata
// // // // //         const { data, error } = await supabase
// // // // //           .from('user_profiles')
// // // // //           .select('first_name, last_name, email, phone_number')
// // // // //           .eq('id', user.id)
// // // // //           .single();

// // // // //         if (error) {
// // // // //           console.error('Error fetching parent data:', error);
// // // // //         } else {
// // // // //           userData = {
// // // // //             full_name: `${data.first_name} ${data.last_name}`,
// // // // //             email: data.email,
// // // // //             parent_contact: data.phone_number,
// // // // //           };
// // // // //           console.log('✅ Parent data fetched:', userData);
// // // // //         }
// // // // //       } else if (userRole === 'staff' || userRole === 'admin') {
// // // // //         // For staff/admin, use user_profiles
// // // // //         const { data, error } = await supabase
// // // // //           .from('user_profiles')
// // // // //           .select('first_name, last_name, email, phone_number')
// // // // //           .eq('id', user.id)
// // // // //           .single();

// // // // //         if (error) {
// // // // //           console.error('Error fetching staff/admin data:', error);
// // // // //         } else {
// // // // //           userData = {
// // // // //             full_name: `${data.first_name} ${data.last_name}`,
// // // // //             email: data.email,
// // // // //             parent_contact: data.phone_number,
// // // // //           };
// // // // //           console.log('✅ Staff/Admin data fetched:', userData);
// // // // //         }
// // // // //       }

// // // // //       if (userData) {
// // // // //         setFormData((prev) => ({
// // // // //           ...prev,
// // // // //           complainant_name: userData.full_name || '',
// // // // //           complainant_email: userData.email || user.email || '',
// // // // //           complainant_phone: userData.parent_contact || userData.phone_number || '',
// // // // //         }));
// // // // //         console.log('✅ Form data updated with user info');
// // // // //       } else {
// // // // //         // Fallback to basic user info from auth
// // // // //         console.warn('⚠️ No user data found, using fallback');
// // // // //         setFormData((prev) => ({
// // // // //           ...prev,
// // // // //           complainant_name: user.email?.split('@')[0] || 'User',
// // // // //           complainant_email: user.email || '',
// // // // //           complainant_phone: user.phone || '',
// // // // //         }));
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('❌ Error in fetchUserInfo:', error);
// // // // //       // Fallback
// // // // //       setFormData((prev) => ({
// // // // //         ...prev,
// // // // //         complainant_name: user.email?.split('@')[0] || 'User',
// // // // //         complainant_email: user.email || '',
// // // // //       }));
// // // // //     }
// // // // //   };

// // // // //   const fetchDropdownData = async () => {
// // // // //   try {
// // // // //     const currentAcademicYear = getCurrentAcademicYear();
// // // // //     console.log('📅 Current Academic Year:', currentAcademicYear);

// // // // //     // Fetch students with their current class from class_assignments
// // // // //     const { data: studentsData, error: studentsError } = await supabase
// // // // //       .from('students')
// // // // //       .select(`
// // // // //         id,
// // // // //         full_name,
// // // // //         class_name,
// // // // //         status
// // // // //       `)
// // // // //       .eq('status', 'active')
// // // // //       .order('full_name');

// // // // //     if (studentsError) {
// // // // //       console.error('Error fetching students:', studentsError);
// // // // //     }

// // // // //     // Fetch teachers
// // // // //     const { data: teachersData, error: teachersError } = await supabase
// // // // //       .from('teachers')
// // // // //       .select('id, full_name, subject_specialization, status')
// // // // //       .eq('status', 'active')
// // // // //       .order('full_name');

// // // // //     if (teachersError) {
// // // // //       console.error('Error fetching teachers:', teachersError);
// // // // //     }

// // // // //     // Fetch distinct class names from class_assignments for current academic year
// // // // //     const { data: classesData, error: classesError } = await supabase
// // // // //       .from('class_assignments')
// // // // //       .select('class_name')
// // // // //       .eq('academic_year', currentAcademicYear)
// // // // //       .order('class_name');

// // // // //     if (classesError) {
// // // // //       console.error('Error fetching classes:', classesError);
// // // // //     }

// // // // //     // Get unique class names using JavaScript Set
// // // // //     const uniqueClasses = classesData 
// // // // //       ? Array.from(new Set(classesData.map(item => item.class_name).filter(Boolean)))
// // // // //           .map(className => ({ name: className }))
// // // // //       : [];

// // // // //     console.log('✅ Fetched data:', {
// // // // //       students: studentsData?.length || 0,
// // // // //       teachers: teachersData?.length || 0,
// // // // //       classes: uniqueClasses.length
// // // // //     });

// // // // //     setStudents(studentsData || []);
// // // // //     setTeachers(teachersData || []);
// // // // //     setClasses(uniqueClasses);
// // // // //   } catch (error) {
// // // // //     console.error('Error fetching dropdown data:', error);
// // // // //     setStudents([]);
// // // // //     setTeachers([]);
// // // // //     setClasses([]);
// // // // //   }
// // // // // };

// // // // //   const handleInputChange = (field: keyof FormData, value: string) => {
// // // // //     setFormData((prev) => ({ ...prev, [field]: value }));
// // // // //     setErrors((prev) => ({ ...prev, [field]: '' }));
// // // // //   };

// // // // //   const handleAgainstChange = (role: string, id: string) => {
// // // // //     let name = '';
    
// // // // //     if (role === 'student') {
// // // // //       const student = students.find((s) => s.id === id);
// // // // //       name = student?.full_name || '';
// // // // //     } else if (role === 'teacher') {
// // // // //       const teacher = teachers.find((t) => t.id === id);
// // // // //       name = teacher?.full_name || '';
// // // // //     }

// // // // //     setFormData((prev) => ({
// // // // //       ...prev,
// // // // //       against_role: role,
// // // // //       against_id: id,
// // // // //       against_name: name,
// // // // //     }));
// // // // //   };

// // // // //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // // // //     if (e.target.files) {
// // // // //       const filesArray = Array.from(e.target.files);
// // // // //       setAttachments((prev) => [...prev, ...filesArray]);
// // // // //     }
// // // // //   };

// // // // //   const removeFile = (index: number) => {
// // // // //     setAttachments((prev) => prev.filter((_, i) => i !== index));
// // // // //   };

// // // // //   const uploadFiles = async () => {
// // // // //     if (attachments.length === 0) return [];

// // // // //     const uploadedUrls: string[] = [];
    
// // // // //     for (const file of attachments) {
// // // // //       const fileName = `${user?.id}/${Date.now()}_${file.name}`;
      
// // // // //       const { data, error } = await supabase.storage
// // // // //         .from('complaint-attachments')
// // // // //         .upload(fileName, file);

// // // // //       if (error) {
// // // // //         console.error('Error uploading file:', error);
// // // // //         continue;
// // // // //       }

// // // // //       const { data: urlData } = supabase.storage
// // // // //         .from('complaint-attachments')
// // // // //         .getPublicUrl(fileName);

// // // // //       uploadedUrls.push(urlData.publicUrl);
// // // // //     }

// // // // //     return uploadedUrls;
// // // // //   };

// // // // //   const validateForm = (): boolean => {
// // // // //     const newErrors: Record<string, string> = {};

// // // // //     if (!formData.title.trim()) newErrors.title = 'Title is required';
// // // // //     if (!formData.description.trim()) newErrors.description = 'Description is required';
// // // // //     if (!formData.complaint_type) newErrors.complaint_type = 'Complaint type is required';
// // // // //     if (!formData.against_role) newErrors.against_role = 'Please select who the complaint is against';
// // // // //     if (formData.against_role !== 'department' && formData.against_role !== 'other' && !formData.against_id) {
// // // // //       newErrors.against_id = 'Please select a specific person';
// // // // //     }
// // // // //     if (!formData.incident_date) newErrors.incident_date = 'Incident date is required';

// // // // //     setErrors(newErrors);
// // // // //     return Object.keys(newErrors).length === 0;
// // // // //   };

// // // // //   const handleSubmit = async (e: React.FormEvent) => {
// // // // //   e.preventDefault();

// // // // //   if (!validateForm()) return;

// // // // //   try {
// // // // //     setLoading(true);
// // // // //     setUploading(true);

// // // // //     // Upload attachments
// // // // //     const uploadedUrls = await uploadFiles();
// // // // //     setUploading(false);

// // // // //     // Insert complaint
// // // // //     const { error } = await supabase.from('complaints').insert({
// // // // //       complainant_role: formData.complainant_role,
// // // // //       complainant_id: user?.id,
// // // // //       complainant_name: formData.complainant_name,
// // // // //       complainant_email: formData.complainant_email,
// // // // //       complainant_phone: formData.complainant_phone,
// // // // //       against_role: formData.against_role,
// // // // //       against_id: formData.against_id || null,
// // // // //       against_name: formData.against_name || formData.department,
// // // // //       department: formData.department || null,
// // // // //       class_id: null, // Set to null since we're using class_name
// // // // //       class_name: formData.class_name || null, // Use the selected class name
// // // // //       complaint_type: formData.complaint_type,
// // // // //       title: formData.title,
// // // // //       description: formData.description,
// // // // //       incident_date: formData.incident_date,
// // // // //       urgency_level: formData.urgency_level,
// // // // //       attachments: uploadedUrls,
// // // // //       status: 'pending',
// // // // //       requires_approval: true,
// // // // //     });

// // // // //     if (error) throw error;

// // // // //     onSuccess();
// // // // //   } catch (error) {
// // // // //     console.error('Error submitting complaint:', error);
// // // // //     alert('Failed to submit complaint. Please try again.');
// // // // //   } finally {
// // // // //     setLoading(false);
// // // // //     setUploading(false);
// // // // //   }
// // // // // };


// // // // //   return (
// // // // //     <motion.div
// // // // //       initial={{ opacity: 0 }}
// // // // //       animate={{ opacity: 1 }}
// // // // //       exit={{ opacity: 0 }}
// // // // //       className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
// // // // //       onClick={onClose}
// // // // //     >
// // // // //       <motion.div
// // // // //         initial={{ scale: 0.9, y: 20 }}
// // // // //         animate={{ scale: 1, y: 0 }}
// // // // //         exit={{ scale: 0.9, y: 20 }}
// // // // //         onClick={(e) => e.stopPropagation()}
// // // // //         className="glass-strong rounded-2xl shadow-float max-w-3xl w-full max-h-[90vh] overflow-y-auto"
// // // // //       >
// // // // //         {/* Header */}
// // // // //         <div className="sticky top-0 z-10 glass-strong border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
// // // // //           <h2 className="text-gray-800">Submit New Complaint</h2>
// // // // //           <button
// // // // //             onClick={onClose}
// // // // //             className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
// // // // //           >
// // // // //             <X className="w-5 h-5 text-gray-500" />
// // // // //           </button>
// // // // //         </div>

// // // // //         {/* Form */}
// // // // //         <form onSubmit={handleSubmit} className="p-6 space-y-6">
// // // // //           {/* Complainant Info (Auto-filled) */}
// // // // // <div className="glass rounded-xl p-4 bg-blue-50/30">
// // // // //   <h4 className="text-sm font-semibold text-gray-700 mb-3">Your Information</h4>
// // // // //   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // // //     <div>
// // // // //       <label className="text-sm text-gray-600">Name</label>
// // // // //       <p className="font-medium text-gray-800">
// // // // //         {formData.complainant_name || 'Loading...'}
// // // // //       </p>
// // // // //     </div>
// // // // //     <div>
// // // // //       <label className="text-sm text-gray-600">Role</label>
// // // // //       <p className="font-medium text-gray-800 capitalize">
// // // // //         {formData.complainant_role || 'Loading...'}
// // // // //       </p>
// // // // //     </div>
// // // // //     {formData.complainant_email && (
// // // // //       <div>
// // // // //         <label className="text-sm text-gray-600">Email</label>
// // // // //         <p className="text-sm text-gray-700">{formData.complainant_email}</p>
// // // // //       </div>
// // // // //     )}
// // // // //     {formData.complainant_phone && (
// // // // //       <div>
// // // // //         <label className="text-sm text-gray-600">Contact</label>
// // // // //         <p className="text-sm text-gray-700">{formData.complainant_phone}</p>
// // // // //       </div>
// // // // //     )}
// // // // //   </div>
// // // // // </div>


// // // // //           {/* Against Section */}
// // // // //           <div className="space-y-4">
// // // // //             <h4 className="text-sm font-semibold text-gray-700">Complaint Against</h4>
            
// // // // //             <div>
// // // // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // // // //                 Role/Type <span className="text-red-500">*</span>
// // // // //               </label>
// // // // //               <select
// // // // //                 value={formData.against_role}
// // // // //                 onChange={(e) => handleInputChange('against_role', e.target.value)}
// // // // //                 className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all ${
// // // // //                   errors.against_role ? 'border-red-300' : 'border-gray-200'
// // // // //                 }`}
// // // // //               >
// // // // //                 <option value="">Select role</option>
// // // // //                 <option value="student">Student</option>
// // // // //                 <option value="teacher">Teacher</option>
// // // // //                 <option value="staff">Staff</option>
// // // // //                 <option value="department">Department</option>
// // // // //                 <option value="other">Other</option>
// // // // //               </select>
// // // // //               {errors.against_role && (
// // // // //                 <p className="mt-1 text-sm text-red-600">{errors.against_role}</p>
// // // // //               )}
// // // // //             </div>

// // // // //             {formData.against_role === 'student' && (
// // // // //               <div>
// // // // //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// // // // //                   Select Student <span className="text-red-500">*</span>
// // // // //                 </label>
// // // // //                 <select
// // // // //                   value={formData.against_id}
// // // // //                   onChange={(e) => handleAgainstChange('student', e.target.value)}
// // // // //                   className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all ${
// // // // //                     errors.against_id ? 'border-red-300' : 'border-gray-200'
// // // // //                   }`}
// // // // //                 >
// // // // //                   <option value="">Select student</option>
// // // // //                   {students.map((student) => (
// // // // //                     <option key={student.id} value={student.id}>
// // // // //                       {student.full_name} {student.class_name && `(${student.class_name})`}
// // // // //                     </option>
// // // // //                   ))}
// // // // //                 </select>
// // // // //                 {errors.against_id && (
// // // // //                   <p className="mt-1 text-sm text-red-600">{errors.against_id}</p>
// // // // //                 )}
// // // // //               </div>
// // // // //             )}

// // // // //             {formData.against_role === 'teacher' && (
// // // // //               <div>
// // // // //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// // // // //                   Select Teacher <span className="text-red-500">*</span>
// // // // //                 </label>
// // // // //                 <select
// // // // //                   value={formData.against_id}
// // // // //                   onChange={(e) => handleAgainstChange('teacher', e.target.value)}
// // // // //                   className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all ${
// // // // //                     errors.against_id ? 'border-red-300' : 'border-gray-200'
// // // // //                   }`}
// // // // //                 >
// // // // //                   <option value="">Select teacher</option>
// // // // //                   {teachers.map((teacher) => (
// // // // //                     <option key={teacher.id} value={teacher.id}>
// // // // //                       {teacher.full_name} ({teacher.subject_specialization})
// // // // //                     </option>
// // // // //                   ))}
// // // // //                 </select>
// // // // //                 {errors.against_id && (
// // // // //                   <p className="mt-1 text-sm text-red-600">{errors.against_id}</p>
// // // // //                 )}
// // // // //               </div>
// // // // //             )}

// // // // //             {formData.against_role === 'department' && (
// // // // //               <div>
// // // // //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// // // // //                   Department Name <span className="text-red-500">*</span>
// // // // //                 </label>
// // // // //                 <input
// // // // //                   type="text"
// // // // //                   value={formData.department}
// // // // //                   onChange={(e) => handleInputChange('department', e.target.value)}
// // // // //                   placeholder="e.g., Administration, Transport, Cafeteria"
// // // // //                   className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all"
// // // // //                 />
// // // // //               </div>
// // // // //             )}

// // // // //             {formData.against_role === 'other' && (
// // // // //               <div>
// // // // //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// // // // //                   Specify Name/Entity
// // // // //                 </label>
// // // // //                 <input
// // // // //                   type="text"
// // // // //                   value={formData.against_name}
// // // // //                   onChange={(e) => handleInputChange('against_name', e.target.value)}
// // // // //                   placeholder="Enter name or description"
// // // // //                   className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all"
// // // // //                 />
// // // // //               </div>
// // // // //             )}
// // // // //           </div>

// // // // //           {/* Class/Department (Optional) */}
// // // // //           {/* Class/Department (Optional) */}
// // // // // <div>
// // // // //   <label className="block text-sm font-medium text-gray-700 mb-2">
// // // // //     Related Class (Optional)
// // // // //   </label>
// // // // //   <select
// // // // //     value={formData.class_name}
// // // // //     onChange={(e) => {
// // // // //       setFormData((prev) => ({
// // // // //         ...prev,
// // // // //         class_name: e.target.value,
// // // // //         class_id: '', // Clear class_id since we're using class_name
// // // // //       }));
// // // // //     }}
// // // // //     className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all"
// // // // //   >
// // // // //     <option value="">Select class (if applicable)</option>
// // // // //     {classes.map((cls, index) => (
// // // // //       <option key={index} value={cls.name}>
// // // // //         {cls.name}
// // // // //       </option>
// // // // //     ))}
// // // // //   </select>
// // // // // </div>


// // // // //           {/* Complaint Details */}
// // // // //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // // //             <div>
// // // // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // // // //                 Complaint Type <span className="text-red-500">*</span>
// // // // //               </label>
// // // // //               <select
// // // // //                 value={formData.complaint_type}
// // // // //                 onChange={(e) => handleInputChange('complaint_type', e.target.value)}
// // // // //                 className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all ${
// // // // //                   errors.complaint_type ? 'border-red-300' : 'border-gray-200'
// // // // //                 }`}
// // // // //               >
// // // // //                 <option value="">Select type</option>
// // // // //                 <option value="academic">Academic</option>
// // // // //                 <option value="behaviour">Behaviour</option>
// // // // //                 <option value="safety">Safety</option>
// // // // //                 <option value="facility">Facility</option>
// // // // //                 <option value="fee">Fee</option>
// // // // //                 <option value="transport">Transport</option>
// // // // //                 <option value="other">Other</option>
// // // // //               </select>
// // // // //               {errors.complaint_type && (
// // // // //                 <p className="mt-1 text-sm text-red-600">{errors.complaint_type}</p>
// // // // //               )}
// // // // //             </div>

// // // // //             <div>
// // // // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // // // //                 Urgency Level <span className="text-red-500">*</span>
// // // // //               </label>
// // // // //               <select
// // // // //                 value={formData.urgency_level}
// // // // //                 onChange={(e) => handleInputChange('urgency_level', e.target.value)}
// // // // //                 className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all"
// // // // //               >
// // // // //                 <option value="low">Low</option>
// // // // //                 <option value="medium">Medium</option>
// // // // //                 <option value="high">High</option>
// // // // //                 <option value="critical">Critical</option>
// // // // //               </select>
// // // // //             </div>
// // // // //           </div>

// // // // //           <div>
// // // // //             <label className="block text-sm font-medium text-gray-700 mb-2">
// // // // //               Incident Date <span className="text-red-500">*</span>
// // // // //             </label>
// // // // //             <input
// // // // //               type="date"
// // // // //               value={formData.incident_date}
// // // // //               onChange={(e) => handleInputChange('incident_date', e.target.value)}
// // // // //               max={new Date().toISOString().split('T')[0]}
// // // // //               className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all ${
// // // // //                 errors.incident_date ? 'border-red-300' : 'border-gray-200'
// // // // //               }`}
// // // // //             />
// // // // //             {errors.incident_date && (
// // // // //               <p className="mt-1 text-sm text-red-600">{errors.incident_date}</p>
// // // // //             )}
// // // // //           </div>

// // // // //           <div>
// // // // //             <label className="block text-sm font-medium text-gray-700 mb-2">
// // // // //               Title/Subject <span className="text-red-500">*</span>
// // // // //             </label>
// // // // //             <input
// // // // //               type="text"
// // // // //               value={formData.title}
// // // // //               onChange={(e) => handleInputChange('title', e.target.value)}
// // // // //               placeholder="Brief title for the complaint"
// // // // //               className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all ${
// // // // //                 errors.title ? 'border-red-300' : 'border-gray-200'
// // // // //               }`}
// // // // //             />
// // // // //             {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
// // // // //           </div>

// // // // //           <div>
// // // // //             <label className="block text-sm font-medium text-gray-700 mb-2">
// // // // //               Description <span className="text-red-500">*</span>
// // // // //             </label>
// // // // //             <textarea
// // // // //               value={formData.description}
// // // // //               onChange={(e) => handleInputChange('description', e.target.value)}
// // // // //               placeholder="Provide detailed explanation of the issue..."
// // // // //               rows={5}
// // // // //               className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all resize-none ${
// // // // //                 errors.description ? 'border-red-300' : 'border-gray-200'
// // // // //               }`}
// // // // //             />
// // // // //             {errors.description && (
// // // // //               <p className="mt-1 text-sm text-red-600">{errors.description}</p>
// // // // //             )}
// // // // //           </div>

// // // // //           {/* File Upload */}
// // // // //           <div>
// // // // //             <label className="block text-sm font-medium text-gray-700 mb-2">
// // // // //               Attachments (Optional)
// // // // //             </label>
// // // // //             <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#1E88E5] transition-colors">
// // // // //               <input
// // // // //                 type="file"
// // // // //                 multiple
// // // // //                 accept="image/*,.pdf,.doc,.docx"
// // // // //                 onChange={handleFileChange}
// // // // //                 className="hidden"
// // // // //                 id="file-upload"
// // // // //               />
// // // // //               <label
// // // // //                 htmlFor="file-upload"
// // // // //                 className="cursor-pointer flex flex-col items-center gap-2"
// // // // //               >
// // // // //                 <Upload className="w-8 h-8 text-gray-400" />
// // // // //                 <p className="text-sm text-gray-600">
// // // // //                   Click to upload or drag and drop
// // // // //                 </p>
// // // // //                 <p className="text-xs text-gray-500">
// // // // //                   Images, PDF, DOC (Max 10MB each)
// // // // //                 </p>
// // // // //               </label>
// // // // //             </div>

// // // // //             {attachments.length > 0 && (
// // // // //               <div className="mt-3 space-y-2">
// // // // //                 {attachments.map((file, index) => (
// // // // //                   <div
// // // // //                     key={index}
// // // // //                     className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
// // // // //                   >
// // // // //                     <span className="text-sm text-gray-700 truncate">{file.name}</span>
// // // // //                     <button
// // // // //                       type="button"
// // // // //                       onClick={() => removeFile(index)}
// // // // //                       className="text-red-500 hover:text-red-700 transition-colors"
// // // // //                     >
// // // // //                       <X className="w-4 h-4" />
// // // // //                     </button>
// // // // //                   </div>
// // // // //                 ))}
// // // // //               </div>
// // // // //             )}
// // // // //           </div>

// // // // //           {/* Info Box */}
// // // // //           <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
// // // // //             <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
// // // // //             <div className="text-sm text-blue-800">
// // // // //               <p className="font-medium mb-1">Before submitting:</p>
// // // // //               <ul className="list-disc list-inside space-y-1 text-blue-700">
// // // // //                 <li>Your complaint will be reviewed by administration</li>
// // // // //                 <li>You'll receive updates via email and notifications</li>
// // // // //                 <li>Provide as much detail as possible for faster resolution</li>
// // // // //               </ul>
// // // // //             </div>
// // // // //           </div>

// // // // //           {/* Action Buttons */}
// // // // //           <div className="flex gap-3 pt-4">
// // // // //             <Button
// // // // //               type="button"
// // // // //               onClick={onClose}
// // // // //               variant="outline"
// // // // //               className="flex-1 rounded-xl h-12"
// // // // //               disabled={loading}
// // // // //             >
// // // // //               Cancel
// // // // //             </Button>
// // // // //             <Button
// // // // //               type="submit"
// // // // //               className="flex-1 gradient-primary text-white rounded-xl h-12 gap-2"
// // // // //               disabled={loading || uploading}
// // // // //             >
// // // // //               {loading ? (
// // // // //                 <>
// // // // //                   <Loader2 className="w-5 h-5 animate-spin" />
// // // // //                   {uploading ? 'Uploading...' : 'Submitting...'}
// // // // //                 </>
// // // // //               ) : (
// // // // //                 'Submit Complaint'
// // // // //               )}
// // // // //             </Button>
// // // // //           </div>
// // // // //         </form>
// // // // //       </motion.div>
// // // // //     </motion.div>
// // // // //   );
// // // // // }
// // // // // components/complaints/ComplaintForm.tsx
// // // // import { useState, useEffect } from 'react';
// // // // import { motion } from 'framer-motion';
// // // // import { X, Upload, AlertCircle, Loader2 } from 'lucide-react';
// // // // import { Button } from '../../../components/ui/button';
// // // // import { supabase } from '../../../lib/supabase';
// // // // import type { User } from '@supabase/supabase-js';

// // // // interface ComplaintFormProps {
// // // //   onClose: () => void;
// // // //   onSuccess: () => void;
// // // //   user: User | null;
// // // //   userRole: string;
// // // // }

// // // // interface FormData {
// // // //   complainant_role: string;
// // // //   complainant_name: string;
// // // //   complainant_email: string;
// // // //   complainant_phone: string;
// // // //   against_role: string;
// // // //   against_id: string;
// // // //   against_name: string;
// // // //   department: string;
// // // //   class_id: string;
// // // //   class_name: string;
// // // //   complaint_type: string;
// // // //   title: string;
// // // //   description: string;
// // // //   incident_date: string;
// // // //   urgency_level: string;
// // // // }

// // // // export default function ComplaintForm({ onClose, onSuccess, user, userRole }: ComplaintFormProps) {
// // // //   const [formData, setFormData] = useState<FormData>({
// // // //     complainant_role: userRole,
// // // //     complainant_name: '',
// // // //     complainant_email: user?.email || '',
// // // //     complainant_phone: '',
// // // //     against_role: '',
// // // //     against_id: '',
// // // //     against_name: '',
// // // //     department: '',
// // // //     class_id: '',
// // // //     class_name: '',
// // // //     complaint_type: '',
// // // //     title: '',
// // // //     description: '',
// // // //     incident_date: '',
// // // //     urgency_level: 'medium',
// // // //   });

// // // //   const [students, setStudents] = useState<any[]>([]);
// // // //   const [teachers, setTeachers] = useState<any[]>([]);
// // // //   const [classes, setClasses] = useState<any[]>([]);
// // // //   const [attachments, setAttachments] = useState<File[]>([]);
// // // //   const [uploading, setUploading] = useState(false);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [loadingData, setLoadingData] = useState(true);
// // // //   const [errors, setErrors] = useState<Record<string, string>>({});

// // // //   // ✅ FIX 1: Fetch user info AND dropdown data on mount
// // // //   useEffect(() => {
// // // //     const initializeForm = async () => {
// // // //       setLoadingData(true);
// // // //       try {
// // // //         await Promise.all([
// // // //           fetchUserInfo(),
// // // //           fetchDropdownData()
// // // //         ]);
// // // //       } catch (error) {
// // // //         console.error('Error initializing form:', error);
// // // //       } finally {
// // // //         setLoadingData(false);
// // // //       }
// // // //     };

// // // //     if (user && userRole) {
// // // //       initializeForm();
// // // //     }
// // // //   }, [user, userRole]);

// // // //   const getCurrentAcademicYear = (): string => {
// // // //     const today = new Date();
// // // //     const currentYear = today.getFullYear();
// // // //     const currentMonth = today.getMonth() + 1;
    
// // // //     if (currentMonth >= 4) {
// // // //       return `${currentYear}-${currentYear + 1}`;
// // // //     } else {
// // // //       return `${currentYear - 1}-${currentYear}`;
// // // //     }
// // // //   };

// // // //   // ✅ FIX 2: Improved fetchUserInfo with better error handling
// // // //   const fetchUserInfo = async () => {
// // // //     if (!user) {
// // // //       console.warn('No user found');
// // // //       return;
// // // //     }

// // // //     try {
// // // //       console.log('👤 Fetching user info for role:', userRole, 'User ID:', user.id);
// // // //       let userData: any = null;
      
// // // //       if (userRole === 'student') {
// // // //         const { data, error } = await supabase
// // // //           .from('students')
// // // //           .select('full_name, email, parent_contact')
// // // //           .eq('id', user.id)
// // // //           .maybeSingle();

// // // //         if (error) {
// // // //           console.error('Error fetching student data:', error);
// // // //         } else if (data) {
// // // //           userData = {
// // // //             full_name: data.full_name,
// // // //             email: data.email || user.email,
// // // //             phone: data.parent_contact
// // // //           };
// // // //         }
// // // //       } else if (userRole === 'teacher') {
// // // //         const { data, error } = await supabase
// // // //           .from('teachers')
// // // //           .select('full_name, email, phone_number')
// // // //           .eq('id', user.id)
// // // //           .maybeSingle();

// // // //         if (error) {
// // // //           console.error('Error fetching teacher data:', error);
// // // //         } else if (data) {
// // // //           userData = {
// // // //             full_name: data.full_name,
// // // //             email: data.email || user.email,
// // // //             phone: data.phone_number
// // // //           };
// // // //         }
// // // //       } else if (userRole === 'parent' || userRole === 'staff' || userRole === 'admin') {
// // // //         const { data, error } = await supabase
// // // //           .from('user_profiles')
// // // //           .select('first_name, last_name, email, phone_number')
// // // //           .eq('id', user.id)
// // // //           .maybeSingle();

// // // //         if (error) {
// // // //           console.error('Error fetching profile data:', error);
// // // //         } else if (data) {
// // // //           userData = {
// // // //             full_name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
// // // //             email: data.email || user.email,
// // // //             phone: data.phone_number
// // // //           };
// // // //         }
// // // //       }

// // // //       // Update form data with fetched info
// // // //       if (userData) {
// // // //         console.log('✅ User data loaded:', userData);
// // // //         setFormData((prev) => ({
// // // //           ...prev,
// // // //           complainant_name: userData.full_name || prev.complainant_name,
// // // //           complainant_email: userData.email || prev.complainant_email,
// // // //           complainant_phone: userData.phone || prev.complainant_phone,
// // // //         }));
// // // //       } else {
// // // //         // Fallback to basic user info
// // // //         console.warn('⚠️ No detailed user data, using fallback');
// // // //         setFormData((prev) => ({
// // // //           ...prev,
// // // //           complainant_name: user.email?.split('@')[0] || 'User',
// // // //           complainant_email: user.email || '',
// // // //           complainant_phone: user.phone || '',
// // // //         }));
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('❌ Error in fetchUserInfo:', error);
// // // //       // Fallback
// // // //       setFormData((prev) => ({
// // // //         ...prev,
// // // //         complainant_name: user.email?.split('@')[0] || 'User',
// // // //         complainant_email: user.email || '',
// // // //         complainant_phone: user.phone || '',
// // // //       }));
// // // //     }
// // // //   };

// // // //   const fetchDropdownData = async () => {
// // // //     try {
// // // //       const currentAcademicYear = getCurrentAcademicYear();
// // // //       console.log('📅 Fetching dropdown data for academic year:', currentAcademicYear);

// // // //       // Fetch students
// // // //       const { data: studentsData, error: studentsError } = await supabase
// // // //         .from('students')
// // // //         .select('id, full_name, class_name, status')
// // // //         .eq('status', 'active')
// // // //         .order('full_name');

// // // //       if (studentsError) {
// // // //         console.error('Error fetching students:', studentsError);
// // // //       } else {
// // // //         console.log('✅ Fetched students:', studentsData?.length || 0);
// // // //       }

// // // //       // Fetch teachers
// // // //       const { data: teachersData, error: teachersError } = await supabase
// // // //         .from('teachers')
// // // //         .select('id, full_name, subject_specialization, status')
// // // //         .eq('status', 'active')
// // // //         .order('full_name');

// // // //       if (teachersError) {
// // // //         console.error('Error fetching teachers:', teachersError);
// // // //       } else {
// // // //         console.log('✅ Fetched teachers:', teachersData?.length || 0);
// // // //       }

// // // //       // Fetch classes
// // // //       const { data: classesData, error: classesError } = await supabase
// // // //         .from('class_assignments')
// // // //         .select('class_name')
// // // //         .eq('academic_year', currentAcademicYear)
// // // //         .order('class_name');

// // // //       if (classesError) {
// // // //         console.error('Error fetching classes:', classesError);
// // // //       }

// // // //       const uniqueClasses = classesData 
// // // //         ? Array.from(new Set(classesData.map(item => item.class_name).filter(Boolean)))
// // // //             .map(className => ({ name: className }))
// // // //         : [];

// // // //       console.log('✅ Fetched classes:', uniqueClasses.length);

// // // //       setStudents(studentsData || []);
// // // //       setTeachers(teachersData || []);
// // // //       setClasses(uniqueClasses);
// // // //     } catch (error) {
// // // //       console.error('❌ Error fetching dropdown data:', error);
// // // //       setStudents([]);
// // // //       setTeachers([]);
// // // //       setClasses([]);
// // // //     }
// // // //   };

// // // //   const handleInputChange = (field: keyof FormData, value: string) => {
// // // //     setFormData((prev) => ({ ...prev, [field]: value }));
// // // //     setErrors((prev) => ({ ...prev, [field]: '' }));
// // // //   };

// // // //   const handleAgainstChange = (role: string, id: string) => {
// // // //     let name = '';
    
// // // //     if (role === 'student') {
// // // //       const student = students.find((s) => s.id === id);
// // // //       name = student?.full_name || '';
// // // //     } else if (role === 'teacher') {
// // // //       const teacher = teachers.find((t) => t.id === id);
// // // //       name = teacher?.full_name || '';
// // // //     }

// // // //     setFormData((prev) => ({
// // // //       ...prev,
// // // //       against_role: role,
// // // //       against_id: id,
// // // //       against_name: name,
// // // //     }));
// // // //     setErrors((prev) => ({ ...prev, against_id: '' }));
// // // //   };

// // // //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // // //     if (e.target.files) {
// // // //       const filesArray = Array.from(e.target.files);
// // // //       const validFiles = filesArray.filter(file => file.size <= 10 * 1024 * 1024); // 10MB limit
      
// // // //       if (validFiles.length !== filesArray.length) {
// // // //         alert('Some files were skipped because they exceed 10MB');
// // // //       }
      
// // // //       setAttachments((prev) => [...prev, ...validFiles]);
// // // //     }
// // // //   };

// // // //   const removeFile = (index: number) => {
// // // //     setAttachments((prev) => prev.filter((_, i) => i !== index));
// // // //   };

// // // //   const uploadFiles = async () => {
// // // //     if (attachments.length === 0) return [];

// // // //     const uploadedUrls: string[] = [];
    
// // // //     for (const file of attachments) {
// // // //       const fileName = `${user?.id}/${Date.now()}_${file.name}`;
      
// // // //       const { data, error } = await supabase.storage
// // // //         .from('complaint-attachments')
// // // //         .upload(fileName, file);

// // // //       if (error) {
// // // //         console.error('Error uploading file:', error);
// // // //         continue;
// // // //       }

// // // //       const { data: urlData } = supabase.storage
// // // //         .from('complaint-attachments')
// // // //         .getPublicUrl(fileName);

// // // //       uploadedUrls.push(urlData.publicUrl);
// // // //     }

// // // //     return uploadedUrls;
// // // //   };

// // // //   const validateForm = (): boolean => {
// // // //     const newErrors: Record<string, string> = {};

// // // //     if (!formData.title.trim()) newErrors.title = 'Title is required';
// // // //     if (!formData.description.trim()) newErrors.description = 'Description is required';
// // // //     if (!formData.complaint_type) newErrors.complaint_type = 'Complaint type is required';
// // // //     if (!formData.against_role) newErrors.against_role = 'Please select who the complaint is against';
    
// // // //     if (formData.against_role === 'student' || formData.against_role === 'teacher') {
// // // //       if (!formData.against_id) {
// // // //         newErrors.against_id = 'Please select a specific person';
// // // //       }
// // // //     }
    
// // // //     if (formData.against_role === 'department' && !formData.department.trim()) {
// // // //       newErrors.department = 'Department name is required';
// // // //     }
    
// // // //     if (!formData.incident_date) newErrors.incident_date = 'Incident date is required';

// // // //     setErrors(newErrors);
// // // //     return Object.keys(newErrors).length === 0;
// // // //   };

// // // //   const handleSubmit = async (e: React.FormEvent) => {
// // // //     e.preventDefault();

// // // //     if (!validateForm()) {
// // // //       console.log('❌ Form validation failed:', errors);
// // // //       return;
// // // //     }

// // // //     try {
// // // //       setLoading(true);
// // // //       setUploading(true);

// // // //       console.log('📤 Uploading attachments...');
// // // //       const uploadedUrls = await uploadFiles();
// // // //       setUploading(false);
// // // //       console.log('✅ Attachments uploaded:', uploadedUrls);

// // // //       console.log('💾 Submitting complaint...');
// // // //       const complaintData = {
// // // //         complainant_role: formData.complainant_role,
// // // //         complainant_id: user?.id,
// // // //         complainant_name: formData.complainant_name,
// // // //         complainant_email: formData.complainant_email,
// // // //         complainant_phone: formData.complainant_phone,
// // // //         against_role: formData.against_role,
// // // //         against_id: formData.against_id || null,
// // // //         against_name: formData.against_name || formData.department,
// // // //         department: formData.department || null,
// // // //         class_id: null,
// // // //         class_name: formData.class_name || null,
// // // //         complaint_type: formData.complaint_type,
// // // //         title: formData.title,
// // // //         description: formData.description,
// // // //         incident_date: formData.incident_date,
// // // //         urgency_level: formData.urgency_level,
// // // //         attachments: uploadedUrls,
// // // //         status: 'pending',
// // // //         requires_approval: true,
// // // //       };

// // // //       console.log('📋 Complaint data:', complaintData);

// // // //       const { data, error } = await supabase
// // // //         .from('complaints')
// // // //         .insert(complaintData)
// // // //         .select()
// // // //         .single();

// // // //       if (error) {
// // // //         console.error('❌ Supabase error:', error);
// // // //         throw error;
// // // //       }

// // // //       console.log('✅ Complaint submitted successfully:', data);
// // // //       onSuccess();
// // // //     } catch (error: any) {
// // // //       console.error('❌ Error submitting complaint:', error);
// // // //       alert(`Failed to submit complaint: ${error.message || 'Please try again.'}`);
// // // //     } finally {
// // // //       setLoading(false);
// // // //       setUploading(false);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <motion.div
// // // //       initial={{ opacity: 0 }}
// // // //       animate={{ opacity: 1 }}
// // // //       exit={{ opacity: 0 }}
// // // //       className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
// // // //       onClick={onClose}
// // // //     >
// // // //       <motion.div
// // // //         initial={{ scale: 0.9, y: 20 }}
// // // //         animate={{ scale: 1, y: 0 }}
// // // //         exit={{ scale: 0.9, y: 20 }}
// // // //         onClick={(e) => e.stopPropagation()}
// // // //         className="glass-strong rounded-2xl shadow-float max-w-3xl w-full max-h-[90vh] overflow-y-auto"
// // // //       >
// // // //         {/* Header */}
// // // //         <div className="sticky top-0 z-10 glass-strong border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
// // // //           <h2 className="text-xl font-bold text-gray-800">Submit New Complaint</h2>
// // // //           <button
// // // //             onClick={onClose}
// // // //             className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
// // // //           >
// // // //             <X className="w-5 h-5 text-gray-500" />
// // // //           </button>
// // // //         </div>

// // // //         {/* Loading State */}
// // // //         {loadingData ? (
// // // //           <div className="p-12 flex flex-col items-center justify-center gap-4">
// // // //             <Loader2 className="w-8 h-8 animate-spin text-[#1E88E5]" />
// // // //             <p className="text-gray-600">Loading form data...</p>
// // // //           </div>
// // // //         ) : (
// // // //           <form onSubmit={handleSubmit} className="p-6 space-y-6">
// // // //             {/* Complainant Info */}
// // // //             <div className="glass rounded-xl p-4 bg-blue-50/30">
// // // //               <h4 className="text-sm font-semibold text-gray-700 mb-3">Your Information</h4>
// // // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // //                 <div>
// // // //                   <label className="text-sm text-gray-600">Name</label>
// // // //                   <p className="font-medium text-gray-800">
// // // //                     {formData.complainant_name || 'Not available'}
// // // //                   </p>
// // // //                 </div>
// // // //                 <div>
// // // //                   <label className="text-sm text-gray-600">Role</label>
// // // //                   <p className="font-medium text-gray-800 capitalize">
// // // //                     {formData.complainant_role}
// // // //                   </p>
// // // //                 </div>
// // // //                 <div>
// // // //                   <label className="text-sm text-gray-600">Email</label>
// // // //                   <p className="text-sm text-gray-700">
// // // //                     {formData.complainant_email || 'Not available'}
// // // //                   </p>
// // // //                 </div>
// // // //                 <div>
// // // //                   <label className="text-sm text-gray-600">Contact</label>
// // // //                   <p className="text-sm text-gray-700">
// // // //                     {formData.complainant_phone || 'Not available'}
// // // //                   </p>
// // // //                 </div>
// // // //               </div>
// // // //             </div>

// // // //             {/* Against Section */}
// // // //             <div className="space-y-4">
// // // //               <h4 className="text-sm font-semibold text-gray-700">Complaint Against</h4>
              
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //                   Role/Type <span className="text-red-500">*</span>
// // // //                 </label>
// // // //                 <select
// // // //                   value={formData.against_role}
// // // //                   onChange={(e) => {
// // // //                     handleInputChange('against_role', e.target.value);
// // // //                     // Reset dependent fields
// // // //                     setFormData(prev => ({
// // // //                       ...prev,
// // // //                       against_role: e.target.value,
// // // //                       against_id: '',
// // // //                       against_name: '',
// // // //                       department: ''
// // // //                     }));
// // // //                   }}
// // // //                   className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all ${
// // // //                     errors.against_role ? 'border-red-300' : 'border-gray-200'
// // // //                   }`}
// // // //                 >
// // // //                   <option value="">Select role</option>
// // // //                   <option value="student">Student</option>
// // // //                   <option value="teacher">Teacher</option>
// // // //                   <option value="staff">Staff</option>
// // // //                   <option value="department">Department</option>
// // // //                   <option value="other">Other</option>
// // // //                 </select>
// // // //                 {errors.against_role && (
// // // //                   <p className="mt-1 text-sm text-red-600">{errors.against_role}</p>
// // // //                 )}
// // // //               </div>

// // // //               {formData.against_role === 'student' && (
// // // //                 <div>
// // // //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //                     Select Student <span className="text-red-500">*</span>
// // // //                   </label>
// // // //                   <select
// // // //                     value={formData.against_id}
// // // //                     onChange={(e) => handleAgainstChange('student', e.target.value)}
// // // //                     className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all ${
// // // //                       errors.against_id ? 'border-red-300' : 'border-gray-200'
// // // //                     }`}
// // // //                   >
// // // //                     <option value="">Select student</option>
// // // //                     {students.map((student) => (
// // // //                       <option key={student.id} value={student.id}>
// // // //                         {student.full_name} {student.class_name && `(${student.class_name})`}
// // // //                       </option>
// // // //                     ))}
// // // //                   </select>
// // // //                   {errors.against_id && (
// // // //                     <p className="mt-1 text-sm text-red-600">{errors.against_id}</p>
// // // //                   )}
// // // //                 </div>
// // // //               )}

// // // //               {formData.against_role === 'teacher' && (
// // // //                 <div>
// // // //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //                     Select Teacher <span className="text-red-500">*</span>
// // // //                   </label>
// // // //                   <select
// // // //                     value={formData.against_id}
// // // //                     onChange={(e) => handleAgainstChange('teacher', e.target.value)}
// // // //                     className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all ${
// // // //                       errors.against_id ? 'border-red-300' : 'border-gray-200'
// // // //                     }`}
// // // //                   >
// // // //                     <option value="">Select teacher</option>
// // // //                     {teachers.map((teacher) => (
// // // //                       <option key={teacher.id} value={teacher.id}>
// // // //                         {teacher.full_name} ({teacher.subject_specialization})
// // // //                       </option>
// // // //                     ))}
// // // //                   </select>
// // // //                   {errors.against_id && (
// // // //                     <p className="mt-1 text-sm text-red-600">{errors.against_id}</p>
// // // //                   )}
// // // //                 </div>
// // // //               )}

// // // //               {formData.against_role === 'department' && (
// // // //                 <div>
// // // //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //                     Department Name <span className="text-red-500">*</span>
// // // //                   </label>
// // // //                   <input
// // // //                     type="text"
// // // //                     value={formData.department}
// // // //                     onChange={(e) => handleInputChange('department', e.target.value)}
// // // //                     placeholder="e.g., Administration, Transport, Cafeteria"
// // // //                     className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all ${
// // // //                       errors.department ? 'border-red-300' : 'border-gray-200'
// // // //                     }`}
// // // //                   />
// // // //                   {errors.department && (
// // // //                     <p className="mt-1 text-sm text-red-600">{errors.department}</p>
// // // //                   )}
// // // //                 </div>
// // // //               )}

// // // //               {formData.against_role === 'other' && (
// // // //                 <div>
// // // //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //                     Specify Name/Entity
// // // //                   </label>
// // // //                   <input
// // // //                     type="text"
// // // //                     value={formData.against_name}
// // // //                     onChange={(e) => handleInputChange('against_name', e.target.value)}
// // // //                     placeholder="Enter name or description"
// // // //                     className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all"
// // // //                   />
// // // //                 </div>
// // // //               )}
// // // //             </div>

// // // //             {/* Class Selection */}
// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //                 Related Class (Optional)
// // // //               </label>
// // // //               <select
// // // //                 value={formData.class_name}
// // // //                 onChange={(e) => handleInputChange('class_name', e.target.value)}
// // // //                 className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all"
// // // //               >
// // // //                 <option value="">Select class (if applicable)</option>
// // // //                 {classes.map((cls, index) => (
// // // //                   <option key={index} value={cls.name}>
// // // //                     {cls.name}
// // // //                   </option>
// // // //                 ))}
// // // //               </select>
// // // //             </div>

// // // //             {/* Complaint Details */}
// // // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //                   Complaint Type <span className="text-red-500">*</span>
// // // //                 </label>
// // // //                 <select
// // // //                   value={formData.complaint_type}
// // // //                   onChange={(e) => handleInputChange('complaint_type', e.target.value)}
// // // //                   className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all ${
// // // //                     errors.complaint_type ? 'border-red-300' : 'border-gray-200'
// // // //                   }`}
// // // //                 >
// // // //                   <option value="">Select type</option>
// // // //                   <option value="academic">Academic</option>
// // // //                   <option value="behaviour">Behaviour</option>
// // // //                   <option value="safety">Safety</option>
// // // //                   <option value="facility">Facility</option>
// // // //                   <option value="fee">Fee</option>
// // // //                   <option value="transport">Transport</option>
// // // //                   <option value="other">Other</option>
// // // //                 </select>
// // // //                 {errors.complaint_type && (
// // // //                   <p className="mt-1 text-sm text-red-600">{errors.complaint_type}</p>
// // // //                 )}
// // // //               </div>

// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //                   Urgency Level <span className="text-red-500">*</span>
// // // //                 </label>
// // // //                 <select
// // // //                   value={formData.urgency_level}
// // // //                   onChange={(e) => handleInputChange('urgency_level', e.target.value)}
// // // //                   className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all"
// // // //                 >
// // // //                   <option value="low">Low</option>
// // // //                   <option value="medium">Medium</option>
// // // //                   <option value="high">High</option>
// // // //                   <option value="critical">Critical</option>
// // // //                 </select>
// // // //               </div>
// // // //             </div>

// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //                 Incident Date <span className="text-red-500">*</span>
// // // //               </label>
// // // //               <input
// // // //                 type="date"
// // // //                 value={formData.incident_date}
// // // //                 onChange={(e) => handleInputChange('incident_date', e.target.value)}
// // // //                 max={new Date().toISOString().split('T')[0]}
// // // //                 className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all ${
// // // //                   errors.incident_date ? 'border-red-300' : 'border-gray-200'
// // // //                 }`}
// // // //               />
// // // //               {errors.incident_date && (
// // // //                 <p className="mt-1 text-sm text-red-600">{errors.incident_date}</p>
// // // //               )}
// // // //             </div>

// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //                 Title/Subject <span className="text-red-500">*</span>
// // // //               </label>
// // // //               <input
// // // //                 type="text"
// // // //                 value={formData.title}
// // // //                 onChange={(e) => handleInputChange('title', e.target.value)}
// // // //                 placeholder="Brief title for the complaint"
// // // //                 className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all ${
// // // //                   errors.title ? 'border-red-300' : 'border-gray-200'
// // // //                 }`}
// // // //               />
// // // //               {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
// // // //             </div>

// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //                 Description <span className="text-red-500">*</span>
// // // //               </label>
// // // //               <textarea
// // // //                 value={formData.description}
// // // //                 onChange={(e) => handleInputChange('description', e.target.value)}
// // // //                 placeholder="Provide detailed explanation of the issue..."
// // // //                 rows={5}
// // // //                 className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all resize-none ${
// // // //                   errors.description ? 'border-red-300' : 'border-gray-200'
// // // //                 }`}
// // // //               />
// // // //               {errors.description && (
// // // //                 <p className="mt-1 text-sm text-red-600">{errors.description}</p>
// // // //               )}
// // // //             </div>

// // // //             {/* File Upload */}
// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //                 Attachments (Optional)
// // // //               </label>
// // // //               <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#1E88E5] transition-colors">
// // // //                 <input
// // // //                   type="file"
// // // //                   multiple
// // // //                   accept="image/*,.pdf,.doc,.docx"
// // // //                   onChange={handleFileChange}
// // // //                   className="hidden"
// // // //                   id="file-upload"
// // // //                 />
// // // //                 <label
// // // //                   htmlFor="file-upload"
// // // //                   className="cursor-pointer flex flex-col items-center gap-2"
// // // //                 >
// // // //                   <Upload className="w-8 h-8 text-gray-400" />
// // // //                   <p className="text-sm text-gray-600">
// // // //                     Click to upload or drag and drop
// // // //                   </p>
// // // //                   <p className="text-xs text-gray-500">
// // // //                     Images, PDF, DOC (Max 10MB each)
// // // //                   </p>
// // // //                 </label>
// // // //               </div>

// // // //               {attachments.length > 0 && (
// // // //                 <div className="mt-3 space-y-2">
// // // //                   {attachments.map((file, index) => (
// // // //                     <div
// // // //                       key={index}
// // // //                       className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
// // // //                     >
// // // //                       <span className="text-sm text-gray-700 truncate">{file.name}</span>
// // // //                       <button
// // // //                         type="button"
// // // //                         onClick={() => removeFile(index)}
// // // //                         className="text-red-500 hover:text-red-700 transition-colors"
// // // //                       >
// // // //                         <X className="w-4 h-4" />
// // // //                       </button>
// // // //                     </div>
// // // //                   ))}
// // // //                 </div>
// // // //               )}
// // // //             </div>

// // // //             {/* Info Box */}
// // // //             <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
// // // //               <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
// // // //               <div className="text-sm text-blue-800">
// // // //                 <p className="font-medium mb-1">Before submitting:</p>
// // // //                 <ul className="list-disc list-inside space-y-1 text-blue-700">
// // // //                   <li>Your complaint will be reviewed by administration</li>
// // // //                   <li>You'll receive updates via email and notifications</li>
// // // //                   <li>Provide as much detail as possible for faster resolution</li>
// // // //                 </ul>
// // // //               </div>
// // // //             </div>

// // // //             {/* Action Buttons */}
// // // //             <div className="flex gap-3 pt-4">
// // // //               <Button
// // // //                 type="button"
// // // //                 onClick={onClose}
// // // //                 variant="outline"
// // // //                 className="flex-1 rounded-xl h-12"
// // // //                 disabled={loading}
// // // //               >
// // // //                 Cancel
// // // //               </Button>
// // // //               <Button
// // // //                 type="submit"
// // // //                 className="flex-1 gradient-primary text-white rounded-xl h-12 gap-2"
// // // //                 disabled={loading || uploading}
// // // //               >
// // // //                 {loading ? (
// // // //                   <>
// // // //                     <Loader2 className="w-5 h-5 animate-spin" />
// // // //                     {uploading ? 'Uploading...' : 'Submitting...'}
// // // //                   </>
// // // //                 ) : (
// // // //                   'Submit Complaint'
// // // //                 )}
// // // //               </Button>
// // // //             </div>
// // // //           </form>
// // // //         )}
// // // //       </motion.div>
// // // //     </motion.div>
// // // //   );
// // // // }

// // // // components/complaints/ComplaintForm.tsx
// // // import { useState, useEffect } from 'react';
// // // import { motion } from 'framer-motion';
// // // import { X, Upload, Loader2, AlertCircle } from 'lucide-react';
// // // import { Button } from '../../../components/ui/button';
// // // import { supabase } from '../../../lib/supabase';
// // // import { useAuth } from '../../../context/AuthContext';

// // // export default function ComplaintForm({
// // //   onClose,
// // //   onSuccess,
// // // }: {
// // //   onClose: () => void;
// // //   onSuccess: () => void;
// // // }) {
// // //   const { user, userProfile } = useAuth();

// // //   // ✅ Normalize roles for database constraint
// // //   const normalizeRole = (role: string | undefined | null): string => {
// // //     switch (role?.toLowerCase()) {
// // //       case 'student':
// // //       case 'teacher':
// // //       case 'parent':
// // //       case 'staff':
// // //         return role.toLowerCase();
// // //       default:
// // //         return 'other';
// // //     }
// // //   };

// // //   const userRole = normalizeRole(user?.role || userProfile?.role);

// // //   // 🧩 Form state
// // //   const [formData, setFormData] = useState({
// // //     complainant_role: userRole,
// // //     complainant_name:
// // //       userProfile
// // //         ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim()
// // //         : user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
// // //     complainant_email: user?.email || userProfile?.email || '',
// // //     complainant_phone: userProfile?.phone_number || '',
// // //     against_role: '',
// // //     against_id: '',
// // //     against_name: '',
// // //     department: '',
// // //     class_id: '',
// // //     class_name: '',
// // //     complaint_type: '',
// // //     title: '',
// // //     description: '',
// // //     incident_date: '',
// // //     urgency_level: 'medium',
// // //   });

// // //   const [students, setStudents] = useState<any[]>([]);
// // //   const [teachers, setTeachers] = useState<any[]>([]);
// // //   const [classes, setClasses] = useState<any[]>([]);
// // //   const [attachments, setAttachments] = useState<File[]>([]);
// // //   const [loadingDropdowns, setLoadingDropdowns] = useState(true);
// // //   const [loadingSubmit, setLoadingSubmit] = useState(false);
// // //   const [errors, setErrors] = useState<Record<string, string>>({});

// // //   // 📦 Fetch dropdowns
// // //   useEffect(() => {
// // //     const fetchDropdowns = async () => {
// // //       try {
// // //         const { data: s } = await supabase
// // //           .from('students')
// // //           .select('id, full_name, class_name')
// // //           .eq('status', 'active')
// // //           .order('full_name');

// // //         const { data: t } = await supabase
// // //           .from('teachers')
// // //           .select('id, full_name, subject_specialization')
// // //           .eq('status', 'active')
// // //           .order('full_name');

// // //         const { data: c } = await supabase
// // //           .from('class_assignments')
// // //           .select('class_name')
// // //           .order('class_name');

// // //         setStudents(s || []);
// // //         setTeachers(t || []);
// // //         setClasses(c || []);
// // //       } finally {
// // //         setLoadingDropdowns(false);
// // //       }
// // //     };

// // //     fetchDropdowns();
// // //   }, []);

// // //   // 🧠 Input handlers
// // //   const handleInputChange = (field: string, value: string) => {
// // //     setFormData((prev) => ({ ...prev, [field]: value }));
// // //     setErrors((prev) => ({ ...prev, [field]: '' }));
// // //   };

// // //   const handleAgainstChange = (role: string, id: string) => {
// // //     let name = '';
// // //     let className = '';
// // //     if (role === 'student') {
// // //       const s = students.find((st) => st.id === id);
// // //       name = s?.full_name || '';
// // //       className = s?.class_name || '';
// // //     } else if (role === 'teacher') {
// // //       const t = teachers.find((te) => te.id === id);
// // //       name = t?.full_name || '';
// // //     }
// // //     setFormData((prev) => ({
// // //       ...prev,
// // //       against_role: role,
// // //       against_id: id,
// // //       against_name: name,
// // //       class_name: className || prev.class_name,
// // //     }));
// // //   };

// // //   // 📎 File upload
// // //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     if (e.target.files) {
// // //       const validFiles = Array.from(e.target.files).filter(
// // //         (f) => f.size <= 10 * 1024 * 1024
// // //       );
// // //       setAttachments((prev) => [...prev, ...validFiles]);
// // //     }
// // //   };

// // //   const removeFile = (i: number) => {
// // //     setAttachments((p) => p.filter((_, idx) => idx !== i));
// // //   };

// // //   // ☁️ Upload to Supabase Storage
// // //   const uploadFiles = async () => {
// // //     const urls: string[] = [];
// // //     for (const file of attachments) {
// // //       const safeName = file.name.replace(/[^\w.\-]/g, '_');
// // //       const fileName = `${user?.id}/${Date.now()}_${safeName}`;

// // //       // 🔧 ensure this bucket exists in Supabase
// // //       const { error } = await supabase.storage
// // //         .from('complaint-attachments')
// // //         .upload(fileName, file);

// // //       if (error) {
// // //         console.error('Upload error:', error);
// // //         continue;
// // //       }

// // //       const { data } = supabase.storage
// // //         .from('complaint-attachments')
// // //         .getPublicUrl(fileName);
// // //       urls.push(data.publicUrl);
// // //     }
// // //     return urls;
// // //   };

// // //   // ✅ Validation
// // //   const validateForm = () => {
// // //     const newErrors: Record<string, string> = {};
// // //     if (!formData.title.trim()) newErrors.title = 'Title is required';
// // //     if (!formData.description.trim())
// // //       newErrors.description = 'Description is required';
// // //     if (!formData.complaint_type)
// // //       newErrors.complaint_type = 'Complaint type is required';
// // //     if (!formData.incident_date)
// // //       newErrors.incident_date = 'Incident date is required';
// // //     if (!formData.against_role)
// // //       newErrors.against_role = 'Please select who the complaint is against';
// // //     setErrors(newErrors);
// // //     return Object.keys(newErrors).length === 0;
// // //   };

// // //   // 💾 Submit
// // //   const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     if (!validateForm()) return;

// // //     setLoadingSubmit(true);
// // //     try {
// // //       const uploadedUrls = await uploadFiles();

// // //       const cleanData = {
// // //         ...formData,
// // //         complainant_id: user?.id || null,
// // //         complainant_role: normalizeRole(formData.complainant_role),
// // //         against_id: formData.against_id?.trim() ? formData.against_id : null,
// // //         class_id: formData.class_id?.trim() ? formData.class_id : null,
// // //         assigned_to: null,
// // //         attachments: uploadedUrls,
// // //         status: 'pending',
// // //         requires_approval: true,
// // //       };

// // //       const { error } = await supabase.from('complaints').insert(cleanData);
// // //       if (error) throw error;

// // //       onSuccess();
// // //     } catch (err: any) {
// // //       alert(`Failed to submit: ${err.message}`);
// // //     } finally {
// // //       setLoadingSubmit(false);
// // //     }
// // //   };

// // //   // 🧱 UI
// // //   return (
// // //     <motion.div
// // //       className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
// // //       onClick={onClose}
// // //       initial={{ opacity: 0 }}
// // //       animate={{ opacity: 1 }}
// // //       exit={{ opacity: 0 }}
// // //     >
// // //       <motion.div
// // //         onClick={(e) => e.stopPropagation()}
// // //         initial={{ scale: 0.95 }}
// // //         animate={{ scale: 1 }}
// // //         className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-y-auto max-h-[90vh]"
// // //       >
// // //         {/* Header */}
// // //         <div className="flex justify-between items-center border-b p-4 bg-white sticky top-0 z-10 rounded-t-2xl">
// // //           <h2 className="text-lg font-semibold text-gray-800">Submit New Complaint</h2>
// // //           <button onClick={onClose}>
// // //             <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
// // //           </button>
// // //         </div>

// // //         {/* Form */}
// // //         <form onSubmit={handleSubmit} className="p-6 space-y-6">
// // //           {/* Prefilled Complainant Info */}
// // //           <div className="glass p-4 rounded-xl bg-blue-50/40">
// // //             <h4 className="text-sm font-semibold mb-2 text-gray-700">
// // //               Your Information
// // //             </h4>
// // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //               <div>
// // //                 <label className="text-sm">Full Name</label>
// // //                 <input
// // //                   value={formData.complainant_name}
// // //                   onChange={(e) =>
// // //                     handleInputChange('complainant_name', e.target.value)
// // //                   }
// // //                   className="w-full px-3 py-2 border rounded-lg"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label className="text-sm">Role</label>
// // //                 <input
// // //                   value={formData.complainant_role}
// // //                   disabled
// // //                   className="w-full px-3 py-2 border rounded-lg bg-gray-100"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label className="text-sm">Email</label>
// // //                 <input
// // //                   value={formData.complainant_email}
// // //                   onChange={(e) =>
// // //                     handleInputChange('complainant_email', e.target.value)
// // //                   }
// // //                   className="w-full px-3 py-2 border rounded-lg"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label className="text-sm">Phone</label>
// // //                 <input
// // //                   value={formData.complainant_phone}
// // //                   onChange={(e) =>
// // //                     handleInputChange('complainant_phone', e.target.value)
// // //                   }
// // //                   className="w-full px-3 py-2 border rounded-lg"
// // //                 />
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Complaint Against Section */}
// // //           <div className="space-y-3">
// // //             <label className="text-sm font-semibold text-gray-700">
// // //               Complaint Against
// // //             </label>
// // //             <select
// // //               value={formData.against_role}
// // //               onChange={(e) => handleInputChange('against_role', e.target.value)}
// // //               className="w-full px-3 py-2 border rounded-lg"
// // //             >
// // //               <option value="">Select Role</option>
// // //               <option value="student">Student</option>
// // //               <option value="teacher">Teacher</option>
// // //               <option value="staff">Staff</option>
// // //               <option value="department">Department</option>
// // //               <option value="other">Other</option>
// // //             </select>
// // //             {errors.against_role && (
// // //               <p className="text-red-500 text-sm">{errors.against_role}</p>
// // //             )}

// // //             {formData.against_role === 'student' && (
// // //               <select
// // //                 value={formData.against_id}
// // //                 onChange={(e) => handleAgainstChange('student', e.target.value)}
// // //                 className="w-full px-3 py-2 border rounded-lg"
// // //               >
// // //                 <option value="">Select Student</option>
// // //                 {students.map((s) => (
// // //                   <option key={s.id} value={s.id}>
// // //                     {s.full_name} ({s.class_name})
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             )}

// // //             {formData.against_role === 'teacher' && (
// // //               <select
// // //                 value={formData.against_id}
// // //                 onChange={(e) => handleAgainstChange('teacher', e.target.value)}
// // //                 className="w-full px-3 py-2 border rounded-lg"
// // //               >
// // //                 <option value="">Select Teacher</option>
// // //                 {teachers.map((t) => (
// // //                   <option key={t.id} value={t.id}>
// // //                     {t.full_name} ({t.subject_specialization})
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             )}

// // //             {formData.against_role === 'department' && (
// // //               <input
// // //                 value={formData.department}
// // //                 onChange={(e) =>
// // //                   handleInputChange('department', e.target.value)
// // //                 }
// // //                 placeholder="e.g., Administration, Transport"
// // //                 className="w-full px-3 py-2 border rounded-lg"
// // //               />
// // //             )}

// // //             {formData.against_role === 'other' && (
// // //               <input
// // //                 value={formData.against_name}
// // //                 onChange={(e) =>
// // //                   handleInputChange('against_name', e.target.value)
// // //                 }
// // //                 placeholder="Enter name or entity"
// // //                 className="w-full px-3 py-2 border rounded-lg"
// // //               />
// // //             )}
// // //           </div>

// // //           {/* Complaint Details */}
// // //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //             <div>
// // //               <label className="text-sm">Complaint Type</label>
// // //               <select
// // //                 value={formData.complaint_type}
// // //                 onChange={(e) =>
// // //                   handleInputChange('complaint_type', e.target.value)
// // //                 }
// // //                 className="w-full px-3 py-2 border rounded-lg"
// // //               >
// // //                 <option value="">Select type</option>
// // //                 <option value="academic">Academic</option>
// // //                 <option value="behaviour">Behaviour</option>
// // //                 <option value="safety">Safety</option>
// // //                 <option value="facility">Facility</option>
// // //                 <option value="fee">Fee</option>
// // //                 <option value="transport">Transport</option>
// // //                 <option value="other">Other</option>
// // //               </select>
// // //             </div>
// // //             <div>
// // //               <label className="text-sm">Urgency Level</label>
// // //               <select
// // //                 value={formData.urgency_level}
// // //                 onChange={(e) =>
// // //                   handleInputChange('urgency_level', e.target.value)
// // //                 }
// // //                 className="w-full px-3 py-2 border rounded-lg"
// // //               >
// // //                 <option value="low">Low</option>
// // //                 <option value="medium">Medium</option>
// // //                 <option value="high">High</option>
// // //                 <option value="critical">Critical</option>
// // //               </select>
// // //             </div>
// // //           </div>

// // //           <div>
// // //             <label className="text-sm">Incident Date</label>
// // //             <input
// // //               type="date"
// // //               value={formData.incident_date}
// // //               max={new Date().toISOString().split('T')[0]}
// // //               onChange={(e) =>
// // //                 handleInputChange('incident_date', e.target.value)
// // //               }
// // //               className="w-full px-3 py-2 border rounded-lg"
// // //             />
// // //           </div>

// // //           <div>
// // //             <label className="text-sm">Title</label>
// // //             <input
// // //               value={formData.title}
// // //               onChange={(e) => handleInputChange('title', e.target.value)}
// // //               placeholder="Enter short title"
// // //               className="w-full px-3 py-2 border rounded-lg"
// // //             />
// // //           </div>

// // //           <div>
// // //             <label className="text-sm">Description</label>
// // //             <textarea
// // //               value={formData.description}
// // //               onChange={(e) =>
// // //                 handleInputChange('description', e.target.value)
// // //               }
// // //               placeholder="Describe the issue..."
// // //               rows={4}
// // //               className="w-full px-3 py-2 border rounded-lg resize-none"
// // //             />
// // //           </div>

// // //           {/* File Upload */}
// // //           <div>
// // //             <label className="text-sm font-medium text-gray-700">
// // //               Attachments (optional)
// // //             </label>
// // //             <div className="border-2 border-dashed rounded-xl p-4 text-center">
// // //               <input
// // //                 id="file-upload"
// // //                 type="file"
// // //                 multiple
// // //                 onChange={handleFileChange}
// // //                 className="hidden"
// // //               />
// // //               <label
// // //                 htmlFor="file-upload"
// // //                 className="cursor-pointer text-blue-600 hover:underline"
// // //               >
// // //                 <Upload className="inline w-5 h-5 mr-1" /> Click or Drag Files
// // //               </label>
// // //             </div>
// // //             {attachments.length > 0 && (
// // //               <div className="mt-3 space-y-2">
// // //                 {attachments.map((file, i) => (
// // //                   <div
// // //                     key={i}
// // //                     className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
// // //                   >
// // //                     <span className="text-sm truncate">{file.name}</span>
// // //                     <button
// // //                       onClick={() => removeFile(i)}
// // //                       className="text-red-500 text-sm"
// // //                     >
// // //                       Remove
// // //                     </button>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </div>

// // //           {/* Info Note */}
// // //           <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
// // //             <AlertCircle className="w-5 h-5 text-blue-600" />
// // //             <p className="text-sm text-blue-800">
// // //               Once submitted, the complaint will be reviewed by the admin. You’ll
// // //               be notified of follow-ups.
// // //             </p>
// // //           </div>

// // //           {/* Buttons */}
// // //           <div className="flex gap-3 justify-end pt-4">
// // //             <Button
// // //               type="button"
// // //               onClick={onClose}
// // //               className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl"
// // //             >
// // //               Cancel
// // //             </Button>
// // //             <Button
// // //               type="submit"
// // //               className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
// // //               disabled={loadingSubmit}
// // //             >
// // //               {loadingSubmit ? (
// // //                 <>
// // //                   <Loader2 className="w-5 h-5 animate-spin mr-2" /> Submitting...
// // //                 </>
// // //               ) : (
// // //                 'Submit Complaint'
// // //               )}
// // //             </Button>
// // //           </div>
// // //         </form>
// // //       </motion.div>
// // //     </motion.div>
// // //   );
// // // }
// // // components/complaints/ComplaintForm.tsx
// // import { useState, useEffect } from 'react';
// // import { motion } from 'framer-motion';
// // import { X, Upload, AlertCircle, Loader2 } from 'lucide-react';
// // import { Button } from '../../../components/ui/button';
// // import { supabase } from '../../../lib/supabase';
// // import { complaintService } from '../../../services/complaintService';
// // import { useAuth } from '../../../context/AuthContext';

// // interface ComplaintFormProps {
// //   onClose: () => void;
// //   onSuccess: () => void;
// // }

// // interface FormData {
// //   complainant_role: string;
// //   complainant_name: string;
// //   complainant_email: string;
// //   complainant_phone: string;
// //   against_role: string;
// //   against_id: string;
// //   against_name: string;
// //   department: string;
// //   class_id: string;
// //   class_name: string;
// //   complaint_type: string;
// //   title: string;
// //   description: string;
// //   incident_date: string;
// //   urgency_level: string;
// // }

// // interface Student {
// //   id: string;
// //   full_name: string;
// //   admission_number: string;
// //   class_name: string;
// // }

// // interface Teacher {
// //   id: string;
// //   full_name: string;
// //   employee_id: string;
// //   subject_specialization: string;
// // }

// // interface ClassData {
// //   id: string;
// //   class_name: string;
// //   section: string;
// // }

// // export default function ComplaintForm({ onClose, onSuccess }: ComplaintFormProps) {
// //   const { user, userProfile } = useAuth();
  
// //   const [formData, setFormData] = useState<FormData>({
// //     complainant_role: userProfile?.role || 'other',
// //     complainant_name: '',
// //     complainant_email: user?.email || '',
// //     complainant_phone: '',
// //     against_role: '',
// //     against_id: '',
// //     against_name: '',
// //     department: '',
// //     class_id: '',
// //     class_name: '',
// //     complaint_type: '',
// //     title: '',
// //     description: '',
// //     incident_date: new Date().toISOString().split('T')[0],
// //     urgency_level: 'medium',
// //   });

// //   const [files, setFiles] = useState<File[]>([]);
// //   const [students, setStudents] = useState<Student[]>([]);
// //   const [teachers, setTeachers] = useState<Teacher[]>([]);
// //   const [classes, setClasses] = useState<ClassData[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [loadingData, setLoadingData] = useState(true);
// //   const [errors, setErrors] = useState<Record<string, string>>({});

// //   // Fetch user profile and initial data
// //   useEffect(() => {
// //     fetchInitialData();
// //   }, [userProfile]);

// //   const fetchInitialData = async () => {
// //     try {
// //       setLoadingData(true);

// //       // Fetch complainant details based on role
// //       if (userProfile) {
// //         let userData = {
// //           name: '',
// //           email: user?.email || '',
// //           phone: '',
// //         };

// //         const role = userProfile.role.toLowerCase();

// //         if (role === 'student') {
// //           const { data } = await supabase
// //             .from('student_profiles')
// //             .select('full_name, email, parent_contact')
// //             .eq('id', user?.id)
// //             .single();

// //           if (data) {
// //             userData.name = data.full_name;
// //             userData.email = data.email || user?.email || '';
// //             userData.phone = data.parent_contact;
// //           }
// //         } else if (role === 'teacher') {
// //           const { data } = await supabase
// //             .from('teacher_profiles')
// //             .select('full_name, email, phone_number')
// //             .eq('id', user?.id)
// //             .single();

// //           if (data) {
// //             userData.name = data.full_name;
// //             userData.email = data.email;
// //             userData.phone = data.phone_number;
// //           }
// //         } else if (role === 'parent') {
// //           const { data } = await supabase
// //             .from('parent_profiles')
// //             .select('parent_name, email, phone_number')
// //             .eq('id', user?.id)
// //             .single();

// //           if (data) {
// //             userData.name = data.parent_name;
// //             userData.email = data.email;
// //             userData.phone = data.phone_number;
// //           }
// //         } else if (role === 'staff' || role === 'admin') {
// //           const { data } = await supabase
// //             .from('staff_profiles')
// //             .select('staff_name, email, phone_number')
// //             .eq('id', user?.id)
// //             .single();

// //           if (data) {
// //             userData.name = data.staff_name;
// //             userData.email = data.email;
// //             userData.phone = data.phone_number;
// //           } else {
// //             // Fallback to user_profiles
// //             userData.name = `${userProfile.first_name} ${userProfile.last_name}`;
// //             userData.phone = userProfile.phone_number || '';
// //           }
// //         }

// //         setFormData(prev => ({
// //           ...prev,
// //           complainant_name: userData.name,
// //           complainant_email: userData.email,
// //           complainant_phone: userData.phone,
// //           complainant_role: role,
// //         }));
// //       }

// //       // Fetch students for dropdown
// //       const { data: studentsData } = await supabase
// //         .from('student_profiles')
// //         .select('id, full_name, admission_number, class_name')
// //         .eq('status', 'active')
// //         .order('full_name');

// //       setStudents(studentsData || []);

// //       // Fetch teachers for dropdown
// //       const { data: teachersData } = await supabase
// //         .from('teachers')
// //         .select('id, full_name, employee_id, subject_specialization')
// //         .eq('status', 'active')
// //         .order('full_name');

// //       setTeachers(teachersData || []);

// //       // Fetch current academic year classes
// //       const currentYear = getCurrentAcademicYear();
// //       const { data: classesData } = await supabase
// //         .from('class_assignments')
// //         .select('class_id, class_name')
// //         .eq('academic_year', currentYear)
// //         .order('class_name');

// //       // Remove duplicates
// //       const uniqueClasses = Array.from(
// //         new Map(classesData?.map(item => [item.class_id, item])).values()
// //       );

// //       setClasses(uniqueClasses as ClassData[]);
// //     } catch (error) {
// //       console.error('Error fetching initial data:', error);
// //     } finally {
// //       setLoadingData(false);
// //     }
// //   };

// //   const getCurrentAcademicYear = () => {
// //     const today = new Date();
// //     const currentYear = today.getFullYear();
// //     const currentMonth = today.getMonth() + 1;

// //     // Academic year starts in April
// //     if (currentMonth >= 4) {
// //       return `${currentYear}-${currentYear + 1}`;
// //     } else {
// //       return `${currentYear - 1}-${currentYear}`;
// //     }
// //   };

// //   const handleInputChange = (
// //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
// //   ) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({ ...prev, [name]: value }));
    
// //     // Clear error when user starts typing
// //     if (errors[name]) {
// //       setErrors(prev => ({ ...prev, [name]: '' }));
// //     }

// //     // Auto-fill against_name when selecting student or teacher
// //     if (name === 'against_id' && value) {
// //       if (formData.against_role === 'student') {
// //         const student = students.find(s => s.id === value);
// //         if (student) {
// //           setFormData(prev => ({ ...prev, against_name: student.full_name }));
// //         }
// //       } else if (formData.against_role === 'teacher') {
// //         const teacher = teachers.find(t => t.id === value);
// //         if (teacher) {
// //           setFormData(prev => ({ ...prev, against_name: teacher.full_name }));
// //         }
// //       }
// //     }

// //     // Auto-fill class_name when selecting class
// //     if (name === 'class_id' && value) {
// //       const classData = classes.find(c => c.id === value);
// //       if (classData) {
// //         setFormData(prev => ({ ...prev, class_name: classData.class_name }));
// //       }
// //     }
// //   };

// //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     if (e.target.files) {
// //       const newFiles = Array.from(e.target.files);
// //       setFiles(prev => [...prev, ...newFiles]);
// //     }
// //   };

// //   const removeFile = (index: number) => {
// //     setFiles(prev => prev.filter((_, i) => i !== index));
// //   };

// //   const validateForm = (): boolean => {
// //     const newErrors: Record<string, string> = {};

// //     if (!formData.against_role) newErrors.against_role = 'Required';
// //     if (!formData.against_name) newErrors.against_name = 'Required';
// //     if (!formData.complaint_type) newErrors.complaint_type = 'Required';
// //     if (!formData.title) newErrors.title = 'Required';
// //     if (!formData.description) newErrors.description = 'Required';
// //     if (!formData.incident_date) newErrors.incident_date = 'Required';
// //     if (!formData.urgency_level) newErrors.urgency_level = 'Required';

// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();

// //     if (!validateForm()) {
// //       return;
// //     }

// //     if (!user || !userProfile) {
// //       alert('You must be logged in to submit a complaint');
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       await complaintService.createComplaint(
// //         formData,
// //         user.id,
// //         userProfile.role,
// //         files
// //       );

// //       alert('Complaint submitted successfully!');
// //       onSuccess();
// //       onClose();
// //     } catch (error: any) {
// //       console.error('Error submitting complaint:', error);
// //       alert(error.message || 'Failed to submit complaint. Please try again.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (loadingData) {
// //     return (
// //       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
// //         <div className="bg-white rounded-2xl p-8">
// //           <Loader2 className="w-8 h-8 animate-spin text-[#1E88E5]" />
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
// //       <motion.div
// //         initial={{ opacity: 0, scale: 0.95 }}
// //         animate={{ opacity: 1, scale: 1 }}
// //         className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
// //       >
// //         {/* Header */}
// //         <div className="sticky top-0 bg-gradient-to-r from-[#1E88E5] to-[#1976D2] text-white p-6 flex items-center justify-between">
// //           <h2 className="text-2xl font-bold">File a Complaint</h2>
// //           <button
// //             onClick={onClose}
// //             className="p-2 hover:bg-white/20 rounded-lg transition-colors"
// //           >
// //             <X className="w-6 h-6" />
// //           </button>
// //         </div>

// //         {/* Form */}
// //         <form onSubmit={handleSubmit} className="p-6 space-y-6">
// //           {/* Complainant Information */}
// //           <div className="bg-gray-50 rounded-xl p-4 space-y-4">
// //             <h3 className="font-semibold text-lg text-gray-800">Your Information</h3>
            
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Role
// //                 </label>
// //                 <input
// //                   type="text"
// //                   value={formData.complainant_role}
// //                   disabled
// //                   className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg capitalize"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Name
// //                 </label>
// //                 <input
// //                   type="text"
// //                   value={formData.complainant_name}
// //                   disabled
// //                   className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Email
// //                 </label>
// //                 <input
// //                   type="email"
// //                   value={formData.complainant_email}
// //                   disabled
// //                   className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Phone
// //                 </label>
// //                 <input
// //                   type="tel"
// //                   value={formData.complainant_phone}
// //                   disabled
// //                   className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg"
// //                 />
// //               </div>
// //             </div>
// //           </div>

// //           {/* Complaint Against */}
// //           <div className="space-y-4">
// //             <h3 className="font-semibold text-lg text-gray-800">Complaint Against</h3>

// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Against Role <span className="text-red-500">*</span>
// //                 </label>
// //                 <select
// //                   name="against_role"
// //                   value={formData.against_role}
// //                   onChange={handleInputChange}
// //                   className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] ${
// //                     errors.against_role ? 'border-red-500' : 'border-gray-300'
// //                   }`}
// //                 >
// //                   <option value="">Select Role</option>
// //                   <option value="student">Student</option>
// //                   <option value="teacher">Teacher</option>
// //                   <option value="staff">Staff</option>
// //                   <option value="department">Department</option>
// //                   <option value="other">Other</option>
// //                 </select>
// //                 {errors.against_role && (
// //                   <p className="text-red-500 text-sm mt-1">{errors.against_role}</p>
// //                 )}
// //               </div>

// //               {formData.against_role === 'student' && (
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Select Student <span className="text-red-500">*</span>
// //                   </label>
// //                   <select
// //                     name="against_id"
// //                     value={formData.against_id}
// //                     onChange={handleInputChange}
// //                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
// //                   >
// //                     <option value="">Select Student</option>
// //                     {students.map(student => (
// //                       <option key={student.id} value={student.id}>
// //                         {student.full_name} - {student.admission_number} ({student.class_name})
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>
// //               )}

// //               {formData.against_role === 'teacher' && (
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Select Teacher <span className="text-red-500">*</span>
// //                   </label>
// //                   <select
// //                     name="against_id"
// //                     value={formData.against_id}
// //                     onChange={handleInputChange}
// //                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
// //                   >
// //                     <option value="">Select Teacher</option>
// //                     {teachers.map(teacher => (
// //                       <option key={teacher.id} value={teacher.id}>
// //                         {teacher.full_name} - {teacher.subject_specialization}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>
// //               )}

// //               {(formData.against_role === 'staff' ||
// //                 formData.against_role === 'department' ||
// //                 formData.against_role === 'other') && (
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Name/Description <span className="text-red-500">*</span>
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="against_name"
// //                     value={formData.against_name}
// //                     onChange={handleInputChange}
// //                     className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] ${
// //                       errors.against_name ? 'border-red-500' : 'border-gray-300'
// //                     }`}
// //                     placeholder="Enter name or description"
// //                   />
// //                   {errors.against_name && (
// //                     <p className="text-red-500 text-sm mt-1">{errors.against_name}</p>
// //                   )}
// //                 </div>
// //               )}
// //             </div>

// //             {formData.against_role === 'department' && (
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Department
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="department"
// //                   value={formData.department}
// //                   onChange={handleInputChange}
// //                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
// //                   placeholder="Enter department name"
// //                 />
// //               </div>
// //             )}
// //           </div>

// //           {/* Complaint Details */}
// //           <div className="space-y-4">
// //             <h3 className="font-semibold text-lg text-gray-800">Complaint Details</h3>

// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Complaint Type <span className="text-red-500">*</span>
// //                 </label>
// //                 <select
// //                   name="complaint_type"
// //                   value={formData.complaint_type}
// //                   onChange={handleInputChange}
// //                   className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] ${
// //                     errors.complaint_type ? 'border-red-500' : 'border-gray-300'
// //                   }`}
// //                 >
// //                   <option value="">Select Type</option>
// //                   <option value="academic">Academic</option>
// //                   <option value="behaviour">Behaviour</option>
// //                   <option value="safety">Safety</option>
// //                   <option value="facility">Facility</option>
// //                   <option value="fee">Fee</option>
// //                   <option value="transport">Transport</option>
// //                   <option value="other">Other</option>
// //                 </select>
// //                 {errors.complaint_type && (
// //                   <p className="text-red-500 text-sm mt-1">{errors.complaint_type}</p>
// //                 )}
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Priority Level <span className="text-red-500">*</span>
// //                 </label>
// //                 <select
// //                   name="urgency_level"
// //                   value={formData.urgency_level}
// //                   onChange={handleInputChange}
// //                   className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] ${
// //                     errors.urgency_level ? 'border-red-500' : 'border-gray-300'
// //                   }`}
// //                 >
// //                   <option value="low">Low</option>
// //                   <option value="medium">Medium</option>
// //                   <option value="high">High</option>
// //                   <option value="critical">Critical</option>
// //                 </select>
// //                 {errors.urgency_level && (
// //                   <p className="text-red-500 text-sm mt-1">{errors.urgency_level}</p>
// //                 )}
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Incident Date <span className="text-red-500">*</span>
// //                 </label>
// //                 <input
// //                   type="date"
// //                   name="incident_date"
// //                   value={formData.incident_date}
// //                   onChange={handleInputChange}
// //                   max={new Date().toISOString().split('T')[0]}
// //                   className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] ${
// //                     errors.incident_date ? 'border-red-500' : 'border-gray-300'
// //                   }`}
// //                 />
// //                 {errors.incident_date && (
// //                   <p className="text-red-500 text-sm mt-1">{errors.incident_date}</p>
// //                 )}
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Related Class (Optional)
// //                 </label>
// //                 <select
// //                   name="class_id"
// //                   value={formData.class_id}
// //                   onChange={handleInputChange}
// //                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
// //                 >
// //                   <option value="">Select Class</option>
// //                   {classes.map(cls => (
// //                     <option key={cls.id} value={cls.id}>
// //                       {cls.class_name}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 Title <span className="text-red-500">*</span>
// //               </label>
// //               <input
// //                 type="text"
// //                 name="title"
// //                 value={formData.title}
// //                 onChange={handleInputChange}
// //                 className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] ${
// //                   errors.title ? 'border-red-500' : 'border-gray-300'
// //                 }`}
// //                 placeholder="Brief title of your complaint"
// //               />
// //               {errors.title && (
// //                 <p className="text-red-500 text-sm mt-1">{errors.title}</p>
// //               )}
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 Description <span className="text-red-500">*</span>
// //               </label>
// //               <textarea
// //                 name="description"
// //                 value={formData.description}
// //                 onChange={handleInputChange}
// //                 rows={6}
// //                 className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] ${
// //                   errors.description ? 'border-red-500' : 'border-gray-300'
// //                 }`}
// //                 placeholder="Provide detailed information about your complaint..."
// //               />
// //               {errors.description && (
// //                 <p className="text-red-500 text-sm mt-1">{errors.description}</p>
// //               )}
// //             </div>
// //           </div>

// //           {/* File Attachments */}
// //           <div className="space-y-4">
// //             <h3 className="font-semibold text-lg text-gray-800">Attachments (Optional)</h3>
            
// //             <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
// //               <input
// //                 type="file"
// //                 id="file-upload"
// //                 multiple
// //                 onChange={handleFileChange}
// //                 className="hidden"
// //                 accept="image/*,.pdf,.doc,.docx"
// //               />
// //               <label
// //                 htmlFor="file-upload"
// //                 className="cursor-pointer flex flex-col items-center"
// //               >
// //                 <Upload className="w-12 h-12 text-gray-400 mb-2" />
// //                 <span className="text-sm text-gray-600">
// //                   Click to upload files (images, PDF, documents)
// //                 </span>
// //               </label>
// //             </div>

// //             {files.length > 0 && (
// //               <div className="space-y-2">
// //                 {files.map((file, index) => (
// //                   <div
// //                     key={index}
// //                     className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
// //                   >
// //                     <span className="text-sm text-gray-700 truncate">{file.name}</span>
// //                     <button
// //                       type="button"
// //                       onClick={() => removeFile(index)}
// //                       className="text-red-500 hover:text-red-700"
// //                     >
// //                       <X className="w-5 h-5" />
// //                     </button>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>

// //           {/* Actions */}
// //           <div className="flex items-center justify-end gap-4 pt-6 border-t">
// //             <Button
// //               type="button"
// //               onClick={onClose}
// //               variant="outline"
// //               disabled={loading}
// //             >
// //               Cancel
// //             </Button>
// //             <Button
// //               type="submit"
// //               disabled={loading}
// //               className="bg-gradient-to-r from-[#1E88E5] to-[#1976D2]"
// //             >
// //               {loading ? (
// //                 <>
// //                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
// //                   Submitting...
// //                 </>
// //               ) : (
// //                 'Submit Complaint'
// //               )}
// //             </Button>
// //           </div>
// //         </form>
// //       </motion.div>
// //     </div>
// //   );
// // }
// // components/complaints/ComplaintForm.tsx
// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { X, Upload, AlertCircle, Loader2 ,FileText} from 'lucide-react';
// import { Button } from '../../../components/ui/button';
// import { supabase } from '../../../lib/supabase';
// import { complaintService } from '../../../services/complaintService';
// import { useAuth } from '../../../context/AuthContext';

// interface ComplaintFormProps {
//   onClose: () => void;
//   onSuccess: () => void;
// }

// interface FormData {
//   complainant_role: string;
//   complainant_name: string;
//   complainant_email: string;
//   complainant_phone: string;
//   against_role: string;
//   against_id: string;
//   against_name: string;
//   department: string;
//   class_id: string;
//   class_name: string;
//   complaint_type: string;
//   title: string;
//   description: string;
//   incident_date: string;
//   urgency_level: string;
// }

// interface Student {
//   id: string;
//   full_name: string;
//   admission_number: string;
//   class_name: string;
// }

// interface Teacher {
//   id: string;
//   full_name: string;
//   employee_id: string;
//   subject_specialization: string;
// }

// interface ClassData {
//   id: string;
//   class_name: string;
//   section: string;
// }

// export default function ComplaintForm({ onClose, onSuccess }: ComplaintFormProps) {
//   const { user, userProfile } = useAuth();
  
//   const [formData, setFormData] = useState<FormData>({
//     complainant_role: userProfile?.role || 'other',
//     complainant_name: '',
//     complainant_email: user?.email || '',
//     complainant_phone: '',
//     against_role: '',
//     against_id: '',
//     against_name: '',
//     department: '',
//     class_id: '',
//     class_name: '',
//     complaint_type: '',
//     title: '',
//     description: '',
//     incident_date: new Date().toISOString().split('T')[0],
//     urgency_level: 'medium',
//   });

//   const [files, setFiles] = useState<File[]>([]);
//   const [students, setStudents] = useState<Student[]>([]);
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [classes, setClasses] = useState<ClassData[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(true);
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   // Fetch user profile and initial data
//   useEffect(() => {
//     fetchInitialData();
//   }, [userProfile]);

//   const fetchInitialData = async () => {
//     try {
//       setLoadingData(true);
//       console.log('🔄 Fetching initial data for role:', userProfile?.role);

//       // Fetch complainant details based on role
//       if (userProfile && user) {
//         let userData = {
//           name: '',
//           email: user?.email || '',
//           phone: '',
//         };

//         const role = userProfile.role.toLowerCase();

//         if (role === 'student') {
//           const { data, error } = await supabase
//             .from('student_profiles')
//             .select('full_name, email, parent_contact')
//             .eq('id', user.id)
//             .maybeSingle();

//           if (error) {
//             console.error('Error fetching student profile:', error);
//           } else if (data) {
//             userData.name = data.full_name;
//             userData.email = data.email || user?.email || '';
//             userData.phone = data.parent_contact;
//           }
//         } else if (role === 'teacher') {
//           const { data, error } = await supabase
//             .from('teacher_profiles')
//             .select('full_name, email, phone_number')
//             .eq('id', user.id)
//             .maybeSingle();

//           if (error) {
//             console.error('Error fetching teacher profile:', error);
//           } else if (data) {
//             userData.name = data.full_name;
//             userData.email = data.email;
//             userData.phone = data.phone_number;
//           }
//         } else if (role === 'parent') {
//           const { data, error } = await supabase
//             .from('parent_profiles')
//             .select('parent_name, email, phone_number')
//             .eq('id', user.id)
//             .maybeSingle();

//           if (error) {
//             console.error('Error fetching parent profile:', error);
//           } else if (data) {
//             userData.name = data.parent_name;
//             userData.email = data.email;
//             userData.phone = data.phone_number;
//           }
//         } else if (role === 'staff' || role === 'admin') {
//           // Try staff_profiles first
//           const { data: staffData, error: staffError } = await supabase
//             .from('staff_profiles')
//             .select('staff_name, email, phone_number')
//             .eq('id', user.id)
//             .maybeSingle();

//           if (staffError) {
//             console.warn('Staff profile not found, using user_profiles:', staffError);
//           }

//           if (staffData) {
//             userData.name = staffData.staff_name;
//             userData.email = staffData.email;
//             userData.phone = staffData.phone_number;
//           } else {
//             // Fallback to user_profiles
//             userData.name = `${userProfile.first_name} ${userProfile.last_name}`;
//             userData.phone = userProfile.phone_number || '';
//           }
//         }

//         setFormData(prev => ({
//           ...prev,
//           complainant_name: userData.name,
//           complainant_email: userData.email,
//           complainant_phone: userData.phone,
//           complainant_role: role,
//         }));
//       }

//       // Fetch students for dropdown - using student_profiles with RLS bypass
//       const { data: studentsData, error: studentsError } = await supabase
//         .from('student_profiles')
//         .select('id, full_name, admission_number, class_name')
//         .eq('status', 'active')
//         .order('full_name');

//       if (studentsError) {
//         console.error('Error fetching students:', studentsError);
//       } else {
//         console.log('✅ Students fetched:', studentsData?.length || 0);
//         setStudents(studentsData || []);
//       }

//       // Fetch teachers for dropdown
//       const { data: teachersData, error: teachersError } = await supabase
//         .from('teachers')
//         .select('id, full_name, employee_id, subject_specialization')
//         .eq('status', 'active')
//         .order('full_name');

//       if (teachersError) {
//         console.error('Error fetching teachers:', teachersError);
//       } else {
//         console.log('✅ Teachers fetched:', teachersData?.length || 0);
//         setTeachers(teachersData || []);
//       }

//       // Fetch current academic year classes
//       const currentYear = getCurrentAcademicYear();
//       const { data: classesData, error: classesError } = await supabase
//         .from('class_assignments')
//         .select('class_id, class_name')
//         .eq('academic_year', currentYear)
//         .order('class_name');

//       if (classesError) {
//         console.error('Error fetching classes:', classesError);
//       } else {
//         // Remove duplicates
//         const uniqueClasses = Array.from(
//           new Map(classesData?.map(item => [item.class_id, item])).values()
//         );
//         console.log('✅ Classes fetched:', uniqueClasses.length);
//         setClasses(uniqueClasses as ClassData[]);
//       }
//     } catch (error) {
//       console.error('Error fetching initial data:', error);
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   const getCurrentAcademicYear = () => {
//     const today = new Date();
//     const currentYear = today.getFullYear();
//     const currentMonth = today.getMonth() + 1;

//     // Academic year starts in April
//     if (currentMonth >= 4) {
//       return `${currentYear}-${currentYear + 1}`;
//     } else {
//       return `${currentYear - 1}-${currentYear}`;
//     }
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }

//     // Auto-fill against_name when selecting student or teacher
//     if (name === 'against_id' && value) {
//       if (formData.against_role === 'student') {
//         const student = students.find(s => s.id === value);
//         if (student) {
//           setFormData(prev => ({ ...prev, against_name: student.full_name }));
//         }
//       } else if (formData.against_role === 'teacher') {
//         const teacher = teachers.find(t => t.id === value);
//         if (teacher) {
//           setFormData(prev => ({ ...prev, against_name: teacher.full_name }));
//         }
//       }
//     }

//     // Auto-fill class_name when selecting class
//     if (name === 'class_id' && value) {
//       const classData = classes.find(c => c.id === value);
//       if (classData) {
//         setFormData(prev => ({ ...prev, class_name: classData.class_name }));
//       }
//     }

//     // Clear against_id when against_role changes
//     if (name === 'against_role') {
//       setFormData(prev => ({ 
//         ...prev, 
//         against_id: '', 
//         against_name: '',
//         department: ''
//       }));
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const newFiles = Array.from(e.target.files);
//       setFiles(prev => [...prev, ...newFiles]);
//     }
//   };

//   const removeFile = (index: number) => {
//     setFiles(prev => prev.filter((_, i) => i !== index));
//   };

//   const validateForm = (): boolean => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.against_role) newErrors.against_role = 'Required';
//     if (!formData.against_name) newErrors.against_name = 'Required';
//     if (!formData.complaint_type) newErrors.complaint_type = 'Required';
//     if (!formData.title.trim()) newErrors.title = 'Required';
//     if (!formData.description.trim()) newErrors.description = 'Required';
//     if (!formData.incident_date) newErrors.incident_date = 'Required';
//     if (!formData.urgency_level) newErrors.urgency_level = 'Required';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       alert('Please fill all required fields');
//       return;
//     }

//     if (!user || !userProfile) {
//       alert('You must be logged in to submit a complaint');
//       return;
//     }

//     try {
//       setLoading(true);
//       console.log('📤 Submitting complaint:', formData);

//       // Clean the form data - convert empty strings to null for UUID fields
//       const cleanedData = {
//         ...formData,
//         against_id: formData.against_id || null,
//         class_id: formData.class_id || null,
//         department: formData.department || null,
//       };

//       await complaintService.createComplaint(
//         cleanedData as any,
//         user.id,
//         userProfile.role,
//         files
//       );

//       alert('✅ Complaint submitted successfully!');
//       onSuccess();
//       onClose();
//     } catch (error: any) {
//       console.error('❌ Error submitting complaint:', error);
//       alert(error.message || 'Failed to submit complaint. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loadingData) {
//     return (
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
//           <Loader2 className="w-8 h-8 animate-spin text-[#1E88E5]" />
//           <p className="text-gray-600">Loading form data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
//       >
//         {/* Header */}
//         <div className="sticky top-0 bg-gradient-to-r from-[#1E88E5] to-[#1976D2] text-white p-6 flex items-center justify-between z-10">
//           <h2 className="text-2xl font-bold">File a Complaint</h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* Complainant Information */}
//           <div className="bg-gray-50 rounded-xl p-4 space-y-4">
//             <h3 className="font-semibold text-lg text-gray-800">Your Information</h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Role
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.complainant_role}
//                   disabled
//                   className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg capitalize"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.complainant_name}
//                   disabled
//                   className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={formData.complainant_email}
//                   disabled
//                   className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Phone
//                 </label>
//                 <input
//                   type="tel"
//                   value={formData.complainant_phone}
//                   disabled
//                   className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Complaint Against */}
//           <div className="space-y-4">
//             <h3 className="font-semibold text-lg text-gray-800">Complaint Against</h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Against Role <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="against_role"
//                   value={formData.against_role}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] ${
//                     errors.against_role ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                 >
//                   <option value="">Select Role</option>
//                   <option value="student">Student</option>
//                   <option value="teacher">Teacher</option>
//                   <option value="staff">Staff</option>
//                   <option value="department">Department</option>
//                   <option value="other">Other</option>
//                 </select>
//                 {errors.against_role && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     {errors.against_role}
//                   </p>
//                 )}
//               </div>

//               {formData.against_role === 'student' && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Select Student <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="against_id"
//                     value={formData.against_id}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
//                   >
//                     <option value="">Select Student ({students.length} available)</option>
//                     {students.map(student => (
//                       <option key={student.id} value={student.id}>
//                         {student.full_name} - {student.admission_number} ({student.class_name || 'N/A'})
//                       </option>
//                     ))}
//                   </select>
//                   {students.length === 0 && (
//                     <p className="text-amber-600 text-sm mt-1">No students found. Check RLS policies.</p>
//                   )}
//                 </div>
//               )}

//               {formData.against_role === 'teacher' && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Select Teacher <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="against_id"
//                     value={formData.against_id}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
//                   >
//                     <option value="">Select Teacher ({teachers.length} available)</option>
//                     {teachers.map(teacher => (
//                       <option key={teacher.id} value={teacher.id}>
//                         {teacher.full_name} - {teacher.subject_specialization}
//                       </option>
//                     ))}
//                   </select>
//                   {teachers.length === 0 && (
//                     <p className="text-amber-600 text-sm mt-1">No teachers found. Check RLS policies.</p>
//                   )}
//                 </div>
//               )}

//               {(formData.against_role === 'staff' ||
//                 formData.against_role === 'department' ||
//                 formData.against_role === 'other') && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Name/Description <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="against_name"
//                     value={formData.against_name}
//                     onChange={handleInputChange}
//                     className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] ${
//                       errors.against_name ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter name or description"
//                   />
//                   {errors.against_name && (
//                     <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                       <AlertCircle className="w-4 h-4" />
//                       {errors.against_name}
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>

//             {formData.against_role === 'department' && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Department (Optional)
//                 </label>
//                 <input
//                   type="text"
//                   name="department"
//                   value={formData.department}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
//                   placeholder="Enter department name"
//                 />
//               </div>
//             )}
//           </div>

//           {/* Complaint Details */}
//           <div className="space-y-4">
//             <h3 className="font-semibold text-lg text-gray-800">Complaint Details</h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Complaint Type <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="complaint_type"
//                   value={formData.complaint_type}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] ${
//                     errors.complaint_type ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                 >
//                   <option value="">Select Type</option>
//                   <option value="academic">Academic</option>
//                   <option value="behaviour">Behaviour</option>
//                   <option value="safety">Safety</option>
//                   <option value="facility">Facility</option>
//                   <option value="fee">Fee</option>
//                   <option value="transport">Transport</option>
//                   <option value="other">Other</option>
//                 </select>
//                 {errors.complaint_type && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     {errors.complaint_type}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Priority Level <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="urgency_level"
//                   value={formData.urgency_level}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] ${
//                     errors.urgency_level ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                 >
//                   <option value="low">Low</option>
//                   <option value="medium">Medium</option>
//                   <option value="high">High</option>
//                   <option value="critical">Critical</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Incident Date <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   name="incident_date"
//                   value={formData.incident_date}
//                   onChange={handleInputChange}
//                   max={new Date().toISOString().split('T')[0]}
//                   className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] ${
//                     errors.incident_date ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                 />
//                 {errors.incident_date && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     {errors.incident_date}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Related Class (Optional)
//                 </label>
//                 <select
//                   name="class_id"
//                   value={formData.class_id}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
//                 >
//                   <option value="">Select Class ({classes.length} available)</option>
//                   {classes.map(cls => (
//                     <option key={cls.id} value={cls.id}>
//                       {cls.class_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Title <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] ${
//                   errors.title ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 placeholder="Brief title of your complaint"
//               />
//               {errors.title && (
//                 <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                   <AlertCircle className="w-4 h-4" />
//                   {errors.title}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Description <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows={6}
//                 className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] resize-none ${
//                   errors.description ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 placeholder="Provide detailed information about your complaint..."
//               />
//               {errors.description && (
//                 <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                   <AlertCircle className="w-4 h-4" />
//                   {errors.description}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* File Attachments */}
//           <div className="space-y-4">
//             <h3 className="font-semibold text-lg text-gray-800">Attachments (Optional)</h3>
            
//             <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#1E88E5] transition-colors">
//               <input
//                 type="file"
//                 id="file-upload"
//                 multiple
//                 onChange={handleFileChange}
//                 className="hidden"
//                 accept="image/*,.pdf,.doc,.docx"
//               />
//               <label
//                 htmlFor="file-upload"
//                 className="cursor-pointer flex flex-col items-center"
//               >
//                 <Upload className="w-12 h-12 text-gray-400 mb-2" />
//                 <span className="text-sm text-gray-600">
//                   Click to upload files (images, PDF, documents)
//                 </span>
//                 <span className="text-xs text-gray-500 mt-1">
//                   Max 10MB per file
//                 </span>
//               </label>
//             </div>

//             {files.length > 0 && (
//               <div className="space-y-2">
//                 <p className="text-sm font-medium text-gray-700">
//                   {files.length} file(s) selected
//                 </p>
//                 {files.map((file, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
//                   >
//                     <div className="flex items-center gap-2 flex-1 min-w-0">
//                       <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
//                       <span className="text-sm text-gray-700 truncate">{file.name}</span>
//                       <span className="text-xs text-gray-500 flex-shrink-0">
//                         ({(file.size / 1024).toFixed(1)} KB)
//                       </span>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => removeFile(index)}
//                       className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
//                     >
//                       <X className="w-5 h-5" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Actions */}
//           <div className="flex items-center justify-end gap-4 pt-6 border-t sticky bottom-0 bg-white">
//             <Button
//               type="button"
//               onClick={onClose}
//               variant="outline"
//               disabled={loading}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={loading}
//               className="bg-gradient-to-r from-[#1E88E5] to-[#1976D2] min-w-[140px]"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                   Submitting...
//                 </>
//               ) : (
//                 'Submit Complaint'
//               )}
//             </Button>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// }
// components/complaints/ComplaintForm.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, AlertCircle, Loader2, FileText } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { supabase } from '../../../lib/supabase';
import { complaintService } from '../../../services/complaintService';
import { useAuth } from '../../../context/AuthContext';

interface ComplaintFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  complainant_role: string;
  complainant_name: string;
  complainant_email: string;
  complainant_phone: string;
  against_role: string;
  against_id: string;
  against_name: string;
  department: string;
  class_id: string;
  class_name: string;
  complaint_type: string;
  title: string;
  description: string;
  incident_date: string;
  urgency_level: string;
}

interface ClassAssignmentRow {
  id: string;
  academic_year: string;
  class_id: string;
  class_name: string;
  student_id: string;
  student_name: string;
}

interface Teacher {
  id: string;
  full_name: string;
  employee_id: string;
  subject_specialization: string;
}

export default function ComplaintForm({ onClose, onSuccess }: ComplaintFormProps) {
  const { user, userProfile } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    complainant_role: userProfile?.role || 'other',
    complainant_name: '',
    complainant_email: user?.email || '',
    complainant_phone: '',
    against_role: '',
    against_id: '',
    against_name: '',
    department: '',
    class_id: '',
    class_name: '',
    complaint_type: '',
    title: '',
    description: '',
    incident_date: new Date().toISOString().split('T')[0],
    urgency_level: 'medium',
  });

  // Files
  const [files, setFiles] = useState<File[]>([]);

  // For Student selection
  const [allAssignments, setAllAssignments] = useState<ClassAssignmentRow[]>([]);
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [availableClasses, setAvailableClasses] = useState<{ class_id: string; class_name: string }[]>([]);
  const [availableStudents, setAvailableStudents] = useState<{ student_id: string; student_name: string }[]>([]);
  
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  // For Teacher selection
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch user profile and initial data
  useEffect(() => {
    fetchInitialData();
  }, [userProfile]);

  const fetchInitialData = async () => {
    try {
      setLoadingData(true);
      console.log('🔄 Fetching initial data for role:', userProfile?.role);

      // Fetch complainant details based on role
      if (userProfile && user) {
        let userData = {
          name: '',
          email: user?.email || '',
          phone: '',
        };

        const role = userProfile.role.toLowerCase();

        if (role === 'student') {
          const { data, error } = await supabase
            .from('student_profiles')
            .select('full_name, email, parent_contact')
            .eq('id', user.id)
            .maybeSingle();

          if (error) {
            console.error('Error fetching student profile:', error);
          } else if (data) {
            userData.name = data.full_name;
            userData.email = data.email || user?.email || '';
            userData.phone = data.parent_contact;
          }
        } else if (role === 'teacher') {
          const { data, error } = await supabase
            .from('teacher_profiles')
            .select('full_name, email, phone_number')
            .eq('id', user.id)
            .maybeSingle();

          if (error) {
            console.error('Error fetching teacher profile:', error);
          } else if (data) {
            userData.name = data.full_name;
            userData.email = data.email;
            userData.phone = data.phone_number;
          }
        } else if (role === 'parent') {
          const { data, error } = await supabase
            .from('parent_profiles')
            .select('parent_name, email, phone_number')
            .eq('id', user.id)
            .maybeSingle();

          if (error) {
            console.error('Error fetching parent profile:', error);
          } else if (data) {
            userData.name = data.parent_name;
            userData.email = data.email;
            userData.phone = data.phone_number;
          }
        } else if (role === 'staff' || role === 'admin') {
          // Try staff_profiles first
          const { data: staffData, error: staffError } = await supabase
            .from('staff_profiles')
            .select('staff_name, email, phone_number')
            .eq('id', user.id)
            .maybeSingle();

          if (staffError) {
            console.warn('Staff profile not found, using user_profiles:', staffError);
          }

          if (staffData) {
            userData.name = staffData.staff_name;
            userData.email = staffData.email;
            userData.phone = staffData.phone_number;
          } else {
            // Fallback to user_profiles
            userData.name = `${userProfile.first_name} ${userProfile.last_name}`;
            userData.phone = userProfile.phone_number || '';
          }
        }

        setFormData(prev => ({
          ...prev,
          complainant_name: userData.name,
          complainant_email: userData.email,
          complainant_phone: userData.phone,
          complainant_role: role,
        }));
      }

      // Fetch all class assignments (for academic year, class, student dropdowns)
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('class_assignments')
        .select('id, academic_year, class_id, class_name, student_id, student_name')
        .order('academic_year')
        .order('class_name')
        .order('student_name');

      if (assignmentsError) {
        console.error('Error fetching class assignments:', assignmentsError);
      } else if (assignmentsData) {
        console.log('✅ Class assignments fetched:', assignmentsData.length);
        setAllAssignments(assignmentsData);
        
        // Extract unique academic years
        const years = Array.from(new Set(assignmentsData.map(row => row.academic_year)));
        setAcademicYears(years);
      }

      // Fetch teachers for dropdown
      const { data: teachersData, error: teachersError } = await supabase
        .from('teachers')
        .select('id, full_name, employee_id, subject_specialization')
        .eq('status', 'active')
        .order('full_name');

      if (teachersError) {
        console.error('Error fetching teachers:', teachersError);
      } else {
        console.log('✅ Teachers fetched:', teachersData?.length || 0);
        setTeachers(teachersData || []);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  // Filter classes when academic year changes
  useEffect(() => {
    setSelectedClassId('');
    setAvailableClasses([]);
    setAvailableStudents([]);
    setFormData(prev => ({ ...prev, class_id: '', class_name: '', against_id: '', against_name: '' }));

    if (!selectedAcademicYear) return;

    const filtered = allAssignments.filter(row => row.academic_year === selectedAcademicYear);
    const uniqueClasses = Array.from(
      new Map(filtered.map(row => [row.class_id, { class_id: row.class_id, class_name: row.class_name }])).values()
    );
    setAvailableClasses(uniqueClasses);
    console.log('✅ Classes for year:', selectedAcademicYear, uniqueClasses.length);
  }, [selectedAcademicYear, allAssignments]);

  // Filter students when class changes
  useEffect(() => {
    setAvailableStudents([]);
    setFormData(prev => ({ ...prev, against_id: '', against_name: '' }));

    if (!selectedAcademicYear || !selectedClassId) return;

    const filtered = allAssignments.filter(
      row => row.academic_year === selectedAcademicYear && row.class_id === selectedClassId
    );
    const uniqueStudents = Array.from(
      new Map(filtered.map(row => [row.student_id, { student_id: row.student_id, student_name: row.student_name }])).values()
    );
    setAvailableStudents(uniqueStudents);
    console.log('✅ Students for class:', selectedClassId, uniqueStudents.length);
  }, [selectedAcademicYear, selectedClassId, allAssignments]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear related fields when against_role changes
    if (name === 'against_role') {
      setFormData(prev => ({
        ...prev,
        against_id: '',
        against_name: '',
        department: '',
        class_id: '',
        class_name: '',
      }));
      setSelectedAcademicYear('');
      setSelectedClassId('');
    }
  };

  const handleAcademicYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAcademicYear(e.target.value);
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = e.target.value;
    setSelectedClassId(classId);
    
    const selectedClass = availableClasses.find(c => c.class_id === classId);
    if (selectedClass) {
      setFormData(prev => ({
        ...prev,
        class_id: selectedClass.class_id,
        class_name: selectedClass.class_name,
      }));
    }
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = e.target.value;
    const selectedStudent = availableStudents.find(s => s.student_id === studentId);
    
    if (selectedStudent) {
      setFormData(prev => ({
        ...prev,
        against_id: selectedStudent.student_id,
        against_name: selectedStudent.student_name,
      }));
    }
  };

  const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const teacherId = e.target.value;
    const selectedTeacher = teachers.find(t => t.id === teacherId);
    
    if (selectedTeacher) {
      setFormData(prev => ({
        ...prev,
        against_id: selectedTeacher.id,
        against_name: selectedTeacher.full_name,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.against_role) newErrors.against_role = 'Required';
    if (!formData.against_name) newErrors.against_name = 'Required';
    if (!formData.complaint_type) newErrors.complaint_type = 'Required';
    if (!formData.title.trim()) newErrors.title = 'Required';
    if (!formData.description.trim()) newErrors.description = 'Required';
    if (!formData.incident_date) newErrors.incident_date = 'Required';
    if (!formData.urgency_level) newErrors.urgency_level = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fill all required fields');
      return;
    }

    if (!user || !userProfile) {
      alert('You must be logged in to submit a complaint');
      return;
    }

    try {
      setLoading(true);
      console.log('📤 Submitting complaint:', formData);

      // Clean the form data - convert empty strings to null for UUID fields
      const cleanedData = {
        ...formData,
        against_id: formData.against_id || null,
        class_id: formData.class_id || null,
        department: formData.department || null,
      };

      await complaintService.createComplaint(
        cleanedData as any,
        user.id,
        userProfile.role,
        files
      );

      alert('✅ Complaint submitted successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('❌ Error submitting complaint:', error);
      alert(error.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#1E88E5]" />
          <p className="text-gray-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#1E88E5] to-[#1976D2] text-white p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold">File a Complaint</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Complainant Information */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-4">
            <h3 className="font-semibold text-lg text-gray-800">Your Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  value={formData.complainant_role}
                  disabled
                  className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg capitalize"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.complainant_name}
                  disabled
                  className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.complainant_email}
                  disabled
                  className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.complainant_phone}
                  disabled
                  className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Complaint Against */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-800">Complaint Against</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Against Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="against_role"
                  value={formData.against_role}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] ${
                    errors.against_role ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Role</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="staff">Staff</option>
                  <option value="department">Department</option>
                  <option value="other">Other</option>
                </select>
                {errors.against_role && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.against_role}
                  </p>
                )}
              </div>
            </div>

            {/* Student Selection - Three cascading dropdowns */}
            {formData.against_role === 'student' && (
              <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-medium">Select student by academic year and class</p>
                
                {/* Academic Year Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedAcademicYear}
                    onChange={handleAcademicYearChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
                  >
                    <option value="">Select Academic Year ({academicYears.length} available)</option>
                    {academicYears.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Class Dropdown */}
                {selectedAcademicYear && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedClassId}
                      onChange={handleClassChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
                    >
                      <option value="">Select Class ({availableClasses.length} available)</option>
                      {availableClasses.map(cls => (
                        <option key={cls.class_id} value={cls.class_id}>
                          {cls.class_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Student Dropdown */}
                {selectedClassId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.against_id}
                      onChange={handleStudentChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
                    >
                      <option value="">Select Student ({availableStudents.length} available)</option>
                      {availableStudents.map(stu => (
                        <option key={stu.student_id} value={stu.student_id}>
                          {stu.student_name}
                        </option>
                      ))}
                    </select>
                    {availableStudents.length === 0 && selectedClassId && (
                      <p className="text-amber-600 text-sm mt-1">No students found in this class.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Teacher Selection */}
            {formData.against_role === 'teacher' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Teacher <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.against_id}
                  onChange={handleTeacherChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
                >
                  <option value="">Select Teacher ({teachers.length} available)</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.full_name} - {teacher.subject_specialization}
                    </option>
                  ))}
                </select>
                {teachers.length === 0 && (
                  <p className="text-amber-600 text-sm mt-1">No teachers found.</p>
                )}
              </div>
            )}

            {/* Staff/Department/Other - Manual Entry */}
            {(formData.against_role === 'staff' ||
              formData.against_role === 'department' ||
              formData.against_role === 'other') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name/Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="against_name"
                  value={formData.against_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] ${
                    errors.against_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter name or description"
                />
                {errors.against_name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.against_name}
                  </p>
                )}
              </div>
            )}

            {formData.against_role === 'department' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department (Optional)
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
                  placeholder="Enter department name"
                />
              </div>
            )}
          </div>

          {/* Complaint Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-800">Complaint Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complaint Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="complaint_type"
                  value={formData.complaint_type}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] ${
                    errors.complaint_type ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Type</option>
                  <option value="academic">Academic</option>
                  <option value="behaviour">Behaviour</option>
                  <option value="safety">Safety</option>
                  <option value="facility">Facility</option>
                  <option value="fee">Fee</option>
                  <option value="transport">Transport</option>
                  <option value="other">Other</option>
                </select>
                {errors.complaint_type && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.complaint_type}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="urgency_level"
                  value={formData.urgency_level}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="incident_date"
                  value={formData.incident_date}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] ${
                    errors.incident_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.incident_date && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.incident_date}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Brief title of your complaint"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Provide detailed information about your complaint..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* File Attachments */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-800">Attachments (Optional)</h3>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#1E88E5] transition-colors">
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload files (images, PDF, documents)
                </span>
                <span className="text-xs text-gray-500 mt-1">Max 10MB per file</span>
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">{files.length} file(s) selected</p>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t sticky bottom-0 bg-white">
            <Button type="button" onClick={onClose} variant="outline" disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-[#1E88E5] to-[#1976D2] min-w-[140px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Complaint'
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
