import { supabase } from './supabase';

export interface PerformanceRecord {
  id: string;
  learner_id: string;
  subject: string;
  term: string;
  score: number;
  grade_achieved: string | null;
  recorded_date: string;
  notes: string | null;
  previous_score: number | null;
  created_at: string;
}

export interface PerformanceRecordInput {
  learner_id: string;
  subject: string;
  term: string;
  score: number;
  grade_achieved?: string | null;
  recorded_date: string;
  notes?: string | null;
  previous_score?: number | null;
}

// Fetch performance records for a specific learner
export async function fetchPerformanceRecordsByLearner(learnerId: string): Promise<PerformanceRecord[]> {
  try {
    const { data, error } = await (supabase as any)
      .from('performance_records')
      .select('*')
      .eq('learner_id', learnerId)
      .order('recorded_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching performance records for learner:', error);
    return [];
  }
}

// Fetch performance records for multiple learners (by teacher)
export async function fetchPerformanceRecordsByTeacher(teacherId: string): Promise<PerformanceRecord[]> {
  try {
    // First get all learners for this teacher
    const { data: learners, error: learnersError } = await (supabase as any)
      .from('learners')
      .select('id')
      .eq('teacher_id', teacherId);

    if (learnersError) throw learnersError;
    
    if (!learners || learners.length === 0) {
      return [];
    }

    const learnerIds = learners.map((learner: any) => learner.id);
    
    // Then get performance records for these learners
    const { data, error } = await (supabase as any)
      .from('performance_records')
      .select('*')
      .in('learner_id', learnerIds)
      .order('recorded_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching performance records for teacher:', error);
    return [];
  }
}

// Fetch performance records for a specific subject (e.g., Life Orientation)
export async function fetchPerformanceRecordsBySubject(teacherId: string, subject: string): Promise<PerformanceRecord[]> {
  try {
    // First get all learners for this teacher
    const { data: learners, error: learnersError } = await (supabase as any)
      .from('learners')
      .select('id')
      .eq('teacher_id', teacherId);

    if (learnersError) throw learnersError;
    
    if (!learners || learners.length === 0) {
      return [];
    }

    const learnerIds = learners.map((learner: any) => learner.id);
    
    // Then get performance records for these learners and specific subject
    const { data, error } = await (supabase as any)
      .from('performance_records')
      .select('*')
      .in('learner_id', learnerIds)
      .eq('subject', subject)
      .order('recorded_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching performance records for subject ${subject}:`, error);
    return [];
  }
}

// Create a new performance record
export async function createPerformanceRecord(record: PerformanceRecordInput): Promise<PerformanceRecord | null> {
  try {
    const { data, error } = await (supabase as any)
      .from('performance_records')
      .insert([record])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating performance record:', error);
    return null;
  }
}

// Update a performance record
export async function updatePerformanceRecord(id: string, updates: Partial<PerformanceRecordInput>): Promise<PerformanceRecord | null> {
  try {
    const { data, error } = await (supabase as any)
      .from('performance_records')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating performance record:', error);
    return null;
  }
}

// Delete a performance record
export async function deletePerformanceRecord(id: string): Promise<boolean> {
  try {
    const { error } = await (supabase as any)
      .from('performance_records')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting performance record:', error);
    return false;
  }
}