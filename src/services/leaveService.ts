import { supabase } from '../lib/supabase';

export interface LeaveApplication {
  id?: string;
  user_id: string;
  applicant_name: string;
  applicant_role: 'teacher' | 'staff' | 'admin';
  employee_id?: string;
  department?: string;
  leave_type: string;
  from_date: string;
  to_date: string;
  total_days: number;
  reason: string;
  contact_during_leave?: string;
  emergency_contact?: string;
  address_during_leave?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  applied_date?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  review_comments?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LeaveApplicationWithReviewer extends LeaveApplication {
  reviewer?: {
    first_name: string;
    last_name: string;
    role: string;
  };
  applicant?: {
    email: string;
    phone_number: string;
    profile_picture?: string;
  };
}

class LeaveService {
  /**
   * Submit a new leave application
   */
  async submitLeaveApplication(data: Omit<LeaveApplication, 'id' | 'status' | 'applied_date' | 'created_at' | 'updated_at'>): Promise<{ data: LeaveApplication | null; error: any }> {
    try {
      const { data: result, error } = await supabase
        .from('leave_applications')
        .insert([{
          ...data,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      return { data: result, error: null };
    } catch (error: any) {
      console.error('Error submitting leave application:', error);
      return { data: null, error };
    }
  }

  /**
   * Get all leave applications (Admin only)
   */
  async getAllLeaveApplications(): Promise<{ data: LeaveApplicationWithReviewer[] | null; error: any }> {
    try {
      // First, get all leave applications
      const { data: leaves, error: leavesError } = await supabase
        .from('leave_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (leavesError) throw leavesError;
      if (!leaves || leaves.length === 0) return { data: [], error: null };

      // Get unique reviewer IDs
      const reviewerIds = [...new Set(leaves
        .filter(leave => leave.reviewed_by)
        .map(leave => leave.reviewed_by))];

      // Get unique applicant IDs
      const applicantIds = [...new Set(leaves.map(leave => leave.user_id))];

      // Fetch reviewer profiles
      let reviewers: any = {};
      if (reviewerIds.length > 0) {
        const { data: reviewerData } = await supabase
          .from('user_profiles')
          .select('id, first_name, last_name, role')
          .in('id', reviewerIds);
        
        reviewerData?.forEach(r => {
          reviewers[r.id] = r;
        });
      }

      // Fetch applicant profiles
      let applicants: any = {};
      if (applicantIds.length > 0) {
        const { data: applicantData } = await supabase
          .from('user_profiles')
          .select('id, email, phone_number, profile_picture')
          .in('id', applicantIds);
        
        applicantData?.forEach(a => {
          applicants[a.id] = a;
        });
      }

      // Combine the data
      const enrichedLeaves = leaves.map(leave => ({
        ...leave,
        reviewer: leave.reviewed_by ? reviewers[leave.reviewed_by] : null,
        applicant: applicants[leave.user_id] || null
      }));

      return { data: enrichedLeaves, error: null };
    } catch (error: any) {
      console.error('Error fetching all leave applications:', error);
      return { data: null, error };
    }
  }

  /**
   * Get user's own leave applications
   */
  async getUserLeaveApplications(userId: string): Promise<{ data: LeaveApplicationWithReviewer[] | null; error: any }> {
    try {
      // Get user's leave applications
      const { data: leaves, error: leavesError } = await supabase
        .from('leave_applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (leavesError) throw leavesError;
      if (!leaves || leaves.length === 0) return { data: [], error: null };

      // Get unique reviewer IDs
      const reviewerIds = [...new Set(leaves
        .filter(leave => leave.reviewed_by)
        .map(leave => leave.reviewed_by))];

      // Fetch reviewer profiles
      let reviewers: any = {};
      if (reviewerIds.length > 0) {
        const { data: reviewerData } = await supabase
          .from('user_profiles')
          .select('id, first_name, last_name, role')
          .in('id', reviewerIds);
        
        reviewerData?.forEach(r => {
          reviewers[r.id] = r;
        });
      }

      // Combine the data
      const enrichedLeaves = leaves.map(leave => ({
        ...leave,
        reviewer: leave.reviewed_by ? reviewers[leave.reviewed_by] : null
      }));

      return { data: enrichedLeaves, error: null };
    } catch (error: any) {
      console.error('Error fetching user leave applications:', error);
      return { data: null, error };
    }
  }

  /**
   * Get pending leave applications (Admin view)
   */
  async getPendingLeaveApplications(): Promise<{ data: LeaveApplicationWithReviewer[] | null; error: any }> {
    try {
      // Get pending leave applications
      const { data: leaves, error: leavesError } = await supabase
        .from('leave_applications')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (leavesError) throw leavesError;
      if (!leaves || leaves.length === 0) return { data: [], error: null };

      // Get unique applicant IDs
      const applicantIds = [...new Set(leaves.map(leave => leave.user_id))];

      // Fetch applicant profiles
      let applicants: any = {};
      if (applicantIds.length > 0) {
        const { data: applicantData } = await supabase
          .from('user_profiles')
          .select('id, email, phone_number, profile_picture')
          .in('id', applicantIds);
        
        applicantData?.forEach(a => {
          applicants[a.id] = a;
        });
      }

      // Combine the data
      const enrichedLeaves = leaves.map(leave => ({
        ...leave,
        applicant: applicants[leave.user_id] || null
      }));

      return { data: enrichedLeaves, error: null };
    } catch (error: any) {
      console.error('Error fetching pending leave applications:', error);
      return { data: null, error };
    }
  }

  /**
   * Approve leave application (Admin only)
   */
  async approveLeaveApplication(
    applicationId: string, 
    reviewerId: string, 
    comments?: string
  ): Promise<{ data: LeaveApplication | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('leave_applications')
        .update({
          status: 'approved',
          reviewed_by: reviewerId,
          reviewed_at: new Date().toISOString(),
          review_comments: comments,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      console.error('Error approving leave application:', error);
      return { data: null, error };
    }
  }

  /**
   * Reject leave application (Admin only)
   */
  async rejectLeaveApplication(
    applicationId: string, 
    reviewerId: string, 
    comments: string
  ): Promise<{ data: LeaveApplication | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('leave_applications')
        .update({
          status: 'rejected',
          reviewed_by: reviewerId,
          reviewed_at: new Date().toISOString(),
          review_comments: comments,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      console.error('Error rejecting leave application:', error);
      return { data: null, error };
    }
  }

  /**
   * Cancel leave application (User can cancel their own pending application)
   */
  async cancelLeaveApplication(applicationId: string, userId: string): Promise<{ data: LeaveApplication | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('leave_applications')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId)
        .eq('user_id', userId)
        .eq('status', 'pending')
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      console.error('Error cancelling leave application:', error);
      return { data: null, error };
    }
  }

  /**
   * Get leave statistics
   */
  async getLeaveStatistics(userId?: string): Promise<{ 
    total: number; 
    pending: number; 
    approved: number; 
    rejected: number; 
  }> {
    try {
      let query = supabase.from('leave_applications').select('status', { count: 'exact' });
      
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { count: total } = await query;
      const { count: pending } = await query.eq('status', 'pending');
      const { count: approved } = await query.eq('status', 'approved');
      const { count: rejected } = await query.eq('status', 'rejected');

      return {
        total: total || 0,
        pending: pending || 0,
        approved: approved || 0,
        rejected: rejected || 0
      };
    } catch (error) {
      console.error('Error fetching leave statistics:', error);
      return { total: 0, pending: 0, approved: 0, rejected: 0 };
    }
  }
}

export const leaveService = new LeaveService();
