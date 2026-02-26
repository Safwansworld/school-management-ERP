// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   ChevronLeft,
//   ChevronRight,
//   Calendar,
//   Clock,
//   Plus,
//   Edit2,
//   Trash2,
//   Users,
//   MapPin,
//   Save,
//   X,
//   UserCheck,
//   AlertTriangle,
// } from 'lucide-react';
// import { Button } from '../../components/ui/button';
// import { Badge } from '../../components/ui/badge';
// import { useAuth } from '../../context/AuthContext';
// import { supabase } from '../../lib/supabase';
// import { toast } from 'sonner';

// // ------- INTERFACE & TYPE DEFINITIONS -------
// interface TimeSlot {
//   id?: string;
//   class_id: string;
//   class_name: string;
//   day: string;
//   start_time: string;
//   end_time: string;
//   subject: string;
//   teacher_id: string;
//   teacher_name: string;
//   room_number: string;
//   academic_year: string;
//   color?: string;
//   duration?: number;
// }

// interface Teacher {
//   id: string;
//   full_name: string;
//   employee_id: string;
//   subject_specialization: string;
//   status: string;
// }

// interface Class {
//   id: string;
//   class_name: string;
//   section?: string;
// }

// interface ConflictInfo {
//   type: 'teacher' | 'room' | 'class';
//   message: string;
//   slots: TimeSlot[];
// }

// // ------- UTILITY FUNCTIONS -------
// const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// const timeSlots = [
//   '8:00 AM',
//   '9:00 AM',
//   '10:00 AM',
//   '11:00 AM',
//   '12:00 PM',
//   '1:00 PM',
//   '2:00 PM',
//   '3:00 PM',
//   '4:00 PM',
// ];

// const subjectColors: { [key: string]: string } = {
//   Mathematics: '#1E88E5',
//   Physics: '#7B1FA2',
//   Chemistry: '#00897B',
//   Biology: '#43A047',
//   English: '#F57C00',
//   History: '#E53935',
//   Geography: '#00ACC1',
//   'Computer Science': '#5B9FFF',
//   'Physical Education': '#F4511E',
//   Arts: '#8E24AA',
//   Music: '#D81B60',
//   Break: '#9E9E9E',
//   Lunch: '#9E9E9E',
// };

// const getSubjectColor = (subject: string): string => subjectColors[subject] || '#607D8B';

// const parseTime = (timeStr: string): Date => {
//   const [time, period] = timeStr.split(' ');
//   let [hours, minutes] = time.split(':').map(Number);
//   if (period === 'PM' && hours !== 12) hours += 12;
//   if (period === 'AM' && hours === 12) hours = 0;
//   const date = new Date();
//   date.setHours(hours, minutes, 0, 0);
//   return date;
// };

// const checkTimeOverlap = (
//   start1: string,
//   end1: string,
//   start2: string,
//   end2: string
// ): boolean => {
//   const s1 = parseTime(start1);
//   const e1 = parseTime(end1);
//   const s2 = parseTime(start2);
//   const e2 = parseTime(end2);
//   return s1 < e2 && s2 < e1;
// };

// // ------- MAIN COMPONENT -------
// export default function Timetable() {
//   const { userProfile, isAdmin, isTeacher, isStudent } = useAuth();

//   const [selectedDay, setSelectedDay] = useState('Monday');
//   const [selectedClass, setSelectedClass] = useState<string>('');
//   const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('');
//   const [academicYears, setAcademicYears] = useState<string[]>([]);
//   const [classes, setClasses] = useState<Class[]>([]);
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [schedule, setSchedule] = useState<TimeSlot[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [conflicts, setConflicts] = useState<ConflictInfo[]>([]);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);

//   const [formData, setFormData] = useState<Partial<TimeSlot>>({
//     day: 'Monday',
//     start_time: '9:00 AM',
//     end_time: '10:00 AM',
//     subject: '',
//     teacher_id: '',
//     room_number: '',
//   });

//   // ------- DATA FETCHING -------
//   useEffect(() => {
//     fetchInitialData();
//   }, [userProfile]);

//   useEffect(() => {
//     if (selectedAcademicYear && !isStudent) {
//       fetchClassesForYear();
//     }
//   }, [selectedAcademicYear]);

//   useEffect(() => {
//     if (selectedClass && selectedAcademicYear) {
//       fetchSchedule();
//     }
//   }, [selectedClass, selectedAcademicYear]);

//   useEffect(() => {
//     if (schedule.length > 0) detectConflicts();
//   }, [schedule]);

//   const fetchAcademicYears = async () => {
//     try {
//       // ✅ FIXED: Fetch from class_assignments instead of timetable
//       const { data, error } = await supabase
//         .from('class_assignments')
//         .select('academic_year')
//         .order('academic_year', { ascending: false });

//       if (error) throw error;

//       if (data) {
//         // Get unique academic years
//         const uniqueYears = [...new Set(data.map(item => item.academic_year))];
//         setAcademicYears(uniqueYears);

//         // Auto-select current year if it exists
//         const currentYear = new Date().getFullYear().toString();
//         if (uniqueYears.includes(currentYear)) {
//           setSelectedAcademicYear(currentYear);
//         } else if (uniqueYears.length > 0) {
//           setSelectedAcademicYear(uniqueYears[0]);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching academic years:', error);
//     }
//   };

//   const fetchInitialData = async () => {
//     try {
//       setLoading(true);

//       // 🧩 STUDENT ROLE LOGIC - FIXED
//       if (isStudent && userProfile?.id) {
//         try {
//           console.log('Student auth user ID:', userProfile.id);

//           // 1️⃣ Get student_id from student_profiles (id IS the user_id)
//           const { data: studentProfile, error: studentProfileError } = await supabase
//             .from('student_profiles')
//             .select('student_id')
//             .eq('id', userProfile.id) // ✅ Primary key IS user_id
//             .single();

//           if (studentProfileError || !studentProfile) {
//             console.error('Student profile error:', studentProfileError);
//             toast.error('Student profile not found');
//             setLoading(false);
//             return;
//           }

//           const studentId = studentProfile.student_id;
//           console.log('Found student_id:', studentId);

//           // 2️⃣ Get class assignment with academic year
//           const { data: assignment, error: assignmentError } = await supabase
//             .from('class_assignments')
//             .select('class_id, academic_year')
//             .eq('student_id', studentId)
//             .single();

//           if (assignmentError || !assignment) {
//             console.error('Assignment error:', assignmentError);
//             toast.error('No class assigned to your profile');
//             setLoading(false);
//             return;
//           }

//           console.log('Student assignment:', assignment);

//           // 3️⃣ Get the class details from classes table
//           const { data: classDetails, error: classError } = await supabase
//             .from('classes')
//             .select('id, class_name, section')
//             .eq('id', assignment.class_id)
//             .single();

//           if (classError || !classDetails) {
//             console.error('Class not found:', classError);
//             toast.error('Assigned class not found in system');
//             setLoading(false);
//             return;
//           }

//           console.log('Student class details:', classDetails);

//           // 4️⃣ Set the student's class and academic year
//           setClasses([classDetails]);
//           setSelectedClass(classDetails.id);
//           setSelectedAcademicYear(assignment.academic_year);
//           setAcademicYears([assignment.academic_year]);

//           console.log('✅ Student data loaded successfully');
//         } catch (error: any) {
//           console.error('Student data fetch error:', error);
//           toast.error(error.message || 'Failed to load student data');
//           setLoading(false);
//           return;
//         }
//       }

//       // 🧩 TEACHER ROLE LOGIC - FIXED
//       else if (isTeacher && userProfile?.id) {
//         try {
//           console.log('Teacher auth user ID:', userProfile.id);

//           // Fetch available academic years first
//           await fetchAcademicYears();

//           // 1️⃣ Get teacher_id from teacher_profiles (id IS the user_id)
//           const { data: teacherProfile, error: teacherProfileError } = await supabase
//             .from('teacher_profiles')
//             .select('teacher_id')
//             .eq('id', userProfile.id) // ✅ Primary key IS user_id
//             .single();

//           if (teacherProfileError || !teacherProfile) {
//             console.error('Teacher profile error:', teacherProfileError);
//             toast.error('Teacher profile not found');
//             setLoading(false);
//             return;
//           }

//           const teacherId = teacherProfile.teacher_id;
//           console.log('Found teacher_id:', teacherId);

//           // 2️⃣ Verify teacher exists in teachers table
//           const { data: teacherData, error: teacherError } = await supabase
//             .from('teachers')
//             .select('id, full_name, subject_specialization')
//             .eq('id', teacherId)
//             .single();

//           if (teacherError || !teacherData) {
//             console.error('Teacher not found:', teacherError);
//             toast.error('Teacher record not found');
//             setLoading(false);
//             return;
//           }

//           console.log('Teacher data:', teacherData);
//           console.log('✅ Teacher data loaded successfully');
//         } catch (error: any) {
//           console.error('Teacher data fetch error:', error);
//           toast.error(error.message || 'Failed to load teacher data');
//           setLoading(false);
//           return;
//         }
//       }

//       // 🧩 ADMIN / STAFF ROLE LOGIC
//       else {
//         // Fetch all available academic years from class_assignments
//         await fetchAcademicYears();
//       }

//       // 🧩 FETCH ACTIVE TEACHERS (for Admin/Staff)
//       if (isAdmin || userProfile?.role === 'staff') {
//         const { data: teachersData, error: teacherError } = await supabase
//           .from('teachers')
//           .select('id, full_name, employee_id, subject_specialization, status')
//           .eq('status', 'active');

//         if (teacherError) throw teacherError;
//         if (teachersData) setTeachers(teachersData as Teacher[]);
//       }

//       setLoading(false);
//     } catch (error: any) {
//       console.error('Error fetching initial data:', error);
//       toast.error(error.message || 'Failed to load data');
//       setLoading(false);
//     }
//   };

//   const fetchClassesForYear = async () => {
//     if (!selectedAcademicYear) return;

//     try {
//       if (isTeacher && userProfile?.id) {
//         // Teacher: Fetch classes they teach in selected year
//         const { data: teacherProfile } = await supabase
//           .from('teacher_profiles')
//           .select('teacher_id')
//           .eq('id', userProfile.id) // ✅ Primary key IS user_id
//           .single();

//         if (!teacherProfile) {
//           toast.error('Teacher profile not found');
//           return;
//         }

//         const teacherId = teacherProfile.teacher_id;
//         console.log('Fetching classes for teacher:', teacherId, 'Year:', selectedAcademicYear);

//         const { data: teacherSchedule, error } = await supabase
//           .from('timetable')
//           .select('class_id')
//           .eq('teacher_id', teacherId)
//           .eq('academic_year', selectedAcademicYear);

//         if (error) throw error;

//         console.log('Teacher schedule:', teacherSchedule);

//         if (teacherSchedule && teacherSchedule.length > 0) {
//           const uniqueClassIds = [...new Set(teacherSchedule.map(item => item.class_id))];

//           const { data: classesData, error: classError } = await supabase
//             .from('classes')
//             .select('id, class_name, section')
//             .in('id', uniqueClassIds);

//           if (classError) throw classError;

//           if (classesData && classesData.length > 0) {
//             setClasses(classesData as Class[]);
//             setSelectedClass(classesData[0].id);
//           } else {
//             setClasses([]);
//             setSelectedClass('');
//           }
//         } else {
//           setClasses([]);
//           setSelectedClass('');
//           toast.info('No classes assigned to you for this academic year');
//         }
//       } else {
//         // Admin/Staff: Fetch unique classes from class_assignments for selected year
//         const { data: assignments, error } = await supabase
//           .from('class_assignments')
//           .select('class_id')
//           .eq('academic_year', selectedAcademicYear);

//         if (error) throw error;

//         if (assignments && assignments.length > 0) {
//           const uniqueClassIds = [...new Set(assignments.map(item => item.class_id))];

//           const { data: classesData, error: classError } = await supabase
//             .from('classes')
//             .select('id, class_name, section')
//             .in('id', uniqueClassIds);

//           if (classError) throw classError;

//           if (classesData && classesData.length > 0) {
//             setClasses(classesData as Class[]);
//             setSelectedClass(classesData[0].id);
//           } else {
//             setClasses([]);
//             setSelectedClass('');
//             toast.info('No classes found for this academic year');
//           }
//         } else {
//           setClasses([]);
//           setSelectedClass('');
//           toast.info('No class assignments found for this year');
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching classes:', error);
//       toast.error('Failed to load classes');
//     }
//   };

//   const fetchSchedule = async () => {
//     if (!selectedClass || !selectedAcademicYear) return;

//     try {
//       const { data, error } = await supabase
//         .from('timetable')
//         .select(
//           `id, class_id, day, start_time, end_time, subject, teacher_id, room_number, academic_year,
//            classes(class_name), teachers(full_name)`
//         )
//         .eq('class_id', selectedClass)
//         .eq('academic_year', selectedAcademicYear)
//         .order('start_time');

//       if (error) throw error;

//       const formattedSchedule: TimeSlot[] = (data || []).map((slot: any) => ({
//         id: slot.id,
//         class_id: slot.class_id,
//         class_name: slot.classes?.class_name || '',
//         day: slot.day,
//         start_time: slot.start_time,
//         end_time: slot.end_time,
//         subject: slot.subject,
//         teacher_id: slot.teacher_id,
//         teacher_name: slot.teachers?.full_name || '',
//         room_number: slot.room_number,
//         academic_year: slot.academic_year,
//         color: getSubjectColor(slot.subject),
//       }));

//       console.log('Fetched schedule:', formattedSchedule);
//       setSchedule(formattedSchedule);
//     } catch (error) {
//       console.error('Error fetching schedule:', error);
//       toast.error('Failed to load schedule');
//     }
//   };

//   // ------- CONFLICT DETECTION -------
//   const detectConflicts = () => {
//     const detectedConflicts: ConflictInfo[] = [];
//     const scheduleByDay = schedule.reduce((acc, slot) => {
//       if (!acc[slot.day]) acc[slot.day] = [];
//       acc[slot.day].push(slot);
//       return acc;
//     }, {} as Record<string, TimeSlot[]>);

//     Object.entries(scheduleByDay).forEach(([day, slots]) => {
//       const teacherSlots: Record<string, TimeSlot[]> = {};
//       slots.forEach(slot => {
//         if (!teacherSlots[slot.teacher_id]) teacherSlots[slot.teacher_id] = [];
//         teacherSlots[slot.teacher_id].push(slot);
//       });
//       Object.entries(teacherSlots).forEach(([teacherId, teacherSchedule]) => {
//         for (let i = 0; i < teacherSchedule.length; i++) {
//           for (let j = i + 1; j < teacherSchedule.length; j++) {
//             if (
//               checkTimeOverlap(
//                 teacherSchedule[i].start_time,
//                 teacherSchedule[i].end_time,
//                 teacherSchedule[j].start_time,
//                 teacherSchedule[j].end_time
//               )
//             ) {
//               detectedConflicts.push({
//                 type: 'teacher',
//                 message: `${teacherSchedule[i].teacher_name} has overlapping classes on ${day}`,
//                 slots: [teacherSchedule[i], teacherSchedule[j]],
//               });
//             }
//           }
//         }
//       });

//       const roomSlots: Record<string, TimeSlot[]> = {};
//       slots.forEach(slot => {
//         if (!roomSlots[slot.room_number]) roomSlots[slot.room_number] = [];
//         roomSlots[slot.room_number].push(slot);
//       });
//       Object.entries(roomSlots).forEach(([room, roomSchedule]) => {
//         for (let i = 0; i < roomSchedule.length; i++) {
//           for (let j = i + 1; j < roomSchedule.length; j++) {
//             if (
//               checkTimeOverlap(
//                 roomSchedule[i].start_time,
//                 roomSchedule[i].end_time,
//                 roomSchedule[j].start_time,
//                 roomSchedule[j].end_time
//               )
//             ) {
//               detectedConflicts.push({
//                 type: 'room',
//                 message: `Room ${room} is double-booked on ${day}`,
//                 slots: [roomSchedule[i], roomSchedule[j]],
//               });
//             }
//           }
//         }
//       });
//     });

//     setConflicts(detectedConflicts);
//     if (detectedConflicts.length > 0) {
//       toast.warning(`${detectedConflicts.length} scheduling conflict(s) detected`);
//     }
//   };

//   // ------- CRUD OPERATIONS -------
//   const handleAddSlot = async () => {
//     if (!isAdmin && userProfile?.role !== 'staff') {
//       toast.error('You do not have permission to add schedule slots');
//       return;
//     }
//     try {
//       const { error } = await supabase.from('timetable').insert({
//         class_id: selectedClass,
//         day: formData.day,
//         start_time: formData.start_time,
//         end_time: formData.end_time,
//         subject: formData.subject,
//         teacher_id: formData.teacher_id,
//         room_number: formData.room_number,
//         academic_year: selectedAcademicYear,
//       });
//       if (error) throw error;
//       toast.success('Schedule added successfully');
//       setIsAddModalOpen(false);
//       resetForm();
//       fetchSchedule();
//     } catch (error: any) {
//       console.error('Error adding slot:', error);
//       toast.error(error.message || 'Failed to add schedule');
//     }
//   };

//   const handleUpdateSlot = async () => {
//     if (!isAdmin && userProfile?.role !== 'staff') {
//       toast.error('You do not have permission to edit schedule');
//       return;
//     }
//     if (!editingSlot?.id) return;
//     try {
//       const { error } = await supabase
//         .from('timetable')
//         .update({
//           day: formData.day,
//           start_time: formData.start_time,
//           end_time: formData.end_time,
//           subject: formData.subject,
//           teacher_id: formData.teacher_id,
//           room_number: formData.room_number,
//         })
//         .eq('id', editingSlot.id);
//       if (error) throw error;
//       toast.success('Schedule updated successfully');
//       setIsEditModalOpen(false);
//       setEditingSlot(null);
//       resetForm();
//       fetchSchedule();
//     } catch (error: any) {
//       console.error('Error updating slot:', error);
//       toast.error(error.message || 'Failed to update schedule');
//     }
//   };

//   const handleDeleteSlot = async (slotId: string) => {
//     if (!isAdmin && userProfile?.role !== 'staff') {
//       toast.error('You do not have permission to delete schedule');
//       return;
//     }
//     if (!confirm('Are you sure you want to delete this schedule slot?')) return;
//     try {
//       const { error } = await supabase.from('timetable').delete().eq('id', slotId);
//       if (error) throw error;
//       toast.success('Schedule deleted successfully');
//       fetchSchedule();
//     } catch (error: any) {
//       console.error('Error deleting slot:', error);
//       toast.error(error.message || 'Failed to delete schedule');
//     }
//   };

//   const handleSubstituteRequest = async (slotId: string) => {
//     if (!isTeacher) {
//       toast.error('Only teachers can request substitutions');
//       return;
//     }
//     toast.info('Substitute request feature coming soon');
//   };

//   const resetForm = () => {
//     setFormData({
//       day: 'Monday',
//       start_time: '9:00 AM',
//       end_time: '10:00 AM',
//       subject: '',
//       teacher_id: '',
//       room_number: '',
//     });
//   };

//   const openEditModal = (slot: TimeSlot) => {
//     setEditingSlot(slot);
//     setFormData({
//       day: slot.day,
//       start_time: slot.start_time,
//       end_time: slot.end_time,
//       subject: slot.subject,
//       teacher_id: slot.teacher_id,
//       room_number: slot.room_number,
//     });
//     setIsEditModalOpen(true);
//   };

//   // ------- RENDER -------
//   const filteredSchedule = schedule.filter(slot => slot.day === selectedDay);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E88E5]"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-3 space-y-6">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex items-center justify-between"
//       >
//         <div>
//           <h1 className="mb-2">Timetable</h1>
//           <p className="text-gray-600">Weekly class schedule and timings</p>
//         </div>
//         <div className="flex gap-3 items-center">
//           {/* Academic Year Filter - Only for Admin/Staff/Teacher */}
//           {!isStudent && (
//             <select
//               value={selectedAcademicYear}
//               onChange={e => setSelectedAcademicYear(e.target.value)}
//               className="px-4 py-2 rounded-xl border border-gray-200 focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20 outline-none transition-all bg-white"
//             >
//               <option value="">Select Academic Year</option>
//               {academicYears.map(year => (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               ))}
//             </select>
//           )}

//           {(isAdmin || userProfile?.role === 'staff') && (
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//               <Button
//                 onClick={() => setIsAddModalOpen(true)}
//                 disabled={!selectedClass || !selectedAcademicYear}
//                 className="gradient-primary text-white shadow-glow hover:shadow-float rounded-xl h-11 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Plus className="w-5 h-5" />
//                 Add Schedule
//               </Button>
//             </motion.div>
//           )}
//         </div>
//       </motion.div>

//       {/* Conflicts Alert */}
//       {conflicts.length > 0 && (isAdmin || userProfile?.role === 'staff') && (
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="glass-strong rounded-2xl p-4 border-l-4 border-orange-500 shadow-soft"
//         >
//           <div className="flex items-start gap-3">
//             <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
//             <div className="flex-1">
//               <h4 className="text-orange-700 mb-2">Scheduling Conflicts Detected</h4>
//               <div className="space-y-2">
//                 {conflicts.slice(0, 3).map((conflict, idx) => (
//                   <div key={idx} className="text-sm text-gray-700">
//                     <Badge variant="outline" className="mr-2 text-xs">
//                       {conflict.type}
//                     </Badge>
//                     {conflict.message}
//                   </div>
//                 ))}
//                 {conflicts.length > 3 && (
//                   <p className="text-sm text-gray-600">+{conflicts.length - 3} more conflicts</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       )}

//       {/* Class Selector */}
//       {classes.length > 0 && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="glass-strong rounded-2xl p-4 shadow-soft"
//         >
//           <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
//             {classes.map(cls => (
//               <motion.button
//                 key={cls.id}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setSelectedClass(cls.id)}
//                 className={`
//                   px-6 py-2.5 rounded-xl font-medium transition-all duration-300 whitespace-nowrap
//                   ${
//                     selectedClass === cls.id
//                       ? 'gradient-primary text-white shadow-glow'
//                       : 'bg-white text-gray-600 hover:bg-white/80'
//                   }
//                 `}
//               >
//                 Class {cls.class_name} {cls.section ? `- ${cls.section}` : ''}
//               </motion.button>
//             ))}
//           </div>
//         </motion.div>
//       )}

//       {/* Day Selector */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.2 }}
//         className="glass-strong rounded-2xl p-6 shadow-soft"
//       >
//         <div className="flex items-center justify-between mb-4">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="rounded-xl hover:bg-white/60"
//             onClick={() => {
//               const currentIndex = days.indexOf(selectedDay);
//               if (currentIndex > 0) setSelectedDay(days[currentIndex - 1]);
//             }}
//           >
//             <ChevronLeft className="w-5 h-5" />
//           </Button>
//           <div className="flex gap-3 flex-1 justify-center overflow-x-auto scrollbar-thin">
//             {days.map(day => (
//               <motion.button
//                 key={day}
//                 whileHover={{ scale: 1.05, y: -2 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setSelectedDay(day)}
//                 className={`
//                   px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap
//                   ${
//                     selectedDay === day
//                       ? 'bg-white text-[#1E88E5] shadow-soft'
//                       : 'text-gray-600 hover:bg-white/60'
//                   }
//                 `}
//               >
//                 {day}
//               </motion.button>
//             ))}
//           </div>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="rounded-xl hover:bg-white/60"
//             onClick={() => {
//               const currentIndex = days.indexOf(selectedDay);
//               if (currentIndex < days.length - 1) setSelectedDay(days[currentIndex + 1]);
//             }}
//           >
//             <ChevronRight className="w-5 h-5" />
//           </Button>
//         </div>
//       </motion.div>

//       {/* Schedule Grid */}
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={selectedDay}
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           exit={{ opacity: 0, x: -20 }}
//           transition={{ duration: 0.3 }}
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
//         >
//           {filteredSchedule.length === 0 ? (
//             <div className="col-span-full glass-strong rounded-2xl p-12 text-center shadow-soft">
//               <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
//               <h3 className="text-gray-600 mb-2">No classes scheduled</h3>
//               <p className="text-sm text-gray-500">
//                 {isAdmin || userProfile?.role === 'staff'
//                   ? 'Click "Add Schedule" to create a new schedule slot'
//                   : 'No classes scheduled for this day'}
//               </p>
//             </div>
//           ) : (
//             filteredSchedule.map((slot, index) => (
//               <motion.div
//                 key={slot.id}
//                 initial={{ opacity: 0, y: 40 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.05, duration: 0.4 }}
//                 whileHover={{ y: -4, scale: 1.02 }}
//                 className={`
//                   glass-strong rounded-2xl p-5 shadow-soft hover:shadow-float transition-all duration-300 cursor-pointer
//                   ${slot.subject === 'Break' || slot.subject === 'Lunch' ? 'opacity-60' : ''}
//                 `}
//               >
//                 <div className="flex items-start justify-between mb-3">
//                   <Badge
//                     variant="outline"
//                     className="border-0"
//                     style={{ backgroundColor: `${slot.color}20`, color: slot.color }}
//                   >
//                     {slot.start_time} - {slot.end_time}
//                   </Badge>
//                   {slot.room_number && (
//                     <Badge variant="outline" className="bg-white/60 border-gray-200/50 text-gray-600">
//                       <MapPin className="w-3 h-3 mr-1" />
//                       {slot.room_number}
//                     </Badge>
//                   )}
//                 </div>

//                 <h4 className="mb-2" style={{ color: slot.color }}>
//                   {slot.subject}
//                 </h4>
//                 {slot.teacher_name && (
//                   <p className="text-sm text-gray-600 flex items-center gap-2 mb-3">
//                     <Users className="w-4 h-4" />
//                     {slot.teacher_name}
//                   </p>
//                 )}

//                 {slot.subject !== 'Break' && slot.subject !== 'Lunch' && (
//                   <div className="mt-4 pt-3 border-t border-gray-200/50 flex items-center justify-between">
//                     <div className="flex items-center gap-2 text-xs text-gray-500">
//                       <Clock className="w-3 h-3" />
//                       <span>60 minutes</span>
//                     </div>
//                     <div className="flex gap-2">
//                       {isTeacher && slot.teacher_id === userProfile?.id && (
//                         <Button
//                           size="sm"
//                           variant="ghost"
//                           className="h-8 w-8 p-0"
//                           onClick={() => handleSubstituteRequest(slot.id!)}
//                         >
//                           <UserCheck className="w-4 h-4" />
//                         </Button>
//                       )}
//                       {(isAdmin || userProfile?.role === 'staff') && (
//                         <>
//                           <Button
//                             size="sm"
//                             variant="ghost"
//                             className="h-8 w-8 p-0"
//                             onClick={() => openEditModal(slot)}
//                           >
//                             <Edit2 className="w-4 h-4" />
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="ghost"
//                             className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
//                             onClick={() => handleDeleteSlot(slot.id!)}
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </Button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </motion.div>
//             ))
//           )}
//         </motion.div>
//       </AnimatePresence>

//       {/* Add/Edit Modal */}
//       <AnimatePresence>
//         {(isAddModalOpen || isEditModalOpen) && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => {
//               setIsAddModalOpen(false);
//               setIsEditModalOpen(false);
//               resetForm();
//             }}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               onClick={e => e.stopPropagation()}
//               className="glass-strong rounded-2xl p-6 w-full max-w-2xl shadow-float max-h-[90vh] overflow-y-auto scrollbar-thin"
//             >
//               <div className="flex items-center justify-between mb-6">
//                 <h2>{isEditModalOpen ? 'Edit Schedule' : 'Add New Schedule'}</h2>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => {
//                     setIsAddModalOpen(false);
//                     setIsEditModalOpen(false);
//                     resetForm();
//                   }}
//                 >
//                   <X className="w-5 h-5" />
//                 </Button>
//               </div>
//               <div className="space-y-4">
//                 {/* Day */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
//                   <select
//                     value={formData.day}
//                     onChange={e => setFormData({ ...formData, day: e.target.value })}
//                     className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20 outline-none transition-all"
//                   >
//                     {days.map(day => (
//                       <option key={day} value={day}>
//                         {day}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 {/* Time */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
//                     <select
//                       value={formData.start_time}
//                       onChange={e => setFormData({ ...formData, start_time: e.target.value })}
//                       className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20 outline-none transition-all"
//                     >
//                       {timeSlots.map(time => (
//                         <option key={time} value={time}>
//                           {time}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
//                     <select
//                       value={formData.end_time}
//                       onChange={e => setFormData({ ...formData, end_time: e.target.value })}
//                       className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20 outline-none transition-all"
//                     >
//                       {timeSlots.map(time => (
//                         <option key={time} value={time}>
//                           {time}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 {/* Subject */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
//                   <input
//                     type="text"
//                     value={formData.subject}
//                     onChange={e => setFormData({ ...formData, subject: e.target.value })}
//                     className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20 outline-none transition-all"
//                     placeholder="e.g., Mathematics"
//                   />
//                 </div>
//                 {/* Teacher */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Teacher</label>
//                   <select
//                     value={formData.teacher_id}
//                     onChange={e => setFormData({ ...formData, teacher_id: e.target.value })}
//                     className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20 outline-none transition-all"
//                   >
//                     <option value="">Select Teacher</option>
//                     {teachers.map(teacher => (
//                       <option key={teacher.id} value={teacher.id}>
//                         {teacher.full_name} - {teacher.subject_specialization}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 {/* Room */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
//                   <input
//                     type="text"
//                     value={formData.room_number}
//                     onChange={e => setFormData({ ...formData, room_number: e.target.value })}
//                     className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20 outline-none transition-all"
//                     placeholder="e.g., 101"
//                   />
//                 </div>
//               </div>
//               <div className="flex gap-3 mt-6">
//                 <Button
//                   onClick={isEditModalOpen ? handleUpdateSlot : handleAddSlot}
//                   className="flex-1 gradient-primary text-white shadow-glow hover:shadow-float rounded-xl h-11 gap-2"
//                 >
//                   <Save className="w-5 h-5" />
//                   {isEditModalOpen ? 'Update' : 'Add'} Schedule
//                 </Button>
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setIsAddModalOpen(false);
//                     setIsEditModalOpen(false);
//                     resetForm();
//                   }}
//                   className="px-6 rounded-xl h-11"
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Users,
  MapPin,
  Save,
  X,
  UserCheck,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

// ------- INTERFACE & TYPE DEFINITIONS -------
interface TimeSlot {
  id?: string;
  class_id: string;
  class_name: string;
  day: string;
  start_time: string;
  end_time: string;
  subject: string;
  teacher_id: string;
  teacher_name: string;
  room_number: string;
  academic_year: string;
  color?: string;
  duration?: number;
}

interface Teacher {
  id: string;
  full_name: string;
  employee_id: string;
  subject_specialization: string;
  status: string;
}

interface Class {
  id: string;
  class_name: string;
  section?: string;
}

interface ConflictInfo {
  type: 'teacher' | 'room' | 'class';
  message: string;
  slots: TimeSlot[];
}

interface LinkedStudent {
  student_id: string;
  full_name: string;
  class_id: string;
  class_name: string;
  section?: string;
  academic_year: string;
}

// ------- UTILITY FUNCTIONS -------
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlots = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
];

const subjectColors: { [key: string]: string } = {
  Mathematics: '#1E88E5',
  Physics: '#7B1FA2',
  Chemistry: '#00897B',
  Biology: '#43A047',
  English: '#F57C00',
  History: '#E53935',
  Geography: '#00ACC1',
  'Computer Science': '#5B9FFF',
  'Physical Education': '#F4511E',
  Arts: '#8E24AA',
  Music: '#D81B60',
  Break: '#9E9E9E',
  Lunch: '#9E9E9E',
};

const getSubjectColor = (subject: string): string => subjectColors[subject] || '#607D8B';

const parseTime = (timeStr: string): Date => {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const checkTimeOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean => {
  const s1 = parseTime(start1);
  const e1 = parseTime(end1);
  const s2 = parseTime(start2);
  const e2 = parseTime(end2);
  return s1 < e2 && s2 < e1;
};

// ------- MAIN COMPONENT -------
export default function Timetable() {
  const { userProfile, isAdmin, isTeacher, isStudent } = useAuth();

  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('');
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [schedule, setSchedule] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [conflicts, setConflicts] = useState<ConflictInfo[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [errorMsg, setError] = useState<string | null>(null);

  // Parent-specific state
  const [linkedStudents, setLinkedStudents] = useState<LinkedStudent[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  const [formData, setFormData] = useState<Partial<TimeSlot>>({
    day: 'Monday',
    start_time: '9:00 AM',
    end_time: '10:00 AM',
    subject: '',
    teacher_id: '',
    room_number: '',
  });

  // ------- DATA FETCHING -------
  useEffect(() => {
    fetchInitialData();
  }, [userProfile]);

  useEffect(() => {
    if (selectedAcademicYear && !isStudent && userProfile?.role !== 'parent') {
      fetchClassesForYear();
    }
  }, [selectedAcademicYear]);

  useEffect(() => {
    if (selectedClass && selectedAcademicYear) {
      fetchSchedule();
    }
  }, [selectedClass, selectedAcademicYear]);

  useEffect(() => {
    if (schedule.length > 0) detectConflicts();
  }, [schedule]);

  // Update class selection when parent switches child
  useEffect(() => {
    if (userProfile?.role === 'parent' && selectedStudentId && linkedStudents.length > 0) {
      const selectedStudent = linkedStudents.find(s => s.student_id === selectedStudentId);
      if (selectedStudent) {
        setSelectedClass(selectedStudent.class_id);
        setSelectedAcademicYear(selectedStudent.academic_year);
        setClasses([{
          id: selectedStudent.class_id,
          class_name: selectedStudent.class_name,
          section: selectedStudent.section,
        }]);
      }
    }
  }, [selectedStudentId, linkedStudents, userProfile]);

  const fetchAcademicYears = async () => {
    try {
      const { data, error } = await supabase
        .from('class_assignments')
        .select('academic_year')
        .order('academic_year', { ascending: false });

      if (error) throw error;

      if (data) {
        const uniqueYears = [...new Set(data.map(item => item.academic_year))];
        setAcademicYears(uniqueYears);

        const currentYear = new Date().getFullYear().toString();
        if (uniqueYears.includes(currentYear)) {
          setSelectedAcademicYear(currentYear);
        } else if (uniqueYears.length > 0) {
          setSelectedAcademicYear(uniqueYears[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching academic years:', error);
    }
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      // 🧩 PARENT ROLE LOGIC
      if (userProfile?.role === 'parent' && userProfile?.id) {
        try {
          console.log('🔍 Parent ID:', userProfile.id);

          // 1. Get all linked children
          const { data: links, error: linkError } = await supabase
            .from('parent_student_links')
            .select('student_id')
            .eq('parent_id', userProfile.id);

          if (linkError || !links || links.length === 0) {
            setError('No students linked to your account. Please contact administration.');
            setLoading(false);
            return;
          }

          const studentIds = links.map(l => l.student_id);
          console.log('👨‍👩‍👧‍👦 Linked student IDs:', studentIds);

          // 2. Get student profiles
          const { data: students, error: studentsError } = await supabase
            .from('student_profiles')
            .select('student_id, full_name')
            .in('student_id', studentIds);

          if (studentsError || !students) {
            toast.error('Could not fetch student profiles');
            setLoading(false);
            return;
          }

          console.log('📚 Student profiles:', students);

          // 3. Get class assignments for these students
          const { data: assignments, error: assignmentsError } = await supabase
            .from('class_assignments')
            .select('student_id, class_id, academic_year')
            .in('student_id', studentIds);

          if (assignmentsError || !assignments || assignments.length === 0) {
            toast.error('No class assignments found for your children');
            setLoading(false);
            return;
          }

          console.log('🏫 Class assignments:', assignments);

          // 4. Get class details
          const allClassIds = assignments.map(a => a.class_id);
          const { data: classesData, error: classesErr } = await supabase
            .from('classes')
            .select('id, class_name, section')
            .in('id', allClassIds);

          if (classesErr || !classesData) {
            toast.error('Could not fetch class details');
            setLoading(false);
            return;
          }

          console.log('📋 Classes data:', classesData);

          // 5. Build linked students array with all info
          const childInfos: LinkedStudent[] = assignments.map((assign) => {
            const student = students.find(s => s.student_id === assign.student_id);
            const classObj = classesData.find(cls => cls.id === assign.class_id);
            return {
              student_id: assign.student_id,
              full_name: student?.full_name || 'Unknown',
              class_id: assign.class_id,
              class_name: classObj?.class_name || 'N/A',
              section: classObj?.section,
              academic_year: assign.academic_year
            };
          });

          setLinkedStudents(childInfos);
          console.log('✅ Linked students prepared:', childInfos);

          // 6. Auto-select first child
          if (childInfos.length > 0) {
            setSelectedStudentId(childInfos[0].student_id);
            setSelectedClass(childInfos[0].class_id);
            setSelectedAcademicYear(childInfos[0].academic_year);
            setClasses([{
              id: childInfos[0].class_id,
              class_name: childInfos[0].class_name,
              section: childInfos[0].section,
            }]);
          }

          setLoading(false);
          return;

        } catch (error: any) {
          console.error('❌ Parent data fetch error:', error);
          toast.error(error.message || 'Failed to load children information');
          setLoading(false);
          return;
        }
      }

      // 🧩 STUDENT ROLE LOGIC
      if (isStudent && userProfile?.id) {
        try {
          console.log('Student auth user ID:', userProfile.id);

          const { data: studentProfile, error: studentProfileError } = await supabase
            .from('student_profiles')
            .select('student_id')
            .eq('id', userProfile.id)
            .single();

          if (studentProfileError || !studentProfile) {
            console.error('Student profile error:', studentProfileError);
            toast.error('Student profile not found');
            setLoading(false);
            return;
          }

          const studentId = studentProfile.student_id;
          console.log('Found student_id:', studentId);

          const { data: assignment, error: assignmentError } = await supabase
            .from('class_assignments')
            .select('class_id, academic_year')
            .eq('student_id', studentId)
            .single();

          if (assignmentError || !assignment) {
            console.error('Assignment error:', assignmentError);
            toast.error('No class assigned to your profile');
            setLoading(false);
            return;
          }

          console.log('Student assignment:', assignment);

          const { data: classDetails, error: classError } = await supabase
            .from('classes')
            .select('id, class_name, section')
            .eq('id', assignment.class_id)
            .single();

          if (classError || !classDetails) {
            console.error('Class not found:', classError);
            toast.error('Assigned class not found in system');
            setLoading(false);
            return;
          }

          console.log('Student class details:', classDetails);

          setClasses([classDetails]);
          setSelectedClass(classDetails.id);
          setSelectedAcademicYear(assignment.academic_year);
          setAcademicYears([assignment.academic_year]);

          console.log('✅ Student data loaded successfully');
        } catch (error: any) {
          console.error('Student data fetch error:', error);
          toast.error(error.message || 'Failed to load student data');
          setLoading(false);
          return;
        }
      }

      // 🧩 TEACHER ROLE LOGIC
      else if (isTeacher && userProfile?.id) {
        try {
          console.log('Teacher auth user ID:', userProfile.id);

          await fetchAcademicYears();

          const { data: teacherProfile, error: teacherProfileError } = await supabase
            .from('teacher_profiles')
            .select('teacher_id')
            .eq('id', userProfile.id)
            .single();

          if (teacherProfileError || !teacherProfile) {
            console.error('Teacher profile error:', teacherProfileError);
            toast.error('Teacher profile not found');
            setLoading(false);
            return;
          }

          const teacherId = teacherProfile.teacher_id;
          console.log('Found teacher_id:', teacherId);

          const { data: teacherData, error: teacherError } = await supabase
            .from('teachers')
            .select('id, full_name, subject_specialization')
            .eq('id', teacherId)
            .single();

          if (teacherError || !teacherData) {
            console.error('Teacher not found:', teacherError);
            toast.error('Teacher record not found');
            setLoading(false);
            return;
          }

          console.log('Teacher data:', teacherData);
          console.log('✅ Teacher data loaded successfully');
        } catch (error: any) {
          console.error('Teacher data fetch error:', error);
          toast.error(error.message || 'Failed to load teacher data');
          setLoading(false);
          return;
        }
      }

      // 🧩 ADMIN / STAFF ROLE LOGIC
      else {
        await fetchAcademicYears();
      }

      // 🧩 FETCH ACTIVE TEACHERS (for Admin/Staff)
      if (isAdmin || userProfile?.role === 'staff') {
        const { data: teachersData, error: teacherError } = await supabase
          .from('teachers')
          .select('id, full_name, employee_id, subject_specialization, status')
          .eq('status', 'active');

        if (teacherError) throw teacherError;
        if (teachersData) setTeachers(teachersData as Teacher[]);
      }

      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching initial data:', error);
      toast.error(error.message || 'Failed to load data');
      setLoading(false);
    }
  };

  const fetchClassesForYear = async () => {
    if (!selectedAcademicYear) return;

    try {
      if (isTeacher && userProfile?.id) {
        const { data: teacherProfile } = await supabase
          .from('teacher_profiles')
          .select('teacher_id')
          .eq('id', userProfile.id)
          .single();

        if (!teacherProfile) {
          toast.error('Teacher profile not found');
          return;
        }

        const teacherId = teacherProfile.teacher_id;
        console.log('Fetching classes for teacher:', teacherId, 'Year:', selectedAcademicYear);

        const { data: teacherSchedule, error } = await supabase
          .from('timetable')
          .select('class_id')
          .eq('teacher_id', teacherId)
          .eq('academic_year', selectedAcademicYear);

        if (error) throw error;

        console.log('Teacher schedule:', teacherSchedule);

        if (teacherSchedule && teacherSchedule.length > 0) {
          const uniqueClassIds = [...new Set(teacherSchedule.map(item => item.class_id))];

          const { data: classesData, error: classError } = await supabase
            .from('classes')
            .select('id, class_name, section')
            .in('id', uniqueClassIds);

          if (classError) throw classError;

          if (classesData && classesData.length > 0) {
            setClasses(classesData as Class[]);
            setSelectedClass(classesData[0].id);
          } else {
            setClasses([]);
            setSelectedClass('');
          }
        } else {
          setClasses([]);
          setSelectedClass('');
          toast.info('No classes assigned to you for this academic year');
        }
      } else {
        const { data: assignments, error } = await supabase
          .from('class_assignments')
          .select('class_id')
          .eq('academic_year', selectedAcademicYear);

        if (error) throw error;

        if (assignments && assignments.length > 0) {
          const uniqueClassIds = [...new Set(assignments.map(item => item.class_id))];

          const { data: classesData, error: classError } = await supabase
            .from('classes')
            .select('id, class_name, section')
            .in('id', uniqueClassIds);

          if (classError) throw classError;

          if (classesData && classesData.length > 0) {
            setClasses(classesData as Class[]);
            setSelectedClass(classesData[0].id);
          } else {
            setClasses([]);
            setSelectedClass('');
            toast.info('No classes found for this academic year');
          }
        } else {
          setClasses([]);
          setSelectedClass('');
          toast.info('No class assignments found for this year');
        }
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to load classes');
    }
  };

  const fetchSchedule = async () => {
    if (!selectedClass || !selectedAcademicYear) return;

    try {
      const { data, error } = await supabase
        .from('timetable')
        .select(
          `id, class_id, day, start_time, end_time, subject, teacher_id, room_number, academic_year,
           classes(class_name), teachers(full_name)`
        )
        .eq('class_id', selectedClass)
        .eq('academic_year', selectedAcademicYear)
        .order('start_time');

      if (error) throw error;

      const formattedSchedule: TimeSlot[] = (data || []).map((slot: any) => ({
        id: slot.id,
        class_id: slot.class_id,
        class_name: slot.classes?.class_name || '',
        day: slot.day,
        start_time: slot.start_time,
        end_time: slot.end_time,
        subject: slot.subject,
        teacher_id: slot.teacher_id,
        teacher_name: slot.teachers?.full_name || '',
        room_number: slot.room_number,
        academic_year: slot.academic_year,
        color: getSubjectColor(slot.subject),
      }));

      console.log('Fetched schedule:', formattedSchedule);
      setSchedule(formattedSchedule);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      toast.error('Failed to load schedule');
    }
  };

  // ------- CONFLICT DETECTION -------
  const detectConflicts = () => {
    const detectedConflicts: ConflictInfo[] = [];
    const scheduleByDay = schedule.reduce((acc, slot) => {
      if (!acc[slot.day]) acc[slot.day] = [];
      acc[slot.day].push(slot);
      return acc;
    }, {} as Record<string, TimeSlot[]>);

    Object.entries(scheduleByDay).forEach(([day, slots]) => {
      const teacherSlots: Record<string, TimeSlot[]> = {};
      slots.forEach(slot => {
        if (!teacherSlots[slot.teacher_id]) teacherSlots[slot.teacher_id] = [];
        teacherSlots[slot.teacher_id].push(slot);
      });
      Object.entries(teacherSlots).forEach(([teacherId, teacherSchedule]) => {
        for (let i = 0; i < teacherSchedule.length; i++) {
          for (let j = i + 1; j < teacherSchedule.length; j++) {
            if (
              checkTimeOverlap(
                teacherSchedule[i].start_time,
                teacherSchedule[i].end_time,
                teacherSchedule[j].start_time,
                teacherSchedule[j].end_time
              )
            ) {
              detectedConflicts.push({
                type: 'teacher',
                message: `${teacherSchedule[i].teacher_name} has overlapping classes on ${day}`,
                slots: [teacherSchedule[i], teacherSchedule[j]],
              });
            }
          }
        }
      });

      const roomSlots: Record<string, TimeSlot[]> = {};
      slots.forEach(slot => {
        if (!roomSlots[slot.room_number]) roomSlots[slot.room_number] = [];
        roomSlots[slot.room_number].push(slot);
      });
      Object.entries(roomSlots).forEach(([room, roomSchedule]) => {
        for (let i = 0; i < roomSchedule.length; i++) {
          for (let j = i + 1; j < roomSchedule.length; j++) {
            if (
              checkTimeOverlap(
                roomSchedule[i].start_time,
                roomSchedule[i].end_time,
                roomSchedule[j].start_time,
                roomSchedule[j].end_time
              )
            ) {
              detectedConflicts.push({
                type: 'room',
                message: `Room ${room} is double-booked on ${day}`,
                slots: [roomSchedule[i], roomSchedule[j]],
              });
            }
          }
        }
      });
    });

    setConflicts(detectedConflicts);
    if (detectedConflicts.length > 0) {
      toast.warning(`${detectedConflicts.length} scheduling conflict(s) detected`);
    }
  };

  // ------- CRUD OPERATIONS -------
  const handleAddSlot = async () => {
    if (!isAdmin && userProfile?.role !== 'staff') {
      toast.error('You do not have permission to add schedule slots');
      return;
    }
    try {
      const { error } = await supabase.from('timetable').insert({
        class_id: selectedClass,
        day: formData.day,
        start_time: formData.start_time,
        end_time: formData.end_time,
        subject: formData.subject,
        teacher_id: formData.teacher_id,
        room_number: formData.room_number,
        academic_year: selectedAcademicYear,
      });
      if (error) throw error;
      toast.success('Schedule added successfully');
      setIsAddModalOpen(false);
      resetForm();
      fetchSchedule();
    } catch (error: any) {
      console.error('Error adding slot:', error);
      toast.error(error.message || 'Failed to add schedule');
    }
  };

  const handleUpdateSlot = async () => {
    if (!isAdmin && userProfile?.role !== 'staff') {
      toast.error('You do not have permission to edit schedule');
      return;
    }
    if (!editingSlot?.id) return;
    try {
      const { error } = await supabase
        .from('timetable')
        .update({
          day: formData.day,
          start_time: formData.start_time,
          end_time: formData.end_time,
          subject: formData.subject,
          teacher_id: formData.teacher_id,
          room_number: formData.room_number,
        })
        .eq('id', editingSlot.id);
      if (error) throw error;
      toast.success('Schedule updated successfully');
      setIsEditModalOpen(false);
      setEditingSlot(null);
      resetForm();
      fetchSchedule();
    } catch (error: any) {
      console.error('Error updating slot:', error);
      toast.error(error.message || 'Failed to update schedule');
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!isAdmin && userProfile?.role !== 'staff') {
      toast.error('You do not have permission to delete schedule');
      return;
    }
    if (!confirm('Are you sure you want to delete this schedule slot?')) return;
    try {
      const { error } = await supabase.from('timetable').delete().eq('id', slotId);
      if (error) throw error;
      toast.success('Schedule deleted successfully');
      fetchSchedule();
    } catch (error: any) {
      console.error('Error deleting slot:', error);
      toast.error(error.message || 'Failed to delete schedule');
    }
  };

  const handleSubstituteRequest = async (slotId: string) => {
    if (!isTeacher) {
      toast.error('Only teachers can request substitutions');
      return;
    }
    toast.info('Substitute request feature coming soon');
  };

  const resetForm = () => {
    setFormData({
      day: 'Monday',
      start_time: '9:00 AM',
      end_time: '10:00 AM',
      subject: '',
      teacher_id: '',
      room_number: '',
    });
  };

  const openEditModal = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setFormData({
      day: slot.day,
      start_time: slot.start_time,
      end_time: slot.end_time,
      subject: slot.subject,
      teacher_id: slot.teacher_id,
      room_number: slot.room_number,
    });
    setIsEditModalOpen(true);
  };

  // ------- RENDER -------
  const filteredSchedule = schedule.filter(slot => slot.day === selectedDay);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E88E5]"></div>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="mb-2">Timetable</h1>
          <p className="text-gray-600">Weekly class schedule and timings</p>
        </div>
        <div className="flex gap-3 items-center">
          {/* Academic Year Filter - Only for Admin/Staff/Teacher */}
          {!isStudent && userProfile?.role !== 'parent' && (
            <select
              value={selectedAcademicYear}
              onChange={e => setSelectedAcademicYear(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20 outline-none transition-all bg-white"
            >
              <option value="">Select Academic Year</option>
              {academicYears.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          )}

          {(isAdmin || userProfile?.role === 'staff') && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                disabled={!selectedClass || !selectedAcademicYear}
                className="gradient-primary text-white shadow-glow hover:shadow-float rounded-xl h-11 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
                Add Schedule
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Parent: Child Selector */}
      {userProfile?.role === 'parent' && linkedStudents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-strong rounded-2xl p-4 shadow-soft"
        >
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-900">Select Child</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {linkedStudents.map(child => (
              <motion.button
                key={child.student_id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedStudentId(child.student_id)}
                className={`
                  px-6 py-2.5 rounded-xl font-medium transition-all duration-300 whitespace-nowrap
                  ${selectedStudentId === child.student_id
                    ? 'gradient-primary text-white shadow-glow'
                    : 'bg-white text-gray-600 hover:bg-white/80'
                  }
                `}
              >
                {child.full_name}
                <span className="ml-2 text-xs opacity-80">
                  ({child.class_name}{child.section ? `-${child.section}` : ''})
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (isAdmin || userProfile?.role === 'staff') && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-4 border-l-4 border-orange-500 shadow-soft"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-orange-700 mb-2">Scheduling Conflicts Detected</h4>
              <div className="space-y-2">
                {conflicts.slice(0, 3).map((conflict, idx) => (
                  <div key={idx} className="text-sm text-gray-700">
                    <Badge variant="outline" className="mr-2 text-xs">
                      {conflict.type}
                    </Badge>
                    {conflict.message}
                  </div>
                ))}
                {conflicts.length > 3 && (
                  <p className="text-sm text-gray-600">+{conflicts.length - 3} more conflicts</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Class Selector - Hide for Parent (auto-selected) */}
      {classes.length > 0 && userProfile?.role !== 'parent' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong rounded-2xl p-4 shadow-soft"
        >
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {classes.map(cls => (
              <motion.button
                key={cls.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedClass(cls.id)}
                className={`
                  px-6 py-2.5 rounded-xl font-medium transition-all duration-300 whitespace-nowrap
                  ${selectedClass === cls.id
                    ? 'gradient-primary text-white shadow-glow'
                    : 'bg-white text-gray-600 hover:bg-white/80'
                  }
                `}
              >
                Class {cls.class_name} {cls.section ? `- ${cls.section}` : ''}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Day Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-strong rounded-2xl p-6 shadow-soft"
      >
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl hover:bg-white/60"
            onClick={() => {
              const currentIndex = days.indexOf(selectedDay);
              if (currentIndex > 0) setSelectedDay(days[currentIndex - 1]);
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex gap-3 flex-1 justify-center overflow-x-auto scrollbar-thin">
            {days.map(day => (
              <motion.button
                key={day}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDay(day)}
                className={`
                  px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap
                  ${selectedDay === day
                    ? 'bg-white text-[#1E88E5] shadow-soft'
                    : 'text-gray-600 hover:bg-white/60'
                  }
                `}
              >
                {day}
              </motion.button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl hover:bg-white/60"
            onClick={() => {
              const currentIndex = days.indexOf(selectedDay);
              if (currentIndex < days.length - 1) setSelectedDay(days[currentIndex + 1]);
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </motion.div>

      {/* Schedule Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredSchedule.length === 0 ? (
            <div className="col-span-full glass-strong rounded-2xl p-12 text-center shadow-soft">
              <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-gray-600 mb-2">No classes scheduled</h3>
              <p className="text-sm text-gray-500">
                {isAdmin || userProfile?.role === 'staff'
                  ? 'Click "Add Schedule" to create a new schedule slot'
                  : 'No classes scheduled for this day'}
              </p>
            </div>
          ) : (
            filteredSchedule.map((slot, index) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`
                  glass-strong rounded-2xl p-5 shadow-soft hover:shadow-float transition-all duration-300 cursor-pointer
                  ${slot.subject === 'Break' || slot.subject === 'Lunch' ? 'opacity-60' : ''}
                `}
              >
                <div className="flex items-start justify-between mb-3">
                  <Badge
                    variant="outline"
                    className="border-0"
                    style={{ backgroundColor: `${slot.color}20`, color: slot.color }}
                  >
                    {slot.start_time} - {slot.end_time}
                  </Badge>
                  {slot.room_number && (
                    <Badge variant="outline" className="bg-white/60 border-gray-200/50 text-gray-600">
                      <MapPin className="w-3 h-3 mr-1" />
                      {slot.room_number}
                    </Badge>
                  )}
                </div>

                <h4 className="mb-2" style={{ color: slot.color }}>
                  {slot.subject}
                </h4>
                {slot.teacher_name && (
                  <p className="text-sm text-gray-600 flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4" />
                    {slot.teacher_name}
                  </p>
                )}

                {slot.subject !== 'Break' && slot.subject !== 'Lunch' && (
                  <div className="mt-4 pt-3 border-t border-gray-200/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>60 minutes</span>
                    </div>
                    <div className="flex gap-2">
                      {isTeacher && slot.teacher_id === userProfile?.id && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => handleSubstituteRequest(slot.id!)}
                        >
                          <UserCheck className="w-4 h-4" />
                        </Button>
                      )}
                      {(isAdmin || userProfile?.role === 'staff') && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => openEditModal(slot)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteSlot(slot.id!)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setIsAddModalOpen(false);
              setIsEditModalOpen(false);
              resetForm();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="glass-strong rounded-2xl p-6 w-full max-w-2xl shadow-float max-h-[90vh] overflow-y-auto scrollbar-thin"
            >
              <div className="flex items-center justify-between mb-6">
                <h2>{isEditModalOpen ? 'Edit Schedule' : 'Add New Schedule'}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    resetForm();
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-4">
                {/* Day */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                  <select
                    value={formData.day}
                    onChange={e => setFormData({ ...formData, day: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20 outline-none transition-all"
                  >
                    {days.map(day => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <select
                      value={formData.start_time}
                      onChange={e => setFormData({ ...formData, start_time: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20 outline-none transition-all"
                    >
                      {timeSlots.map(time => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <select
                      value={formData.end_time}
                      onChange={e => setFormData({ ...formData, end_time: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20 outline-none transition-all"
                    >
                      {timeSlots.map(time => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20 outline-none transition-all"
                    placeholder="e.g., Mathematics"
                  />
                </div>
                {/* Teacher */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teacher</label>
                  <select
                    value={formData.teacher_id}
                    onChange={e => setFormData({ ...formData, teacher_id: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20 outline-none transition-all"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.full_name} - {teacher.subject_specialization}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Room */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                  <input
                    type="text"
                    value={formData.room_number}
                    onChange={e => setFormData({ ...formData, room_number: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20 outline-none transition-all"
                    placeholder="e.g., 101"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={isEditModalOpen ? handleUpdateSlot : handleAddSlot}
                  className="flex-1 gradient-primary text-white shadow-glow hover:shadow-float rounded-xl h-11 gap-2"
                >
                  <Save className="w-5 h-5" />
                  {isEditModalOpen ? 'Update' : 'Add'} Schedule
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    resetForm();
                  }}
                  className="px-6 rounded-xl h-11"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
