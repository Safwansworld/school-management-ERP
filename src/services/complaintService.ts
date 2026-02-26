// // services/complaintService.ts
// import { supabase } from '../lib/supabase';
// import type { ComplaintFormData, Complaint } from '../types/complaints';

// export const complaintService = {
//   async createComplaint(formData: ComplaintFormData, userId: string, files: File[]) {
//     try {
//       // Upload attachments
//       const attachmentUrls = await this.uploadAttachments(files, userId);

//       // Insert complaint
//       const { data, error } = await supabase
//         .from('complaints')
//         .insert({
//           ...formData,
//           complainant_id: userId,
//           attachments: attachmentUrls,
//           status: 'pending',
//           requires_approval: true,
//         })
//         .select()
//         .single();

//       if (error) throw error;
//       return data;
//     } catch (error) {
//       console.error('Error creating complaint:', error);
//       throw error;
//     }
//   },

//   async uploadAttachments(files: File[], userId: string): Promise<string[]> {
//     if (files.length === 0) return [];

//     const uploadPromises = files.map(async (file: File) => {
//       const fileName = `${userId}/${Date.now()}_${file.name}`;
//       const { error } = await supabase.storage
//         .from('complaint-attachments')
//         .upload(fileName, file);

//       if (error) throw error;

//       const { data } = supabase.storage
//         .from('complaint-attachments')
//         .getPublicUrl(fileName);

//       return data.publicUrl;
//     });

//     const urls = await Promise.all(uploadPromises);
//     return urls.filter((url: string) => url !== null);
//   },

//   async getComplaints(userId: string, userRole: string) {
//     let query = supabase
//       .from('complaints')
//       .select('*')
//       .order('created_at', { ascending: false });

//     if (userRole === 'student' || userRole === 'parent') {
//       query = query.eq('complainant_id', userId);
//     } else if (userRole === 'teacher') {
//       query = query.or(`complainant_id.eq.${userId},assigned_to.eq.${userId}`);
//     }

//     const { data, error } = await query;
//     if (error) throw error;
//     return data;
//   },

//   async updateComplaintStatus(complaintId: string, status: string) {
//     const { data, error } = await supabase
//       .from('complaints')
//       .update({ status })
//       .eq('id', complaintId)
//       .select()
//       .single();

//     if (error) throw error;
//     return data;
//   },
// };
// services/complaintService.ts
import { supabase } from '../lib/supabase';
import type { ComplaintFormData, Complaint } from '../types/complaints';

export const complaintService = {
  /**
   * Create a new complaint with file attachments
   */
  // services/complaintService.ts - Updated createComplaint method
async createComplaint(
  formData: ComplaintFormData,
  userId: string,
  userRole: string,
  files: File[]
) {
  try {
    console.log('📝 Creating complaint:', { userId, userRole, formData });

    // Upload attachments first
    const attachmentUrls = await this.uploadAttachments(files, userId);

    // Clean UUID fields - convert empty strings to null
    const cleanData = {
      complainant_id: userId,
      complainant_role: userRole,
      complainant_name: formData.complainant_name,
      complainant_email: formData.complainant_email,
      complainant_phone: formData.complainant_phone,
      against_role: formData.against_role,
      against_id: formData.against_id || null, // ✅ Convert empty string to null
      against_name: formData.against_name,
      department: formData.department || null, // ✅ Convert empty string to null
      class_id: formData.class_id || null, // ✅ Convert empty string to null
      class_name: formData.class_name || null,
      complaint_type: formData.complaint_type,
      title: formData.title,
      description: formData.description,
      incident_date: formData.incident_date,
      urgency_level: formData.urgency_level || 'medium',
      attachments: attachmentUrls,
      status: 'pending',
      requires_approval: true,
    };

    console.log('📤 Inserting complaint with cleaned data:', cleanData);

    // Insert complaint
    const { data, error } = await supabase
      .from('complaints')
      .insert(cleanData)
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating complaint:', error);
      throw error;
    }

    console.log('✅ Complaint created:', data);
    return data;
  } catch (error) {
    console.error('❌ Error in createComplaint:', error);
    throw error;
  }
},


  /**
   * Upload multiple attachments to Supabase Storage
   */
  async uploadAttachments(files: File[], userId: string): Promise<string[]> {
    if (files.length === 0) return [];

    try {
      console.log(`📎 Uploading ${files.length} attachments...`);

      const uploadPromises = files.map(async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('complaint-attachments')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('❌ Upload error:', uploadError);
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('complaint-attachments')
          .getPublicUrl(fileName);

        return data.publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      console.log('✅ Attachments uploaded:', urls.length);
      return urls.filter((url: string) => url !== null);
    } catch (error) {
      console.error('❌ Error uploading attachments:', error);
      throw error;
    }
  },

  /**
   * Get complaints based on user role with proper RLS handling
   */
  async getComplaints(userId: string, userRole: string) {
    try {
      console.log('📋 Fetching complaints for:', { userId, userRole });

      let query = supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      // Role-based filtering (RLS will also apply)
      const normalizedRole = userRole.toLowerCase();

      if (normalizedRole === 'student') {
        // Students see only their own complaints
        query = query.eq('complainant_id', userId);
      } else if (normalizedRole === 'parent') {
        // Parents see their own complaints
        query = query.eq('complainant_id', userId);
      } else if (normalizedRole === 'teacher') {
        // Teachers see complaints they created OR assigned to them
        query = query.or(`complainant_id.eq.${userId},assigned_to.eq.${userId}`);
      }
      // Admin and staff see ALL complaints - no filter needed (RLS handles it)

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error fetching complaints:', error);
        throw error;
      }

      console.log('✅ Complaints fetched:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ Error in getComplaints:', error);
      throw error;
    }
  },

  /**
   * Get single complaint by ID
   */
  async getComplaintById(complaintId: string) {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('id', complaintId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error fetching complaint:', error);
      throw error;
    }
  },

  /**
   * Update complaint status
   */
  async updateComplaintStatus(
    complaintId: string,
    status: string,
    userId: string,
    userName: string
  ) {
    try {
      console.log('🔄 Updating complaint status:', { complaintId, status });

      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      // Set timestamps based on status
      if (status === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
      } else if (status === 'closed') {
        updateData.closed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('complaints')
        .update(updateData)
        .eq('id', complaintId)
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Status updated');
      return data;
    } catch (error) {
      console.error('❌ Error updating status:', error);
      throw error;
    }
  },

  /**
   * Approve complaint (admin only)
   */
  async approveComplaint(complaintId: string, adminId: string) {
    try {
      console.log('✅ Approving complaint:', complaintId);

      const { data, error } = await supabase
        .from('complaints')
        .update({
          requires_approval: false,
          approved_by: adminId,
          approved_at: new Date().toISOString(),
          status: 'in-progress',
        })
        .eq('id', complaintId)
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Complaint approved');
      return data;
    } catch (error) {
      console.error('❌ Error approving complaint:', error);
      throw error;
    }
  },

  /**
   * Reject complaint (admin only)
   */
  async rejectComplaint(
    complaintId: string,
    adminId: string,
    reason: string
  ) {
    try {
      console.log('❌ Rejecting complaint:', complaintId);

      const { data, error } = await supabase
        .from('complaints')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          approved_by: adminId,
          approved_at: new Date().toISOString(),
        })
        .eq('id', complaintId)
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Complaint rejected');
      return data;
    } catch (error) {
      console.error('❌ Error rejecting complaint:', error);
      throw error;
    }
  },

  /**
   * Assign complaint to user
   */
  async assignComplaint(
    complaintId: string,
    assignToId: string,
    assignToName: string
  ) {
    try {
      console.log('👤 Assigning complaint:', { complaintId, assignToId });

      const { data, error } = await supabase
        .from('complaints')
        .update({
          assigned_to: assignToId,
          assigned_to_name: assignToName,
        })
        .eq('id', complaintId)
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Complaint assigned');
      return data;
    } catch (error) {
      console.error('❌ Error assigning complaint:', error);
      throw error;
    }
  },

  /**
   * Get complaint follow-ups
   */
  async getFollowups(complaintId: string) {
    try {
      const { data, error } = await supabase
        .from('complaint_followups')
        .select('*')
        .eq('complaint_id', complaintId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error fetching followups:', error);
      throw error;
    }
  },

  /**
   * Add follow-up to complaint
   */
  async addFollowup(
    complaintId: string,
    followupData: {
      followup_type: string;
      message: string;
      status_update?: string;
      attachments?: string[];
    },
    userId: string,
    userName: string,
    userRole: string
  ) {
    try {
      console.log('💬 Adding followup:', { complaintId, followup_type: followupData.followup_type });

      const followupNumber = `FU${Date.now()}`;

      const { data, error } = await supabase
        .from('complaint_followups')
        .insert({
          followup_number: followupNumber,
          complaint_id: complaintId,
          followup_type: followupData.followup_type,
          message: followupData.message,
          status_update: followupData.status_update || null,
          attachments: followupData.attachments || [],
          added_by: userId,
          added_by_name: userName,
          added_by_role: userRole,
        })
        .select()
        .single();

      if (error) throw error;

      // Update complaint status if provided
      if (followupData.status_update) {
        await this.updateComplaintStatus(complaintId, followupData.status_update, userId, userName);
      }

      console.log('✅ Followup added');
      return data;
    } catch (error) {
      console.error('❌ Error adding followup:', error);
      throw error;
    }
  },

  /**
   * Get active teachers for assignment
   */
  async getActiveTeachers() {
  try {
    const { data, error } = await supabase
      .from('teacher_profiles')
      .select('id, full_name, email, subject_specialization')
      .eq('status', 'active')
      .order('full_name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('❌ Error fetching teachers:', error);
    return [];
  }
},
  /**
   * Get active staff for assignment
   */
  async getActiveStaff() {
  try {
    const { data, error } = await supabase
      .from('staff_profiles')
      .select('id, staff_name, email, department, position')
      .eq('status', 'active')
      .order('staff_name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('❌ Error fetching staff:', error);
    return [];
  }
},
};
