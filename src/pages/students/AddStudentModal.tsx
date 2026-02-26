// // // // import React, { useState } from 'react'
// // // // import { useForm } from 'react-hook-form'
// // // // import { zodResolver } from '@hookform/resolvers/zod'
// // // // import { z } from 'zod'
// // // // import { XIcon, CameraIcon, LoaderIcon } from 'lucide-react'
// // // // import { StudentService } from '../../services/studentService'
// // // // import { Student } from '../../types/Student'
// // // // import { ImageUpload } from './ImageUpload'

// // // // const studentSchema = z.object({
// // // //   full_name: z.string().min(2, 'Full name must be at least 2 characters'),
// // // //   class_name: z.string().min(1, 'Class is required'),
// // // //   roll_number: z.string().min(1, 'Roll number is required'),
// // // //   admission_number: z.string().min(1, 'Admission number is required'),
// // // //   gender: z.enum(['male', 'female', 'other']),
// // // //   date_of_birth: z.string().min(1, 'Date of birth is required'),
// // // //   address: z.string().min(5, 'Address must be at least 5 characters'),
// // // //   parent_name: z.string().min(2, 'Parent name is required'),
// // // //   parent_contact: z.string().min(10, 'Valid contact number is required'),
// // // //   email: z.string().email('Valid email is required').optional().or(z.literal('')),
// // // //   section: z.string().optional(),
// // // // })

// // // // type StudentFormData = z.infer<typeof studentSchema>

// // // // interface AddStudentModalProps {
// // // //   onClose: () => void
// // // //   onSuccess: () => void
// // // // }

// // // // export const AddStudentModal: React.FC<AddStudentModalProps> = ({ onClose, onSuccess }) => {
// // // //   const [loading, setLoading] = useState(false)
// // // //   const [profilePicture, setProfilePicture] = useState<File | null>(null)
// // // //   const [profilePictureUrl, setProfilePictureUrl] = useState<string>('')

// // // //   const {
// // // //     register,
// // // //     handleSubmit,
// // // //     formState: { errors },
// // // //     reset
// // // //   } = useForm<StudentFormData>({
// // // //     resolver: zodResolver(studentSchema)
// // // //   })

// // // //   const onSubmit = async (data: StudentFormData) => {
// // // //     try {
// // // //       setLoading(true)

// // // //       const studentData: Omit<Student, 'id' | 'created_at' | 'updated_at'> = {
// // // //         ...data,
// // // //         email: data.email || undefined,
// // // //         status: 'active',
// // // //         admission_year: new Date().getFullYear(),
// // // //         profile_picture: profilePictureUrl
// // // //       }

// // // //       const newStudent = await StudentService.createStudent(studentData)

// // // //       // Upload profile picture if provided
// // // //       if (profilePicture && newStudent.id) {
// // // //         const imageUrl = await StudentService.uploadProfilePicture(profilePicture, newStudent.id)
// // // //         await StudentService.updateStudent(newStudent.id, { profile_picture: imageUrl })
// // // //       }

// // // //       onSuccess()
// // // //       reset()
// // // //     } catch (error) {
// // // //       console.error('Error creating student:', error)
// // // //     } finally {
// // // //       setLoading(false)
// // // //     }
// // // //   }

// // // //   return (
// // // //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// // // //       <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
// // // //         {/* Header */}
// // // //         <div className="flex items-center justify-between p-6 border-b border-gray-200">
// // // //           <h2 className="text-xl font-semibold text-gray-900">Add New Student</h2>
// // // //           <button
// // // //             onClick={onClose}
// // // //             className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
// // // //           >
// // // //             <XIcon className="h-6 w-6" />
// // // //           </button>
// // // //         </div>

// // // //         {/* Form */}
// // // //         <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
// // // //           {/* Profile Picture Upload */}
// // // //           <div className="flex justify-center">
// // // //             <ImageUpload
// // // //               onImageSelect={(file, url) => {
// // // //                 setProfilePicture(file)
// // // //                 setProfilePictureUrl(url)
// // // //               }}
// // // //               currentImage={profilePictureUrl}
// // // //             />
// // // //           </div>

// // // //           {/* Form Grid */}
// // // //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // // //             {/* Full Name */}
// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-1">
// // // //                 Full Name *
// // // //               </label>
// // // //               <input
// // // //                 {...register('full_name')}
// // // //                 type="text"
// // // //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // // //                 placeholder="Enter full name"
// // // //               />
// // // //               {errors.full_name && (
// // // //                 <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
// // // //               )}
// // // //             </div>

// // // //             {/* Class */}
// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-1">
// // // //                 Class *
// // // //               </label>
// // // //               <select
// // // //                 {...register('class_name')}
// // // //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // // //               >
// // // //                 <option value="">Select Class</option>
// // // //                 <option value="1">Class 1</option>
// // // //                 <option value="2">Class 2</option>
// // // //                 <option value="3">Class 3</option>
// // // //                 <option value="4">Class 4</option>
// // // //                 <option value="5">Class 5</option>
// // // //                 <option value="6">Class 6</option>
// // // //                 <option value="7">Class 7</option>
// // // //                 <option value="8">Class 8</option>
// // // //                 <option value="9">Class 9</option>
// // // //                 <option value="10">Class 10</option>
// // // //                 <option value="11">Class 11</option>
// // // //                 <option value="12">Class 12</option>
// // // //               </select>
// // // //               {errors.class_name && (
// // // //                 <p className="text-red-500 text-sm mt-1">{errors.class_name.message}</p>
// // // //               )}
// // // //             </div>

// // // //             {/* Roll Number */}
// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-1">
// // // //                 Roll Number *
// // // //               </label>
// // // //               <input
// // // //                 {...register('roll_number')}
// // // //                 type="text"
// // // //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // // //                 placeholder="Enter roll number"
// // // //               />
// // // //               {errors.roll_number && (
// // // //                 <p className="text-red-500 text-sm mt-1">{errors.roll_number.message}</p>
// // // //               )}
// // // //             </div>

// // // //             {/* Admission Number */}
// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-1">
// // // //                 Admission Number *
// // // //               </label>
// // // //               <input
// // // //                 {...register('admission_number')}
// // // //                 type="text"
// // // //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // // //                 placeholder="Enter admission number"
// // // //               />
// // // //               {errors.admission_number && (
// // // //                 <p className="text-red-500 text-sm mt-1">{errors.admission_number.message}</p>
// // // //               )}
// // // //             </div>

// // // //             {/* Gender */}
// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-1">
// // // //                 Gender *
// // // //               </label>
// // // //               <select
// // // //                 {...register('gender')}
// // // //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // // //               >
// // // //                 <option value="">Select Gender</option>
// // // //                 <option value="male">Male</option>
// // // //                 <option value="female">Female</option>
// // // //                 <option value="other">Other</option>
// // // //               </select>
// // // //               {errors.gender && (
// // // //                 <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
// // // //               )}
// // // //             </div>

// // // //             {/* Date of Birth */}
// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-1">
// // // //                 Date of Birth *
// // // //               </label>
// // // //               <input
// // // //                 {...register('date_of_birth')}
// // // //                 type="date"
// // // //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // // //               />
// // // //               {errors.date_of_birth && (
// // // //                 <p className="text-red-500 text-sm mt-1">{errors.date_of_birth.message}</p>
// // // //               )}
// // // //             </div>

// // // //             {/* Section */}
// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-1">
// // // //                 Section
// // // //               </label>
// // // //               <select
// // // //                 {...register('section')}
// // // //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // // //               >
// // // //                 <option value="">Select Section</option>
// // // //                 <option value="A">Section A</option>
// // // //                 <option value="B">Section B</option>
// // // //                 <option value="C">Section C</option>
// // // //                 <option value="D">Section D</option>
// // // //               </select>
// // // //             </div>

// // // //             {/* Parent Name */}
// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-1">
// // // //                 Parent's Name * 👨‍👩‍👧
// // // //               </label>
// // // //               <input
// // // //                 {...register('parent_name')}
// // // //                 type="text"
// // // //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // // //                 placeholder="Enter parent's name"
// // // //               />
// // // //               {errors.parent_name && (
// // // //                 <p className="text-red-500 text-sm mt-1">{errors.parent_name.message}</p>
// // // //               )}
// // // //             </div>

// // // //             {/* Parent Contact */}
// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-1">
// // // //                 Parent's Contact *
// // // //               </label>
// // // //               <input
// // // //                 {...register('parent_contact')}
// // // //                 type="tel"
// // // //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // // //                 placeholder="Enter contact number"
// // // //               />
// // // //               {errors.parent_contact && (
// // // //                 <p className="text-red-500 text-sm mt-1">{errors.parent_contact.message}</p>
// // // //               )}
// // // //             </div>

// // // //             {/* Email */}
// // // //             <div className="md:col-span-2">
// // // //               <label className="block text-sm font-medium text-gray-700 mb-1">
// // // //                 Email (Optional)
// // // //               </label>
// // // //               <input
// // // //                 {...register('email')}
// // // //                 type="email"
// // // //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // // //                 placeholder="Enter email address"
// // // //               />
// // // //               {errors.email && (
// // // //                 <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
// // // //               )}
// // // //             </div>

// // // //             {/* Address */}
// // // //             <div className="md:col-span-2">
// // // //               <label className="block text-sm font-medium text-gray-700 mb-1">
// // // //                 Address *
// // // //               </label>
// // // //               <textarea
// // // //                 {...register('address')}
// // // //                 rows={3}
// // // //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // // //                 placeholder="Enter complete address"
// // // //               />
// // // //               {errors.address && (
// // // //                 <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
// // // //               )}
// // // //             </div>
// // // //           </div>

// // // //           {/* Actions */}
// // // //           <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
// // // //             <button
// // // //               type="button"
// // // //               onClick={onClose}
// // // //               className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
// // // //             >
// // // //               Cancel
// // // //             </button>
// // // //             <button
// // // //               type="submit"
// // // //               disabled={loading}
// // // //               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors duration-200"
// // // //             >
// // // //               {loading && <LoaderIcon className="h-4 w-4 animate-spin" />}
// // // //               <span>{loading ? 'Creating...' : 'Create Student'}</span>
// // // //             </button>
// // // //           </div>
// // // //         </form>
// // // //       </div>
// // // //     </div>
// // // //   )
// // // // }
// // // import React, { useState, useEffect } from 'react';
// // // import { motion, AnimatePresence } from 'framer-motion';
// // // import { useForm } from 'react-hook-form';
// // // import { zodResolver } from '@hookform/resolvers/zod';
// // // import { z } from 'zod';
// // // import { X, Loader, Camera } from 'lucide-react';
// // // import { StudentService } from '../../services/studentService';
// // // import { Student } from '../../types/Student';
// // // import { ImageUpload } from './ImageUpload';

// // // const studentSchema = z.object({
// // //   full_name: z.string().min(2, 'Full name must be at least 2 characters'),
// // //   class_name: z.string().min(1, 'Class is required'),
// // //   roll_number: z.string().min(1, 'Roll number is required'),
// // //   admission_number: z.string().min(1, 'Admission number is required'),
// // //   gender: z.enum(['male', 'female', 'other']),
// // //   date_of_birth: z.string().min(1, 'Date of birth is required'),
// // //   address: z.string().min(5, 'Address must be at least 5 characters'),
// // //   parent_name: z.string().min(2, 'Parent name is required'),
// // //   parent_contact: z.string().min(10, 'Valid contact number is required'),
// // //   email: z.string().email('Valid email is required').optional().or(z.literal('')),
// // //   section: z.string().optional(),
// // // });

// // // type StudentFormData = z.infer<typeof studentSchema>;

// // // interface AddStudentModalProps {
// // //   student?: Student | null;
// // //   onClose: () => void;
// // //   onSuccess: () => void;
// // // }

// // // export const AddStudentModal: React.FC<AddStudentModalProps> = ({
// // //   student,
// // //   onClose,
// // //   onSuccess,
// // // }) => {
// // //   const [loading, setLoading] = useState(false);
// // //   const [profilePicture, setProfilePicture] = useState<File | null>(null);
// // //   const [profilePictureUrl, setProfilePictureUrl] = useState<string>(
// // //     student?.profile_picture || ''
// // //   );

// // //   const {
// // //     register,
// // //     handleSubmit,
// // //     formState: { errors },
// // //     reset,
// // //   } = useForm<StudentFormData>({
// // //     resolver: zodResolver(studentSchema),
// // //     defaultValues: student || {},
// // //   });

// // //   const onSubmit = async (data: StudentFormData) => {
// // //     try {
// // //       setLoading(true);

// // //       if (student?.id) {
// // //         // Update existing student
// // //         await StudentService.updateStudent(student.id, {
// // //           ...data,
// // //           email: data.email || undefined,
// // //         });

// // //         if (profilePicture) {
// // //           const imageUrl = await StudentService.uploadProfilePicture(
// // //             profilePicture,
// // //             student.id
// // //           );
// // //           await StudentService.updateStudent(student.id, { profile_picture: imageUrl });
// // //         }
// // //       } else {
// // //         // Create new student
// // //         const studentData: Omit<Student, 'id' | 'created_at' | 'updated_at'> = {
// // //           ...data,
// // //           email: data.email || undefined,
// // //           status: 'active',
// // //           admission_year: new Date().getFullYear(),
// // //           profile_picture: profilePictureUrl,
// // //         };

// // //         const newStudent = await StudentService.createStudent(studentData);

// // //         if (profilePicture && newStudent.id) {
// // //           const imageUrl = await StudentService.uploadProfilePicture(
// // //             profilePicture,
// // //             newStudent.id
// // //           );
// // //           await StudentService.updateStudent(newStudent.id, { profile_picture: imageUrl });
// // //         }
// // //       }

// // //       onSuccess();
// // //       reset();
// // //     } catch (error) {
// // //       console.error('Error saving student:', error);
// // //       alert('Error saving student. Please try again.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <AnimatePresence>
// // //       <motion.div
// // //         initial={{ opacity: 0 }}
// // //         animate={{ opacity: 1 }}
// // //         exit={{ opacity: 0 }}
// // //         className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
// // //         onClick={onClose}
// // //       >
// // //         <motion.div
// // //           initial={{ scale: 0.9, y: 20 }}
// // //           animate={{ scale: 1, y: 0 }}
// // //           exit={{ scale: 0.9, y: 20 }}
// // //           transition={{ type: 'spring', duration: 0.5 }}
// // //           onClick={(e) => e.stopPropagation()}
// // //           className="bg-white rounded-[24px] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
// // //         >
// // //           {/* Header */}
// // //           <div className="flex items-center justify-between p-6 border-b border-gray-200">
// // //             <h2
// // //               className="text-gray-900"
// // //               style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.015em' }}
// // //             >
// // //               {student ? 'Edit Student' : 'Add New Student'}
// // //             </h2>
// // //             <motion.button
// // //               whileHover={{ scale: 1.1, rotate: 90 }}
// // //               whileTap={{ scale: 0.9 }}
// // //               onClick={onClose}
// // //               className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
// // //             >
// // //               <X className="h-6 w-6" />
// // //             </motion.button>
// // //           </div>

// // //           {/* Form */}
// // //           <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
// // //             {/* Profile Picture Upload */}
// // //             <div className="flex justify-center">
// // //               <ImageUpload
// // //                 onImageSelect={(file, url) => {
// // //                   setProfilePicture(file);
// // //                   setProfilePictureUrl(url);
// // //                 }}
// // //                 currentImage={profilePictureUrl}
// // //               />
// // //             </div>

// // //             {/* Form Grid */}
// // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
// // //               {/* Full Name */}
// // //               <div>
// // //                 <label
// // //                   className="block text-gray-700 mb-2"
// // //                   style={{ fontSize: '14px', fontWeight: 500 }}
// // //                 >
// // //                   Full Name *
// // //                 </label>
// // //                 <input
// // //                   {...register('full_name')}
// // //                   type="text"
// // //                   className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all duration-200 outline-none"
// // //                   placeholder="Enter full name"
// // //                   style={{ fontSize: '15px' }}
// // //                 />
// // //                 {errors.full_name && (
// // //                   <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
// // //                 )}
// // //               </div>

// // //               {/* Class */}
// // //               <div>
// // //                 <label
// // //                   className="block text-gray-700 mb-2"
// // //                   style={{ fontSize: '14px', fontWeight: 500 }}
// // //                 >
// // //                   Class *
// // //                 </label>
// // //                 <select
// // //                   {...register('class_name')}
// // //                   className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all duration-200 outline-none"
// // //                   style={{ fontSize: '15px' }}
// // //                 >
// // //                   <option value="">Select Class</option>
// // //                   {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
// // //                     <option key={num} value={num.toString()}>
// // //                       Class {num}
// // //                     </option>
// // //                   ))}
// // //                 </select>
// // //                 {errors.class_name && (
// // //                   <p className="text-red-500 text-sm mt-1">{errors.class_name.message}</p>
// // //                 )}
// // //               </div>

// // //               {/* Roll Number */}
// // //               <div>
// // //                 <label
// // //                   className="block text-gray-700 mb-2"
// // //                   style={{ fontSize: '14px', fontWeight: 500 }}
// // //                 >
// // //                   Roll Number *
// // //                 </label>
// // //                 <input
// // //                   {...register('roll_number')}
// // //                   type="text"
// // //                   className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all duration-200 outline-none"
// // //                   placeholder="Enter roll number"
// // //                   style={{ fontSize: '15px' }}
// // //                 />
// // //                 {errors.roll_number && (
// // //                   <p className="text-red-500 text-sm mt-1">{errors.roll_number.message}</p>
// // //                 )}
// // //               </div>

// // //               {/* Admission Number */}
// // //               <div>
// // //                 <label
// // //                   className="block text-gray-700 mb-2"
// // //                   style={{ fontSize: '14px', fontWeight: 500 }}
// // //                 >
// // //                   Admission Number *
// // //                 </label>
// // //                 <input
// // //                   {...register('admission_number')}
// // //                   type="text"
// // //                   className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all duration-200 outline-none"
// // //                   placeholder="Enter admission number"
// // //                   style={{ fontSize: '15px' }}
// // //                 />
// // //                 {errors.admission_number && (
// // //                   <p className="text-red-500 text-sm mt-1">
// // //                     {errors.admission_number.message}
// // //                   </p>
// // //                 )}
// // //               </div>

// // //               {/* Gender */}
// // //               <div>
// // //                 <label
// // //                   className="block text-gray-700 mb-2"
// // //                   style={{ fontSize: '14px', fontWeight: 500 }}
// // //                 >
// // //                   Gender *
// // //                 </label>
// // //                 <select
// // //                   {...register('gender')}
// // //                   className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all duration-200 outline-none"
// // //                   style={{ fontSize: '15px' }}
// // //                 >
// // //                   <option value="">Select Gender</option>
// // //                   <option value="male">Male</option>
// // //                   <option value="female">Female</option>
// // //                   <option value="other">Other</option>
// // //                 </select>
// // //                 {errors.gender && (
// // //                   <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
// // //                 )}
// // //               </div>

// // //               {/* Date of Birth */}
// // //               <div>
// // //                 <label
// // //                   className="block text-gray-700 mb-2"
// // //                   style={{ fontSize: '14px', fontWeight: 500 }}
// // //                 >
// // //                   Date of Birth *
// // //                 </label>
// // //                 <input
// // //                   {...register('date_of_birth')}
// // //                   type="date"
// // //                   className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all duration-200 outline-none"
// // //                   style={{ fontSize: '15px' }}
// // //                 />
// // //                 {errors.date_of_birth && (
// // //                   <p className="text-red-500 text-sm mt-1">{errors.date_of_birth.message}</p>
// // //                 )}
// // //               </div>

// // //               {/* Section */}
// // //               <div>
// // //                 <label
// // //                   className="block text-gray-700 mb-2"
// // //                   style={{ fontSize: '14px', fontWeight: 500 }}
// // //                 >
// // //                   Section
// // //                 </label>
// // //                 <select
// // //                   {...register('section')}
// // //                   className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all duration-200 outline-none"
// // //                   style={{ fontSize: '15px' }}
// // //                 >
// // //                   <option value="">Select Section</option>
// // //                   {['A', 'B', 'C', 'D'].map((section) => (
// // //                     <option key={section} value={section}>
// // //                       Section {section}
// // //                     </option>
// // //                   ))}
// // //                 </select>
// // //               </div>

// // //               {/* Parent Name */}
// // //               <div>
// // //                 <label
// // //                   className="block text-gray-700 mb-2"
// // //                   style={{ fontSize: '14px', fontWeight: 500 }}
// // //                 >
// // //                   Parent's Name *
// // //                 </label>
// // //                 <input
// // //                   {...register('parent_name')}
// // //                   type="text"
// // //                   className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all duration-200 outline-none"
// // //                   placeholder="Enter parent's name"
// // //                   style={{ fontSize: '15px' }}
// // //                 />
// // //                 {errors.parent_name && (
// // //                   <p className="text-red-500 text-sm mt-1">{errors.parent_name.message}</p>
// // //                 )}
// // //               </div>

// // //               {/* Parent Contact */}
// // //               <div>
// // //                 <label
// // //                   className="block text-gray-700 mb-2"
// // //                   style={{ fontSize: '14px', fontWeight: 500 }}
// // //                 >
// // //                   Parent's Contact *
// // //                 </label>
// // //                 <input
// // //                   {...register('parent_contact')}
// // //                   type="tel"
// // //                   className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all duration-200 outline-none"
// // //                   placeholder="Enter contact number"
// // //                   style={{ fontSize: '15px' }}
// // //                 />
// // //                 {errors.parent_contact && (
// // //                   <p className="text-red-500 text-sm mt-1">{errors.parent_contact.message}</p>
// // //                 )}
// // //               </div>

// // //               {/* Email */}
// // //               <div className="md:col-span-2">
// // //                 <label
// // //                   className="block text-gray-700 mb-2"
// // //                   style={{ fontSize: '14px', fontWeight: 500 }}
// // //                 >
// // //                   Email (Optional)
// // //                 </label>
// // //                 <input
// // //                   {...register('email')}
// // //                   type="email"
// // //                   className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all duration-200 outline-none"
// // //                   placeholder="Enter email address"
// // //                   style={{ fontSize: '15px' }}
// // //                 />
// // //                 {errors.email && (
// // //                   <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
// // //                 )}
// // //               </div>

// // //               {/* Address */}
// // //               <div className="md:col-span-2">
// // //                 <label
// // //                   className="block text-gray-700 mb-2"
// // //                   style={{ fontSize: '14px', fontWeight: 500 }}
// // //                 >
// // //                   Address *
// // //                 </label>
// // //                 <textarea
// // //                   {...register('address')}
// // //                   rows={3}
// // //                   className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all duration-200 outline-none resize-none"
// // //                   placeholder="Enter complete address"
// // //                   style={{ fontSize: '15px' }}
// // //                 />
// // //                 {errors.address && (
// // //                   <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
// // //                 )}
// // //               </div>
// // //             </div>

// // //             {/* Actions */}
// // //             <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
// // //               <motion.button
// // //                 whileHover={{ scale: 1.02 }}
// // //                 whileTap={{ scale: 0.98 }}
// // //                 type="button"
// // //                 onClick={onClose}
// // //                 className="px-6 py-2.5 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
// // //               >
// // //                 Cancel
// // //               </motion.button>
// // //               <motion.button
// // //                 whileHover={{ scale: 1.02 }}
// // //                 whileTap={{ scale: 0.98 }}
// // //                 type="submit"
// // //                 disabled={loading}
// // //                 className="px-6 py-2.5 gradient-primary text-white rounded-xl hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-200 font-medium"
// // //               >
// // //                 {loading && <Loader className="h-4 w-4 animate-spin" />}
// // //                 <span>{loading ? 'Saving...' : student ? 'Update Student' : 'Add Student'}</span>
// // //               </motion.button>
// // //             </div>
// // //           </form>
// // //         </motion.div>
// // //       </motion.div>
// // //     </AnimatePresence>
// // //   );
// // // };
// // import React, { useState, useEffect } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { useForm } from 'react-hook-form';
// // import { zodResolver } from '@hookform/resolvers/zod';
// // import { z } from 'zod';
// // import { X, Loader, Camera, AlertCircle } from 'lucide-react';
// // import { StudentService } from '../../services/studentService';
// // import { Student } from '../../types/Student';
// // import { ImageUpload } from './ImageUpload';

// // const studentSchema = z.object({
// //   full_name: z.string().min(2, 'Full name must be at least 2 characters'),
// //   class_name: z.string().min(1, 'Class is required'),
// //   roll_number: z.string().min(1, 'Roll number is required'),
// //   admission_number: z.string().min(1, 'Admission number is required'),
// //   gender: z.enum(['male', 'female', 'other']),
// //   date_of_birth: z.string().min(1, 'Date of birth is required'),
// //   address: z.string().min(5, 'Address must be at least 5 characters'),
// //   parent_name: z.string().min(2, 'Parent name is required'),
// //   parent_contact: z.string().min(10, 'Valid contact number is required'),
// //   email: z.string().email('Valid email is required').optional().or(z.literal('')),
// //   parent_email: z.string().email('Valid email is required').optional().or(z.literal('')),
// //   section: z.string().optional(),
// // }).refine((data) => {
// //   // Check if both emails exist and are not empty
// //   if (data.email && data.parent_email && data.email.trim() !== '' && data.parent_email.trim() !== '') {
// //     return data.email.toLowerCase() !== data.parent_email.toLowerCase();
// //   }
// //   return true;
// // }, {
// //   message: 'Student email and parent email must be different',
// //   path: ['parent_email'], // This will show the error on parent_email field
// // });

// // type StudentFormData = z.infer<typeof studentSchema>;

// // interface AddStudentModalProps {
// //   student?: Student | null;
// //   onClose: () => void;
// //   onSuccess: () => void;
// // }

// // export const AddStudentModal: React.FC<AddStudentModalProps> = ({
// //   student,
// //   onClose,
// //   onSuccess,
// // }) => {
// //   const [loading, setLoading] = useState(false);
// //   const [profilePicture, setProfilePicture] = useState<File | null>(null);
// //   const [profilePictureUrl, setProfilePictureUrl] = useState(
// //     student?.profile_picture || ''
// //   );
// //   const [emailWarning, setEmailWarning] = useState('');

// //   const {
// //     register,
// //     handleSubmit,
// //     formState: { errors },
// //     reset,
// //     watch,
// //   } = useForm<StudentFormData>({
// //     resolver: zodResolver(studentSchema),
// //     defaultValues: student || {},
// //   });

// //   // Watch both email fields for real-time validation
// //   const studentEmail = watch('email');
// //   const parentEmail = watch('parent_email');

// //   // Real-time email validation
// //   useEffect(() => {
// //     if (studentEmail && parentEmail && studentEmail.trim() !== '' && parentEmail.trim() !== '') {
// //       if (studentEmail.toLowerCase() === parentEmail.toLowerCase()) {
// //         setEmailWarning('⚠️ Student and parent emails must be different');
// //       } else {
// //         setEmailWarning('');
// //       }
// //     } else {
// //       setEmailWarning('');
// //     }
// //   }, [studentEmail, parentEmail]);

// //   const onSubmit = async (data: StudentFormData) => {
// //     try {
// //       setLoading(true);

// //       if (student?.id) {
// //         // Update existing student
// //         await StudentService.updateStudent(student.id, {
// //           ...data,
// //           email: data.email || undefined,
// //           parent_email: data.parent_email || undefined,
// //         });

// //         if (profilePicture) {
// //           const imageUrl = await StudentService.uploadProfilePicture(
// //             profilePicture,
// //             student.id
// //           );
// //           await StudentService.updateStudent(student.id, { profile_picture: imageUrl });
// //         }
// //       } else {
// //         // Create new student
// //         const studentData: Omit<Student, 'id' | 'created_at' | 'updated_at'> = {
// //           ...data,
// //           email: data.email || undefined,
// //           parent_email: data.parent_email || undefined,
// //           status: 'active',
// //           admission_year: new Date().getFullYear(),
// //           profile_picture: profilePictureUrl,
// //         };

// //         const newStudent = await StudentService.createStudent(studentData);

// //         if (profilePicture && newStudent.id) {
// //           const imageUrl = await StudentService.uploadProfilePicture(
// //             profilePicture,
// //             newStudent.id
// //           );
// //           await StudentService.updateStudent(newStudent.id, { profile_picture: imageUrl });
// //         }
// //       }

// //       onSuccess();
// //       reset();
// //     } catch (error) {
// //       console.error('Error saving student:', error);
// //       alert('Error saving student. Please try again.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <AnimatePresence>
// //       <motion.div
// //         initial={{ opacity: 0 }}
// //         animate={{ opacity: 1 }}
// //         exit={{ opacity: 0 }}
// //         className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
// //         onClick={onClose}
// //       >
// //         <motion.div
// //           initial={{ scale: 0.9, opacity: 0 }}
// //           animate={{ scale: 1, opacity: 1 }}
// //           exit={{ scale: 0.9, opacity: 0 }}
// //           onClick={(e) => e.stopPropagation()}
// //           className="bg-white rounded-[24px] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
// //         >
// //           {/* Header */}
// //           <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-[24px] flex justify-between items-center z-10">
// //             <h2 className="text-2xl font-bold">
// //               {student ? 'Edit Student' : 'Add New Student'}
// //             </h2>
// //             <button
// //               onClick={onClose}
// //               className="hover:bg-white/20 p-2 rounded-full transition-colors"
// //             >
// //               <X className="w-6 h-6" />
// //             </button>
// //           </div>

// //           {/* Form */}
// //           <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
// //             {/* Profile Picture Upload */}
// //             <div className="flex justify-center">
// //               <ImageUpload
// //                 onUpload={(file, url) => {
// //                   setProfilePicture(file);
// //                   setProfilePictureUrl(url);
// //                 }}
// //                 currentImage={profilePictureUrl}
// //               />
// //             </div>

// //             {/* Form Grid */}
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               {/* Full Name */}
// //               <div className="md:col-span-2">
// //                 <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                   Full Name *
// //                 </label>
// //                 <input
// //                   {...register('full_name')}
// //                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
// //                   placeholder="Enter full name"
// //                 />
// //                 {errors.full_name && (
// //                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
// //                     <AlertCircle className="w-4 h-4" />
// //                     {errors.full_name.message}
// //                   </p>
// //                 )}
// //               </div>

// //               {/* Class */}
// //               <div>
// //                 <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                   Class *
// //                 </label>
// //                 <select
// //                   {...register('class_name')}
// //                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
// //                 >
// //                   <option value="">Select Class</option>
// //                   {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
// //                     <option key={num} value={num}>
// //                       Class {num}
// //                     </option>
// //                   ))}
// //                 </select>
// //                 {errors.class_name && (
// //                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
// //                     <AlertCircle className="w-4 h-4" />
// //                     {errors.class_name.message}
// //                   </p>
// //                 )}
// //               </div>

// //               {/* Roll Number */}
// //               <div>
// //                 <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                   Roll Number *
// //                 </label>
// //                 <input
// //                   {...register('roll_number')}
// //                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
// //                   placeholder="Enter roll number"
// //                 />
// //                 {errors.roll_number && (
// //                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
// //                     <AlertCircle className="w-4 h-4" />
// //                     {errors.roll_number.message}
// //                   </p>
// //                 )}
// //               </div>

// //               {/* Admission Number */}
// //               <div>
// //                 <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                   Admission Number *
// //                 </label>
// //                 <input
// //                   {...register('admission_number')}
// //                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
// //                   placeholder="Enter admission number"
// //                 />
// //                 {errors.admission_number && (
// //                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
// //                     <AlertCircle className="w-4 h-4" />
// //                     {errors.admission_number.message}
// //                   </p>
// //                 )}
// //               </div>

// //               {/* Gender */}
// //               <div>
// //                 <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                   Gender *
// //                 </label>
// //                 <select
// //                   {...register('gender')}
// //                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
// //                 >
// //                   <option value="">Select Gender</option>
// //                   <option value="male">Male</option>
// //                   <option value="female">Female</option>
// //                   <option value="other">Other</option>
// //                 </select>
// //                 {errors.gender && (
// //                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
// //                     <AlertCircle className="w-4 h-4" />
// //                     {errors.gender.message}
// //                   </p>
// //                 )}
// //               </div>

// //               {/* Date of Birth */}
// //               <div>
// //                 <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                   Date of Birth *
// //                 </label>
// //                 <input
// //                   type="date"
// //                   {...register('date_of_birth')}
// //                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
// //                 />
// //                 {errors.date_of_birth && (
// //                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
// //                     <AlertCircle className="w-4 h-4" />
// //                     {errors.date_of_birth.message}
// //                   </p>
// //                 )}
// //               </div>

// //               {/* Section */}
// //               <div>
// //                 <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                   Section
// //                 </label>
// //                 <select
// //                   {...register('section')}
// //                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
// //                 >
// //                   <option value="">Select Section</option>
// //                   {['A', 'B', 'C', 'D'].map((section) => (
// //                     <option key={section} value={section}>
// //                       Section {section}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>

// //               {/* Parent Name */}
// //               <div>
// //                 <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                   Parent's Name *
// //                 </label>
// //                 <input
// //                   {...register('parent_name')}
// //                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
// //                   placeholder="Enter parent's name"
// //                 />
// //                 {errors.parent_name && (
// //                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
// //                     <AlertCircle className="w-4 h-4" />
// //                     {errors.parent_name.message}
// //                   </p>
// //                 )}
// //               </div>

// //               {/* Parent Contact */}
// //               <div>
// //                 <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                   Parent's Contact *
// //                 </label>
// //                 <input
// //                   {...register('parent_contact')}
// //                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
// //                   placeholder="Enter parent's contact"
// //                 />
// //                 {errors.parent_contact && (
// //                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
// //                     <AlertCircle className="w-4 h-4" />
// //                     {errors.parent_contact.message}
// //                   </p>
// //                 )}
// //               </div>

// //               {/* Student Email */}
// //               <div>
// //                 <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                   Student Email <span className="text-blue-600 text-xs">(Optional)</span>
// //                 </label>
// //                 <input
// //                   type="email"
// //                   {...register('email')}
// //                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
// //                   placeholder="Enter student's email"
// //                 />
// //                 {errors.email && (
// //                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
// //                     <AlertCircle className="w-4 h-4" />
// //                     {errors.email.message}
// //                   </p>
// //                 )}
// //               </div>

// //               {/* Parent Email */}
// //               <div>
// //                 <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                   Parent Email <span className="text-blue-600 text-xs">(Optional)</span>
// //                 </label>
// //                 <input
// //                   type="email"
// //                   {...register('parent_email')}
// //                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
// //                   placeholder="Enter parent's email"
// //                 />
// //                 {errors.parent_email && (
// //                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
// //                     <AlertCircle className="w-4 h-4" />
// //                     {errors.parent_email.message}
// //                   </p>
// //                 )}
// //               </div>

// //               {/* Email Warning Message */}
// //               {emailWarning && (
// //                 <div className="md:col-span-2">
// //                   <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 flex items-start gap-3">
// //                     <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
// //                     <p className="text-yellow-800 text-sm font-medium">
// //                       {emailWarning}
// //                     </p>
// //                   </div>
// //                 </div>
// //               )}

// //               {/* Address */}
// //               <div className="md:col-span-2">
// //                 <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                   Address *
// //                 </label>
// //                 <textarea
// //                   {...register('address')}
// //                   rows={3}
// //                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
// //                   placeholder="Enter full address"
// //                 />
// //                 {errors.address && (
// //                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
// //                     <AlertCircle className="w-4 h-4" />
// //                     {errors.address.message}
// //                   </p>
// //                 )}
// //               </div>
// //             </div>

// //             {/* Actions */}
// //             <div className="flex gap-4 justify-end pt-4 border-t">
// //               <button
// //                 type="button"
// //                 onClick={onClose}
// //                 className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-colors font-semibold"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 type="submit"
// //                 disabled={loading || !!emailWarning}
// //                 className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
// //               >
// //                 {loading && <Loader className="w-5 h-5 animate-spin" />}
// //                 {loading ? 'Saving...' : student ? 'Update Student' : 'Add Student'}
// //               </button>
// //             </div>
// //           </form>
// //         </motion.div>
// //       </motion.div>
// //     </AnimatePresence>
// //   );
// // };
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { X, Loader, Camera, AlertCircle } from 'lucide-react';
// import { StudentService } from '../../services/studentService';
// import { Student } from '../../types/Student';
// import { ImageUpload } from './ImageUpload';

// const studentSchema = z.object({
//   full_name: z.string().min(2, 'Full name must be at least 2 characters'),
//   class_name: z.string().min(1, 'Class is required'),
//   roll_number: z.string().min(1, 'Roll number is required'),
//   admission_number: z.string().min(1, 'Admission number is required'),
//   gender: z.enum(['male', 'female', 'other']),
//   date_of_birth: z.string().min(1, 'Date of birth is required'),
//   address: z.string().min(5, 'Address must be at least 5 characters'),
//   parent_name: z.string().min(2, 'Parent name is required'),
//   parent_contact: z.string().min(10, 'Valid contact number is required'),
//   email: z.string().email('Valid email is required').optional().or(z.literal('')),
//   parent_email: z.string().email('Valid email is required').optional().or(z.literal('')),
//   section: z.string().optional(),
// }).refine((data) => {
//   // Check if both emails exist and are not empty
//   if (data.email && data.parent_email && data.email.trim() !== '' && data.parent_email.trim() !== '') {
//     return data.email.toLowerCase() !== data.parent_email.toLowerCase();
//   }
//   return true;
// }, {
//   message: 'Student email and parent email must be different',
//   path: ['parent_email'],
// });

// type StudentFormData = z.infer<typeof studentSchema>;

// interface AddStudentModalProps {
//   student?: Student | null;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// export const AddStudentModal: React.FC<AddStudentModalProps> = ({
//   student,
//   onClose,
//   onSuccess,
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [profilePicture, setProfilePicture] = useState<File | null>(null);
//   const [profilePictureUrl, setProfilePictureUrl] = useState(
//     student?.profile_picture || ''
//   );
//   const [emailWarning, setEmailWarning] = useState('');

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     watch,
//   } = useForm<StudentFormData>({
//     resolver: zodResolver(studentSchema),
//     defaultValues: student || {},
//   });

//   // Watch both email fields for real-time validation
//   const studentEmail = watch('email');
//   const parentEmail = watch('parent_email');

//   // Real-time email validation
//   useEffect(() => {
//     if (studentEmail && parentEmail && studentEmail.trim() !== '' && parentEmail.trim() !== '') {
//       if (studentEmail.toLowerCase() === parentEmail.toLowerCase()) {
//         setEmailWarning('⚠️ Student and parent emails must be different');
//       } else {
//         setEmailWarning('');
//       }
//     } else {
//       setEmailWarning('');
//     }
//   }, [studentEmail, parentEmail]);

//   const onSubmit = async (data: StudentFormData) => {
//     try {
//       setLoading(true);

//       if (student?.id) {
//         await StudentService.updateStudent(student.id, {
//           ...data,
//           email: data.email || undefined,
//           parent_email: data.parent_email || undefined,
//         });

//         if (profilePicture) {
//           const imageUrl = await StudentService.uploadProfilePicture(
//             profilePicture,
//             student.id
//           );
//           await StudentService.updateStudent(student.id, { profile_picture: imageUrl });
//         }
//       } else {
//         const studentData: Omit<Student, 'id' | 'created_at' | 'updated_at'> = {
//           ...data,
//           email: data.email || undefined,
//           parent_email: data.parent_email || undefined,
//           status: 'active',
//           admission_year: new Date().getFullYear(),
//           profile_picture: profilePictureUrl,
//         };

//         const newStudent = await StudentService.createStudent(studentData);

//         if (profilePicture && newStudent.id) {
//           const imageUrl = await StudentService.uploadProfilePicture(
//             profilePicture,
//             newStudent.id
//           );
//           await StudentService.updateStudent(newStudent.id, { profile_picture: imageUrl });
//         }
//       }

//       onSuccess();
//       reset();
//     } catch (error) {
//       console.error('Error saving student:', error);
//       alert('Error saving student. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//         onClick={onClose}
//       >
//         <motion.div
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           exit={{ scale: 0.9, opacity: 0 }}
//           onClick={(e) => e.stopPropagation()}
//           className="bg-white rounded-[24px] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
//         >
//           {/* Header */}
//           <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-[24px] flex justify-between items-center z-10">
//             <h2 className="text-2xl font-bold">
//               {student ? 'Edit Student' : 'Add New Student'}
//             </h2>
//             <button
//               onClick={onClose}
//               className="hover:bg-white/20 p-2 rounded-full transition-colors"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
//             {/* Profile Picture Upload - CORRECTED */}
//             <div className="flex justify-center">
//               <ImageUpload
//                 onImageSelect={(file: File, url: string) => {
//                   setProfilePicture(file);
//                   setProfilePictureUrl(url);
//                 }}
//                 currentImage={profilePictureUrl}
//               />
//             </div>

//             {/* Form Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Full Name */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Full Name *
//                 </label>
//                 <input
//                   {...register('full_name')}
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
//                   placeholder="Enter full name"
//                 />
//                 {errors.full_name && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     {errors.full_name.message}
//                   </p>
//                 )}
//               </div>

//               {/* Class */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Class *
//                 </label>
//                 <select
//                   {...register('class_name')}
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
//                 >
//                   <option value="">Select Class</option>
//                   {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
//                     <option key={num} value={num}>
//                       Class {num}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.class_name && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     {errors.class_name.message}
//                   </p>
//                 )}
//               </div>

//               {/* Roll Number */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Roll Number *
//                 </label>
//                 <input
//                   {...register('roll_number')}
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
//                   placeholder="Enter roll number"
//                 />
//                 {errors.roll_number && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     {errors.roll_number.message}
//                   </p>
//                 )}
//               </div>

//               {/* Admission Number */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Admission Number *
//                 </label>
//                 <input
//                   {...register('admission_number')}
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
//                   placeholder="Enter admission number"
//                 />
//                 {errors.admission_number && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     {errors.admission_number.message}
//                   </p>
//                 )}
//               </div>

//               {/* Gender */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Gender *
//                 </label>
//                 <select
//                   {...register('gender')}
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                   <option value="other">Other</option>
//                 </select>
//                 {errors.gender && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     {errors.gender.message}
//                   </p>
//                 )}
//               </div>

//               {/* Date of Birth */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Date of Birth *
//                 </label>
//                 <input
//                   type="date"
//                   {...register('date_of_birth')}
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
//                 />
//                 {errors.date_of_birth && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     {errors.date_of_birth.message}
//                   </p>
//                 )}
//               </div>

//               {/* Section */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Section
//                 </label>
//                 <select
//                   {...register('section')}
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
//                 >
//                   <option value="">Select Section</option>
//                   {['A', 'B', 'C', 'D'].map((section) => (
//                     <option key={section} value={section}>
//                       Section {section}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Parent Name */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Parent's Name *
//                 </label>
//                 <input
//                   {...register('parent_name')}
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
//                   placeholder="Enter parent's name"
//                 />
//                 {errors.parent_name && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     {errors.parent_name.message}
//                   </p>
//                 )}
//               </div>

//               {/* Parent Contact */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Parent's Contact *
//                 </label>
//                 <input
//                   {...register('parent_contact')}
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
//                   placeholder="Enter parent's contact"
//                 />
//                 {errors.parent_contact && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     {errors.parent_contact.message}
//                   </p>
//                 )}
//               </div>

//               {/* Student Email */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Student Email <span className="text-blue-600 text-xs">(Optional)</span>
//                 </label>
//                 <input
//                   type="email"
//                   {...register('email')}
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
//                   placeholder="Enter student's email"
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     {errors.email.message}
//                   </p>
//                 )}
//               </div>

//               {/* Parent Email */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Parent Email <span className="text-blue-600 text-xs">(Optional)</span>
//                 </label>
//                 <input
//                   type="email"
//                   {...register('parent_email')}
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
//                   placeholder="Enter parent's email"
//                 />
//                 {errors.parent_email && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     {errors.parent_email.message}
//                   </p>
//                 )}
//               </div>

//               {/* Email Warning Message */}
//               {emailWarning && (
//                 <div className="md:col-span-2">
//                   <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 flex items-start gap-3">
//                     <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
//                     <p className="text-yellow-800 text-sm font-medium">
//                       {emailWarning}
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* Address */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Address *
//                 </label>
//                 <textarea
//                   {...register('address')}
//                   rows={3}
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
//                   placeholder="Enter full address"
//                 />
//                 {errors.address && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     {errors.address.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="flex gap-4 justify-end pt-4 border-t">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-colors font-semibold"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading || !!emailWarning}
//                 className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//               >
//                 {loading && <Loader className="w-5 h-5 animate-spin" />}
//                 {loading ? 'Saving...' : student ? 'Update Student' : 'Add Student'}
//               </button>
//             </div>
//           </form>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader, Camera, AlertCircle } from 'lucide-react';
import { StudentService } from '../../services/studentService';
import { Student } from '../../types/Student';
import { ImageUpload } from './ImageUpload';

// Schema with REQUIRED emails and validation
const studentSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  class_name: z.string().min(1, 'Class is required'),
  roll_number: z.string().min(1, 'Roll number is required'),
  admission_number: z.string().min(1, 'Admission number is required'),
  gender: z.enum(['male', 'female', 'other']),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  parent_name: z.string().min(2, 'Parent name is required'),
  parent_contact: z.string().min(10, 'Valid contact number is required'),
  email: z.string().min(1, 'Student email is required').email('Valid email is required'),
  parent_email: z.string().min(1, 'Parent email is required').email('Valid parent email is required'),
  section: z.string().optional(),
}).refine((data) => {
  // Ensure student and parent emails are different
  return data.email.toLowerCase() !== data.parent_email.toLowerCase();
}, {
  message: 'Student email and parent email must be different',
  path: ['parent_email'],
});

type StudentFormData = z.infer<typeof studentSchema>;

interface AddStudentModalProps {
  student?: Student | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  student,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    student?.profile_picture || ''
  );
  const [emailWarning, setEmailWarning] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: student || {},
  });

  // Watch both email fields for real-time validation
  const studentEmail = watch('email');
  const parentEmail = watch('parent_email');

  // Real-time email validation
  useEffect(() => {
    if (studentEmail && parentEmail && studentEmail.trim() !== '' && parentEmail.trim() !== '') {
      if (studentEmail.toLowerCase() === parentEmail.toLowerCase()) {
        setEmailWarning('⚠️ Student and parent emails must be different');
      } else {
        setEmailWarning('');
      }
    } else {
      setEmailWarning('');
    }
  }, [studentEmail, parentEmail]);

  const onSubmit = async (data: StudentFormData) => {
    try {
      setLoading(true);

      if (student?.id) {
        // Update existing student
        await StudentService.updateStudent(student.id, {
          ...data,
          email: data.email,
          parent_email: data.parent_email,
        });

        if (profilePicture) {
          const imageUrl = await StudentService.uploadProfilePicture(
            profilePicture,
            student.id
          );
          await StudentService.updateStudent(student.id, { profile_picture: imageUrl });
        }
      } else {
        // Create new student
        const studentData: Omit<Student, 'id' | 'created_at' | 'updated_at'> = {
          ...data,
          email: data.email,
          parent_email: data.parent_email,
          status: 'active',
          admission_year: new Date().getFullYear(),
          profile_picture: profilePictureUrl,
        };

        const newStudent = await StudentService.createStudent(studentData);

        if (profilePicture && newStudent.id) {
          const imageUrl = await StudentService.uploadProfilePicture(
            profilePicture,
            newStudent.id
          );
          await StudentService.updateStudent(newStudent.id, { profile_picture: imageUrl });
        }
      }

      onSuccess();
      reset();
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Error saving student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-[24px] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-[24px] flex justify-between items-center z-10">
            <h2 className="text-2xl font-bold">
              {student ? 'Edit Student' : 'Add New Student'}
            </h2>
            <button
              onClick={onClose}
              className="hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Profile Picture Upload */}
            <div className="flex justify-center">
              <ImageUpload
                onImageSelect={(file: File, url: string) => {
                  setProfilePicture(file);
                  setProfilePictureUrl(url);
                }}
                currentImage={profilePictureUrl}
              />
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                  Full Name *
                </label>
                <input
                  {...register('full_name')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all duration-200 outline-none"
                  placeholder="Enter full name"
                  style={{ fontSize: '15px' }}
                />
                {errors.full_name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              {/* Class */}
              <div>
                <label className="block text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                  Class *
                </label>
                <select
                  {...register('class_name')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all duration-200 outline-none"
                  style={{ fontSize: '15px' }}
                >
                  <option value="">Select Class</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                    <option key={num} value={num}>
                      Class {num}
                    </option>
                  ))}
                </select>
                {errors.class_name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.class_name.message}
                  </p>
                )}
              </div>

              {/* Roll Number */}
              <div>
                <label className="block text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                  Roll Number *
                </label>
                <input
                  {...register('roll_number')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all duration-200 outline-none"
                  placeholder="Enter roll number"
                  style={{ fontSize: '15px' }}
                />
                {errors.roll_number && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.roll_number.message}
                  </p>
                )}
              </div>

              {/* Admission Number */}
              <div>
                <label className="block text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                  Admission Number *
                </label>
                <input
                  {...register('admission_number')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all duration-200 outline-none"
                  placeholder="Enter admission number"
                  style={{ fontSize: '15px' }}
                />
                {errors.admission_number && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.admission_number.message}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                  Gender *
                </label>
                <select
                  {...register('gender')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all duration-200 outline-none"
                  style={{ fontSize: '15px' }}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.gender.message}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                  Date of Birth *
                </label>
                <input
                  type="date"
                  {...register('date_of_birth')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all duration-200 outline-none"
                  style={{ fontSize: '15px' }}
                />
                {errors.date_of_birth && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.date_of_birth.message}
                  </p>
                )}
              </div>

              {/* Section */}
              <div>
                <label className="block text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                  Section
                </label>
                <select
                  {...register('section')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all duration-200 outline-none"
                  style={{ fontSize: '15px' }}
                >
                  <option value="">Select Section</option>
                  {['A', 'B', 'C', 'D'].map((section) => (
                    <option key={section} value={section}>
                      Section {section}
                    </option>
                  ))}
                </select>
              </div>

              {/* Parent Name */}
              <div>
                <label className="block text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                  Parent's Name *
                </label>
                <input
                  {...register('parent_name')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all duration-200 outline-none"
                  placeholder="Enter parent's name"
                  style={{ fontSize: '15px' }}
                />
                {errors.parent_name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.parent_name.message}
                  </p>
                )}
              </div>

              {/* Parent Contact */}
              <div>
                <label className="block text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                  Parent's Contact *
                </label>
                <input
                  {...register('parent_contact')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all duration-200 outline-none"
                  placeholder="Enter parent's contact"
                  style={{ fontSize: '15px' }}
                />
                {errors.parent_contact && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.parent_contact.message}
                  </p>
                )}
              </div>

              {/* Student Email - REQUIRED */}
              <div>
                <label className="block text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                  Student Email *
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all duration-200 outline-none"
                  placeholder="student@example.com"
                  style={{ fontSize: '15px' }}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Parent Email - REQUIRED */}
              <div>
                <label className="block text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                  Parent Email *
                </label>
                <input
                  type="email"
                  {...register('parent_email')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all duration-200 outline-none"
                  placeholder="parent@example.com"
                  style={{ fontSize: '15px' }}
                />
                {errors.parent_email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.parent_email.message}
                  </p>
                )}
              </div>

              {/* Email Warning Message */}
              {emailWarning && (
                <div className="md:col-span-2">
                  <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-yellow-800 text-sm font-medium">
                      {emailWarning}
                    </p>
                  </div>
                </div>
              )}

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                  Address *
                </label>
                <textarea
                  {...register('address')}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] transition-all duration-200 outline-none resize-none"
                  placeholder="Enter full address"
                  style={{ fontSize: '15px' }}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-end pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-colors font-medium"
                style={{ fontSize: '15px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !!emailWarning}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{ fontSize: '15px' }}
              >
                {loading && <Loader className="h-4 w-4 animate-spin" />}
                <span>{loading ? 'Saving...' : student ? 'Update Student' : 'Add Student'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
