import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { authService } from '../../services/authService'
import { AlertCircle, CheckCircle2, Loader2, Search, Copy, Mail, Phone, Edit3 } from 'lucide-react'

interface Student {
  id: string
  admission_number: string
  full_name: string
  email: string
  parent_contact: string
  class_name: string
  roll_number: string
  profile_picture?: string | null
  gender?: string | null
  date_of_birth?: string | null
  address?: string | null
  parent_name?: string | null
  section?: string | null
  class_id?: string | null
  admission_year?: string| null
}


interface CreatedCredentials {
  email: string
  tempPassword: string
  studentName: string
  phoneNumber: string
}

export function AddStudentPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState<Partial<Student>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [step, setStep] = useState<'select' | 'form' | 'result'>('select')
  const [createdCredentials, setCreatedCredentials] = useState<CreatedCredentials | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    setIsSearching(true)
    try {
      const { data, error: err } = await supabase
        .from('students')
        .select('*')
        .eq('status', 'active')
        .order('full_name')

      if (err) throw err

      const { data: existingProfiles } = await supabase
        .from('student_profiles')
        .select('student_id')

      const existingIds = new Set(existingProfiles?.map(p => p.student_id) || [])
      const availableStudents = (data || []).filter(s => !existingIds.has(s.id))
      setStudents(availableStudents)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students')
    } finally {
      setIsSearching(false)
    }
  }

  const generateEmail = (student: Student) =>
    `student.${student.admission_number.toLowerCase()}@school.local`

  const openEditableForm = (student: Student) => {
    setSelectedStudent(student)
    setFormData({
      full_name: student.full_name,
      admission_number: student.admission_number,
      email: generateEmail(student),
      parent_contact: student.parent_contact,
      class_name: student.class_name,
      roll_number: student.roll_number,
      parent_name: student.parent_name,
      gender: student.gender,
    })
    setStep('form')
  }

  const handleFormChange = (field: keyof Student, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCreateAccount = async () => {
  if (!selectedStudent || !formData.email || !formData.parent_contact) return

  setError('')
  setSuccess('')
  setLoading(true)

  try {
    // 1️⃣ Check if user already exists
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', formData.email)
      .maybeSingle()

    if (existingUser) {
      throw new Error('Account already exists for this student')
    }

    // 2️⃣ Extract name parts
    const [firstName, ...lastNameParts] = (formData.full_name || '').split(' ')
    const lastName = lastNameParts.join(' ') || firstName

    // 3️⃣ Create authentication user via Edge Function
    const result = await authService.createUser({
      role: 'student',
      email: formData.email,
      phone_number: formData.parent_contact,
      firstName,
      lastName,
      metadata: {
        admission_number: formData.admission_number,
        student_id: selectedStudent.id,
        class_name: formData.class_name,
        roll_number: formData.roll_number,
      },
    })

    if (!result.success) throw new Error('Failed to create authentication account')

    // 4️⃣ Fetch temporary password
    const { data: tempAuthData } = await supabase
      .from('user_auth_temp')
      .select('temp_password')
      .eq('auth_user_id', result.userId)
      .maybeSingle()

    // 5️⃣ Insert into student_profiles table
    const { error: insertError } = await supabase.from('student_profiles').insert({
      id: result.userId, // UUID from auth user
      student_id: selectedStudent.id, // UUID from students table
      admission_number: selectedStudent.admission_number || null,
      full_name: selectedStudent.full_name || null,
      class_name: selectedStudent.class_name || null,
      roll_number: selectedStudent.roll_number || null,
      profile_picture: selectedStudent.profile_picture || null,
      gender: selectedStudent.gender || null,
      date_of_birth: selectedStudent.date_of_birth
        ? new Date(selectedStudent.date_of_birth).toISOString().split('T')[0]
        : null,
      address: selectedStudent.address || null,
      parent_name: selectedStudent.parent_name || null,
      parent_contact: selectedStudent.parent_contact || null,
      email: formData.email,
      status: 'active',
      admission_year: selectedStudent.admission_year
        ? parseInt(selectedStudent.admission_year)
        : new Date().getFullYear(),
      section: selectedStudent.section || null,
      class_id: selectedStudent.class_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error('❌ Failed to insert into student_profiles:', insertError)
      throw new Error(`Profile creation failed: ${insertError.message}`)
    } else {
      console.log('✅ Student profile created successfully')
    }

    // 6️⃣ Show success in UI
    setCreatedCredentials({
      email: formData.email,
      tempPassword: tempAuthData?.temp_password || result.tempPassword,
      studentName: formData.full_name!,
      phoneNumber: formData.parent_contact!,
    })

    setSuccess(`Account created successfully for ${formData.full_name}`)
    setStep('result')
  } catch (err) {
    console.error('⚠️ Error creating account:', err)
    setError(err instanceof Error ? err.message : 'Failed to create account')
  } finally {
    setLoading(false)
  }
}


  const handleReset = () => {
    setSelectedStudent(null)
    setFormData({})
    setCreatedCredentials(null)
    setStep('select')
    fetchStudents()
  }

  const filteredStudents = students.filter(
    s =>
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admission_number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess('Copied to clipboard!')
    setTimeout(() => setSuccess(''), 2000)
  }

  return (
    <div className="mx-auto p-3">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Add Student Account</h1>

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

        {/* Step 1: Select Student */}
        {step === 'select' && (
          <div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search student by name or admission number"
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>

            {isSearching ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredStudents.map(student => (
                  <div
                    key={student.id}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{student.full_name}</p>
                        <p className="text-sm text-gray-600">
                          {student.admission_number} • {student.class_name}
                        </p>
                      </div>
                      <button
                        onClick={() => openEditableForm(student)}
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
            <h2 className="text-xl font-semibold mb-4">Review Student Details</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Full Name', key: 'full_name' },
                { label: 'Admission No.', key: 'admission_number' },
                { label: 'Email', key: 'email' },
                { label: 'Parent Contact', key: 'parent_contact' },
                { label: 'Parent Name', key: 'parent_name' },
                { label: 'Class', key: 'class_name' },
                { label: 'Roll Number', key: 'roll_number' },
                { label: 'Gender', key: 'gender' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-sm font-medium">{label}</label>
                  <input
                    type="text"
                    value={(formData[key as keyof Student] as string) || ''}
                    onChange={e => handleFormChange(key as keyof Student, e.target.value)}
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
              Credentials for <strong>{createdCredentials.studentName}</strong>
            </p>

            <div className="space-y-3 text-left max-w-md mx-auto">
              <div className="border p-3 rounded bg-white">
                <div className="flex justify-between">
                  <span>Email / Username:</span>
                  <button
                    onClick={() => copyToClipboard(createdCredentials.email)}
                    title="Copy"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <p className="font-mono text-sm">{createdCredentials.email}</p>
              </div>

              <div className="border p-3 rounded bg-white">
                <div className="flex justify-between">
                  <span>Temporary Password:</span>
                  <button
                    onClick={() => copyToClipboard(createdCredentials.tempPassword)}
                    title="Copy"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <p className="font-mono text-sm font-semibold">{createdCredentials.tempPassword}</p>
              </div>

              <div className="border p-3 rounded bg-white">
                <div className="flex justify-between">
                  <span>Parent Contact:</span>
                  <button
                    onClick={() => copyToClipboard(createdCredentials.phoneNumber)}
                    title="Copy"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <p className="font-mono text-sm">{createdCredentials.phoneNumber}</p>
              </div>
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
  )
}
