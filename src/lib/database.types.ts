export interface Database {
  public: {
    Tables: {
      teachers: {
        Row: {
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
        };
        Insert: {
          id?: string;
          auth_user_id: string;
          full_name: string;
          email: string;
          subject_specialization?: string;
          school_name?: string | null;
          experience_years?: number;
          profile_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_user_id?: string;
          full_name?: string;
          email?: string;
          subject_specialization?: string;
          school_name?: string | null;
          experience_years?: number;
          profile_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      learners: {
        Row: {
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
        };
        Insert: {
          id?: string;
          teacher_id: string;
          full_name: string;
          grade: string;
          student_number: string;
          email?: string | null;
          date_of_birth?: string | null;
          enrollment_date?: string;
          status?: string;
          avg_score?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          teacher_id?: string;
          full_name?: string;
          grade?: string;
          student_number?: string;
          email?: string | null;
          date_of_birth?: string | null;
          enrollment_date?: string;
          status?: string;
          avg_score?: number;
          created_at?: string;
        };
      };
      performance_records: {
        Row: {
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
        };
        Insert: {
          id?: string;
          learner_id: string;
          subject: string;
          term: string;
          score: number;
          grade_achieved?: string | null;
          recorded_date?: string;
          notes?: string | null;
          previous_score?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          learner_id?: string;
          subject?: string;
          term?: string;
          score?: number;
          grade_achieved?: string | null;
          recorded_date?: string;
          notes?: string | null;
          previous_score?: number | null;
          created_at?: string;
        };
      };
      subjects: {
        Row: {
          id: string;
          name: string;
          code: string;
          description: string | null;
          color: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          description?: string | null;
          color?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          description?: string | null;
          color?: string;
        };
      };
      resources: {
        Row: {
          id: string;
          teacher_id: string;
          title: string;
          description: string | null;
          category: string;
          file_url: string | null;
          tags: string[];
          downloads: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          title: string;
          description?: string | null;
          category?: string;
          file_url?: string | null;
          tags?: string[];
          downloads?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          teacher_id?: string;
          title?: string;
          description?: string | null;
          category?: string;
          file_url?: string | null;
          tags?: string[];
          downloads?: number;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          teacher_id: string;
          title: string;
          message: string;
          type: string;
          is_read: boolean;
          created_at: string;
          learner_id?: string | null;
          learner_name?: string | null;
          sound_play_count?: number;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          title: string;
          message: string;
          type?: string;
          is_read?: boolean;
          created_at?: string;
          learner_id?: string | null;
          learner_name?: string | null;
          sound_play_count?: number;
        };
        Update: {
          id?: string;
          teacher_id?: string;
          title?: string;
          message?: string;
          type?: string;
          is_read?: boolean;
          created_at?: string;
          learner_id?: string | null;
          learner_name?: string | null;
          sound_play_count?: number;
        };
      };
      achievements: {
        Row: {
          id: string;
          learner_id: string;
          title: string;
          description: string | null;
          badge_type: string;
          achievement_type: string;
          auto_awarded: boolean;
          awarded_by: string;
          awarded_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          learner_id: string;
          title: string;
          description?: string | null;
          badge_type?: string;
          achievement_type?: string;
          auto_awarded?: boolean;
          awarded_by?: string;
          awarded_date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          learner_id?: string;
          title?: string;
          description?: string | null;
          badge_type?: string;
          achievement_type?: string;
          auto_awarded?: boolean;
          awarded_by?: string;
          awarded_date?: string;
          created_at?: string;
        };
      };
    };
  };
}
