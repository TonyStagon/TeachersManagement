import { supabase } from './supabase';

export interface Learner {
  id: string;
  teacher_id: string;
  full_name: string;
  grade: string;
  student_number: string;
  email: string | null;
  date_of_birth: string | null;
  enrollment_date: string;
  status: string;
  avg_score: number;
  created_at: string;
}

export async function fetchLearners(teacherId: string): Promise<Learner[]> {
  const { data, error } = await supabase
    .from('learners')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createLearner(learner: Omit<Learner, 'id' | 'created_at'>): Promise<Learner> {
  const { data, error } = await (supabase as any)
    .from('learners')
    .insert([learner])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateLearner(id: string, updates: Partial<Learner>): Promise<Learner> {
  const { data, error } = await (supabase as any)
    .from('learners')
    .update({ ...updates })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function generateUniqueStudentNumber(teacherId: string): Promise<string> {
  // Fetch existing student numbers for this teacher
  const { data: existingLearners, error } = await (supabase as any)
    .from('learners')
    .select('student_number')
    .eq('teacher_id', teacherId)
    .order('student_number', { ascending: false });

  if (error) throw error;

  // Extract numeric parts from existing student numbers
  const existingNumbers: number[] = [];
  const studentNumberRegex = /^STU(\d+)$/i;
  
  existingLearners?.forEach((learner: any) => {
    const match = learner.student_number?.match(studentNumberRegex);
    if (match) {
      existingNumbers.push(parseInt(match[1], 10));
    }
  });

  // Find the highest number and increment
  const highestNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
  const nextNumber = highestNumber + 1;
  
  // Format as STU with leading zeros (e.g., STU001, STU012, STU123)
  return `STU${nextNumber.toString().padStart(3, '0')}`;
}

export async function generateMultipleStudentNumbers(teacherId: string, count: number): Promise<string[]> {
  // Fetch existing student numbers for this teacher
  const { data: existingLearners, error } = await (supabase as any)
    .from('learners')
    .select('student_number')
    .eq('teacher_id', teacherId)
    .order('student_number', { ascending: false });

  if (error) throw error;

  // Extract numeric parts from existing student numbers
  const existingNumbers: number[] = [];
  const studentNumberRegex = /^STU(\d+)$/i;
  
  existingLearners?.forEach((learner: any) => {
    const match = learner.student_number?.match(studentNumberRegex);
    if (match) {
      existingNumbers.push(parseInt(match[1], 10));
    }
  });

  // Find the highest number
  const highestNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
  
  // Generate sequential numbers starting from highest + 1
  const studentNumbers: string[] = [];
  for (let i = 1; i <= count; i++) {
    const nextNumber = highestNumber + i;
    studentNumbers.push(`STU${nextNumber.toString().padStart(3, '0')}`);
  }
  
  return studentNumbers;
}

export async function deleteLearner(id: string): Promise<void> {
  const { error } = await (supabase as any)
    .from('learners')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function bulkCreateLearners(learners: Omit<Learner, 'id' | 'created_at'>[]): Promise<Learner[]> {
  const { data, error } = await (supabase as any)
    .from('learners')
    .insert(learners)
    .select();

  if (error) throw error;
  return data;
}
