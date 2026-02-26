import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { authService } from '../../services/authService';
import { AlertCircle, CheckCircle2, Loader2, Check } from 'lucide-react';

const AVAILABLE_PERMISSIONS = [
  { id: 'view_attendance', label: 'View Attendance' },
  { id: 'manage_library', label: 'Manage Library' },
  { id: 'view_fees', label: 'View Fees' },
  { id: 'manage_fees', label: 'Manage Fees' },
  { id: 'view_results', label: 'View Results' },
  { id: 'manage_results', label: 'Manage Results' },
  { id: 'view_students', label: 'View Students' },
  { id: 'manage_events', label: 'Manage Events' },
  { id: 'view_reports', label: 'View Reports' },
];

export function CreateStaffPage() {
  const [staffName, setStaffName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!staffName || !email || !phone || !department || !position) {
      setError('All fields are required');
      return;
    }

    setLoading(true);

    try {
      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        setError('Email already registered');
        return;
      }

      // Create auth account
      const result = await authService.createUser({
        role: 'staff',
        email,
        phone_number: phone,
        firstName: staffName.split(' ')[0],
        lastName: staffName.split(' ').slice(1).join(' '),
        metadata: {
          department,
          position,
          permissions: selectedPermissions,
        },
      });

      if (result.success) {
        // Create staff profile
        await supabase.from('staff_profiles').insert({
          id: result.userId,
          staff_name: staffName,
          email,
          phone_number: phone,
          department,
          position,
          permissions: selectedPermissions,
          date_of_joining: new Date().toISOString().split('T')[0],
        });

        setSuccess(`Staff account created successfully for ${staffName}`);
        setStaffName('');
        setEmail('');
        setPhone('');
        setDepartment('');
        setPosition('');
        setSelectedPermissions([]);

        setTimeout(() => {
          setSuccess('');
        }, 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create staff account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Staff Member</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleCreateStaff} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="Enter full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="E.g., Administration"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position *
                </label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="E.g., Librarian"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Access Permissions</h2>
            <div className="grid grid-cols-2 gap-3">
              {AVAILABLE_PERMISSIONS.map((perm) => (
                <button
                  key={perm.id}
                  type="button"
                  onClick={() => togglePermission(perm.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-colors flex items-center gap-3 ${
                    selectedPermissions.includes(perm.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedPermissions.includes(perm.id)
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedPermissions.includes(perm.id) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="font-medium text-gray-900">{perm.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Staff Account
          </button>
        </form>
      </div>
    </div>
  );
}
