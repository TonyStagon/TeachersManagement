export interface Database {
  public: {
    Tables: {
      teachers: {
        Row: {
          id: string;
          auth_id: string | null;
          full_name: string;
          email: string;
          subject_specialization: string;
          school_name: string | null;
          experience_years: number;
          profile_image: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          auth_id?: string | null;
          full_name: string;
          email: string;
          subject_specialization?: string;
          school_name?: string | null;
          experience_years?: number;
          profile_image?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          auth_id?: string | null;
          full_name?: string;
          email?: string;
          subject_specialization?: string;
          school_name?: string | null;
          experience_years?: number;
          profile_image?: string | null;
          created_at?: string;
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
          assessment_type: string;
          recorded_date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          learner_id: string;
          subject: string;
          term: string;
          score: number;
          grade_achieved?: string | null;
          assessment_type?: string;
          recorded_date?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          learner_id?: string;
          subject?: string;
          term?: string;
          score?: number;
          grade_achieved?: string | null;
          assessment_type?: string;
          recorded_date?: string;
          notes?: string | null;
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
        };
        Insert: {
          id?: string;
          teacher_id: string;
          title: string;
          message: string;
          type?: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          teacher_id?: string;
          title?: string;
          message?: string;
          type?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          learner_id: string;
          title: string;
          description: string | null;
          badge_type: string;
          awarded_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          learner_id: string;
          title: string;
          description?: string | null;
          badge_type?: string;
          awarded_date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          learner_id?: string;
          title?: string;
          description?: string | null;
          badge_type?: string;
          awarded_date?: string;
          created_at?: string;
        };
      };
    };
  };
}
