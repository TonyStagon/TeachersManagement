import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface Teacher {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  subject_specialization: string;
  school_name: string | null;
  experience_years: number;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  teacher: Teacher | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, schoolName: string, experienceYears: number) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateTeacherProfile: (updates: Partial<Teacher>) => Promise<void>;
  uploadProfileImage: (file: File) => Promise<string>;
  refreshTeacher: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTeacherProfile = async (userId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from('teachers')
        .select('*')
        .eq('auth_user_id', userId)
        .single();

      if (error) throw error;
      setTeacher(data);
      
      // Save teacher data to localStorage for notificationManager
      localStorage.setItem('teacher_profile', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
      setTeacher(null);
      // Clear teacher data from localStorage on error
      localStorage.removeItem('teacher_profile');
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchTeacherProfile(session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchTeacherProfile(session.user.id);
      } else {
        setTeacher(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, schoolName: string, experienceYears: number) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const { error: profileError } = await (supabase as any)
        .from('teachers')
        .insert([
          {
            auth_user_id: data.user.id,
            email,
            full_name: fullName,
            subject_specialization: 'Life Orientation',
            school_name: schoolName || null,
            experience_years: experienceYears || 0,
          },
        ]);

      if (profileError) throw profileError;
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // Clear teacher data from localStorage on sign out
    localStorage.removeItem('teacher_profile');
  };

  const updateTeacherProfile = async (updates: Partial<Teacher>) => {
    if (!teacher) throw new Error('No teacher profile found');

    const { error } = await (supabase as any)
      .from('teachers')
      .update(updates)
      .eq('id', teacher.id);

    if (error) throw error;

    // Refresh teacher data
    await refreshTeacher();
  };

  const uploadProfileImage = async (file: File): Promise<string> => {
    if (!teacher) throw new Error('No teacher profile found');

    const fileExt = file.name.split('.').pop();
    const fileName = `${teacher.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `profile-images/${fileName}`;

    const { error: uploadError } = await (supabase as any).storage
      .from('teacher-profiles')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = (supabase as any).storage
      .from('teacher-profiles')
      .getPublicUrl(filePath);

    await updateTeacherProfile({ profile_image: publicUrl });

    return publicUrl;
  };

  const refreshTeacher = async () => {
    if (user) {
      await fetchTeacherProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        teacher,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        updateTeacherProfile,
        uploadProfileImage,
        refreshTeacher,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
