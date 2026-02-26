// src/hooks/useRolePermissions.ts
import { useAuth } from '../context/AuthContext';

export const useRolePermissions = () => {
  const { user } = useAuth();

  return {
    isAdmin: user?.role === 'admin',
    isTeacher: user?.role === 'teacher',
    isStudent: user?.role === 'student',
    isParent: user?.role === 'parent',
    isStaff: user?.role === 'staff',
    
    // Permission helpers
    canAdd: user?.role === 'admin',
    canEdit: user?.role === 'admin',
    canDelete: user?.role === 'admin',
    canView: true, // Everyone can view
    
    // Page-specific permissions
    canManageStudents: ['admin'].includes(user?.role || ''),
    canViewStudents: ['admin', 'teacher'].includes(user?.role || ''),
    canManageTeachers: user?.role === 'admin',
    canManageFees: ['admin', 'staff'].includes(user?.role || ''),
  };
};
