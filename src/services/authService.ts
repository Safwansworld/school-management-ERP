// export const authService = new AuthService();
import { supabase } from '../lib/supabase';
import { AuthError, Session, User } from '@supabase/supabase-js';

// ============================================================
// INTERFACES
// ============================================================

interface LoginCredentials {
  identifier: string;
  password: string;
}

interface CreateUserPayload {
  role: 'admin' | 'teacher' | 'student' | 'parent' | 'staff';
  email: string;
  phone_number: string;
  firstName: string;
  lastName: string;
  metadata: Record<string, any>;
}

// ============================================================
// AUTH SERVICE CLASS
// ============================================================

class AuthService {
  /**
   * Login with username, email, or phone
   */
  async login(credentials: LoginCredentials) {
    try {
      const { identifier, password } = credentials;
      const isEmail = identifier.includes('@');
      const isPhone = identifier.startsWith('+') || /^\d{10,}$/.test(identifier);

      let email: string | undefined;
      let phone: string | undefined;

      if (isEmail) {
        email = identifier;
      } else if (isPhone) {
        phone = identifier;
        email = `${phone}@phone.auth`;
      } else {
        // Username lookup
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('email')
          .eq('username', identifier)
          .single();

        if (!profile) {
          throw new Error('User not found');
        }

        email = profile.email;
      }

      // Sign in with password
      const { data, error } = await supabase.auth.signInWithPassword({
  email: email!,
  password,
});

// If Supabase returns a verification-required error, detect and throw a special error
if (error) {
  // Supabase error messages vary; this check is robust enough for "email not confirmed"
  const message = (error.message || '').toLowerCase();
  if (message.includes('email not confirmed') || message.includes('email is not confirmed') || (error.status === 400 && message.includes('confirm'))) {
    // Throw a structured error object so UI can redirect to verify-account
    const e: any = new Error('Email not confirmed');
    e.code = 'EMAIL_NOT_CONFIRMED';
    e.email = email;
    throw e;
  }
  throw error;
}


      // Check if first-time login
      let isFirstLogin = false;
      try {
        const { data: tempData } = await supabase
          .from('user_auth_temp')
          .select('is_first_login')
          .eq('auth_user_id', data.user!.id)
          .maybeSingle();

        if (!tempData) {
          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('is_first_login, email_verified, phone_verified')
            .eq('id', data.user!.id)
            .maybeSingle();

          isFirstLogin = profileData?.is_first_login || false;
        } else {
          isFirstLogin = tempData.is_first_login || false;
        }
      } catch (err) {
        console.warn('Could not check first login status:', err);
        isFirstLogin = false;
      }

      await this.logSession(data.user!.id);
      await this.auditLog(data.user!.id, 'login_success', {
        identifier_type: isEmail ? 'email' : isPhone ? 'phone' : 'username',
      });

      return {
        success: true,
        user: data.user,
        session: data.session,
        isFirstLogin,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      await this.auditLog(null, 'login_failed', {
        error: errorMessage,
        identifier: credentials.identifier,
      });
      throw error;
    }
  }

  /**
   * Create a new user
   */
  async createUser(payload: CreateUserPayload) {
    try {
      const { role, email, phone_number, firstName, lastName, metadata } = payload;
      console.log('Creating user with payload:', { role, email, phone_number, firstName, lastName });

      const tempPassword = this.generateTemporaryPassword();
      console.log('Generated temp password:', tempPassword);

      const { data: edgeFunctionData, error: edgeFunctionError } = await supabase.functions.invoke('create-auth-user', {
        body: {
          email,
          phone_number,
          password: tempPassword,
          role,
          firstName,
          lastName,
          metadata,
        },
      });

      if (edgeFunctionError) {
        console.error('Edge function error:', edgeFunctionError);
        throw new Error(`Failed to create auth user: ${edgeFunctionError.message}`);
      }

      if (!edgeFunctionData?.userId) {
        throw new Error('No user ID returned from auth creation');
      }

      const userId = edgeFunctionData.userId;
      console.log('Auth user and profile created with ID:', userId);

      const { data: { user: currentUser } } = await supabase.auth.getUser();

      const { error: tempError } = await supabase.from('user_auth_temp').insert({
        auth_user_id: userId,
        role,
        temp_password: tempPassword,
        is_first_login: true,
      });

      if (tempError) {
        console.error('Temp auth record error:', tempError);
        console.warn('Failed to create temp auth record, but user creation succeeded');
      } else {
        console.log('Temp auth record created');
      }

      await this.auditLog(currentUser?.id, 'user_created', {
        email,
        role,
        created_user_id: userId,
      });

      console.log('User creation complete!');

      return {
        success: true,
        userId,
        tempPassword,
        message: 'User created successfully',
      };
    } catch (error) {
      console.error('User creation failed:', error);
      throw error;
    }
  }

  /**
   * Send Magic Link for Email Verification
   */
  async sendMagicLink(email: string) {
    try {
      console.log('📧 Sending magic link to:', email);

      const redirectUrl = `${window.location.origin}/auth/callback`;
      
      console.log('🔗 Redirect URL:', redirectUrl);

      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: redirectUrl,
          shouldCreateUser: false,
        },
      });

      if (error) {
        console.error('❌ Magic link send error:', error);
        throw error;
      }

      console.log('✅ Magic link sent successfully');

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await this.auditLog(user.id, 'magic_link_sent', {
          email: email,
          sent_at: new Date().toISOString(),
        });
      }

      return {
        success: true,
        message: 'Magic link sent! Check your email.',
      };
    } catch (error) {
      console.error('❌ Send magic link error:', error);
      throw error;
    }
  }

  /**
   * Check Email Verification Status
   */
  async checkEmailVerificationStatus(): Promise<boolean> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        console.error('❌ Error getting user:', error);
        return false;
      }

      const isVerified = !!user.email_confirmed_at;
      console.log('📋 Email verification status:', isVerified);

      if (isVerified) {
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({
            email_verified: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('❌ Error updating profile:', updateError);
        } else {
          console.log('✅ Profile updated with email_verified = true');
        }
      }

      return isVerified;
    } catch (error) {
      console.error('❌ Check verification error:', error);
      return false;
    }
  }

  /**
   * Change password
   */
  async changePassword(newPassword: string) {
    try {
      console.log('🔒 Changing password...');

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('❌ Password change error:', error);
        throw error;
      }

      console.log('✅ Password updated in auth');

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        console.log('💾 Updating user profile flags...');

        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({
            is_first_login: false,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (profileError) {
          console.error('❌ Error updating profile:', profileError);
        } else {
          console.log('✅ Profile updated');
        }

        const { error: tempError } = await supabase
          .from('user_auth_temp')
          .update({ is_first_login: false })
          .eq('auth_user_id', user.id);

        if (tempError) {
          console.error('❌ Error updating temp auth:', tempError);
        } else {
          console.log('✅ Temp auth updated');
        }

        await this.auditLog(user.id, 'password_changed', {
          first_login_completed: true,
        });
      }

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  }

  /**
   * Logout
   */
  async logout() {
    try {
      console.log('👋 Logging out...');

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('❌ Logout error:', error);
        throw error;
      }

      await this.auditLog(null, 'logout_success');
      console.log('✅ Logged out successfully');

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Get current session
   */
  async getSession(): Promise<Session | null> {
    const { data } = await supabase.auth.getSession();
    return data.session;
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }

  /**
   * Get current user profile with role - WITH TIMEOUT PROTECTION
   */
  async getCurrentUserProfile() {
    try {
      console.log('🔍 Getting current user profile...');
      
      const user = await this.getCurrentUser();
      if (!user) {
        console.log('❌ No current user found');
        return null;
      }

      console.log('👤 Current user ID:', user.id);
      console.log('📧 User email confirmed:', !!user.email_confirmed_at);

      // CRITICAL FIX: Add timeout protection with Promise.race
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile query timeout')), 2000);
      });

      const queryPromise = supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      let result;
      try {
        result = await Promise.race([queryPromise, timeoutPromise]);
      } catch (timeoutError) {
        console.error('⏱️ Profile fetch timed out:', timeoutError);
        // Return basic profile on timeout
        return {
          id: user.id,
          role: 'student' as const,
          first_name: user.email?.split('@')[0] || 'User',
          last_name: '',
          email: user.email || '',
          phone_number: user.phone || '',
          is_first_login: true,
          email_verified: !!user.email_confirmed_at,
          phone_verified: !!user.phone_confirmed_at,
        };
      }

      const { data: profile, error } = result as any;

      if (error) {
        console.error('❌ Profile fetch error:', error);
        
        // If it's a permissions error (403), return a basic profile
        if (error.code === '42501' || error.message?.includes('403') || error.message?.includes('permission')) {
          console.warn('⚠️ Permissions error, returning basic profile from auth data');
          return {
            id: user.id,
            role: 'student' as const,
            first_name: user.email?.split('@')[0] || 'User',
            last_name: '',
            email: user.email || '',
            phone_number: user.phone || '',
            is_first_login: true,
            email_verified: !!user.email_confirmed_at,
            phone_verified: !!user.phone_confirmed_at,
          };
        }
        
        return null;
      }

      console.log('✅ Profile retrieved:', profile);
      return profile;
    } catch (error) {
      console.error('❌ Error in getCurrentUserProfile:', error);
      
      // Last resort: try to get user and return basic profile
      try {
        const user = await this.getCurrentUser();
        if (user) {
          console.warn('⚠️ Returning fallback profile from auth user');
          return {
            id: user.id,
            role: 'student' as const,
            first_name: user.email?.split('@')[0] || 'User',
            last_name: '',
            email: user.email || '',
            phone_number: user.phone || '',
            is_first_login: true,
            email_verified: !!user.email_confirmed_at,
            phone_verified: !!user.phone_confirmed_at,
          };
        }
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
      }
      
      return null;
    }
  }

  // ============================================================
  // PRIVATE HELPER METHODS
  // ============================================================

  private async logSession(userId: string) {
    try {
      const deviceFingerprint = this.generateDeviceFingerprint();
      const browserInfo = navigator.userAgent;
      const ipAddress = await this.getClientIP();

      await supabase
        .from('login_sessions')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('device_fingerprint', deviceFingerprint);

      await supabase.from('login_sessions').insert({
        user_id: userId,
        device_fingerprint: deviceFingerprint,
        browser_info: browserInfo,
        ip_address: ipAddress,
      });
    } catch (error) {
      console.error('Failed to log session:', error);
    }
  }

  private async auditLog(
    userId: string | null | undefined,
    action: string,
    details?: Record<string, any>
  ) {
    try {
      await supabase.from('auth_audit_log').insert({
        user_id: userId,
        action,
        details,
        ip_address: await this.getClientIP(),
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
    }
  }

  private generateTemporaryPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  private generateDeviceFingerprint(): string {
    const nav = window.navigator;
    const screen = window.screen;
    const fingerprint = `${nav.userAgent}-${nav.language}-${screen.width}x${screen.height}-${nav.hardwareConcurrency}`;
    return btoa(fingerprint);
  }

  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  }
}

export const authService = new AuthService();