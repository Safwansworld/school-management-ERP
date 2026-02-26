import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { User, Search, X, UserPlus, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Student {
  id: string;
  full_name: string;
  admission_number: string;
  class_name: string;
  parent_email: string;
  parent_name: string;
  parent_contact: string;
}

interface ParentCredentials {
  parentName: string;
  email: string;
  tempPassword: string;
  phoneNumber: string;
  linkedStudents: string[];
}

const AddParent: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<ParentCredentials | null>(null);

  const [parentData, setParentData] = useState({
    parent_name: '',
    email: '',
    phone_number: '',
    address: '',
    relation: 'parent',
    password: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
        student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admission_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.parent_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, full_name, admission_number, class_name, parent_email, parent_name, parent_contact')
        .eq('status', 'active')
        .order('full_name');

      if (error) throw error;
      setStudents(data || []);
      setFilteredStudents(data || []);
    } catch (err: any) {
      setError(`Failed to fetch students: ${err.message}`);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleStudentSelect = (student: Student) => {
    if (selectedStudents.find(s => s.id === student.id)) {
      setSelectedStudents(selectedStudents.filter(s => s.id !== student.id));
    } else {
      setSelectedStudents([...selectedStudents, student]);
      
      // Auto-fill parent data from first selected student if empty
      if (selectedStudents.length === 0 && student.parent_email) {
        setParentData(prev => ({
          ...prev,
          parent_name: student.parent_name || prev.parent_name,
          email: student.parent_email || prev.email,
          phone_number: student.parent_contact || prev.phone_number
        }));
      }
    }
  };

  const handleCreateParentCredentials = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validation
      if (!parentData.parent_name || !parentData.email || !parentData.phone_number) {
        throw new Error('Please fill in all required fields');
      }

      if (selectedStudents.length === 0) {
        throw new Error('Please select at least one student to link with this parent');
      }

      // Generate password if not provided
      const password = parentData.password || generatePassword();

      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Call edge function to create auth user and parent profile
      const { data, error: functionError } = await supabase.functions.invoke('create-auth-user', {
        body: {
          email: parentData.email.toLowerCase(),
          phone_number: parentData.phone_number,
          password: password,
          role: 'parent',
          firstName: parentData.parent_name.split(' ')[0],
          lastName: parentData.parent_name.split(' ').slice(1).join(' ') || parentData.parent_name.split(' ')[0],
          metadata: {
            address: parentData.address,
            relation: parentData.relation,
            linked_student_count: selectedStudents.length
          }
        }
      });

      if (functionError) {
        throw new Error(functionError.message || 'Failed to create parent credentials');
      }

      if (!data?.userId) {
        throw new Error('No user ID returned from credential creation');
      }

      // Create parent profile
      const { error: parentProfileError } = await supabase
        .from('parent_profiles')
        .insert({
          id: data.userId,
          parent_name: parentData.parent_name,
          email: parentData.email.toLowerCase(),
          phone_number: parentData.phone_number,
          address: parentData.address,
          relation: parentData.relation
        });

      if (parentProfileError) {
        console.error('Parent profile creation error:', parentProfileError);
        throw new Error(`Failed to create parent profile: ${parentProfileError.message}`);
      }

      // Link students to parent
      const linkData = selectedStudents.map(student => ({
        parent_id: data.userId,
        student_id: student.id,
        relationship: parentData.relation
      }));

      const { error: linkError } = await supabase
        .from('parent_student_links')
        .insert(linkData);

      if (linkError) {
        console.error('Student linking error:', linkError);
        throw new Error(`Failed to link students: ${linkError.message}`);
      }

      // Update students table with parent_email reference
      for (const student of selectedStudents) {
        const { error: updateError } = await supabase
          .from('students')
          .update({ 
            parent_email: parentData.email.toLowerCase(),
            parent_name: parentData.parent_name,
            parent_contact: parentData.phone_number
          })
          .eq('id', student.id);

        if (updateError) {
          console.error(`Failed to update student ${student.admission_number}:`, updateError);
        }
      }

      setCreatedCredentials({
        parentName: parentData.parent_name,
        email: parentData.email,
        tempPassword: password,
        phoneNumber: parentData.phone_number,
        linkedStudents: selectedStudents.map(s => s.full_name)
      });

      setSuccess(`Parent credentials created successfully! Linked to ${selectedStudents.length} student(s).`);
      
      // Reset form
      setParentData({
        parent_name: '',
        email: '',
        phone_number: '',
        address: '',
        relation: 'parent',
        password: ''
      });
      setSelectedStudents([]);
      setSearchTerm('');
      
      // Refresh students list
      await fetchStudents();

    } catch (err: any) {
      console.error('Error creating parent credentials:', err);
      setError(err.message || 'Failed to create parent credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseCredentials = () => {
    setCreatedCredentials(null);
    setSuccess('');
  };

  return (
    <div className="mx-auto p-3">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <UserPlus className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Create Parent Credentials</h2>
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
                  Credentials for <span className="text-blue-600">{createdCredentials.parentName}</span>
                </h3>
                <button
                  onClick={handleCloseCredentials}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
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
                  <p className="text-sm text-gray-600 mb-2">Linked Students</p>
                  <ul className="list-disc list-inside space-y-1">
                    {createdCredentials.linkedStudents.map((student, idx) => (
                      <li key={idx} className="text-gray-800">{student}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Important:</strong> Please save these credentials securely and share them with the parent. 
                  They will need to change the password on first login.
                </p>
              </div>

              <button
                onClick={handleCloseCredentials}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Student Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Select Students</h3>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, admission number, class, or parent email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Selected Students */}
            {selectedStudents.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Selected: {selectedStudents.length} student(s)
                </p>
                <div className="space-y-2">
                  {selectedStudents.map(student => (
                    <div key={student.id} className="flex items-center justify-between bg-white p-2 rounded">
                      <span className="text-sm text-gray-800">{student.full_name}</span>
                      <button
                        onClick={() => handleStudentSelect(student)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Student List */}
            <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
              {filteredStudents.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No students found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredStudents.map(student => (
                    <div
                      key={student.id}
                      onClick={() => handleStudentSelect(student)}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedStudents.find(s => s.id === student.id)
                          ? 'bg-blue-100'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{student.full_name}</h4>
                          <p className="text-sm text-gray-600">
                            {student.admission_number} • {student.class_name || 'No class'}
                          </p>
                          {student.parent_email && (
                            <p className="text-xs text-gray-500 mt-1">
                              Parent: {student.parent_email}
                            </p>
                          )}
                        </div>
                        {selectedStudents.find(s => s.id === student.id) && (
                          <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Parent Information Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Parent Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={parentData.parent_name}
                onChange={(e) => setParentData({ ...parentData, parent_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter parent's full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={parentData.email}
                onChange={(e) => setParentData({ ...parentData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="parent@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={parentData.phone_number}
                onChange={(e) => setParentData({ ...parentData, phone_number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+91 1234567890"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship
              </label>
              <select
                value={parentData.relation}
                onChange={(e) => setParentData({ ...parentData, relation: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="parent">Parent</option>
                <option value="father">Father</option>
                <option value="mother">Mother</option>
                <option value="guardian">Guardian</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                value={parentData.address}
                onChange={(e) => setParentData({ ...parentData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  value={parentData.password}
                  onChange={(e) => setParentData({ ...parentData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
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

            <button
              onClick={handleCreateParentCredentials}
              disabled={loading || selectedStudents.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Parent Credentials
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddParent;
