// types/complaints.ts
export interface Complaint {
  id: string;
  complaint_number: string;
  complainant_role: 'student' | 'parent' | 'teacher' | 'staff' | 'other';
  complainant_id: string | null;
  complainant_name: string;
  complainant_email: string | null;
  complainant_phone: string | null;
  against_role: 'student' | 'teacher' | 'staff' | 'department' | 'other';
  against_id: string | null;
  against_name: string;
  department: string | null;
  class_id: string | null;
  class_name: string | null;
  complaint_type: 'academic' | 'behaviour' | 'safety' | 'facility' | 'fee' | 'transport' | 'other';
  title: string;
  description: string;
  incident_date: string;
  urgency_level: 'low' | 'medium' | 'high' | 'critical';
  attachments: string[];
  assigned_to: string | null;
  assigned_to_name: string | null;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed' | 'rejected';
  admin_remarks: string | null;
  requires_approval: boolean;
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  closed_at: string | null;
}

export interface ComplaintFollowup {
  id: string;
  followup_number: string;
  complaint_id: string;
  followup_type: 'action_taken' | 'comment' | 'response' | 'escalation' | 'resolution';
  message: string;
  attachments: string[];
  next_action_required: boolean;
  forward_to: string | null;
  forward_to_name: string | null;
  status_update: 'in-review' | 'investigated' | 'resolved' | 'closed' | null;
  is_resolution: boolean;
  resolution_note: string | null;
  added_by: string;
  added_by_name: string;
  added_by_role: string;
  created_at: string;
}

export interface ComplaintStats {
  open: number;
  inProgress: number;
  resolved: number;
}

export interface ComplaintFormData {
  complainant_role: string;
  complainant_name: string;
  complainant_email: string;
  complainant_phone: string;
  against_role: string;
  against_id: string;
  against_name: string;
  department: string;
  class_id: string;
  class_name: string;
  complaint_type: string;
  title: string;
  description: string;
  incident_date: string;
  urgency_level: string;
}
interface FormData {
  complainant_role: string;
  complainant_name: string;
  complainant_email: string;
  complainant_phone: string;
  against_role: string;
  against_id: string;
  against_name: string;
  department: string;
  class_id: string; // Keep for database compatibility
  class_name: string; // This is what we'll use
  complaint_type: string;
  title: string;
  description: string;
  incident_date: string;
  urgency_level: string;
}
