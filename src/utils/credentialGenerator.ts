/**
 * Generate unique username from teacher/student/staff profile
 * Format: firstname.lastname (if exists) or admission_number (for students) or employee_id (for staff)
 */
export const generateUsername = (
  fullName: string,
  identifier?: string
): string => {
  if (identifier) {
    return identifier.toLowerCase().replace(/\\s+/g, '.')
  }

  const parts = fullName.trim().split(/\\s+/)
  if (parts.length >= 2) {
    return `\${parts[0].toLowerCase()}.\${parts[parts.length - 1].toLowerCase()}`
  }
  return fullName.toLowerCase().replace(/\\s+/g, '.')
}

/**
 * Generate strong temporary password
 * Requirements: 12 characters, uppercase, lowercase, numbers, special chars
 */
export const generateTemporaryPassword = (): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const special = '@#$%^&*'
  
  const allChars = uppercase + lowercase + numbers + special
  let password = ''
  
  // Ensure at least one of each required type
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += special[Math.floor(Math.random() * special.length)]
  
  // Fill remaining characters
  for (let i = password.length; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  // Shuffle password
  return password.split('').sort(() => 0.5 - Math.random()).join('')
}

/**
 * Validate strong password
 */
export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (password.length < 8) errors.push('Password must be at least 8 characters')
  if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letter')
  if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letter')
  if (!/[0-9]/.test(password)) errors.push('Password must contain number')
  if (!/[@#$%^&*]/.test(password)) errors.push('Password must contain special character (@#\$%^&*)')
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+\$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (Indian format: 10 digits)
 */
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}\$/
  return phoneRegex.test(phone.replace(/[^0-9]/g, ''))
}

/**
 * Format phone number to standard format
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/[^0-9]/g, '')
  if (cleaned.length === 10) {
    return `+91\${cleaned}`
  }
  return phone
}