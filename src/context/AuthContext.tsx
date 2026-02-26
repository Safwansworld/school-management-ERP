import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';

// ============================================================
// INTERFACES
// ============================================================

interface UserProfile {
  id: string;
  role: 'admin' | 'teacher' | 'student' | 'parent' | 'staff';
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  is_first_login: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  username?: string;
}

interface ExtendedUser extends User {
  role?: 'admin' | 'teacher' | 'student' | 'parent' | 'staff';
  username?: string;
  profile?: UserProfile;
}

interface AuthContextType {
  user: ExtendedUser | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  // ✅ Add these three
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  login: (credentials: { identifier: string; password: string }) => Promise<any>;
  logout: () => Promise<void>;
  sendMagicLink: (email: string) => Promise<any>;
  checkEmailVerificationStatus: () => Promise<boolean>;
  changePassword: (newPassword: string) => Promise<any>;
  refreshProfile: () => Promise<void>;
}



const AuthContext = createContext<AuthContextType | undefined>(undefined);



// ============================================================
// AUTH PROVIDER COMPONENT
// ============================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  
  // Track ongoing profile fetches to prevent duplicates
  const fetchingProfileRef = useRef<string | null>(null);
  const profileCacheRef = useRef<Map<string, UserProfile>>(new Map());

  /**
   * Fetch and update user profile with caching and deduplication
   */
  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('📋 Fetching user profile for:', userId);
      
      // Check cache first
      if (profileCacheRef.current.has(userId)) {
        console.log('💾 Using cached profile');
        return profileCacheRef.current.get(userId)!;
      }

      // Check if already fetching this profile
      if (fetchingProfileRef.current === userId) {
        console.log('⏳ Profile fetch already in progress, waiting...');
        // Wait for the ongoing fetch
        await new Promise(resolve => setTimeout(resolve, 100));
        return profileCacheRef.current.get(userId) || null;
      }

      // Mark as fetching
      fetchingProfileRef.current = userId;
      
      // Add timeout protection - 10 seconds
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000);
      });

      const profilePromise = authService.getCurrentUserProfile();
      const profile = await Promise.race([profilePromise, timeoutPromise]);

      if (!profile) {
        console.warn('⚠️ No profile found for user:', userId);
        fetchingProfileRef.current = null;
        return null;
      }

      console.log('✅ Profile fetched:', profile);
      
      // Cache the profile
      profileCacheRef.current.set(userId, profile);
      fetchingProfileRef.current = null;
      
      return profile;
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      fetchingProfileRef.current = null;
      throw error;
    }
  }, []);

  /**
   * Update user and profile state
   */
  const updateUserState = useCallback(async (authUser: User | null) => {
    if (!authUser) {
      console.log('🚫 No auth user, clearing state');
      setUser(null);
      setUserProfile(null);
      return;
    }

    console.log('👤 Updating user state for:', authUser.id);
    
    try {
      const profile = await fetchUserProfile(authUser.id);
      
      if (!profile) {
        console.warn('⚠️ Could not load profile, keeping user signed in with basic info');
        // Still set the user but without profile
        setUser(authUser as ExtendedUser);
        setUserProfile(null);
        return;
      }
      
      setUserProfile(profile);

      const extendedUser: ExtendedUser = {
        ...authUser,
        role: profile.role,
        username: profile.email?.split('@')[0] || profile.first_name || 'User',
        profile: profile,
      };

      setUser(extendedUser);
      console.log('✅ User state updated');
    } catch (error) {
      console.error('❌ Failed to update user state:', error);
      // Don't clear the session, just log the error
      setUser(authUser as ExtendedUser);
      setUserProfile(null);
    }
  }, [fetchUserProfile]);

  /**
   * Initialize session on mount (runs once)
   */
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const initSession = async () => {
      try {
        console.log('🚀 Initializing auth session...');

        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Session init timeout')), 5000);
        });

        const sessionPromise = authService.getSession();
        const sessionData = await Promise.race([sessionPromise, timeoutPromise]) as Session | null;

        if (!isMounted) {
          console.log('⚠️ Component unmounted, aborting init');
          return;
        }

        console.log('📦 Session data:', sessionData ? 'Found' : 'None');
        setSession(sessionData);

        if (sessionData?.user) {
          await updateUserState(sessionData.user);
        }

        console.log('✅ Session initialization complete');
      } catch (error) {
        console.error('❌ Error initializing session:', error);
        
        if (isMounted) {
          setSession(null);
          setUser(null);
          setUserProfile(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
          console.log('✅ Auth context initialized');
        }
        if (timeoutId) clearTimeout(timeoutId);
      }
    };

    if (!initialized) {
      initSession();
    }

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  /**
   * Listen for auth state changes with deduplication
   */
  useEffect(() => {
  let isMounted = true;
  let lastProcessedUser: string | null = null;
  console.log('👂 Setting up auth state listener...');

  const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('🔔 Auth state changed:', event);
      
    if (!isMounted || !initialized) return;

    if (session?.user) {
      // Only update if user actually changed
      if (session.user.id !== lastProcessedUser) {
        lastProcessedUser = session.user.id;
        await updateUserState(session.user);
      }
    } else {
      lastProcessedUser = null;
      setUser(null);
      setUserProfile(null);
      profileCacheRef.current.clear();
    }

    setSession(session);
    setLoading(false);
  });

  return () => {
    isMounted = false;
    listener?.subscription.unsubscribe();
  };
}, [initialized, updateUserState]);


  /**
   * Login function
   */
  const login = useCallback(async (credentials: { identifier: string; password: string }) => {
    try {
      console.log('🔑 Logging in...');
      setLoading(true);
      
      const result = await authService.login(credentials);
      console.log('✅ Login successful:', result);
      
      // Clear profile cache on login
      profileCacheRef.current.clear();
      
      // Wait for auth state change to process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return result;
    } catch (error) {
      console.error('❌ Login error:', error);
      setLoading(false);
      throw error;
    }
  }, []);

  /**
   * Logout function
   */
  const logout = useCallback(async () => {
    try {
      console.log('👋 Logging out...');
      await authService.logout();
      setUser(null);
      setUserProfile(null);
      setSession(null);
      profileCacheRef.current.clear();
      fetchingProfileRef.current = null;
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  }, []);

  /**
   * Send Magic Link for Email Verification
   */
  const sendMagicLink = useCallback(async (email: string) => {
    try {
      console.log('📧 Sending magic link...');
      const result = await authService.sendMagicLink(email);
      console.log('✅ Magic link sent');
      return result;
    } catch (error) {
      console.error('❌ Send magic link error:', error);
      throw error;
    }
  }, []);

  /**
   * Check Email Verification Status
   */
  const checkEmailVerificationStatus = useCallback(async () => {
    try {
      console.log('🔍 Checking email verification status...');
      const isVerified = await authService.checkEmailVerificationStatus();
      console.log('📋 Verification status:', isVerified);
      
      // Clear cache and refresh profile if verified
      if (isVerified && user) {
        profileCacheRef.current.delete(user.id);
        await updateUserState(user);
      }
      
      return isVerified;
    } catch (error) {
      console.error('❌ Check verification error:', error);
      return false;
    }
  }, [user, updateUserState]);

  /**
   * Change password
   */
  const changePassword = useCallback(async (newPassword: string) => {
    try {
      console.log('🔒 Changing password...');
      const result = await authService.changePassword(newPassword);
      console.log('✅ Password changed');
      
      // Clear cache and refresh profile
      if (user) {
        profileCacheRef.current.delete(user.id);
        await updateUserState(user);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Password change error:', error);
      throw error;
    }
  }, [user, updateUserState]);

  /**
   * Manually refresh user profile
   */
  const refreshProfile = useCallback(async () => {
    if (!user) return;
    console.log('🔄 Manually refreshing profile...');
    setLoading(true);
    
    // Clear cache for this user
    profileCacheRef.current.delete(user.id);
    
    await updateUserState(user);
    setLoading(false);
  }, [user, updateUserState]);

  /**
   * Memoize context value to prevent unnecessary re-renders
   */
  const contextValue = useMemo(
  () => ({
    user,
    userProfile,
    session,
    loading,
    isAuthenticated: !!user && !!session,

    // ✅ Role helpers
    isAdmin: userProfile?.role === 'admin',
    isTeacher: userProfile?.role === 'teacher',
    isStudent: userProfile?.role === 'student',

    login,
    logout,
    sendMagicLink,
    checkEmailVerificationStatus,
    changePassword,
    refreshProfile,
  }),
  [
    user,
    userProfile,
    session,
    loading,
    login,
    logout,
    sendMagicLink,
    checkEmailVerificationStatus,
    changePassword,
    refreshProfile,
  ]
);



  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================
// CUSTOM HOOK
// ============================================================

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}