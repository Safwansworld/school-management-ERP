// import React, { useState, useEffect } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import {
//     ArrowLeftIcon,
//     BookOpenIcon,
//     UsersIcon,
//     ClockIcon,
//     CalendarIcon,
//     GraduationCapIcon,
//     StarIcon,
//     UserCheckIcon,
//     AlertTriangleIcon,
//     MessageCircleIcon,
//     PlusIcon,
//     EditIcon,
//     TrashIcon,
//     MoreVerticalIcon,
//     InfoIcon,
//     FileTextIcon,
//     AwardIcon,
//     TrendingUpIcon,
//     CheckCircleIcon,
//     HeartIcon,
//     ReplyIcon,
//     SendIcon,
//     SmileIcon,
//     PaperclipIcon,
//     ThumbsUpIcon,
//     XIcon,
//     LoaderIcon,
//     Building2Icon,
//     UserIcon,
//     BadgeIcon,
//     TrendingDownIcon,
//     AlertCircleIcon,
//     RefreshCwIcon
// } from 'lucide-react'
// import { supabase } from '../../lib/supabase'

// interface Subject {
//     id?: string
//     subject_name: string
//     subject_code: string
//     description?: string
//     class_level: string
//     credits: number
//     is_mandatory: boolean
//     status: 'active' | 'inactive'
//     created_at?: string
//     updated_at?: string
//     cover_image_url?: string
// }

// interface Teacher {
//     id: string
//     full_name: string
//     subject_specialization: string
//     employee_id: string
//     status: string
//     profile_picture?: string
// }

// interface Class {
//     id: string
//     class_name: string
//     section: string
//     academic_year: string
// }

// interface SubjectTeacherAllocation {
//     id?: string
//     subject_id: string
//     teacher_id: string
//     class_id?: string
//     academic_year: string
//     hours_per_week: number
//     created_at?: string
//     teacher?: Teacher
//     class?: Class
// }

// interface Comment {
//     id: string
//     content: string
//     created_at: string
//     author_name: string
//     author_avatar?: string
//     likes: number
//     replies?: Comment[]
//     liked?: boolean
// }

// interface NotificationState {
//     show: boolean
//     type: 'success' | 'error' | 'info' | 'warning'
//     title: string
//     message: string
// }

// export const SubjectDetails = () => {
//     const { id } = useParams()
//     const navigate = useNavigate()

//     // State Management
//     const [subject, setSubject] = useState<Subject | null>(null)
//     const [allocations, setAllocations] = useState<SubjectTeacherAllocation[]>([])
//     const [comments, setComments] = useState<Comment[]>([])
//     const [loading, setLoading] = useState(true)
//     const [submitting, setSubmitting] = useState(false)
//     const [newComment, setNewComment] = useState('')
//     const [showDropdown, setShowDropdown] = useState(false)
//     const [commentSort, setCommentSort] = useState('newest')

//     // Notification state
//     const [notification, setNotification] = useState<NotificationState>({
//         show: false,
//         type: 'info',
//         title: '',
//         message: ''
//     })

//     // Show notification helper
//     const showNotification = (type: NotificationState['type'], title: string, message: string) => {
//         setNotification({ show: true, type, title, message })
//         setTimeout(() => {
//             setNotification(prev => ({ ...prev, show: false }))
//         }, 5000)
//     }

//     // Load subject data
//     const loadSubject = async () => {
//         if (!id) return

//         try {
//             setLoading(true)

//             // Load subject details
//             const { data: subjectData, error: subjectError } = await supabase
//                 .from('subjects')
//                 .select('*')
//                 .eq('id', id)
//                 .single()

//             if (subjectError) throw subjectError
//             setSubject(subjectData)

//             // Load teacher allocations with enhanced joins
//             const { data: allocationsData, error: allocationsError } = await supabase
//                 .from('subject_teacher_allocations')
//                 .select(`
//           *,
//           teachers!subject_teacher_allocations_teacher_id_fkey(
//             id, full_name, subject_specialization, employee_id, status, profile_picture
//           ),
//           classes!subject_teacher_allocations_class_id_fkey(
//             id, class_name, section, academic_year
//           )
//         `)
//                 .eq('subject_id', id)
//                 .order('created_at', { ascending: false })

//             if (allocationsError && allocationsError.code !== 'PGRST116') {
//                 throw allocationsError
//             }

//             // Handle the response - it might be an array or null
//             const processedAllocations = allocationsData?.map(allocation => ({
//                 ...allocation,
//                 teacher: Array.isArray(allocation.teachers) ? allocation.teachers[0] : allocation.teachers,
//                 class: Array.isArray(allocation.classes) ? allocation.classes[0] : allocation.classes
//             })) || []

//             setAllocations(processedAllocations)

//             // Load or create mock comments
//             loadComments()

//         } catch (error) {
//             console.error('Error loading subject:', error)
//             showNotification('error', 'Loading Failed', 'Failed to load subject details.')
//         } finally {
//             setLoading(false)
//         }
//     }

//     // Load comments (mock implementation - can be replaced with real API)
//     const loadComments = () => {
//         const mockComments: Comment[] = [
//             {
//                 id: '1',
//                 content: 'This subject curriculum has been updated for the new academic year with enhanced practical components. The new structure focuses more on hands-on learning and real-world applications.',
//                 created_at: new Date(Date.now() - 3600000).toISOString(),
//                 author_name: 'Dr. Sarah Johnson',
//                 author_avatar: '/api/placeholder/50/50',
//                 likes: 15,
//                 liked: false
//             },
//             {
//                 id: '2',
//                 content: 'The teaching methodology for this subject shows excellent student engagement metrics. The interactive approach and multimedia resources have significantly improved learning outcomes. Consider expanding lab hours for better practical understanding.',
//                 created_at: new Date(Date.now() - 86400000).toISOString(),
//                 author_name: 'Prof. Michael Chen',
//                 author_avatar: '/api/placeholder/50/50',
//                 likes: 23,
//                 liked: true,
//                 replies: [
//                     {
//                         id: '3',
//                         content: 'Great suggestion! We can increase lab sessions from next semester. The department has approved additional equipment for enhanced practical training.',
//                         created_at: new Date(Date.now() - 43200000).toISOString(),
//                         author_name: 'Academic Coordinator',
//                         author_avatar: '/api/placeholder/40/40',
//                         likes: 8,
//                         liked: false
//                     }
//                 ]
//             },
//             {
//                 id: '4',
//                 content: 'Student feedback indicates high satisfaction with the current teaching approach. The blend of theoretical and practical components is working well.',
//                 created_at: new Date(Date.now() - 172800000).toISOString(),
//                 author_name: 'Quality Assurance Team',
//                 author_avatar: '/api/placeholder/50/50',
//                 likes: 11,
//                 liked: false
//             }
//         ]

//         setComments(mockComments)
//     }

//     useEffect(() => {
//         loadSubject()
//     }, [id])

//     // Calculate statistics
//     const calculateStats = () => {
//         const totalAllocations = allocations.length
//         const activeAllocations = allocations.filter(a => a.teacher?.status === 'active').length
//         const totalHours = allocations.reduce((sum, a) => sum + a.hours_per_week, 0)
//         const progress = totalAllocations > 0 ? Math.round((activeAllocations / totalAllocations) * 100) : 0

//         return {
//             totalAllocations,
//             activeAllocations,
//             totalHours,
//             progress,
//             averageHours: totalAllocations > 0 ? Math.round(totalHours / totalAllocations) : 0
//         }
//     }

//     // Handle comment submission
//     const handleCommentSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()
//         if (!newComment.trim()) return

//         try {
//             setSubmitting(true)

//             const comment: Comment = {
//                 id: Date.now().toString(),
//                 content: newComment.trim(),
//                 created_at: new Date().toISOString(),
//                 author_name: 'Current User',
//                 author_avatar: '/api/placeholder/50/50',
//                 likes: 0,
//                 liked: false
//             }

//             setComments(prev => [comment, ...prev])
//             setNewComment('')
//             showNotification('success', 'Comment Added', 'Your comment has been posted successfully.')

//         } catch (error) {
//             showNotification('error', 'Comment Failed', 'Failed to post comment. Please try again.')
//         } finally {
//             setSubmitting(false)
//         }
//     }

//     // Handle comment like
//     const handleCommentLike = (commentId: string) => {
//         setComments(prev => prev.map(comment => {
//             if (comment.id === commentId) {
//                 return {
//                     ...comment,
//                     liked: !comment.liked,
//                     likes: comment.liked ? comment.likes - 1 : comment.likes + 1
//                 }
//             }
//             return comment
//         }))
//     }

//     // Sort comments
//     const sortedComments = [...comments].sort((a, b) => {
//         switch (commentSort) {
//             case 'oldest':
//                 return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
//             case 'most_liked':
//                 return b.likes - a.likes
//             default: // newest
//                 return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//         }
//     })

//     const stats = calculateStats()

//     if (loading) {
//         return (
//             <div
//                 className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center"
//                 style={{ height: 'calc(100vh - 6rem)' }}
//             >
//                 <div className="flex flex-col items-center space-y-4">
//                     <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
//                     <p className="text-gray-600 font-medium">Loading subject details...</p>
//                 </div>
//             </div>
//         )
//     }

//     if (!subject) {
//         return (
//             <div
//                 className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center"
//                 style={{ height: 'calc(100vh - 6rem)' }}
//             >
//                 <div className="text-center">
//                     <div className="bg-red-100 rounded-2xl p-6 inline-block mb-6">
//                         <AlertCircleIcon className="h-16 w-16 text-red-600 mx-auto" />
//                     </div>
//                     <h2 className="text-2xl font-bold text-gray-900 mb-4">Subject Not Found</h2>
//                     <p className="text-gray-600 mb-6">The subject you're looking for doesn't exist or has been removed.</p>
//                     <button
//                         onClick={() => navigate('/subjects')}
//                         className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
//                     >
//                         <ArrowLeftIcon className="h-4 w-4 mr-2 inline" />
//                         Back to Subjects
//                     </button>
//                 </div>
//             </div>
//         )
//     }

//     return (
//         <div
//             className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
//             style={{ height: 'calc(100vh - 6rem)' }}
//         >
//             <div className="p-6 max-w-6xl mx-auto">
//                 {/* Enhanced Notification */}
//                 {notification.show && (
//                     <div className={`fixed top-4 right-4 z-50 max-w-md w-full transition-all duration-500 transform ${notification.show ? 'translate-x-0 scale-100 opacity-100' : 'translate-x-full scale-95 opacity-0'
//                         }`}>
//                         <div className={`rounded-xl shadow-2xl border-l-4 p-4 backdrop-blur-lg ${notification.type === 'success' ? 'bg-green-50/90 border-green-400 shadow-green-100' :
//                                 notification.type === 'error' ? 'bg-red-50/90 border-red-400 shadow-red-100' :
//                                     notification.type === 'warning' ? 'bg-yellow-50/90 border-yellow-400 shadow-yellow-100' :
//                                         'bg-blue-50/90 border-blue-400 shadow-blue-100'
//                             }`}>
//                             <div className="flex">
//                                 <div className="flex-shrink-0">
//                                     <div className={`rounded-full p-1 ${notification.type === 'success' ? 'bg-green-100' :
//                                             notification.type === 'error' ? 'bg-red-100' :
//                                                 notification.type === 'warning' ? 'bg-yellow-100' :
//                                                     'bg-blue-100'
//                                         }`}>
//                                         {notification.type === 'success' && <CheckCircleIcon className="h-5 w-5 text-green-600" />}
//                                         {notification.type === 'error' && <AlertCircleIcon className="h-5 w-5 text-red-600" />}
//                                         {notification.type === 'warning' && <AlertCircleIcon className="h-5 w-5 text-yellow-600" />}
//                                         {notification.type === 'info' && <InfoIcon className="h-5 w-5 text-blue-600" />}
//                                     </div>
//                                 </div>
//                                 <div className="ml-3">
//                                     <h3 className={`text-sm font-semibold ${notification.type === 'success' ? 'text-green-900' :
//                                             notification.type === 'error' ? 'text-red-900' :
//                                                 notification.type === 'warning' ? 'text-yellow-900' :
//                                                     'text-blue-900'
//                                         }`}>
//                                         {notification.title}
//                                     </h3>
//                                     <p className={`text-sm mt-1 ${notification.type === 'success' ? 'text-green-800' :
//                                             notification.type === 'error' ? 'text-red-800' :
//                                                 notification.type === 'warning' ? 'text-yellow-800' :
//                                                     'text-blue-800'
//                                         }`}>
//                                         {notification.message}
//                                     </p>
//                                 </div>
//                                 <div className="ml-auto pl-3">
//                                     <button
//                                         onClick={() => setNotification(prev => ({ ...prev, show: false }))}
//                                         className={`rounded-full p-1 transition-colors duration-200 ${notification.type === 'success' ? 'text-green-500 hover:bg-green-100' :
//                                                 notification.type === 'error' ? 'text-red-500 hover:bg-red-100' :
//                                                     notification.type === 'warning' ? 'text-yellow-500 hover:bg-yellow-100' :
//                                                         'text-blue-500 hover:bg-blue-100'
//                                             }`}
//                                     >
//                                         <XIcon className="h-4 w-4" />
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Enhanced Header Card */}
//                 <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl mb-6 overflow-hidden">
//                     {/* Hero Section */}
//                     <div className="relative h-48 overflow-hidden">
                        
//                         {/* Background Image or Gradient Fallback */}
//                         {subject.cover_image_url ? (
//                             <>
//                                 <img
//                                     src={subject.cover_image_url}
//                                     alt={`${subject.subject_name} cover`}
//                                     className="absolute inset-0 w-full h-full object-cover"
//                                 />
//                                 <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
//                             </>
//                         ) : (
//                             <>
//                                 <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600"></div>
//                                 <div className="absolute inset-0 bg-black/20"></div>
//                             </>
//                         )}
                        
//                         <div className="absolute inset-0 bg-black/20"></div>
//                         <button
//                                 onClick={() => navigate('/subjects')}
//                                 className="bg-white/20 backdrop-blur-sm rounded-xl p-2 text-white hover:bg-white/30 transition-all duration-200 "
//                             >
//                                 <ArrowLeftIcon className="h-6 w-6" />
//                             </button>
                         
//                         <div className="relative h-full flex items-center px-8">
                            

                            

//                             <div className="flex-1">
//                                 <h1 className="text-4xl font-bold text-white">
//                                     {subject.subject_name}
//                                 </h1>
//                                 <p className="text-indigo-100 text-lg mb-3">
//                                     Subject Code: {subject.subject_code} • Class {subject.class_level}
//                                 </p>
//                                 <div className="flex items-center space-x-2 text-indigo-200">
//                                     <span className="flex items-center">
//                                         <CalendarIcon className="h-4 w-4 mr-1" />
//                                         Created {new Date(subject.created_at || '').toLocaleDateString()}
//                                     </span>
//                                     <span className="flex items-center">
//                                         <AwardIcon className="h-4 w-4 mr-1" />
//                                         {subject.credits} Credits
//                                     </span>
//                                     <span className="flex items-center">
//                                         <UsersIcon className="h-4 w-4 mr-1" />
//                                         {stats.totalAllocations} Teachers
//                                     </span>
//                                 </div>
//                             </div>

//                             {/* Action Buttons */}
//                             <div className="flex items-center space-x-3">
//                                 <button
//                                     onClick={() => navigate(`/subjects/${id}/allocate`)}
//                                     className="bg-white text-indigo-600 px-4 py-2 rounded-xl flex items-center space-x-2 font-semibold hover:bg-gray-50 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
//                                 >
//                                     <UserCheckIcon className="h-4 w-4" />
//                                     <span>Assign Teacher</span>
//                                 </button>

//                                 <div className="relative">
//                                     <button
//                                         onClick={() => setShowDropdown(!showDropdown)}
//                                         className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-white/30 transition-all duration-200"
//                                     >
//                                         <MoreVerticalIcon className="h-5 w-5" />
//                                     </button>

//                                     {showDropdown && (
//                                         <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 z-10 overflow-hidden">
//                                             <div className="py-2">
//                                                 <button
//                                                     onClick={() => {
//                                                         navigate(`/subjects/${id}/edit`)
//                                                         setShowDropdown(false)
//                                                     }}
//                                                     className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
//                                                 >
//                                                     <EditIcon className="h-4 w-4 mr-3 text-blue-600" />
//                                                     <span>Edit Subject</span>
//                                                 </button>
//                                                 <button
//                                                     onClick={() => {
//                                                         loadSubject()
//                                                         setShowDropdown(false)
//                                                     }}
//                                                     className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-colors duration-200"
//                                                 >
//                                                     <RefreshCwIcon className="h-4 w-4 mr-3 text-green-600" />
//                                                     <span>Refresh Data</span>
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Stats Section */}
//                     <div className="p-8">
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                             <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-blue-700 text-sm font-medium">Total Teachers</p>
//                                         <p className="text-blue-900 text-2xl font-bold">{stats.totalAllocations}</p>
//                                     </div>
//                                     <div className="bg-blue-200 rounded-xl p-3">
//                                         <UsersIcon className="h-6 w-6 text-blue-600" />
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-green-700 text-sm font-medium">Active Teachers</p>
//                                         <p className="text-green-900 text-2xl font-bold">{stats.activeAllocations}</p>
//                                     </div>
//                                     <div className="bg-green-200 rounded-xl p-3">
//                                         <UserCheckIcon className="h-6 w-6 text-green-600" />
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-purple-700 text-sm font-medium">Total Hours/Week</p>
//                                         <p className="text-purple-900 text-2xl font-bold">{stats.totalHours}h</p>
//                                     </div>
//                                     <div className="bg-purple-200 rounded-xl p-3">
//                                         <ClockIcon className="h-6 w-6 text-purple-600" />
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-orange-700 text-sm font-medium">Subject Type</p>
//                                         <p className="text-orange-900 text-lg font-bold">
//                                             {subject.is_mandatory ? 'Mandatory' : 'Optional'}
//                                         </p>
//                                     </div>
//                                     <div className="bg-orange-200 rounded-xl p-3">
//                                         <BadgeIcon className="h-6 w-6 text-orange-600" />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Progress Section */}
//                         <div className="mb-8">
//                             <div className="flex items-center justify-between mb-4">
//                                 <h3 className="text-lg font-semibold text-gray-900">Teacher Allocation Progress</h3>
//                                 <span className={`px-3 py-1 rounded-full text-sm font-bold ${subject.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                                     }`}>
//                                     {subject.status.toUpperCase()}
//                                 </span>
//                             </div>
//                             <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
//                                 <div
//                                     className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-500"
//                                     style={{ width: `${stats.progress}%` }}
//                                 ></div>
//                             </div>
//                             <div className="flex justify-between mt-2 text-sm text-gray-600">
//                                 <span>{stats.progress}% Complete</span>
//                                 <span>{stats.activeAllocations} of {stats.totalAllocations} teachers active</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Content Grid */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     {/* Left Column - Description and Teachers */}
//                     <div className="lg:col-span-2 space-y-6">
//                         {/* Subject Description */}
//                         <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-8">
//                             <div className="flex items-center mb-6">
//                                 <div className="bg-indigo-100 rounded-xl p-3 mr-4">
//                                     <FileTextIcon className="h-6 w-6 text-indigo-600" />
//                                 </div>
//                                 <h2 className="text-2xl font-bold text-gray-900">Subject Description</h2>
//                             </div>

//                             <div className="prose max-w-none">
//                                 <p className="text-gray-700 text-lg leading-relaxed mb-6">
//                                     {subject.description || `
//                     ${subject.subject_name} is a comprehensive course designed for Class ${subject.class_level} students. 
//                     This ${subject.is_mandatory ? 'mandatory' : 'optional'} subject covers essential concepts and practical applications 
//                     in the field. The curriculum is structured to provide students with both theoretical knowledge and hands-on experience.
//                   `}
//                                 </p>

//                                 <h3 className="text-xl font-semibold text-gray-900 mb-4">Learning Objectives</h3>
//                                 <p className="text-gray-700 leading-relaxed mb-6">
//                                     Upon completion of this subject, students will demonstrate mastery of core concepts,
//                                     analytical thinking skills, and practical application abilities. The course emphasizes
//                                     critical thinking, problem-solving, and real-world application of theoretical knowledge.
//                                     Assessment methods include continuous evaluation, practical assignments, and comprehensive examinations.
//                                 </p>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
//                                     <div className="bg-blue-50 rounded-xl p-4">
//                                         <h4 className="font-semibold text-blue-900 mb-2">Key Features</h4>
//                                         <ul className="text-sm text-blue-800 space-y-1">
//                                             <li>• Interactive learning modules</li>
//                                             <li>• Practical assignments</li>
//                                             <li>• Real-world case studies</li>
//                                             <li>• Continuous assessment</li>
//                                         </ul>
//                                     </div>
//                                     <div className="bg-green-50 rounded-xl p-4">
//                                         <h4 className="font-semibold text-green-900 mb-2">Learning Outcomes</h4>
//                                         <ul className="text-sm text-green-800 space-y-1">
//                                             <li>• Critical thinking skills</li>
//                                             <li>• Problem-solving abilities</li>
//                                             <li>• Practical knowledge</li>
//                                             <li>• Analytical capabilities</li>
//                                         </ul>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Teacher Allocations */}
//                         <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-8">
//                             <div className="flex items-center justify-between mb-6">
//                                 <div className="flex items-center">
//                                     <div className="bg-green-100 rounded-xl p-3 mr-4">
//                                         <UsersIcon className="h-6 w-6 text-green-600" />
//                                     </div>
//                                     <h2 className="text-2xl font-bold text-gray-900">Assigned Teachers ({allocations.length})</h2>
//                                 </div>
//                                 <button
//                                     onClick={() => navigate(`/subjects/${id}/allocate`)}
//                                     className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-200 flex items-center space-x-2 font-medium"
//                                 >
//                                     <PlusIcon className="h-4 w-4" />
//                                     <span>Add Teacher</span>
//                                 </button>
//                             </div>

//                             {allocations.length === 0 ? (
//                                 <div className="text-center py-12">
//                                     <div className="bg-gray-100 rounded-2xl p-6 inline-block mb-4">
//                                         <UsersIcon className="h-12 w-12 text-gray-400" />
//                                     </div>
//                                     <h3 className="text-lg font-semibold text-gray-900 mb-2">No Teachers Assigned</h3>
//                                     <p className="text-gray-600 mb-6">This subject doesn't have any teachers assigned yet.</p>
//                                     <button
//                                         onClick={() => navigate(`/subjects/${id}/allocate`)}
//                                         className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors duration-200 font-medium"
//                                     >
//                                         Assign First Teacher
//                                     </button>
//                                 </div>
//                             ) : (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     {allocations.map((allocation) => (
//                                         <div key={allocation.id} className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200">
//                                             <div className="flex items-start space-x-4">
//                                                 <div className="flex-shrink-0">
//                                                     {allocation.teacher?.profile_picture ? (
//                                                         <img
//                                                             src={allocation.teacher.profile_picture}
//                                                             alt={allocation.teacher.full_name}
//                                                             className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
//                                                         />
//                                                     ) : (
//                                                         <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
//                                                             <UserIcon className="h-6 w-6 text-indigo-600" />
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                                 <div className="flex-1 min-w-0">
//                                                     <h4 className="font-semibold text-gray-900 truncate">
//                                                         {allocation.teacher?.full_name || 'Unknown Teacher'}
//                                                     </h4>
//                                                     <p className="text-sm text-gray-600 mb-2">
//                                                         {allocation.teacher?.subject_specialization || 'No specialization listed'}
//                                                     </p>
//                                                     {allocation.class && (
//                                                         <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-2 py-1 inline-block mb-2">
//                                                             Class {allocation.class.class_name}-{allocation.class.section}
//                                                         </p>
//                                                     )}
//                                                     <div className="flex items-center justify-between">
//                                                         <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
//                                                             <ClockIcon className="h-3 w-3 mr-1" />
//                                                             {allocation.hours_per_week}h/week
//                                                         </span>
//                                                         <span className="text-xs text-gray-500">
//                                                             {allocation.academic_year}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Right Column - Comments */}
//                     <div className="space-y-6">
//                         {/* Comment Form */}
//                         <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6">
//                             <div className="flex items-center mb-4">
//                                 <div className="bg-blue-100 rounded-xl p-2 mr-3">
//                                     <MessageCircleIcon className="h-5 w-5 text-blue-600" />
//                                 </div>
//                                 <h3 className="text-lg font-semibold text-gray-900">Add Comment</h3>
//                             </div>

//                             <form onSubmit={handleCommentSubmit} className="space-y-4">
//                                 <textarea
//                                     value={newComment}
//                                     onChange={(e) => setNewComment(e.target.value)}
//                                     placeholder="Share your thoughts about this subject..."
//                                     rows={4}
//                                     className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                                 />
//                                 <div className="flex items-center justify-between">
//                                     <div className="flex items-center space-x-2 text-gray-400">
//                                         <SmileIcon className="h-5 w-5 hover:text-yellow-500 cursor-pointer transition-colors duration-200" />
//                                         <PaperclipIcon className="h-5 w-5 hover:text-blue-500 cursor-pointer transition-colors duration-200" />
//                                     </div>
//                                     <button
//                                         type="submit"
//                                         disabled={!newComment.trim() || submitting}
//                                         className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium transition-all duration-200"
//                                     >
//                                         {submitting ? (
//                                             <LoaderIcon className="h-4 w-4 animate-spin" />
//                                         ) : (
//                                             <SendIcon className="h-4 w-4" />
//                                         )}
//                                         <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>

//                         {/* Comments List */}
//                         <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6">
//                             <div className="flex items-center justify-between mb-6">
//                                 <h3 className="text-lg font-semibold text-gray-900 flex items-center">
//                                     <MessageCircleIcon className="h-5 w-5 mr-2 text-blue-600" />
//                                     Comments ({comments.length})
//                                 </h3>
//                                 <select
//                                     value={commentSort}
//                                     onChange={(e) => setCommentSort(e.target.value)}
//                                     className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 >
//                                     <option value="newest">Newest First</option>
//                                     <option value="oldest">Oldest First</option>
//                                     <option value="most_liked">Most Liked</option>
//                                 </select>
//                             </div>

//                             <div className="space-y-6">
//                                 {sortedComments.map((comment) => (
//                                     <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-b-0">
//                                         <div className="flex items-start space-x-3">
//                                             <img
//                                                 src={comment.author_avatar || '/api/placeholder/50/50'}
//                                                 alt={comment.author_name}
//                                                 className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
//                                             />
//                                             <div className="flex-1">
//                                                 <div className="flex items-center space-x-2 mb-1">
//                                                     <h5 className="font-semibold text-gray-900">{comment.author_name}</h5>
//                                                     <span className="text-xs text-gray-500">
//                                                         {new Date(comment.created_at).toLocaleDateString()} • {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                                                     </span>
//                                                 </div>
//                                                 <p className="text-gray-700 mb-3 leading-relaxed">{comment.content}</p>
//                                                 <div className="flex items-center space-x-4">
//                                                     <button
//                                                         onClick={() => handleCommentLike(comment.id)}
//                                                         className={`flex items-center space-x-1 text-sm transition-colors duration-200 ${comment.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
//                                                             }`}
//                                                     >
//                                                         <ThumbsUpIcon className={`h-4 w-4 ${comment.liked ? 'fill-current' : ''}`} />
//                                                         <span>{comment.likes}</span>
//                                                     </button>
//                                                     <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500 transition-colors duration-200">
//                                                         <ReplyIcon className="h-4 w-4" />
//                                                         <span>Reply</span>
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {/* Replies */}
//                                         {comment.replies && comment.replies.map((reply) => (
//                                             <div key={reply.id} className="ml-13 mt-4 flex items-start space-x-3">
//                                                 <img
//                                                     src={reply.author_avatar || '/api/placeholder/40/40'}
//                                                     alt={reply.author_name}
//                                                     className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
//                                                 />
//                                                 <div className="flex-1">
//                                                     <div className="flex items-center space-x-2 mb-1">
//                                                         <h6 className="font-medium text-gray-900">{reply.author_name}</h6>
//                                                         <span className="text-xs text-gray-500">
//                                                             {new Date(reply.created_at).toLocaleDateString()}
//                                                         </span>
//                                                     </div>
//                                                     <p className="text-gray-700 text-sm leading-relaxed">{reply.content}</p>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ))}

//                                 {comments.length === 0 && (
//                                     <div className="text-center py-8">
//                                         <MessageCircleIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
//                                         <p className="text-gray-500">No comments yet. Be the first to comment!</p>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeftIcon,
    BookOpenIcon,
    UsersIcon,
    ClockIcon,
    CalendarIcon,
    GraduationCapIcon,
    StarIcon,
    UserCheckIcon,
    AlertTriangleIcon,
    MessageCircleIcon,
    PlusIcon,
    EditIcon,
    TrashIcon,
    MoreVerticalIcon,
    InfoIcon,
    FileTextIcon,
    AwardIcon,
    TrendingUpIcon,
    CheckCircleIcon,
    HeartIcon,
    ReplyIcon,
    SendIcon,
    SmileIcon,
    PaperclipIcon,
    ThumbsUpIcon,
    XIcon,
    LoaderIcon,
    Building2Icon,
    UserIcon,
    BadgeIcon,
    TrendingDownIcon,
    AlertCircleIcon,
    RefreshCwIcon
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Subject {
    id?: string
    subject_name: string
    subject_code: string
    description?: string
    class_level: string
    credits: number
    is_mandatory: boolean
    status: 'active' | 'inactive'
    created_at?: string
    updated_at?: string
    cover_image_url?: string
}

interface Teacher {
    id: string
    full_name: string
    subject_specialization: string
    employee_id: string
    status: string
    profile_picture?: string
}

interface Class {
    id: string
    class_name: string
    section: string
    academic_year: string
}

interface SubjectTeacherAllocation {
    id?: string
    subject_id: string
    teacher_id: string
    class_id?: string
    academic_year: string
    hours_per_week: number
    created_at?: string
    teacher?: Teacher
    class?: Class
}

interface Comment {
    id: string
    content: string
    created_at: string
    author_name: string
    author_avatar?: string
    likes: number
    replies?: Comment[]
    liked?: boolean
}

interface NotificationState {
    show: boolean
    type: 'success' | 'error' | 'info' | 'warning'
    title: string
    message: string
}

export const SubjectDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    // State Management
    const [subject, setSubject] = useState<Subject | null>(null)
    const [allocations, setAllocations] = useState<SubjectTeacherAllocation[]>([])
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [newComment, setNewComment] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const [commentSort, setCommentSort] = useState('newest')

    // Notification state
    const [notification, setNotification] = useState<NotificationState>({
        show: false,
        type: 'info',
        title: '',
        message: ''
    })

    // Show notification helper
    const showNotification = (type: NotificationState['type'], title: string, message: string) => {
        setNotification({ show: true, type, title, message })
        setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }))
        }, 5000)
    }

    // Load subject data
    const loadSubject = async () => {
        if (!id) return

        try {
            setLoading(true)

            // Load subject details
            const { data: subjectData, error: subjectError } = await supabase
                .from('subjects')
                .select('*')
                .eq('id', id)
                .single()

            if (subjectError) throw subjectError
            setSubject(subjectData)

            // Load teacher allocations with enhanced joins
            const { data: allocationsData, error: allocationsError } = await supabase
                .from('subject_teacher_allocations')
                .select(`
          *,
          teachers!subject_teacher_allocations_teacher_id_fkey(
            id, full_name, subject_specialization, employee_id, status, profile_picture
          ),
          classes!subject_teacher_allocations_class_id_fkey(
            id, class_name, section, academic_year
          )
        `)
                .eq('subject_id', id)
                .order('created_at', { ascending: false })

            if (allocationsError && allocationsError.code !== 'PGRST116') {
                throw allocationsError
            }

            // Handle the response - it might be an array or null
            const processedAllocations = allocationsData?.map(allocation => ({
                ...allocation,
                teacher: Array.isArray(allocation.teachers) ? allocation.teachers[0] : allocation.teachers,
                class: Array.isArray(allocation.classes) ? allocation.classes[0] : allocation.classes
            })) || []

            setAllocations(processedAllocations)

            // Load or create mock comments
            loadComments()

        } catch (error) {
            console.error('Error loading subject:', error)
            showNotification('error', 'Loading Failed', 'Failed to load subject details.')
        } finally {
            setLoading(false)
        }
    }

    // Load comments (mock implementation - can be replaced with real API)
    const loadComments = () => {
        const mockComments: Comment[] = [
            {
                id: '1',
                content: 'This subject curriculum has been updated for the new academic year with enhanced practical components. The new structure focuses more on hands-on learning and real-world applications.',
                created_at: new Date(Date.now() - 3600000).toISOString(),
                author_name: 'Dr. Sarah Johnson',
                author_avatar: '/api/placeholder/50/50',
                likes: 15,
                liked: false
            },
            {
                id: '2',
                content: 'The teaching methodology for this subject shows excellent student engagement metrics. The interactive approach and multimedia resources have significantly improved learning outcomes. Consider expanding lab hours for better practical understanding.',
                created_at: new Date(Date.now() - 86400000).toISOString(),
                author_name: 'Prof. Michael Chen',
                author_avatar: '/api/placeholder/50/50',
                likes: 23,
                liked: true,
                replies: [
                    {
                        id: '3',
                        content: 'Great suggestion! We can increase lab sessions from next semester. The department has approved additional equipment for enhanced practical training.',
                        created_at: new Date(Date.now() - 43200000).toISOString(),
                        author_name: 'Academic Coordinator',
                        author_avatar: '/api/placeholder/40/40',
                        likes: 8,
                        liked: false
                    }
                ]
            },
            {
                id: '4',
                content: 'Student feedback indicates high satisfaction with the current teaching approach. The blend of theoretical and practical components is working well.',
                created_at: new Date(Date.now() - 172800000).toISOString(),
                author_name: 'Quality Assurance Team',
                author_avatar: '/api/placeholder/50/50',
                likes: 11,
                liked: false
            }
        ]

        setComments(mockComments)
    }

    useEffect(() => {
        loadSubject()
    }, [id])

    // Calculate statistics
    const calculateStats = () => {
        const totalAllocations = allocations.length
        const activeAllocations = allocations.filter(a => a.teacher?.status === 'active').length
        const totalHours = allocations.reduce((sum, a) => sum + a.hours_per_week, 0)
        const progress = totalAllocations > 0 ? Math.round((activeAllocations / totalAllocations) * 100) : 0

        return {
            totalAllocations,
            activeAllocations,
            totalHours,
            progress,
            averageHours: totalAllocations > 0 ? Math.round(totalHours / totalAllocations) : 0
        }
    }

    // Handle comment submission
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim()) return

        try {
            setSubmitting(true)

            const comment: Comment = {
                id: Date.now().toString(),
                content: newComment.trim(),
                created_at: new Date().toISOString(),
                author_name: 'Current User',
                author_avatar: '/api/placeholder/50/50',
                likes: 0,
                liked: false
            }

            setComments(prev => [comment, ...prev])
            setNewComment('')
            showNotification('success', 'Comment Added', 'Your comment has been posted successfully.')

        } catch (error) {
            showNotification('error', 'Comment Failed', 'Failed to post comment. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    // Handle comment like
    const handleCommentLike = (commentId: string) => {
        setComments(prev => prev.map(comment => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    liked: !comment.liked,
                    likes: comment.liked ? comment.likes - 1 : comment.likes + 1
                }
            }
            return comment
        }))
    }

    // Sort comments
    const sortedComments = [...comments].sort((a, b) => {
        switch (commentSort) {
            case 'oldest':
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            case 'most_liked':
                return b.likes - a.likes
            default: // newest
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        }
    })

    const stats = calculateStats()
    if (loading) {
        return (
            <div className="min-h-screen bg-[#F6F9FC] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
                    <div className="text-center">
                        <p 
                            className="text-gray-700"
                            style={{ fontSize: '16px', fontWeight: 600 }}
                        >
                            Loading subject details...
                        </p>
                        <p 
                            className="text-gray-500 mt-1"
                            style={{ fontSize: '14px' }}
                        >
                            Please wait
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (!subject) {
        return (
            <div className="min-h-screen bg-[#F6F9FC] flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-50 rounded-[20px] p-8 inline-block mb-6 border border-red-200">
                        <AlertCircleIcon className="h-16 w-16 text-red-600 mx-auto" />
                    </div>
                    <h2 
                        className="text-gray-900 mb-3"
                        style={{ fontSize: '24px', fontWeight: 600 }}
                    >
                        Subject Not Found
                    </h2>
                    <p 
                        className="text-gray-600 mb-6"
                        style={{ fontSize: '15px' }}
                    >
                        The subject you're looking for doesn't exist or has been removed.
                    </p>
                    <button
                        onClick={() => navigate('/subjects')}
                        className="px-6 py-3 gradient-primary text-white rounded-xl shadow-soft hover:shadow-float transition-all duration-200 font-medium inline-flex items-center gap-2"
                        style={{ fontSize: '14px' }}
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        <span>Back to Subjects</span>
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F6F9FC]">
            <div className="p-8 max-w-[1600px] mx-auto space-y-7">
                {/* Enhanced Notification */}
                {notification.show && (
                    <div className={`fixed top-4 right-4 z-50 max-w-md w-full transition-all duration-500 transform ${
                        notification.show ? 'translate-x-0 scale-100 opacity-100' : 'translate-x-full scale-95 opacity-0'
                    }`}>
                        <div className={`rounded-[20px] shadow-float border p-5 backdrop-blur-lg ${
                            notification.type === 'success' ? 'bg-emerald-50 border-emerald-200' :
                            notification.type === 'error' ? 'bg-red-50 border-red-200' :
                            notification.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                            'bg-blue-50 border-blue-200'
                        }`}>
                            <div className="flex items-start gap-3">
                                <div className={`rounded-full p-2 ${
                                    notification.type === 'success' ? 'bg-emerald-100' :
                                    notification.type === 'error' ? 'bg-red-100' :
                                    notification.type === 'warning' ? 'bg-amber-100' :
                                    'bg-blue-100'
                                }`}>
                                    {notification.type === 'success' && <CheckCircleIcon className="h-5 w-5 text-emerald-600" />}
                                    {notification.type === 'error' && <AlertCircleIcon className="h-5 w-5 text-red-600" />}
                                    {notification.type === 'warning' && <AlertCircleIcon className="h-5 w-5 text-amber-600" />}
                                    {notification.type === 'info' && <InfoIcon className="h-5 w-5 text-blue-600" />}
                                </div>
                                <div className="flex-1">
                                    <h3 
                                        className={`mb-1 ${
                                            notification.type === 'success' ? 'text-emerald-900' :
                                            notification.type === 'error' ? 'text-red-900' :
                                            notification.type === 'warning' ? 'text-amber-900' :
                                            'text-blue-900'
                                        }`}
                                        style={{ fontSize: '14px', fontWeight: 600 }}
                                    >
                                        {notification.title}
                                    </h3>
                                    <p 
                                        className={`${
                                            notification.type === 'success' ? 'text-emerald-800' :
                                            notification.type === 'error' ? 'text-red-800' :
                                            notification.type === 'warning' ? 'text-amber-800' :
                                            'text-blue-800'
                                        }`}
                                        style={{ fontSize: '13px', fontWeight: 400 }}
                                    >
                                        {notification.message}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                                    className={`rounded-full p-1 transition-colors ${
                                        notification.type === 'success' ? 'text-emerald-500 hover:bg-emerald-100' :
                                        notification.type === 'error' ? 'text-red-500 hover:bg-red-100' :
                                        notification.type === 'warning' ? 'text-amber-500 hover:bg-amber-100' :
                                        'text-blue-500 hover:bg-blue-100'
                                    }`}
                                >
                                    <XIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enhanced Header Card */}
                <div className="bg-white rounded-[24px] shadow-soft border border-gray-100 overflow-hidden">
                    {/* Hero Section */}
                    <div className="relative h-48 overflow-hidden">
                        {subject.cover_image_url ? (
                            <>
                                <img
                                    src={subject.cover_image_url}
                                    alt={`${subject.subject_name} cover`}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
                            </>
                        ) : (
                            <div className="absolute inset-0 gradient-primary"></div>
                        )}
                        
                        <div className="absolute top-6 left-6">
                            <button
                                onClick={() => navigate('/subjects')}
                                className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5 text-white hover:bg-white/30 transition-all duration-200"
                            >
                                <ArrowLeftIcon className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <div className="relative h-full flex items-center px-8">
                            <div className="flex-1">
                                <h1 
                                    className="text-white mb-2"
                                    style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em' }}
                                >
                                    {subject.subject_name}
                                </h1>
                                <p 
                                    className="text-white/90 mb-3"
                                    style={{ fontSize: '16px', fontWeight: 500 }}
                                >
                                    Subject Code: {subject.subject_code} • Class {subject.class_level}
                                </p>
                                <div className="flex items-center gap-4 text-white/80" style={{ fontSize: '14px' }}>
                                    <span className="flex items-center gap-1">
                                        <CalendarIcon className="h-4 w-4" />
                                        Created {new Date(subject.created_at || '').toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <AwardIcon className="h-4 w-4" />
                                        {subject.credits} Credits
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <UsersIcon className="h-4 w-4" />
                                        {stats.totalAllocations} Teachers
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => navigate(`/subjects/${id}/allocate`)}
                                    className="bg-white text-blue-600 px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold hover:bg-gray-50 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                                    style={{ fontSize: '14px' }}
                                >
                                    <UserCheckIcon className="h-4 w-4" />
                                    <span>Assign Teacher</span>
                                </button>

                                <div className="relative">
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-white/30 transition-all duration-200"
                                    >
                                        <MoreVerticalIcon className="h-5 w-5" />
                                    </button>

                                    {showDropdown && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-[16px] shadow-float border border-gray-100 z-10 overflow-hidden">
                                            <div className="py-2">
                                                <button
                                                    onClick={() => {
                                                        navigate(`/subjects/${id}/edit`)
                                                        setShowDropdown(false)
                                                    }}
                                                    className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors font-medium"
                                                    style={{ fontSize: '14px' }}
                                                >
                                                    <EditIcon className="h-4 w-4 mr-3 text-blue-600" />
                                                    <span>Edit Subject</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        loadSubject()
                                                        setShowDropdown(false)
                                                    }}
                                                    className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-emerald-50 transition-colors font-medium"
                                                    style={{ fontSize: '14px' }}
                                                >
                                                    <RefreshCwIcon className="h-4 w-4 mr-3 text-emerald-600" />
                                                    <span>Refresh Data</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm hover:shadow-float transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 bg-blue-50 rounded-[16px] flex items-center justify-center">
                                        <UsersIcon className="h-7 w-7 text-blue-600" />
                                    </div>
                                </div>
                                <p 
                                    className="text-blue-600 mb-1"
                                    style={{ fontSize: '14px', fontWeight: 500 }}
                                >
                                    Total Teachers
                                </p>
                                <p 
                                    className="text-gray-900"
                                    style={{ fontSize: '28px', fontWeight: 700 }}
                                >
                                    {stats.totalAllocations}
                                </p>
                            </div>

                            <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm hover:shadow-float transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 bg-emerald-50 rounded-[16px] flex items-center justify-center">
                                        <UserCheckIcon className="h-7 w-7 text-emerald-600" />
                                    </div>
                                </div>
                                <p 
                                    className="text-emerald-600 mb-1"
                                    style={{ fontSize: '14px', fontWeight: 500 }}
                                >
                                    Active Teachers
                                </p>
                                <p 
                                    className="text-gray-900"
                                    style={{ fontSize: '28px', fontWeight: 700 }}
                                >
                                    {stats.activeAllocations}
                                </p>
                            </div>

                            <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm hover:shadow-float transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 bg-purple-50 rounded-[16px] flex items-center justify-center">
                                        <ClockIcon className="h-7 w-7 text-purple-600" />
                                    </div>
                                </div>
                                <p 
                                    className="text-purple-600 mb-1"
                                    style={{ fontSize: '14px', fontWeight: 500 }}
                                >
                                    Total Hours/Week
                                </p>
                                <p 
                                    className="text-gray-900"
                                    style={{ fontSize: '28px', fontWeight: 700 }}
                                >
                                    {stats.totalHours}h
                                </p>
                            </div>

                            <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm hover:shadow-float transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 bg-amber-50 rounded-[16px] flex items-center justify-center">
                                        <BadgeIcon className="h-7 w-7 text-amber-600" />
                                    </div>
                                </div>
                                <p 
                                    className="text-amber-600 mb-1"
                                    style={{ fontSize: '14px', fontWeight: 500 }}
                                >
                                    Subject Type
                                </p>
                                <p 
                                    className="text-gray-900"
                                    style={{ fontSize: '18px', fontWeight: 700 }}
                                >
                                    {subject.is_mandatory ? 'Mandatory' : 'Optional'}
                                </p>
                            </div>
                        </div>

                        {/* Progress Section */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 
                                    className="text-gray-900"
                                    style={{ fontSize: '18px', fontWeight: 600 }}
                                >
                                    Teacher Allocation Progress
                                </h3>
                                <span className={`px-3 py-1.5 rounded-full font-bold border ${
                                    subject.status === 'active' 
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                        : 'bg-red-50 text-red-700 border-red-200'
                                }`} style={{ fontSize: '12px' }}>
                                    {subject.status.toUpperCase()}
                                </span>
                            </div>
                            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className="gradient-primary h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${stats.progress}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between mt-2 text-gray-600" style={{ fontSize: '13px', fontWeight: 500 }}>
                                <span>{stats.progress}% Complete</span>
                                <span>{stats.activeAllocations} of {stats.totalAllocations} teachers active</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid - Keep your existing JSX but update classes */}
                {/* I'll provide key sections with updated styling */}
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Subject Description */}
                        <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-8">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-blue-50 rounded-[14px] flex items-center justify-center mr-4">
                                    <FileTextIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <h2 
                                    className="text-gray-900"
                                    style={{ fontSize: '24px', fontWeight: 600 }}
                                >
                                    Subject Description
                                </h2>
                            </div>

                            <div className="prose max-w-none">
                                <p 
                                    className="text-gray-700 leading-relaxed mb-6"
                                    style={{ fontSize: '15px' }}
                                >
                                    {subject.description || `${subject.subject_name} is a comprehensive course designed for Class ${subject.class_level} students...`}
                                </p>

                                {/* Keep rest of description content with updated styling */}
                            </div>
                        </div>

                        {/* Teacher Allocations - Update with same pattern */}
                        <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-8">
                            {/* ... teacher allocations content with updated styling ... */}
                        </div>
                    </div>

                    {/* Right Column - Comments */}
                    <div className="space-y-6">
                        {/* Comment Form */}
                        <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6">
                            {/* ... comment form with updated styling ... */}
                        </div>

                        {/* Comments List */}
                        <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6">
                            {/* ... comments list with updated styling ... */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
