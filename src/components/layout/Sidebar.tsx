import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  Bell,
  MessageSquare,
  Library,
  DollarSign,
  Receipt,
  FileText,
  MessageCircle,
  Bus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  BarChart3,
  FolderIcon,
  UserCheck,
  Building,
  TrendingUp,
  FlaskConical,
  Settings,
  CalendarDays,
  KeyRound,
  UserPlus,
  NotebookText,
  PenLine,
  FileSignature,
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
  badge?: string;
  children?: MenuItem[];
  isCategory?: boolean; // New property to identify category headers
}

interface SubMenuState {
  [key: string]: boolean;
}

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
}

/**
 * Menu items organized with category subheadings
 */
const menuItems: MenuItem[] = [
  // Category: OVERVIEW
  {
    id: 'category-overview',
    name: 'OVERVIEW',
    icon: LayoutDashboard,
    roles: ['admin', 'teacher', 'student', 'parent', 'staff'],
    isCategory: true,
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'teacher', 'student', 'parent', 'staff'],
  },

  // Category: DAILY OPERATIONS
  {
    id: 'category-daily',
    name: 'DAILY OPERATIONS',
    icon: ClipboardList,
    roles: ['admin', 'teacher', 'student', 'parent', 'staff'],
    isCategory: true,
  },
  {
    id: 'attendance',
    name: 'Attendance',
    icon: ClipboardList,
    roles: ['admin', 'teacher', 'student', 'parent', 'staff'],
    children: [
      {
        id: 'student-attendance',
        name: 'Student Attendance',
        href: '/attendance/student',
        icon: Users,
        roles: ['admin', 'teacher', 'staff'],
      },
      {
        id: 'my-attendance',
        name: 'My Attendance',
        href: '/attendance/my-attendance',
        icon: UserCheck,
        roles: ['student', 'parent'],
      },
      {
        id: 'teacher-attendance',
        name: 'Teacher Attendance',
        href: '/attendance/teacher',
        icon: UserCheck,
        roles: ['admin'],
      },
    ],
  },
  {
    id: 'timetable',
    name: 'Time Table',
    href: '/schedule',
    icon: CalendarDays,
    roles: ['admin', 'teacher', 'student', 'parent', 'staff'],
  },

  // Category: ACADEMICS
  {
    id: 'category-academics',
    name: 'ACADEMICS',
    icon: BookOpen,
    roles: ['admin', 'teacher', 'student', 'parent'],
    isCategory: true,
  },
  {
    id: 'academic',
    name: 'Academic',
    icon: BookOpen,
    roles: ['admin', 'teacher'],
    children: [
      {
        id: 'classes',
        name: 'Classes',
        href: '/classes',
        icon: Building,
        roles: ['admin', 'teacher'],
      },
      {
        id: 'subjects-admin',
        name: 'Subjects',
        href: '/subjects',
        icon: Library,
        roles: ['admin', 'teacher'],
      },
      {
        id: 'students',
        name: 'Students',
        href: '/students',
        icon: GraduationCap,
        roles: ['admin', 'teacher'],
      },
      {
        id: 'teachers',
        name: 'Teachers',
        href: '/teachers',
        icon: UserCheck,
        roles: ['admin'],
      },
    ],
  },
  {
    id: 'subjects',
    name: 'Subjects',
    href: '/subjects',
    icon: Library,
    roles: ['student', 'parent'],
  },
  {
    id: 'lessonplan',
    name: 'Lesson Plan',
    href: '/lessonplan',
    icon: NotebookText,
    roles: ['teacher', 'admin'],
  },
  {
    id: 'assignment',
    name: 'Assignments',
    href: '/assignments',
    icon: PenLine,
    roles: ['teacher', 'admin', 'parent', 'student', 'staff'],
  },

  // Category: ASSESSMENT
  {
    id: 'category-assessment',
    name: 'ASSESSMENT',
    icon: FolderIcon,
    roles: ['admin', 'teacher', 'student', 'parent'],
    isCategory: true,
  },
  {
    id: 'examination',
    name: 'Examination',
    icon: FolderIcon,
    roles: ['admin', 'teacher', 'student', 'parent'],
    children: [
      {
        id: 'exams-admin',
        name: 'Exams',
        href: '/exams',
        icon: FileText,
        roles: ['admin', 'teacher'],
      },
      {
        id: 'exams-student',
        name: 'Exams',
        href: '/examstudent',
        icon: FileText,
        roles: ['student'],
      },
      {
        id: 'exams-parent',
        name: 'Exams',
        href: '/examparent',
        icon: FileText,
        roles: ['parent'],
      },
      {
        id: 'results-admin',
        name: 'Results',
        href: '/results',
        icon: BarChart3,
        roles: ['admin', 'teacher'],
      },
      {
        id: 'results-student',
        name: 'Results',
        href: '/resultstudent',
        icon: BarChart3,
        roles: ['student'],
      },
      {
        id: 'results-parent',
        name: 'Results',
        href: '/resultparent',
        icon: BarChart3,
        roles: ['parent'],
      },
      {
        id: 'certificates',
        name: 'Certificates',
        href: '/certificates',
        icon: FileText,
        roles: ['admin', 'teacher', 'student', 'parent'],
      },
    ],
  },
  {
    id: 'project',
    name: 'Projects',
    icon: FlaskConical,
    roles: ['admin', 'teacher', 'student'],
    children: [
      {
        id: 'project-dashboard',
        name: 'Project Dashboard',
        href: '/project/dashboard',
        icon: FlaskConical,
        roles: ['admin', 'teacher'],
      },
      {
        id: 'project-tracking',
        name: 'Project Tracking',
        href: '/projects/tracking',
        icon: TrendingUp,
        roles: ['admin', 'teacher', 'student'],
      },
    ],
  },

  // Category: COMMUNICATION
  {
    id: 'category-communication',
    name: 'COMMUNICATION',
    icon: MessageSquare,
    roles: ['admin', 'teacher', 'student', 'parent', 'staff'],
    isCategory: true,
  },
  {
    id: 'messages',
    name: 'Messages',
    href: '/messages',
    icon: MessageSquare,
    roles: ['admin', 'teacher', 'student', 'parent', 'staff'],
  },
  {
    id: 'notifications',
    name: 'Notifications',
    href: '/notifications',
    icon: Bell,
    roles: ['admin', 'teacher', 'student', 'parent', 'staff'],
  },
  {
    id: 'complaints',
    name: 'Complaints',
    href: '/complaints',
    icon: MessageCircle,
    roles: ['admin', 'teacher', 'student', 'parent', 'staff'],
  },

  // Category: RESOURCES
  {
    id: 'category-resources',
    name: 'RESOURCES',
    icon: Library,
    roles: ['admin', 'teacher', 'student', 'parent', 'staff'],
    isCategory: true,
  },
  {
    id: 'library',
    name: 'Library',
    href: '/library',
    icon: Library,
    roles: ['admin', 'student', 'staff'],
  },
  {
    id: 'events',
    name: 'Events',
    href: '/events',
    icon: CalendarDays,
    roles: ['admin', 'teacher', 'student', 'parent', 'staff'],
  },

  // Category: ADMINISTRATION
  {
    id: 'category-administration',
    name: 'ADMINISTRATION',
    icon: Settings,
    roles: ['admin', 'teacher', 'parent', 'staff'],
    isCategory: true,
  },
  {
    id: 'my-children',
    name: 'My Children',
    href: '/my-children',
    icon: Users,
    roles: ['parent'],
  },
  {
    id: 'leaveapplication',
    name: 'Leave Application',
    href: '/leaveapplication',
    icon: FileSignature,
    roles: ['admin', 'teacher', 'staff'],
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: DollarSign,
    roles: ['admin', 'staff'],
    children: [
      {
        id: 'fees',
        name: 'Fee Management',
        href: '/fees',
        icon: DollarSign,
        roles: ['admin', 'staff'],
      },
      {
        id: 'expenses',
        name: 'Expenses',
        href: '/expenses',
        icon: Receipt,
        roles: ['admin'],
      },
      {
        id: 'reports',
        name: 'Financial Reports',
        href: '/financial-reports',
        icon: BarChart3,
        roles: ['admin'],
      },
    ],
  },
  {
    id: 'transport',
    name: 'Transport',
    href: '/transport',
    icon: Bus,
    roles: ['admin', 'staff'],
  },
  {
    id: 'credentials',
    name: 'User Management',
    icon: KeyRound,
    roles: ['admin'],
    children: [
      {
        id: 'student-credentials',
        name: 'Add Student',
        href: '/admin/add-student',
        icon: GraduationCap,
        roles: ['admin'],
      },
      {
        id: 'teacher-credentials',
        name: 'Add Teacher',
        href: '/admin/add-teacher',
        icon: UserCheck,
        roles: ['admin'],
      },
      {
        id: 'parent-credentials',
        name: 'Add Parent',
        href: '/admin/add-parent',
        icon: Users,
        roles: ['admin'],
      },
      {
        id: 'staff-credentials',
        name: 'Add Staff',
        href: '/admin/add-staff',
        icon: UserPlus,
        roles: ['admin'],
      },
    ],
  },

  // Category: SETTINGS
  {
    id: 'category-settings',
    name: 'SETTINGS',
    icon: Settings,
    roles: ['admin', 'teacher', 'student', 'parent', 'staff'],
    isCategory: true,
  },
  {
    id: 'settings',
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['admin', 'teacher', 'student', 'parent', 'staff'],
  },
];

const SidebarComponent: React.FC<SidebarProps> = ({
  collapsed = false,
  onToggle,
  isMobile = false,
}) => {
  const [subMenuOpen, setSubMenuOpen] = useState<SubMenuState>({});
  const { user, userProfile } = useAuth();
  const location = useLocation();

  /**
   * Filter menu items based on authenticated user role
   * Memoized to prevent unnecessary recalculations
   */
  const filteredMenuItems = useMemo(() => {
    const userRole = user?.role || '';
    return menuItems
      .filter((item) => item.roles.includes(userRole))
      .map((item) => ({
        ...item,
        children: item.children?.filter((child) =>
          child.roles.includes(userRole)
        ),
      }));
  }, [user?.role]);

  /**
   * Auto-expand parent menu when child route is active
   */
  useEffect(() => {
    const currentPath = location.pathname;
    const activeParent = filteredMenuItems.find((item) =>
      item.children?.some((child) => child.href === currentPath)
    );

    if (activeParent && !subMenuOpen[activeParent.id]) {
      setSubMenuOpen((prev) => ({ ...prev, [activeParent.id]: true }));
    }
  }, [location.pathname, filteredMenuItems, subMenuOpen]);

  /**
   * Toggle submenu expansion state
   */
  const toggleSubMenu = useCallback((itemId: string) => {
    setSubMenuOpen((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  }, []);

  /**
   * Get user display name from profile or username
   */
  const getUserDisplayName = useCallback((): string => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    }
    return user?.username || 'User';
  }, [user?.username, userProfile]);

  /**
   * Get user initials for avatar
   */
  const getUserInitials = useCallback((): string => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name.charAt(0)}${userProfile.last_name.charAt(0)}`.toUpperCase();
    }
    return user?.username?.charAt(0).toUpperCase() || 'U';
  }, [user?.username, userProfile]);

  /**
   * Render category header
   */
  const renderCategoryHeader = (item: MenuItem, index: number) => {
    if (collapsed) return null;

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 * index, duration: 0.3 }}
        className={`px-4 ${index === 0 ? 'pt-2' : 'pt-6'} pb-2`}
      >
        <h3 className="text-xs font-bold text-gray-400 tracking-wider">
          {item.name}
        </h3>
      </motion.div>
    );
  };

  /**
   * Render main menu item or parent item with children
   */
  const renderMenuItem = (item: MenuItem, index: number) => {
    // Render category header
    if (item.isCategory) {
      return renderCategoryHeader(item, index);
    }

    const isActive = item.href === location.pathname;
    const hasActiveChild = item.children?.some(
      (child) => child.href === location.pathname
    );
    const isExpanded = subMenuOpen[item.id];
    const Icon = item.icon;

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05 * index, duration: 0.3 }}
      >
        {/* Link or Button */}
        {item.href ? (
          <Link
            to={item.href}
            onClick={isMobile ? onToggle : undefined}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl
              transition-all duration-300 group relative overflow-hidden
              ${
                isActive
                  ? 'text-white shadow-glow'
                  : 'text-gray-600 hover:text-[#1E88E5] hover:bg-white/60'
              }
            `}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-xl"
                style={{
                  background:
                    'linear-gradient(135deg, #1E88E5 0%, #5B9FFF 100%)',
                }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon
              className={`w-5 h-5 relative z-10 transition-transform duration-300 ${
                isActive ? 'scale-110' : 'group-hover:scale-110'
              }`}
            />
            {!collapsed && (
              <>
                <span className="relative z-10 text-[15px] font-medium flex-1">
                  {item.name}
                </span>
                {item.badge && (
                  <span
                    className={`relative z-10 text-xs font-bold px-2 py-1 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
        ) : (
          <button
            onClick={() => toggleSubMenu(item.id)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl
              transition-all duration-300 group relative overflow-hidden
              ${
                hasActiveChild || isExpanded
                  ? 'text-[#1E88E5] bg-white/60'
                  : 'text-gray-600 hover:text-[#1E88E5] hover:bg-white/60'
              }
            `}
          >
            <Icon
              className={`w-5 h-5 relative z-10 transition-transform duration-300 ${
                hasActiveChild ? 'scale-110' : 'group-hover:scale-110'
              }`}
            />
            {!collapsed && (
              <>
                <span className="relative z-10 text-[15px] font-medium flex-1 text-left">
                  {item.name}
                </span>
                {item.badge && (
                  <span className="relative z-10 text-xs font-bold px-2 py-1 rounded-full bg-red-500 text-white mr-1">
                    {item.badge}
                  </span>
                )}
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </>
            )}
          </button>
        )}

        {/* Submenu */}
        {item.children && !collapsed && (
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <ul className="mt-1 ml-8 space-y-1">
                  {item.children.map((child) => {
                    const isChildActive = child.href === location.pathname;
                    const ChildIcon = child.icon;

                    return (
                      <motion.li
                        key={child.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          to={child.href!}
                          onClick={isMobile ? onToggle : undefined}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                            isChildActive
                              ? 'bg-gradient-to-r from-[#1E88E5] to-[#5B9FFF] text-white font-medium shadow-md'
                              : 'text-gray-600 hover:bg-white/60 hover:text-[#1E88E5]'
                          }`}
                        >
                          <ChildIcon
                            className={`w-4 h-4 transition-transform ${
                              isChildActive
                                ? 'scale-110'
                                : 'group-hover:scale-110'
                            }`}
                          />
                          <span className="flex-1">{child.name}</span>
                          {child.badge && (
                            <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                              {child.badge}
                            </span>
                          )}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    );
  };

  return (
    <motion.aside
      initial={{ x: isMobile ? -280 : 0 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={`glass-strong shadow-soft border-r border-white/50 flex flex-col transition-all duration-300 ease-in-out ${
        isMobile ? 'w-[280px] h-full' : collapsed ? 'w-20' : 'w-[280px]'
      } ${!isMobile ? 'rounded-2xl m-3' : ''}`}
      style={!isMobile ? { height: 'calc(100vh - 1.5rem)' } : {}}
    >
      {/* Logo Section */}
      <div className="p-6 pb-4 border-b border-white/50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex items-center justify-between"
        >
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl shadow-glow flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #1E88E5 0%, #5B9FFF 100%)',
                }}
              >
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-[#1E88E5]">
                  EduNova
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">School Management</p>
              </div>
            </div>
          )}
          {!isMobile && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-white/60 transition-colors duration-200"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              )}
            </motion.button>
          )}
          {isMobile && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-white/60 transition-colors duration-200"
              aria-label="Close menu"
            >
              <X className="h-4 w-4 text-gray-600" />
            </motion.button>
          )}
        </motion.div>
        {collapsed && !isMobile && (
          <div className="flex justify-center mt-2">
            <div
              className="w-10 h-10 rounded-xl shadow-glow flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #1E88E5 0%, #5B9FFF 100%)',
              }}
            >
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 py-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className="space-y-1">
          {filteredMenuItems.map((item, index) => renderMenuItem(item, index))}
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-white/50">
        {collapsed && !isMobile ? (
          <motion.div whileHover={{ scale: 1.05 }} className="flex justify-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-md cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #1E88E5 0%, #5B9FFF 100%)',
              }}
              title={getUserDisplayName()}
            >
              <span className="text-white text-sm font-semibold">
                {getUserInitials()}
              </span>
            </div>
          </motion.div>
        ) : (
          <Link to="/settings">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/60 cursor-pointer hover:shadow-soft transition-all duration-300"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-md flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #1E88E5 0%, #5B9FFF 100%)',
                }}
              >
                <span className="text-white text-sm font-semibold">
                  {getUserInitials()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {getUserDisplayName()}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role || 'User'}
                </p>
              </div>
            </motion.div>
          </Link>
        )}
      </div>
    </motion.aside>
  );
};

export const Sidebar = React.memo(SidebarComponent);
