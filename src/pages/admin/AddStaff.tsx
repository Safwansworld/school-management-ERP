import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Eye, EyeOff, AlertCircle, CheckCircle2, Calendar, Briefcase, Shield } from 'lucide-react';

interface StaffCredentials {
  staffName: string;
  email: string;
  tempPassword: string;
  phoneNumber: string;
  department: string;
  position: string;
}

const DEPARTMENTS = [
  'Administration',
  'Academic',
  'Finance',
  'IT',
  'Library',
  'Laboratory',
  'Sports',
  'Maintenance',
  'Transport',
  'Security',
  'Canteen',
  'Medical',
  'Other'
];

const POSITIONS = [
  'Principal',
  'Vice Principal',
  'Administrator',
  'Accountant',
  'Librarian',
  'Lab Assistant',
  'IT Manager',
  'Sports Coach',
  'Counselor',
  'Security Officer',
  'Receptionist',
  'Office Staff',
  'Other'
];

const AVAILABLE_PERMISSIONS = [
  { value: 'view_attendance', label: 'View Attendance' },
  { value: 'manage_attendance', label: 'Manage Attendance' },
  { value: 'view_students', label: 'View Students' },
  { value: 'manage_students', label: 'Manage Students' },
  { value: 'view_teachers', label: 'View Teachers' },
  { value: 'manage_teachers', label: 'Manage Teachers' },
  { value: 'view_fees', label: 'View Fees' },
  { value: 'manage_fees', label: 'Manage Fees' },
  { value: 'view_expenses', label: 'View Expenses' },
  { value: 'manage_expenses', label: 'Manage Expenses' },
  { value: 'view_library', label: 'View Library' },
  { value: 'manage_library', label: 'Manage Library' },
  { value: 'view_reports', label: 'View Reports' },
  { value: 'generate_reports', label: 'Generate Reports' },
  { value: 'view_schedule', label: 'View Schedule' },
  { value: 'manage_schedule', label: 'Manage Schedule' }
];

const AddStaff: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<StaffCredentials | null>(null);

  const [staffData, setStaffData] = useState({
    staff_name: '',
    email: '',
    phone_number: '',
    department: '',
    position: '',
    address: '',
    date_of_birth: '',
    date_of_joining: new Date().toISOString().split('T')[0],
    qualification: '',
    gender: '',
    status: 'active',
    permissions: [] as string[],
    password: ''
  });

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handlePermissionToggle = (permission: string) => {
    setStaffData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleCreateStaffCredentials = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validation
      if (!staffData.staff_name || !staffData.email || !staffData.phone_number || 
          !staffData.department || !staffData.position || !staffData.date_of_joining) {
        throw new Error('Please fill in all required fields');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(staffData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Date validation
      const joiningDate = new Date(staffData.date_of_joining);
      const today = new Date();
      if (joiningDate > today) {
        throw new Error('Date of joining cannot be in the future');
      }

      if (staffData.date_of_birth) {
        const birthDate = new Date(staffData.date_of_birth);
        if (birthDate > today) {
          throw new Error('Date of birth cannot be in the future');
        }
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 18) {
          throw new Error('Staff member must be at least 18 years old');
        }
      }

      // Generate password if not provided
      const password = staffData.password || generatePassword();

      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Split name for firstName and lastName
      const nameParts = staffData.staff_name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || nameParts[0];

      // Call edge function to create auth user and user profile
      const { data, error: functionError } = await supabase.functions.invoke('create-auth-user', {
        body: {
          email: staffData.email.toLowerCase(),
          phone_number: staffData.phone_number,
          password: password,
          role: 'staff',
          firstName: firstName,
          lastName: lastName,
          metadata: {
            department: staffData.department,
            position: staffData.position,
            date_of_joining: staffData.date_of_joining,
            permissions_count: staffData.permissions.length
          }
        }
      });

      if (functionError) {
        throw new Error(functionError.message || 'Failed to create staff credentials');
      }

      if (!data?.userId) {
        throw new Error('No user ID returned from credential creation');
      }

      console.log('Auth user created with ID:', data.userId);

      // Create staff profile
      const { error: staffProfileError } = await supabase
        .from('staff_profiles')
        .insert({
          id: data.userId,
          staff_name: staffData.staff_name,
          email: staffData.email.toLowerCase(),
          phone_number: staffData.phone_number,
          department: staffData.department,
          position: staffData.position,
          address: staffData.address || null,
          date_of_birth: staffData.date_of_birth || null,
          date_of_joining: staffData.date_of_joining,
          qualification: staffData.qualification || null,
          gender: staffData.gender || null,
          status: staffData.status,
          permissions: staffData.permissions,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (staffProfileError) {
        console.error('Staff profile creation error:', staffProfileError);
        throw new Error(`Failed to create staff profile: ${staffProfileError.message}`);
      }

      console.log('Staff profile created successfully');

      // Set credentials for display
      setCreatedCredentials({
        staffName: staffData.staff_name,
        email: staffData.email,
        tempPassword: password,
        phoneNumber: staffData.phone_number,
        department: staffData.department,
        position: staffData.position
      });

      setSuccess('Staff credentials created successfully!');

      // Reset form
      setStaffData({
        staff_name: '',
        email: '',
        phone_number: '',
        department: '',
        position: '',
        address: '',
        date_of_birth: '',
        date_of_joining: new Date().toISOString().split('T')[0],
        qualification: '',
        gender: '',
        status: 'active',
        permissions: [],
        password: ''
      });

    } catch (err: any) {
      console.error('Error creating staff credentials:', err);
      setError(err.message || 'Failed to create staff credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseCredentials = () => {
    setCreatedCredentials(null);
    setSuccess('');
  };

  return (
    <div className=" mx-auto p-3">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Create Staff Credentials</h2>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Success Alert */}
        {success && !createdCredentials && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Credentials Display Modal */}
        {createdCredentials && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Credentials for <span className="text-purple-600">{createdCredentials.staffName}</span>
                </h3>
                <button
                  onClick={handleCloseCredentials}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <AlertCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="text-lg font-mono font-semibold text-gray-800">{createdCredentials.email}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Temporary Password</p>
                  <p className="text-lg font-mono font-semibold text-gray-800">{createdCredentials.tempPassword}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                  <p className="text-lg font-mono font-semibold text-gray-800">{createdCredentials.phoneNumber}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Position Details</p>
                  <div className="space-y-1">
                    <p className="text-gray-800"><span className="font-medium">Department:</span> {createdCredentials.department}</p>
                    <p className="text-gray-800"><span className="font-medium">Position:</span> {createdCredentials.position}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Important:</strong> Please save these credentials securely and share them with the staff member. 
                  They will need to change the password on first login.
                </p>
              </div>

              <button
                onClick={handleCloseCredentials}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Basic Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={staffData.staff_name}
                onChange={(e) => setStaffData({ ...staffData, staff_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={staffData.email}
                onChange={(e) => setStaffData({ ...staffData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="staff@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={staffData.phone_number}
                onChange={(e) => setStaffData({ ...staffData, phone_number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="+91 1234567890"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                value={staffData.gender}
                onChange={(e) => setStaffData({ ...staffData, gender: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={staffData.date_of_birth}
                  onChange={(e) => setStaffData({ ...staffData, date_of_birth: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                value={staffData.address}
                onChange={(e) => setStaffData({ ...staffData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter residential address"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Password (Optional)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={staffData.password}
                  onChange={(e) => setStaffData({ ...staffData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                  placeholder="Leave empty for auto-generated password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                If left empty, a secure password will be generated automatically
              </p>
            </div>
          </div>

          {/* Right Column - Professional Information & Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Professional Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                value={staffData.department}
                onChange={(e) => setStaffData({ ...staffData, department: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position <span className="text-red-500">*</span>
              </label>
              <select
                value={staffData.position}
                onChange={(e) => setStaffData({ ...staffData, position: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select position</option>
                {POSITIONS.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Joining <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={staffData.date_of_joining}
                  onChange={(e) => setStaffData({ ...staffData, date_of_joining: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qualification
              </label>
              <input
                type="text"
                value={staffData.qualification}
                onChange={(e) => setStaffData({ ...staffData, qualification: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., B.Com, MBA, B.Sc"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={staffData.status}
                onChange={(e) => setStaffData({ ...staffData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Permissions Section */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Access Permissions
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  {AVAILABLE_PERMISSIONS.map(permission => (
                    <label key={permission.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={staffData.permissions.includes(permission.value)}
                        onChange={() => handlePermissionToggle(permission.value)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">{permission.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Selected: {staffData.permissions.length} permission(s)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleCreateStaffCredentials}
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Staff Credentials...
              </>
            ) : (
              <>
                <Users className="w-5 h-5" />
                Create Staff Credentials
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStaff;
