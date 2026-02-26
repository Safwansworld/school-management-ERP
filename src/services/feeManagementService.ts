import { supabase } from '../lib/supabase';

// ==================== TYPES ====================
export interface FeeStructure {
  id: string;
  name: string;
  academic_year: string;
  applicable_for: 'All' | 'SpecificGrade' | 'StudentGroup';
  applicable_grades?: string[];
  applicable_classes?: string[];
  applicable_students?: string[];
  total_amount: number;
  status: 'Active' | 'Inactive';
  created_at: string;
}

export interface FeeComponent {
  id: string;
  fee_structure_id: string;
  type: string;
  amount: number;
  frequency: 'One-Time' | 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Annually';
  due_date: string;
}

export interface FeeAssignment {
  id: string;
  student_id: string;
  fee_structure_id: string;
  assigned_at: string;
  student_name?: string;
  class_name?: string;
  fee_structure_name?: string;
  total_amount?: number;
}

export interface FeePayment {
  id: string;
  student_id: string;
  fee_structure_id: string;
  fee_type: string;
  amount_paid: number;
  payment_mode: 'Cash' | 'UPI' | 'Bank Transfer' | 'Card' | 'Cheque' | 'Online';
  payment_date: string;
  receipt_no: string;
  remarks?: string;
  created_at: string;
}

export interface Student {
  id: string;
  full_name: string;
  student_name: string;
  class_name: string;
  academic_year: string;
  email?: string;
}

// ==================== FEE STRUCTURES ====================

export const fetchFeeStructures = async (academicYear?: string) => {
  try {
    let query = supabase.from('fee_structures').select('*');

    if (academicYear) {
      query = query.eq('academic_year', academicYear);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching fee structures:', error);
    throw error;
  }
};

export const fetchFeeStructureById = async (id: string) => {
  try {
    const { data: structure, error: structureError } = await supabase
      .from('fee_structures')
      .select('*')
      .eq('id', id)
      .single();

    if (structureError) throw structureError;

    const { data: components, error: componentsError } = await supabase
      .from('fee_components_table')
      .select('*')
      .eq('fee_structure_id', id);

    if (componentsError) throw componentsError;

    return { structure, components };
  } catch (error) {
    console.error('Error fetching fee structure:', error);
    throw error;
  }
};

export const createFeeStructure = async (
  structure: Omit<FeeStructure, 'id' | 'created_at'>,
  components: Omit<FeeComponent, 'id' | 'fee_structure_id'>[]
) => {
  try {
    const { data: newStructure, error: structureError } = await supabase
      .from('fee_structures')
      .insert([structure])
      .select()
      .single();

    if (structureError) throw structureError;

    const componentsWithStructureId = components.map(comp => ({
      ...comp,
      fee_structure_id: newStructure.id,
    }));

    const { error: componentsError } = await supabase
      .from('fee_components_table')
      .insert(componentsWithStructureId);

    if (componentsError) throw componentsError;

    return newStructure;
  } catch (error) {
    console.error('Error creating fee structure:', error);
    throw error;
  }
};

export const updateFeeStructure = async (
  id: string,
  structure: Partial<FeeStructure>,
  components?: Omit<FeeComponent, 'id' | 'fee_structure_id'>[]
) => {
  try {
    const { error: structureError } = await supabase
      .from('fee_structures')
      .update(structure)
      .eq('id', id);

    if (structureError) throw structureError;

    if (components) {
      // Delete old components
      await supabase.from('fee_components_table').delete().eq('fee_structure_id', id);

      // Insert new components
      const componentsWithStructureId = components.map(comp => ({
        ...comp,
        fee_structure_id: id,
      }));

      const { error: componentsError } = await supabase
        .from('fee_components_table')
        .insert(componentsWithStructureId);

      if (componentsError) throw componentsError;
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating fee structure:', error);
    throw error;
  }
};

export const deleteFeeStructure = async (id: string) => {
  try {
    // Delete components first
    await supabase.from('fee_components_table').delete().eq('fee_structure_id', id);

    // Delete structure
    const { error } = await supabase.from('fee_structures').delete().eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting fee structure:', error);
    throw error;
  }
};

// ==================== FEE ASSIGNMENTS ====================

export const fetchFeeAssignments = async () => {
  try {
    const { data, error } = await supabase
      .from('student_fee_assignments')
      .select(
        `
        id,
        student_id,
        fee_structure_id,
        assigned_at,
        students:student_id (full_name, class_name),
        fee_structures:fee_structure_id (name, total_amount, academic_year)
      `
      )
      .order('assigned_at', { ascending: false });

    if (error) throw error;

    return (
      data?.map((assignment: any) => ({
        id: assignment.id,
        student_id: assignment.student_id,
        fee_structure_id: assignment.fee_structure_id,
        assigned_at: assignment.assigned_at,
        student_name: assignment.students?.full_name || 'N/A',
        class_name: assignment.students?.class_name || 'N/A',
        fee_structure_name: assignment.fee_structures?.name || 'N/A',
        total_amount: assignment.fee_structures?.total_amount || 0,
      })) || []
    );
  } catch (error) {
    console.error('Error fetching fee assignments:', error);
    throw error;
  }
};

export const assignFeeStructure = async (studentId: string, feeStructureId: string) => {
  try {
    const { data, error } = await supabase
      .from('student_fee_assignments')
      .insert([{ student_id: studentId, fee_structure_id: feeStructureId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error assigning fee structure:', error);
    throw error;
  }
};

export const unassignFeeStructure = async (assignmentId: string) => {
  try {
    const { error } = await supabase
      .from('student_fee_assignments')
      .delete()
      .eq('id', assignmentId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error unassigning fee structure:', error);
    throw error;
  }
};

export const getEligibleStudentsForStructure = async (
  feeStructureId: string
) => {
  try {
    const { data: structure, error: structureError } = await supabase
      .from('fee_structures')
      .select('*')
      .eq('id', feeStructureId)
      .single();

    if (structureError) throw structureError;

    let query = supabase
      .from('class_assignments')
      .select('student_id, student_name, class_name, academic_year')
      .eq('academic_year', structure.academic_year);

    if (structure.applicable_for === 'SpecificGrade') {
      query = query.in('class_name', structure.applicable_classes || []);
    }

    const { data: students, error: studentsError } = await query;

    if (studentsError) throw studentsError;
    return students || [];
  } catch (error) {
    console.error('Error fetching eligible students:', error);
    throw error;
  }
};

// ==================== FEE PAYMENTS ====================

export const fetchFeePayments = async (filters?: {
  studentId?: string;
  paymentMode?: string;
  fromDate?: string;
  toDate?: string;
}) => {
  try {
    let query = supabase
      .from('fee_payments')
      .select(`
        id,
        student_id,
        fee_structure_id,
        fee_type,
        amount_paid,
        payment_mode,
        payment_date,
        receipt_no,
        remarks,
        students:student_id (full_name, class_name),
        fee_structures:fee_structure_id (name)
      `);

    if (filters?.studentId) {
      query = query.eq('student_id', filters.studentId);
    }

    if (filters?.paymentMode) {
      query = query.eq('payment_mode', filters.paymentMode);
    }

    if (filters?.fromDate) {
      query = query.gte('payment_date', filters.fromDate);
    }

    if (filters?.toDate) {
      query = query.lte('payment_date', filters.toDate);
    }

    const { data, error } = await query.order('payment_date', { ascending: false });

    if (error) throw error;

    return (
      data?.map((payment: any) => ({
        id: payment.id,
        student_id: payment.student_id,
        fee_structure_id: payment.fee_structure_id,
        fee_type: payment.fee_type,
        amount_paid: payment.amount_paid,
        payment_mode: payment.payment_mode,
        payment_date: payment.payment_date,
        receipt_no: payment.receipt_no,
        remarks: payment.remarks,
        student_name: payment.students?.full_name || 'N/A',
        class_name: payment.students?.class_name || 'N/A',
      })) || []
    );
  } catch (error) {
    console.error('Error fetching fee payments:', error);
    throw error;
  }
};

export const recordFeePayment = async (payment: Omit<FeePayment, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('fee_payments')
      .insert([payment])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error recording fee payment:', error);
    throw error;
  }
};

export const updateFeePayment = async (
  id: string,
  payment: Partial<Omit<FeePayment, 'id' | 'created_at'>>
) => {
  try {
    const { data, error } = await supabase
      .from('fee_payments')
      .update(payment)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating fee payment:', error);
    throw error;
  }
};

export const deleteFeePayment = async (id: string) => {
  try {
    const { error } = await supabase.from('fee_payments').delete().eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting fee payment:', error);
    throw error;
  }
};

// ==================== ANALYTICS ====================

export const fetchFeeAnalytics = async (academicYear: string) => {
  try {
    // First get fee structure IDs for the academic year
    const { data: feeStructureIds } = await supabase
      .from('fee_structures')
      .select('id')
      .eq('academic_year', academicYear);

    const ids = feeStructureIds?.map((s: { id: string }) => s.id) || [];

    const [assignmentsRes, paymentsRes] = await Promise.all([
      supabase
        .from('student_fee_assignments')
        .select('fee_structures:fee_structure_id (total_amount)')
        .eq('fee_structures.academic_year', academicYear),
      supabase
        .from('fee_payments')
        .select('amount_paid')
        .in('fee_structure_id', ids),
    ]);

    const totalAssigned = (assignmentsRes.data as any[])?.reduce(
      (sum, item) => sum + (item.fee_structures?.total_amount || 0),
      0
    ) || 0;

    const totalPaid = (paymentsRes.data as any[])?.reduce(
      (sum, item) => sum + (item.amount_paid || 0),
      0
    ) || 0;

    return {
      totalAssigned,
      totalPaid,
      outstanding: totalAssigned - totalPaid,
      overdue: Math.max(0, (totalAssigned - totalPaid) * 0.15),
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

// ==================== STUDENTS ====================

export const fetchStudents = async (academicYear?: string) => {
  try {
    let query = supabase
      .from('class_assignments')
      .select('student_id, student_name, class_name, academic_year');

    if (academicYear) {
      query = query.eq('academic_year', academicYear);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const fetchStudentsByClass = async (className: string, academicYear: string) => {
  try {
    const { data, error } = await supabase
      .from('class_assignments')
      .select('student_id, student_name, class_name')
      .eq('class_name', className)
      .eq('academic_year', academicYear);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching students by class:', error);
    throw error;
  }
};
