import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface LearnerProfile {
  id: string;
  teacher_id: string;
  full_name: string;
  email: string;
  grade: string;
  student_number: string;
  date_of_birth: string | null;
  enrollment_date: string;
  status: string;
  avg_score: number;
  created_at: string;
}

interface LearnerAuthContextType {
  learner: LearnerProfile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, studentNumber: string) => Promise<void>;
  signOut: () => void;
}

const LearnerAuthContext = createContext<LearnerAuthContextType | undefined>(undefined);

const LEARNER_SESSION_KEY = 'learner_session';

export function LearnerAuthProvider({ children }: { children: React.ReactNode }) {
  const [learner, setLearner] = useState<LearnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Restore session from localStorage
    try {
      const saved = localStorage.getItem(LEARNER_SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setLearner(parsed);
      }
    } catch {
      localStorage.removeItem(LEARNER_SESSION_KEY);
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, studentNumber: string) => {
    setError(null);
    setLoading(true);
    try {
      const { data, error: dbError } = await supabase
        .from('learners')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .eq('student_number', studentNumber.trim())
        .single();

      if (dbError || !data) {
        throw new Error('Invalid email or student number. Please check your credentials.');
      }

      setLearner(data);
      localStorage.setItem(LEARNER_SESSION_KEY, JSON.stringify(data));
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setLearner(null);
    localStorage.removeItem(LEARNER_SESSION_KEY);
  };

  return (
    <LearnerAuthContext.Provider value={{ learner, loading, error, signIn, signOut }}>
      {children}
    </LearnerAuthContext.Provider>
  );
}

export function useLearnerAuth() {
  const context = useContext(LearnerAuthContext);
  if (!context) throw new Error('useLearnerAuth must be used within LearnerAuthProvider');
  return context;
}
