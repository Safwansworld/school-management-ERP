// import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react'
// import { useAuth } from '../../context/AuthContext'
// import { useLocation } from 'react-router-dom'
// import {
//   BellIcon,
//   SearchIcon,
//   UserIcon,
//   SettingsIcon,
//   LogOutIcon,
//   ChevronDownIcon,
//   SunIcon,
//   MoonIcon,
//   MenuIcon,
//   XIcon,
//   MailIcon,
//   PhoneIcon,
//   CalendarIcon,
//   ClockIcon,
//   MapPinIcon,
//   FilterIcon,
//   MoreVerticalIcon,
//   CheckCircleIcon,
//   AlertCircleIcon,
//   InfoIcon,
//   AlertTriangleIcon,
//   HomeIcon,
//   BuildingIcon,
//   GraduationCapIcon,
//   UsersIcon,
//   BookOpenIcon,
//   BarChart3Icon,
//   CogIcon,
//   StarIcon,
//   TrendingUpIcon,
//   ActivityIcon,
//   ShieldIcon,
//   CreditCardIcon,
//   LibraryIcon,
//   BusIcon,
// } from 'lucide-react'

// interface HeaderProps {
//   onMenuClick?: () => void
//   onSearchFocus?: () => void
// }

// interface Notification {
//   id: number
//   title: string
//   message: string
//   time: string
//   type: 'info' | 'success' | 'warning' | 'error'
//   unread: boolean
//   avatar?: string
//   icon?: JSX.Element
// }

// // Memoized Notification Item Component
// const NotificationItem = memo(
//   ({
//     notification,
//     getNotificationTypeStyles,
//   }: {
//     notification: Notification
//     getNotificationTypeStyles: (type: string) => {
//       bg: string
//       iconBg: string
//       iconColor: string
//       border: string
//     }
//   }) => {
//     const styles = getNotificationTypeStyles(notification.type)
//     return (
//       <div
//         className={`p-4 border-b border-gray-100 hover:bg-gray-50/50 transition-all duration-200 cursor-pointer group ${
//           notification.unread ? 'bg-blue-50/30' : ''
//         }`}
//       >
//         <div className="flex items-start space-x-4">
//           <div
//             className={`flex-shrink-0 p-2 rounded-xl ${styles.iconBg} ${styles.iconColor} group-hover:scale-110 transition-transform duration-200`}
//           >
//             {notification.icon}
//           </div>
//           <div className="flex-1 min-w-0">
//             <div className="flex items-center justify-between mb-1">
//               <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200">
//                 {notification.title}
//               </h4>
//               {notification.unread && (
//                 <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full ml-2 animate-pulse"></div>
//               )}
//             </div>
//             <p className="text-sm text-gray-600 mb-2 leading-relaxed line-clamp-2">
//               {notification.message}
//             </p>
//             <div className="flex items-center justify-between">
//               <span className="text-xs text-gray-500 flex items-center bg-gray-100 px-2 py-1 rounded-lg">
//                 <ClockIcon className="w-3 h-3 mr-1" />
//                 {notification.time}
//               </span>
//               <span
//                 className={`text-xs font-medium px-2 py-1 rounded-lg capitalize ${styles.bg} ${styles.iconColor} ${styles.border}`}
//               >
//                 {notification.type}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }
// )

// NotificationItem.displayName = 'NotificationItem'

// // Memoized Notifications Dropdown
// const NotificationsDropdown = memo(
//   ({
//     notifications,
//     unreadCount,
//     getNotificationTypeStyles,
//   }: {
//     notifications: Notification[]
//     unreadCount: number
//     getNotificationTypeStyles: (type: string) => {
//       bg: string
//       iconBg: string
//       iconColor: string
//       border: string
//     }
//   }) => (
//     <div className="absolute right-0 mt-3 w-96 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 z-50 max-h-[500px] overflow-hidden animate-in slide-in-from-top-2 duration-300">
//       <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
//               <BellIcon className="h-6 w-6 text-white" />
//             </div>
//             <div>
//               <h3 className="text-lg font-bold text-white">Notifications</h3>
//               <p className="text-blue-100 text-sm">{unreadCount} unread messages</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-2">
//             <button className="text-sm text-blue-100 hover:text-white font-medium px-3 py-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-all duration-200">
//               Mark all read
//             </button>
//             <button className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200">
//               <MoreVerticalIcon className="w-4 h-4 text-blue-200" />
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-h-80 overflow-y-auto">
//         {notifications.map((notification) => (
//           <NotificationItem
//             key={notification.id}
//             notification={notification}
//             getNotificationTypeStyles={getNotificationTypeStyles}
//           />
//         ))}
//       </div>

//       <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-2xl">
//         <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-semibold py-2.5 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 transform hover:scale-105">
//           View all notifications
//         </button>
//       </div>
//     </div>
//   )
// )

// NotificationsDropdown.displayName = 'NotificationsDropdown'

// // Memoized Profile Dropdown
// const ProfileDropdown = memo(
//   ({ user, handleSignOut }: { user: any; handleSignOut: () => void }) => (
//     <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-300">
//       {/* Profile Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6 rounded-t-2xl">
//         <div className="flex items-center space-x-4">
//           <div className="relative">
//             <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
//               <span className="text-white font-bold text-xl">
//                 {user?.username?.charAt(0).toUpperCase() || 'U'}
//               </span>
//             </div>
//             <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-3 border-white rounded-full"></div>
//           </div>
//           <div className="flex-1">
//             <p className="text-white font-bold text-lg">{user?.username || 'User'}</p>
//             <p className="text-blue-100 text-sm">{user?.email || 'No email'}</p>
//             <div className="flex items-center space-x-2 mt-2">
//               <span className="bg-white/20 backdrop-blur-sm text-blue-100 text-xs font-semibold px-3 py-1 rounded-lg capitalize">
//                 {user?.role || 'User'}
//               </span>
//               <span className="bg-green-400/20 text-green-100 text-xs font-semibold px-3 py-1 rounded-lg">
//                 Online
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Quick Stats */}
//       <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
//         <div className="grid grid-cols-3 gap-4">
//           <div className="text-center">
//             <p className="text-lg font-bold text-gray-900">1,234</p>
//             <p className="text-xs text-gray-500">Students</p>
//           </div>
//           <div className="text-center border-l border-r border-gray-200">
//             <p className="text-lg font-bold text-gray-900">89</p>
//             <p className="text-xs text-gray-500">Teachers</p>
//           </div>
//           <div className="text-center">
//             <p className="text-lg font-bold text-gray-900">24</p>
//             <p className="text-xs text-gray-500">Classes</p>
//           </div>
//         </div>
//       </div>

//       {/* Menu Items */}
//       <div className="py-2">
//         <button className="flex items-center space-x-3 w-full px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 group">
//           <div className="p-1.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
//             <UserIcon className="w-4 h-4 text-blue-600" />
//           </div>
//           <div className="flex-1 text-left">
//             <span className="font-medium">My Profile</span>
//             <p className="text-xs text-gray-500">View and edit profile</p>
//           </div>
//         </button>

//         <button className="flex items-center space-x-3 w-full px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 group">
//           <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors duration-200">
//             <SettingsIcon className="w-4 h-4 text-gray-600" />
//           </div>
//           <div className="flex-1 text-left">
//             <span className="font-medium">Account Settings</span>
//             <p className="text-xs text-gray-500">Privacy and security</p>
//           </div>
//         </button>

//         <button className="flex items-center space-x-3 w-full px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 group">
//           <div className="p-1.5 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors duration-200">
//             <BellIcon className="w-4 h-4 text-yellow-600" />
//           </div>
//           <div className="flex-1 text-left">
//             <span className="font-medium">Notification Preferences</span>
//             <p className="text-xs text-gray-500">Manage alerts and emails</p>
//           </div>
//         </button>
//       </div>

//       {/* Sign Out */}
//       <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-2xl">
//         <button
//           onClick={handleSignOut}
//           className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium group transform hover:scale-105"
//         >
//           <div className="p-1.5 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors duration-200">
//             <LogOutIcon className="w-4 h-4 text-red-600" />
//           </div>
//           <span>Sign Out</span>
//         </button>
//       </div>
//     </div>
//   )
// )

// ProfileDropdown.displayName = 'ProfileDropdown'

// // Main Header Component
// const HeaderComponent = ({
//   onMenuClick,
//   onSearchFocus,
// }: HeaderProps) => {
//   const { user, logout, userProfile } = useAuth()
//   const location = useLocation()
//   const [showNotifications, setShowNotifications] = useState(false)
//   const [showProfile, setShowProfile] = useState(false)
//   const [showSearch, setShowSearch] = useState(false)
//   const [darkMode, setDarkMode] = useState(false)
//   const [searchQuery, setSearchQuery] = useState('')
//   const notificationRef = useRef<HTMLDivElement>(null)
//   const profileRef = useRef<HTMLDivElement>(null)
//   const searchRef = useRef<HTMLInputElement>(null)

//   // Memoize notifications - only update when needed
//   const notifications: Notification[] = useMemo(
//     () => [
//       {
//         id: 1,
//         title: 'New Student Enrollment',
//         message: 'John Doe has been enrolled in Grade 10-A. Welcome message sent successfully.',
//         time: '2 min ago',
//         type: 'success',
//         unread: true,
//         icon: <GraduationCapIcon className="h-4 w-4" />,
//       },
//       {
//         id: 2,
//         title: 'Fee Payment Received',
//         message: 'Payment of ₹15,000 received from Sarah Wilson for Term 1 fees.',
//         time: '15 min ago',
//         type: 'success',
//         unread: true,
//         icon: <CreditCardIcon className="h-4 w-4" />,
//       },
//       {
//         id: 3,
//         title: 'Teacher Absence Alert',
//         message: 'Mrs. Smith marked absent for Math class. Substitute teacher assigned.',
//         time: '1 hour ago',
//         type: 'warning',
//         unread: true,
//         icon: <UsersIcon className="h-4 w-4" />,
//       },
//       {
//         id: 4,
//         title: 'Library Book Overdue',
//         message: '5 books are overdue. Please send reminder notifications to students.',
//         time: '2 hours ago',
//         type: 'error',
//         unread: false,
//         icon: <LibraryIcon className="h-4 w-4" />,
//       },
//       {
//         id: 5,
//         title: 'Bus Route Update',
//         message: 'Route 3 schedule updated. All parents have been notified.',
//         time: '3 hours ago',
//         type: 'info',
//         unread: false,
//         icon: <BusIcon className="h-4 w-4" />,
//       },
//     ],
//     []
//   )

//   // Memoize page info mapping
//   const pageMap = useMemo(
//     () => ({
//       '/dashboard': {
//         title: 'Dashboard',
//         icon: <HomeIcon className="h-5 w-5" />,
//         description: 'Overview and analytics',
//       },
//       '/students': {
//         title: 'Students Management',
//         icon: <GraduationCapIcon className="h-5 w-5" />,
//         description: 'Manage student records and enrollment',
//       },
//       '/teachers': {
//         title: 'Teachers Management',
//         icon: <UsersIcon className="h-5 w-5" />,
//         description: 'Faculty management and assignments',
//       },
//       '/classes': {
//         title: 'Classes Management',
//         icon: <BuildingIcon className="h-5 w-5" />,
//         description: 'Classroom schedules and assignments',
//       },
//       '/subjects': {
//         title: 'Subjects Management',
//         icon: <BookOpenIcon className="h-5 w-5" />,
//         description: 'Curriculum and subject planning',
//       },
//       '/attendance': {
//         title: 'Attendance Tracking',
//         icon: <CheckCircleIcon className="h-5 w-5" />,
//         description: 'Daily attendance monitoring',
//       },
//       '/exams': {
//         title: 'Examinations',
//         icon: <StarIcon className="h-5 w-5" />,
//         description: 'Exam schedules and results',
//       },
//       '/fees': {
//         title: 'Fee Management',
//         icon: <CreditCardIcon className="h-5 w-5" />,
//         description: 'Payment tracking and billing',
//       },
//       '/library': {
//         title: 'Library Management',
//         icon: <LibraryIcon className="h-5 w-5" />,
//         description: 'Books and resources management',
//       },
//       '/transport': {
//         title: 'Transport Management',
//         icon: <BusIcon className="h-5 w-5" />,
//         description: 'Bus routes and transportation',
//       },
//       '/events': {
//         title: 'Events & Calendar',
//         icon: <CalendarIcon className="h-5 w-5" />,
//         description: 'School events and scheduling',
//       },
//       '/notifications': {
//         title: 'Notifications',
//         icon: <BellIcon className="h-5 w-5" />,
//         description: 'Messages and alerts center',
//       },
//       '/reports': {
//         title: 'Reports & Analytics',
//         icon: <BarChart3Icon className="h-5 w-5" />,
//         description: 'Data insights and reporting',
//       },
//       '/settings': {
//         title: 'System Settings',
//         icon: <CogIcon className="h-5 w-5" />,
//         description: 'Configuration and preferences',
//       },
//     }),
//     []
//   )

//   // Get current page info
//   const currentPage = useMemo(
//     () =>
//       pageMap[location.pathname as keyof typeof pageMap] || {
//         title: 'School Management',
//         icon: <ShieldIcon className="h-5 w-5" />,
//         description: 'Comprehensive school management system',
//       },
//     [location.pathname, pageMap]
//   )

//   // Close dropdowns when clicking outside - memoized
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         notificationRef.current &&
//         !notificationRef.current.contains(event.target as Node)
//       ) {
//         setShowNotifications(false)
//       }
//       if (
//         profileRef.current &&
//         !profileRef.current.contains(event.target as Node)
//       ) {
//         setShowProfile(false)
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   // Focus search input when shown
//   useEffect(() => {
//     if (showSearch && searchRef.current) {
//       searchRef.current.focus()
//     }
//   }, [showSearch])

//   // Memoized callback for sign out
//   const handleSignOut = useCallback(() => {
//     logout()
//     setShowProfile(false)
//   }, [logout])

//   // Memoized notification type styles
//   const getNotificationTypeStyles = useCallback(
//     (type: string) => {
//       switch (type) {
//         case 'success':
//           return {
//             bg: 'bg-green-50',
//             iconBg: 'bg-green-100',
//             iconColor: 'text-green-600',
//             border: 'border-green-200',
//           }
//         case 'warning':
//           return {
//             bg: 'bg-yellow-50',
//             iconBg: 'bg-yellow-100',
//             iconColor: 'text-yellow-600',
//             border: 'border-yellow-200',
//           }
//         case 'error':
//           return {
//             bg: 'bg-red-50',
//             iconBg: 'bg-red-100',
//             iconColor: 'text-red-600',
//             border: 'border-red-200',
//           }
//         default:
//           return {
//             bg: 'bg-blue-50',
//             iconBg: 'bg-blue-100',
//             iconColor: 'text-blue-600',
//             border: 'border-blue-200',
//           }
//       }
//     },
//     []
//   )

//   // Memoize unread count calculation
//   const unreadCount = useMemo(
//     () => notifications.filter((n) => n.unread).length,
//     [notifications]
//   )

//   const getUserDisplayName = useCallback(() => {
//     if (userProfile) {
//       return `${userProfile.first_name} ${userProfile.last_name}`
//     }
//     return user?.username || 'User'
//   }, [user?.username, userProfile])

//   return (
//     <header className="bg-gray-120 rounded-2xl px-3 py-2 border sticky top-4 z-40 mb-6">
//       <div className="flex items-center justify-between">
//         {/* Left Section */}
//         <div className="flex items-center space-x-4">
//           {/* Mobile menu button */}
//           <button
//             onClick={onMenuClick}
//             className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 bg-gray-50"
//             title="Toggle menu"
//           >
//             <MenuIcon className="w-5 h-5 text-gray-600" />
//           </button>

//           {/* Page Title */}
//           <div className="hidden md:block">
//             <div className="flex items-center space-x-3 mb-1">
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900 flex items-center">
//                   {currentPage.title}
//                 </h1>
//                 <p className="text-sm text-gray-600">{currentPage.description}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Center Section - Search */}
//         <div className="flex-1 max-w-2xl mx-8 hidden md:block">
//           <div className="relative group">
//             <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
//             <input
//               ref={searchRef}
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search students, teachers, classes, or anything..."
//               className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gradient-to-r from-gray-50 to-white focus:from-white focus:to-white shadow-sm hover:shadow-md focus:shadow-lg text-sm font-medium placeholder-gray-500"
//               onFocus={onSearchFocus}
//             />
//             {searchQuery && (
//               <button
//                 onClick={() => setSearchQuery('')}
//                 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-all duration-200"
//               >
//                 <XIcon className="w-4 h-4" />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Right Section */}
//         <div className="flex items-center space-x-3">
//           {/* Mobile search toggle */}
//           <button
//             onClick={() => setShowSearch(!showSearch)}
//             className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 bg-gray-50"
//           >
//             <SearchIcon className="w-5 h-5 text-gray-600" />
//           </button>

//           {/* Quick Actions */}
//           <div className="hidden lg:flex items-center space-x-2">
//             <button
//               className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 bg-gray-50 group"
//               title="Calendar"
//             >
//               <CalendarIcon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
//               <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
//             </button>
//             <button
//               className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 bg-gray-50 group"
//               title="Messages"
//             >
//               <MailIcon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
//               <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
//                 3
//               </span>
//             </button>
//           </div>

//           {/* Dark mode toggle */}
//           <button
//             onClick={() => setDarkMode(!darkMode)}
//             className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-300 bg-gray-50 group"
//             title={darkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
//           >
//             <div className="relative">
//               {darkMode ? (
//                 <SunIcon className="w-5 h-5 text-yellow-500 group-hover:text-yellow-600 transition-all duration-300 transform group-hover:rotate-12" />
//               ) : (
//                 <MoonIcon className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-all duration-300 transform group-hover:-rotate-12" />
//               )}
//             </div>
//           </button>

//           {/* Notifications */}
//           <div className="relative" ref={notificationRef}>
//             <button
//               onClick={() => setShowNotifications(!showNotifications)}
//               className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 bg-gray-50 group"
//               title="Notifications"
//             >
//               <BellIcon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
//               {unreadCount > 0 && (
//                 <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
//                   {unreadCount > 9 ? '9+' : unreadCount}
//                 </div>
//               )}
//             </button>

//             {/* Notifications Dropdown */}
//             {showNotifications && (
//               <NotificationsDropdown
//                 notifications={notifications}
//                 unreadCount={unreadCount}
//                 getNotificationTypeStyles={getNotificationTypeStyles}
//               />
//             )}
//           </div>

//           {/* Profile */}
//           <div className="relative" ref={profileRef}>
//             <button
//               onClick={() => setShowProfile(!showProfile)}
//               className="flex items-center space-x-3 p-2 pr-3 rounded-xl hover:bg-gray-100 transition-all duration-200 bg-gray-50 group"
//             >
//               <div className="relative">
//                 <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
//                   <span className="text-white font-bold text-sm">
//                     {getUserDisplayName().charAt(0).toUpperCase()}
//                   </span>
//                 </div>
//                 <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
//               </div>
//               <div className="hidden md:block text-left">
//                 <p className="text-sm font-semibold text-gray-900 max-w-32 truncate group-hover:text-blue-600 transition-colors duration-200">
//                   {getUserDisplayName()}
//                 </p>
//                 <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
//               </div>
//               <ChevronDownIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-all duration-200 transform group-hover:rotate-180" />
//             </button>

//             {/* Profile Dropdown */}
//             {showProfile && (
//               <ProfileDropdown
//                 user={user}
//                 handleSignOut={handleSignOut}
//               />
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile Search Bar */}
//       {showSearch && (
//         <div className="md:hidden mt-4 animate-in slide-in-from-top-2 duration-300">
//           <div className="relative">
//             <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search students, teachers, anything..."
//               className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gradient-to-r from-gray-50 to-white shadow-sm font-medium"
//               autoFocus
//             />
//             <button
//               onClick={() => setShowSearch(false)}
//               className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-all duration-200"
//             >
//               <XIcon className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       )}
//     </header>
//   )
// }

// // Export with memo
// export const Header = memo(HeaderComponent)
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
  Mail,
  Calendar,
  Clock,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Info,
  GraduationCap,
  Users,
  BookOpen,
  CreditCard,
  Library,
  Bus,
  Home,
  Building,
  BarChart3,
  Shield,
  UserCheck,
  ShieldX,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';


interface HeaderProps {
  onMenuClick?: () => void;
  onSearchFocus?: () => void;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  unread: boolean;
  avatar?: string;
  icon?: JSX.Element;
}

// Memoized Notification Item Component
const NotificationItem = memo(
  ({
    notification,
    getNotificationTypeStyles,
  }: {
    notification: Notification;
    getNotificationTypeStyles: (type: string) => {
      bg: string;
      iconBg: string;
      iconColor: string;
      border: string;
    };
  }) => {
    const styles = getNotificationTypeStyles(notification.type);
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`p-4 border-b border-gray-100/50 hover:bg-white/60 transition-all duration-200 cursor-pointer group ${
          notification.unread ? 'bg-blue-50/30' : ''
        }`}
      >
        <div className="flex items-start space-x-3">
          <div
            className={`flex-shrink-0 p-2 rounded-xl ${styles.iconBg} ${styles.iconColor} group-hover:scale-110 transition-transform duration-200`}
          >
            {notification.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-semibold text-gray-900 truncate">
                {notification.title}
              </h4>
              {notification.unread && (
                <div className="w-2 h-2 bg-gradient-to-r from-[#1E88E5] to-[#5B9FFF] rounded-full ml-2 animate-pulse"></div>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {notification.message}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {notification.time}
              </span>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-lg capitalize ${styles.bg} ${styles.iconColor}`}
              >
                {notification.type}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

NotificationItem.displayName = 'NotificationItem';

// Memoized Notifications Dropdown
const NotificationsDropdown = memo(
  ({
    notifications,
    unreadCount,
    getNotificationTypeStyles,
  }: {
    notifications: Notification[];
    unreadCount: number;
    getNotificationTypeStyles: (type: string) => {
      bg: string;
      iconBg: string;
      iconColor: string;
      border: string;
    };
  }) => (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 mt-3 w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 max-h-[500px] overflow-hidden"
    >
      <div className="bg-gradient-to-r from-[#1E88E5] to-[#5B9FFF] p-5 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Notifications</h3>
              <p className="text-blue-100 text-sm">{unreadCount} unread messages</p>
            </div>
          </div>
          <button className="text-sm text-white hover:bg-white/20 font-medium px-3 py-1.5 rounded-lg transition-all duration-200">
            Mark all read
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            getNotificationTypeStyles={getNotificationTypeStyles}
          />
        ))}
      </div>

      <div className="p-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm rounded-b-2xl">
        <button className="w-full text-center text-sm text-[#1E88E5] hover:text-[#1557B0] font-semibold py-2.5 bg-white/80 hover:bg-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
          View all notifications
        </button>
      </div>
    </motion.div>
  )
);

NotificationsDropdown.displayName = 'NotificationsDropdown';

// Memoized Profile Dropdown
const ProfileDropdown = memo(
  ({ user, userProfile, handleSignOut }: { user: any; userProfile: any; handleSignOut: () => void }) => (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden"
    >
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[#1E88E5] to-[#5B9FFF] px-6 py-6 rounded-t-2xl">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-xl">
                {userProfile?.first_name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-3 border-white rounded-full"></div>
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-lg">
              {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : user?.username || 'User'}
            </p>
            <p className="text-blue-100 text-sm">{user?.email || 'No email'}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="bg-white/20 backdrop-blur-sm text-blue-100 text-xs font-semibold px-3 py-1 rounded-lg capitalize">
                {user?.role || 'User'}
              </span>
              <span className="bg-green-400/20 text-green-100 text-xs font-semibold px-3 py-1 rounded-lg">
                Online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm border-b border-gray-100/50">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">1,234</p>
            <p className="text-xs text-gray-500">Students</p>
          </div>
          <div className="text-center border-l border-r border-gray-200">
            <p className="text-lg font-bold text-gray-900">89</p>
            <p className="text-xs text-gray-500">Teachers</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">24</p>
            <p className="text-xs text-gray-500">Classes</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2 bg-white/50 backdrop-blur-sm">
        <motion.button
          whileHover={{ x: 4 }}
          className="flex items-center space-x-3 w-full px-6 py-3 text-sm text-gray-700 hover:bg-white/80 transition-colors duration-200 group"
        >
          <div className="p-1.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1 text-left">
            <span className="font-medium">My Profile</span>
            <p className="text-xs text-gray-500">View and edit profile</p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ x: 4 }}
          className="flex items-center space-x-3 w-full px-6 py-3 text-sm text-gray-700 hover:bg-white/80 transition-colors duration-200 group"
        >
          <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors duration-200">
            <Settings className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1 text-left">
            <span className="font-medium">Account Settings</span>
            <p className="text-xs text-gray-500">Privacy and security</p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ x: 4 }}
          className="flex items-center space-x-3 w-full px-6 py-3 text-sm text-gray-700 hover:bg-white/80 transition-colors duration-200 group"
        >
          <div className="p-1.5 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors duration-200">
            <Bell className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="flex-1 text-left">
            <span className="font-medium">Notification Preferences</span>
            <p className="text-xs text-gray-500">Manage alerts and emails</p>
          </div>
        </motion.button>
      </div>

      {/* Sign Out */}
      <div className="border-t border-gray-200/50 p-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm rounded-b-2xl">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSignOut}
          className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 rounded-xl transition-all duration-200 font-medium group"
        >
          <div className="p-1.5 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors duration-200">
            <LogOut className="w-4 h-4 text-red-600" />
          </div>
          <span>Sign Out</span>
        </motion.button>
      </div>
    </motion.div>
  )
);

ProfileDropdown.displayName = 'ProfileDropdown';

// Main Header Component
const HeaderComponent = ({ onMenuClick, onSearchFocus }: HeaderProps) => {
  const { user, logout, userProfile } = useAuth();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Memoize notifications
  const notifications: Notification[] = useMemo(
    () => [
      {
        id: 1,
        title: 'New Student Enrollment',
        message: 'John Doe has been enrolled in Grade 10-A. Welcome message sent successfully.',
        time: '2 min ago',
        type: 'success',
        unread: true,
        icon: <GraduationCap className="h-4 w-4" />,
      },
      {
        id: 2,
        title: 'Fee Payment Received',
        message: 'Payment of ₹15,000 received from Sarah Wilson for Term 1 fees.',
        time: '15 min ago',
        type: 'success',
        unread: true,
        icon: <CreditCard className="h-4 w-4" />,
      },
      {
        id: 3,
        title: 'Teacher Absence Alert',
        message: 'Mrs. Smith marked absent for Math class. Substitute teacher assigned.',
        time: '1 hour ago',
        type: 'warning',
        unread: true,
        icon: <Users className="h-4 w-4" />,
      },
      {
        id: 4,
        title: 'Library Book Overdue',
        message: '5 books are overdue. Please send reminder notifications to students.',
        time: '2 hours ago',
        type: 'error',
        unread: false,
        icon: <Library className="h-4 w-4" />,
      },
      {
        id: 5,
        title: 'Bus Route Update',
        message: 'Route 3 schedule updated. All parents have been notified.',
        time: '3 hours ago',
        type: 'info',
        unread: false,
        icon: <Bus className="h-4 w-4" />,
      },
    ],
    []
  );

  // Memoize page info mapping
  // const pageMap = useMemo(
  //   () => ({
  //     '/dashboard': {
  //       title: 'Dashboard',
  //       icon: <Home className="h-5 w-5" />,
  //       description: 'Overview and analytics',
  //     },
  //     '/students': {
  //       title: 'Students Management',
  //       icon: <GraduationCap className="h-5 w-5" />,
  //       description: 'Manage student records',
  //     },
  //     '/teachers': {
  //       title: 'Teachers Management',
  //       icon: <Users className="h-5 w-5" />,
  //       description: 'Faculty management',
  //     },
  //     '/classes': {
  //       title: 'Classes Management',
  //       icon: <Building className="h-5 w-5" />,
  //       description: 'Classroom schedules',
  //     },
  //     '/subjects': {
  //       title: 'Subjects Management',
  //       icon: <BookOpen className="h-5 w-5" />,
  //       description: 'Curriculum planning',
  //     },
  //     '/reports': {
  //       title: 'Reports & Analytics',
  //       icon: <BarChart3 className="h-5 w-5" />,
  //       description: 'Data insights',
  //     },
  //   }),
  //   []
  // );

  // Get current page info
  // const currentPage = useMemo(
  //   () =>
  //     pageMap[location.pathname as keyof typeof pageMap] || {
  //       title: 'School Management',
  //       icon: <Shield className="h-5 w-5" />,
  //       description: 'School management system',
  //     },
  //   [location.pathname, pageMap]
  // );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when shown
  useEffect(() => {
    if (showSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showSearch]);

  // Memoized callback for sign out
  const handleSignOut = useCallback(() => {
    logout();
    setShowProfile(false);
  }, [logout]);

  // Memoized notification type styles
  const getNotificationTypeStyles = useCallback((type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          border: 'border-green-200',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          border: 'border-yellow-200',
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          border: 'border-red-200',
        };
      default:
        return {
          bg: 'bg-blue-50',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          border: 'border-blue-200',
        };
    }
  }, []);

  // Memoize unread count
  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications]
  );

  const getUserDisplayName = useCallback(() => {
    if (userProfile) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    }
    return user?.username || 'User';
  }, [user?.username, userProfile]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="h-20 glass border-b border-white/50 flex items-center justify-between px-8 sticky top-0 z-40 mb-6"
      style={{
        background: 'rgba(255, 255, 255, 0)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Left Section - Mobile Menu & Page Info */}
      <div className="flex items-center space-x-4">
        {/* Mobile menu button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMenuClick}
          className="lg:hidden w-11 h-11 rounded-xl bg-white/80 hover:bg-white shadow-soft hover:shadow-float transition-all duration-300 flex items-center justify-center"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </motion.button>

        {/* Page Title - Hidden on mobile */}
        {/* <div className="hidden md:block">
          <h1 className="text-xl font-bold text-gray-900">{currentPage.title}</h1>
          <p className="text-sm text-gray-600">{currentPage.description}</p>
        </div> */}
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-xl mx-8 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-300 group-hover:text-[#1E88E5] group-focus-within:text-[#1E88E5]" />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students, teachers, classes..."
            className="w-full pl-12 pr-12 h-11 bg-white/80 border border-white/80 rounded-xl shadow-soft hover:shadow-glow transition-all duration-300 focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5]/50 text-sm font-medium placeholder-gray-500 outline-none"
            onFocus={onSearchFocus}
          />
          {searchQuery && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-3">
        {/* Mobile search toggle */}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSearch(!showSearch)}
          className="md:hidden w-11 h-11 rounded-xl bg-white/80 hover:bg-white shadow-soft hover:shadow-float transition-all duration-300 flex items-center justify-center group"
        >
          <Search className="w-5 h-5 text-gray-600 group-hover:text-[#1E88E5] transition-colors duration-300" />
        </motion.button>

        {/* Quick Actions - Hidden on small screens */}
        <div className="hidden lg:flex items-center gap-3">
  {/* Events */}
  <motion.button
    onClick={() => navigate('/events')}
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    className={`relative w-11 h-11 rounded-xl shadow-soft hover:shadow-float transition-all duration-300 flex items-center justify-center group
      ${location.pathname === '/events' 
        ? 'bg-[#1E88E5] text-white' 
        : 'bg-white/80 hover:bg-white text-gray-600'}`}
  >
    <Calendar
      className={`w-5 h-5 transition-colors duration-300 ${
        location.pathname === '/events'
          ? 'text-white'
          : 'group-hover:text-[#1E88E5]'
      }`}
    />
    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
  </motion.button>

  {/* Messages */}
  <motion.button
    onClick={() => navigate('/messages')}
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    className={`relative w-11 h-11 rounded-xl shadow-soft hover:shadow-float transition-all duration-300 flex items-center justify-center group
      ${location.pathname === '/messages' 
        ? 'bg-[#1E88E5] text-white' 
        : 'bg-white/80 hover:bg-white text-gray-600'}`}
  >
    <Mail
      className={`w-5 h-5 transition-colors duration-300 ${
        location.pathname === '/messages'
          ? 'text-white'
          : 'group-hover:text-[#1E88E5]'
      }`}
    />
    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#1E88E5] text-white text-xs rounded-full flex items-center justify-center font-bold">
      3
    </span>
  </motion.button>

  {/* Notifications */}
  <div className="relative" ref={notificationRef}>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-11 h-11 rounded-xl bg-white/80 hover:bg-white shadow-soft hover:shadow-float transition-all duration-300 flex items-center justify-center group"
          >
            <Bell className="w-5 h-5 text-gray-600 group-hover:text-[#1E88E5] transition-colors duration-300" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#1E88E5] rounded-full ring-2 ring-white"></span>
            )}
          </motion.button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <NotificationsDropdown
                notifications={notifications}
                unreadCount={unreadCount}
                getNotificationTypeStyles={getNotificationTypeStyles}
              />
            )}
          </AnimatePresence>
        </div>

  {/* Settings */}
  <motion.button
    onClick={() => navigate('/settings')}
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    className={`w-11 h-11 rounded-xl shadow-soft hover:shadow-float transition-all duration-300 flex items-center justify-center group
      ${location.pathname === '/settings' 
        ? 'bg-[#1E88E5] text-white' 
        : 'bg-white/80 hover:bg-white text-gray-600'}`}
  >
    <Settings
      className={`w-5 h-5 transition-colors duration-300 ${
        location.pathname === '/settings'
          ? 'text-white'
          : 'group-hover:text-[#1E88E5]'
      }`}
    />
  </motion.button>
</div>



        

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/80 hover:bg-white shadow-soft hover:shadow-float transition-all duration-300 group"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1E88E5] to-[#5B9FFF] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">
                  {getUserDisplayName().charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-900 max-w-32 truncate">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-all duration-200" />
          </motion.button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {showProfile && (
              <ProfileDropdown
                user={user}
                userProfile={userProfile}
                handleSignOut={handleSignOut}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 right-0 mt-2 px-4"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students, teachers..."
                className="w-full pl-12 pr-12 py-3 bg-white/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl focus:ring-2 focus:ring-[#1E88E5]/20 outline-none"
                autoFocus
              />
              <button
                onClick={() => setShowSearch(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Export with memo
export const Header = memo(HeaderComponent);
