// import React, { useState, useEffect } from 'react';
// import { supabase } from '../../lib/supabase';
// import { authService } from '../../services/authService';
// import { AlertCircle, CheckCircle2, Loader2, Search } from 'lucide-react';

// interface Teacher {
//   id: string;
//   full_name: string;
//   employee_id: string;
//   email: string;
//   phone_number: string;
// }

// export function AddTeacherPage() {
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isSearching, setIsSearching] = useState(false);

//   useEffect(() => {
//     fetchTeachers();
//   }, []);

//   const fetchTeachers = async () => {
//     setIsSearching(true);
//     try {
//       const { data, error: err } = await supabase
//         .from('teachers')
//         .select('id, full_name, employee_id, email, phone_number')
//         .eq('status', 'active')
//         .order('full_name');

//       if (err) throw err;
//       setTeachers(data || []);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to fetch teachers');
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   const handleCreateAccount = async () => {
//     if (!selectedTeacher) return;

//     setError('');
//     setSuccess('');
//     setLoading(true);

//     try {
//       // Check if account already exists
//       const { data: existingUser } = await supabase
//         .from('user_profiles')
//         .select('id')
//         .eq('email', selectedTeacher.email)
//         .single();

//       if (existingUser) {
//         setError('Account already exists for this teacher');
//         return;
//       }

//       // Create auth account
//       const result = await authService.createUser({
//         role: 'teacher',
//         email: selectedTeacher.email,
//         phone_number: selectedTeacher.phone_number,
//         firstName: selectedTeacher.full_name.split(' ')[0],
//         lastName: selectedTeacher.full_name.split(' ').slice(1).join(' '),
//         metadata: {
//           employee_id: selectedTeacher.employee_id,
//           teacher_id: selectedTeacher.id,
//         },
//       });

//       if (result.success) {
//         // Create teacher profile
//         await supabase.from('teacher_profiles').insert({
//           id: result.userId,
//           teacher_id: selectedTeacher.id,
//           employee_id: selectedTeacher.employee_id,
//           full_name: selectedTeacher.full_name,
//           subject_specialization: '', // Get from original table
//           phone_number: selectedTeacher.phone_number,
//           email: selectedTeacher.email,
//           address: '',
//           date_of_birth: new Date(),
//           date_of_joining: new Date(),
//           qualification: '',
//           experience_years: 0,
//           salary: 0,
//           emergency_contact: '',
//         });

//         setSuccess(`Account created successfully for ${selectedTeacher.full_name}`);
//         setSelectedTeacher(null);
//         setTimeout(() => {
//           setSuccess('');
//         }, 3000);
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to create account');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredTeachers = teachers.filter((teacher) =>
//     teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     teacher.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <div className="bg-white rounded-lg shadow p-6">
//         <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Teacher Account</h1>

//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
//             <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
//             <p className="text-red-700 text-sm">{error}</p>
//           </div>
//         )}

//         {success && (
//           <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
//             <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
//             <p className="text-green-700 text-sm">{success}</p>
//           </div>
//         )}

//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Search Teachers
//           </label>
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search by name or employee ID"
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//         </div>

//         {isSearching ? (
//           <div className="flex items-center justify-center py-8">
//             <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
//           </div>
//         ) : (
//           <div className="space-y-2 max-h-96 overflow-y-auto mb-6">
//             {filteredTeachers.map((teacher) => (
//               <button
//                 key={teacher.id}
//                 onClick={() => setSelectedTeacher(teacher)}
//                 className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
//                   selectedTeacher?.id === teacher.id
//                     ? 'border-blue-500 bg-blue-50'
//                     : 'border-gray-200 hover:border-gray-300'
//                 }`}
//               >
//                 <p className="font-semibold text-gray-900">{teacher.full_name}</p>
//                 <p className="text-sm text-gray-600">ID: {teacher.employee_id}</p>
//                 <p className="text-sm text-gray-600">{teacher.email}</p>
//               </button>
//             ))}
//           </div>
//         )}

//         {selectedTeacher && (
//           <div className="bg-gray-50 p-4 rounded-lg mb-6">
//             <p className="text-sm text-gray-600 mb-2">Selected:</p>
//             <p className="font-semibold text-gray-900">{selectedTeacher.full_name}</p>
//             <p className="text-sm text-gray-600">{selectedTeacher.email}</p>
//           </div>
//         )}

//         <button
//           onClick={handleCreateAccount}
//           disabled={!selectedTeacher || loading}
//           className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
//         >
//           {loading && <Loader2 className="w-4 h-4 animate-spin" />}
//           Create Account
//         </button>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { authService } from '../../services/authService';
import { AlertCircle, CheckCircle2, Loader2, Search, Copy, Mail, Phone, Edit3 } from 'lucide-react';

interface Teacher {
  id: string;
  full_name: string;
  employee_id: string;
  email: string;
  phone_number: string;
  subject_specialization?: string | null;
  address?: string | null;
  date_of_birth?: string | null;
  date_of_joining?: string | null;
  qualification?: string | null;
  experience_years?: number | null;
  salary?: number | null;
  emergency_contact?: string | null;
}

interface CreatedCredentials {
  email: string;
  tempPassword: string;
  teacherName: string;
  phoneNumber: string;
}

export function AddTeacherPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState<Partial<Teacher>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [step, setStep] = useState<'select' | 'form' | 'result'>('select');
  const [createdCredentials, setCreatedCredentials] = useState<CreatedCredentials | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setIsSearching(true);
    try {
      const { data, error: err } = await supabase
        .from('teachers')
        .select('*')
        .eq('status', 'active')
        .order('full_name');

      if (err) throw err;

      // Filter out teachers who already have accounts
      const { data: existingProfiles } = await supabase
        .from('teacher_profiles')
        .select('teacher_id');

      const existingIds = new Set(existingProfiles?.map(p => p.teacher_id) || []);
      const availableTeachers = (data || []).filter(t => !existingIds.has(t.id));
      setTeachers(availableTeachers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch teachers');
    } finally {
      setIsSearching(false);
    }
  };

  const generateEmail = (teacher: Teacher) =>
    teacher.email || `teacher.${teacher.employee_id.toLowerCase()}@school.local`;

  const openEditableForm = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      full_name: teacher.full_name,
      employee_id: teacher.employee_id,
      email: generateEmail(teacher),
      phone_number: teacher.phone_number,
      subject_specialization: teacher.subject_specialization,
      qualification: teacher.qualification,
      emergency_contact: teacher.emergency_contact,
    });
    setStep('form');
  };

  const handleFormChange = (field: keyof Teacher, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateAccount = async () => {
    if (!selectedTeacher || !formData.email || !formData.phone_number) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // 1️⃣ Check if user already exists
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (existingUser) {
        throw new Error('Account already exists for this teacher');
      }

      // 2️⃣ Extract name parts
      const [firstName, ...lastNameParts] = (formData.full_name || '').split(' ');
      const lastName = lastNameParts.join(' ') || firstName;

      // 3️⃣ Create authentication user via Edge Function
      const result = await authService.createUser({
        role: 'teacher',
        email: formData.email,
        phone_number: formData.phone_number,
        firstName,
        lastName,
        metadata: {
          employee_id: formData.employee_id,
          teacher_id: selectedTeacher.id,
        },
      });

      if (!result.success) throw new Error('Failed to create authentication account');

      // 4️⃣ Fetch temporary password
      const { data: tempAuthData } = await supabase
        .from('user_auth_temp')
        .select('temp_password')
        .eq('auth_user_id', result.userId)
        .maybeSingle();

      // 5️⃣ Insert into teacher_profiles table
      const { error: insertError } = await supabase.from('teacher_profiles').insert({
        id: result.userId, // UUID from auth user
        teacher_id: selectedTeacher.id, // UUID from teachers table
        employee_id: selectedTeacher.employee_id || null,
        full_name: selectedTeacher.full_name || null,
        subject_specialization: selectedTeacher.subject_specialization || null,
        phone_number: selectedTeacher.phone_number || null,
        email: formData.email,
        address: selectedTeacher.address || null,
        date_of_birth: selectedTeacher.date_of_birth
          ? new Date(selectedTeacher.date_of_birth).toISOString().split('T')[0]
          : null,
        date_of_joining: selectedTeacher.date_of_joining
          ? new Date(selectedTeacher.date_of_joining).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        qualification: selectedTeacher.qualification || null,
        experience_years: selectedTeacher.experience_years || 0,
        salary: selectedTeacher.salary || 0,
        emergency_contact: selectedTeacher.emergency_contact || null,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error('❌ Failed to insert into teacher_profiles:', insertError);
        throw new Error(`Profile creation failed: ${insertError.message}`);
      } else {
        console.log('✅ Teacher profile created successfully');
      }

      // 6️⃣ Show success in UI
      setCreatedCredentials({
        email: formData.email,
        tempPassword: tempAuthData?.temp_password || result.tempPassword,
        teacherName: formData.full_name!,
        phoneNumber: formData.phone_number!,
      });

      setSuccess(`Account created successfully for ${formData.full_name}`);
      setStep('result');
    } catch (err) {
      console.error('⚠️ Error creating account:', err);
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedTeacher(null);
    setFormData({});
    setCreatedCredentials(null);
    setStep('select');
  };

  const filteredTeachers = teachers.filter(
    t =>
      t.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  return (
    <div className=" mx-auto p-3">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Add Teacher Account</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Step 1: Select Teacher */}
        {step === 'select' && (
          <div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search teacher by name or employee ID"
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>

            {isSearching ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredTeachers.map(teacher => (
                  <div
                    key={teacher.id}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{teacher.full_name}</p>
                        <p className="text-sm text-gray-600">
                          {teacher.employee_id} • {teacher.subject_specialization || 'No subject'}
                        </p>
                        <p className="text-sm text-gray-500">{teacher.email || teacher.phone_number}</p>
                      </div>
                      <button
                        onClick={() => openEditableForm(teacher)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg flex items-center gap-1"
                      >
                        <Edit3 className="w-4 h-4" /> Create Account
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Editable Form */}
        {step === 'form' && formData && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Review Teacher Details</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Full Name', key: 'full_name' },
                { label: 'Employee ID', key: 'employee_id' },
                { label: 'Email', key: 'email' },
                { label: 'Phone Number', key: 'phone_number' },
                { label: 'Subject Specialization', key: 'subject_specialization' },
                { label: 'Qualification', key: 'qualification' },
                { label: 'Emergency Contact', key: 'emergency_contact' },
              ].map(({ label, key }) => (
                <div key={key} className={key === 'full_name' ? 'col-span-2' : ''}>
                  <label className="text-sm font-medium">{label}</label>
                  <input
                    type="text"
                    value={(formData[key as keyof Teacher] as string) || ''}
                    onChange={e => handleFormChange(key as keyof Teacher, e.target.value)}
                    className="w-full mt-1 p-2 border rounded"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep('select')}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Back
              </button>
              <button
                onClick={handleCreateAccount}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Creating...' : 'Create Login Credentials'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 'result' && createdCredentials && (
          <div className="text-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Account Created Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Credentials for <strong>{createdCredentials.teacherName}</strong>
            </p>

            <div className="space-y-3 text-left max-w-md mx-auto">
              <div className="border p-3 rounded bg-white">
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    Email / Username:
                  </span>
                  <button
                    onClick={() => copyToClipboard(createdCredentials.email)}
                    title="Copy"
                    className="hover:bg-gray-100 p-1 rounded"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <p className="font-mono text-sm mt-1">{createdCredentials.email}</p>
              </div>

              <div className="border p-3 rounded bg-yellow-50 border-yellow-200">
                <div className="flex justify-between">
                  <span className="font-semibold">Temporary Password:</span>
                  <button
                    onClick={() => copyToClipboard(createdCredentials.tempPassword)}
                    title="Copy"
                    className="hover:bg-yellow-100 p-1 rounded"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <p className="font-mono text-sm font-bold mt-1 text-yellow-900">
                  {createdCredentials.tempPassword}
                </p>
              </div>

              <div className="border p-3 rounded bg-white">
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    Phone Number:
                  </span>
                  <button
                    onClick={() => copyToClipboard(createdCredentials.phoneNumber)}
                    title="Copy"
                    className="hover:bg-gray-100 p-1 rounded"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <p className="font-mono text-sm mt-1">{createdCredentials.phoneNumber}</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-left max-w-md mx-auto">
              <p className="font-semibold text-blue-900 mb-2">⚠️ Important:</p>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• Share these credentials securely with the teacher</li>
                <li>• The teacher must change the password on first login</li>
                <li>• Keep the temporary password confidential</li>
              </ul>
            </div>

            <button
              onClick={handleReset}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Create Another Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
