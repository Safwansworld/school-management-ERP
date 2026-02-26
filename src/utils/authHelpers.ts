import { supabase } from '../lib/supabase'
import { UserProfile, CurrentUser } from '../types/authTypes'
import { validateEmail, validatePhoneNumber } from './credentialGenerator'

/**
 * Check if email already exists in user_profiles or Supabase auth
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  if (!validateEmail(email)) return false

  const { data } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('email', email.toLowerCase())
    .single()

  return !!data
}

/**
 * Check if phone already exists in user_profiles
 */
export const checkPhoneExists = async (phone: string): Promise<boolean> => {
  if (!validatePhoneNumber(phone)) return false

  const { data } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('phone_number', phone)
    .single()

  return !!data
}

/**
 * Check if username already exists
 */
export const checkUsernameExists = async (username: string): Promise<boolean> => {
  const { data } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('username', username.toLowerCase())
    .single()

  return !!data
}

/**
 * Fetch current user profile with role-specific data
 */
export const fetchCurrentUser = async (userId: string): Promise<CurrentUser | null> => {
  try {
    console.log('[FETCH] Starting fetch for user:', userId)

    // ✅ REMOVE .single() - it causes infinite loop!
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)

    console.log('[FETCH] Query complete:', { error, count: data?.length })

    if (error) {
      console.error('[FETCH] ❌ Supabase error:', error.message)
      return null
    }

    if (!data || data.length === 0) {
      console.error('[FETCH] ❌ No profile found')
      return null
    }

    const profile = data[0]  // Get first result
    console.log('[FETCH] ✅ Profile found:', profile.role, profile.email)

    const currentUser = profile as CurrentUser

    // Fetch role-specific data (if needed)
    if (profile.linked_table_name && profile.linked_profile_id) {
      console.log('[FETCH] Fetching role data from:', profile.linked_table_name)
      const { data: roleData } = await supabase
        .from(profile.linked_table_name)
        .select('*')
        .eq('id', profile.linked_profile_id)
        .maybeSingle()  // ✅ Use maybeSingle() instead of .single()

      if (roleData) {
        if (profile.role === 'teacher') currentUser.teacher_data = roleData
        else if (profile.role === 'student') currentUser.student_data = roleData
        else if (profile.role === 'staff') currentUser.staff_data = roleData
      }
    }

    // Fetch staff permissions
    if (profile.role === 'staff' && profile.linked_profile_id) {
      const { data: permissions } = await supabase
        .from('staff_permissions')
        .select('permission_name')
        .eq('staff_id', profile.linked_profile_id)

      currentUser.staff_permissions = permissions?.map(p => p.permission_name) || []
    }

    console.log('[FETCH] ✅ Returning user:', currentUser.email)
    return currentUser
    
  } catch (error) {
    console.error('[FETCH] ❌ Exception:', error)
    return null
  }
}



/**
 * Get user profile by username
 */
export const getUserByUsername = async (username: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('username', username.toLowerCase())
    .single()

  if (error || !data) return null
  return data as UserProfile
}

/**
 * Get user profile by email
 */
export const getUserByEmail = async (email: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()

  if (error || !data) return null
  return data as UserProfile
}

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}reset-password`
  })

  if (error) throw new Error(`Failed to send reset email: ${error.message}`)
}

/**
 * Resend email verification link
 */
export const resendEmailVerification = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email
  })

  if (error) throw new Error(`Failed to resend verification: ${error.message}`)
}

/**
 * Update user profile status
 */
export const updateProfileStatus = async (
  userId: string,
  status: 'pending' | 'active' | 'suspended' | 'inactive'
): Promise<void> => {
  const { error } = await supabase
    .from('user_profiles')
    .update({ profile_status: status, updated_at: new Date().toISOString() })
    .eq('user_id', userId)

  if (error) throw new Error(`Failed to update profile status: ${error.message}`)
}

/**
 * Mark email as verified
 */
export const markEmailVerified = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('user_profiles')
    .update({ 
      email_verified: true,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)

  if (error) throw new Error(`Failed to mark email verified: ${error.message}`)
}

/**
 * Mark phone as verified
 */
export const markPhoneVerified = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('user_profiles')
    .update({ 
      phone_verified: true,
      profile_status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)

  if (error) throw new Error(`Failed to mark phone verified: ${error.message}`)
}