# Teacher Management Dashboard - Database Schemas

This document outlines the database schema for the Teacher Management Dashboard application. The schema is designed for Supabase PostgreSQL database.

## Table Overview

The database consists of 7 main tables:

1. **teachers** - Teacher profiles and information
2. **learners** - Student/learner information
3. **performance_records** - Academic performance tracking
4. **subjects** - Subject/course catalog
5. **resources** - Teaching resources and materials
6. **notifications** - System notifications
7. **achievements** - Student achievements and awards

---

## Table Details

### 1. teachers

Stores teacher profile information.

| Column                 | Type        | Description                            | Constraints                            |
| ---------------------- | ----------- | -------------------------------------- | -------------------------------------- |
| id                     | UUID        | Primary key                            | PRIMARY KEY, DEFAULT gen_random_uuid() |
| auth_id                | TEXT        | Authentication ID (from Supabase Auth) | NULLABLE                               |
| full_name              | TEXT        | Teacher's full name                    | NOT NULL                               |
| email                  | TEXT        | Email address                          | NOT NULL                               |
| subject_specialization | TEXT        | Primary teaching subject               | DEFAULT 'Life Orientation'             |
| school_name            | TEXT        | School name                            | NULLABLE                               |
| experience_years       | INTEGER     | Years of teaching experience           | DEFAULT 0                              |
| profile_image          | TEXT        | URL to profile image                   | NULLABLE                               |
| created_at             | TIMESTAMPTZ | Record creation timestamp              | DEFAULT now()                          |

**Relationships:**

- One teacher has many learners (teacher_id foreign key in learners table)
- One teacher has many resources (teacher_id foreign key in resources table)
- One teacher has many notifications (teacher_id foreign key in notifications table)

---

### 2. learners

Stores student/learner information.

| Column          | Type        | Description                                           | Constraints                            |
| --------------- | ----------- | ----------------------------------------------------- | -------------------------------------- |
| id              | UUID        | Primary key                                           | PRIMARY KEY, DEFAULT gen_random_uuid() |
| teacher_id      | UUID        | Reference to teacher                                  | FOREIGN KEY (teachers.id), NOT NULL    |
| full_name       | TEXT        | Learner's full name                                   | NOT NULL                               |
| grade           | TEXT        | Current grade level (e.g., 'Grade 10')                | NOT NULL                               |
| student_number  | TEXT        | Unique student identifier                             | NOT NULL                               |
| email           | TEXT        | Email address                                         | NULLABLE                               |
| date_of_birth   | DATE        | Date of birth                                         | NULLABLE                               |
| enrollment_date | DATE        | Date of enrollment                                    | DEFAULT CURRENT_DATE                   |
| status          | TEXT        | Enrollment status ('Active', 'Inactive', 'Graduated') | DEFAULT 'Active'                       |
| created_at      | TIMESTAMPTZ | Record creation timestamp                             | DEFAULT now()                          |

**Relationships:**

- Belongs to a teacher (teacher_id foreign key)
- Has many performance_records (learner_id foreign key)
- Has many achievements (learner_id foreign key)

---

### 3. performance_records

Tracks academic performance and assessment results.

| Column          | Type        | Description                                       | Constraints                            |
| --------------- | ----------- | ------------------------------------------------- | -------------------------------------- |
| id              | UUID        | Primary key                                       | PRIMARY KEY, DEFAULT gen_random_uuid() |
| learner_id      | UUID        | Reference to learner                              | FOREIGN KEY (learners.id), NOT NULL    |
| subject         | TEXT        | Subject name                                      | NOT NULL                               |
| term            | TEXT        | Academic term (e.g., 'Term 1', 'Term 2')          | NOT NULL                               |
| score           | INTEGER     | Percentage score (0-100)                          | NOT NULL                               |
| grade_achieved  | TEXT        | Letter grade (e.g., 'A', 'B', 'C')                | NULLABLE                               |
| assessment_type | TEXT        | Type of assessment ('Test', 'Exam', 'Assignment') | DEFAULT 'Test'                         |
| recorded_date   | DATE        | Date when score was recorded                      | DEFAULT CURRENT_DATE                   |
| notes           | TEXT        | Additional notes                                  | NULLABLE                               |
| created_at      | TIMESTAMPTZ | Record creation timestamp                         | DEFAULT now()                          |

**Relationships:**

- Belongs to a learner (learner_id foreign key)

---

### 4. subjects

Catalog of subjects/courses available.

| Column      | Type | Description                      | Constraints                            |
| ----------- | ---- | -------------------------------- | -------------------------------------- |
| id          | UUID | Primary key                      | PRIMARY KEY, DEFAULT gen_random_uuid() |
| name        | TEXT | Subject name                     | NOT NULL                               |
| code        | TEXT | Subject code                     | NOT NULL                               |
| description | TEXT | Subject description              | NULLABLE                               |
| color       | TEXT | Color code for UI representation | DEFAULT '#3B82F6'                      |

**Relationships:**

- Used in performance_records (subject field)

---

### 5. resources

Teaching resources and materials shared by teachers.

| Column      | Type        | Description                                                                    | Constraints                            |
| ----------- | ----------- | ------------------------------------------------------------------------------ | -------------------------------------- |
| id          | UUID        | Primary key                                                                    | PRIMARY KEY, DEFAULT gen_random_uuid() |
| teacher_id  | UUID        | Reference to teacher                                                           | FOREIGN KEY (teachers.id), NOT NULL    |
| title       | TEXT        | Resource title                                                                 | NOT NULL                               |
| description | TEXT        | Resource description                                                           | NULLABLE                               |
| category    | TEXT        | Resource category ('Lesson Plans', 'Worksheets', 'Videos', 'Assessment Tools') | DEFAULT 'Lesson Plans'                 |
| file_url    | TEXT        | URL to resource file                                                           | NULLABLE                               |
| tags        | TEXT[]      | Array of tags for categorization                                               | DEFAULT '{}'                           |
| downloads   | INTEGER     | Download count                                                                 | DEFAULT 0                              |
| created_at  | TIMESTAMPTZ | Record creation timestamp                                                      | DEFAULT now()                          |

**Relationships:**

- Belongs to a teacher (teacher_id foreign key)

---

### 6. notifications

System notifications for teachers.

| Column     | Type        | Description                                        | Constraints                            |
| ---------- | ----------- | -------------------------------------------------- | -------------------------------------- |
| id         | UUID        | Primary key                                        | PRIMARY KEY, DEFAULT gen_random_uuid() |
| teacher_id | UUID        | Reference to teacher                               | FOREIGN KEY (teachers.id), NOT NULL    |
| title      | TEXT        | Notification title                                 | NOT NULL                               |
| message    | TEXT        | Notification message                               | NOT NULL                               |
| type       | TEXT        | Notification type ('Achievement', 'Alert', 'Info') | DEFAULT 'Info'                         |
| is_read    | BOOLEAN     | Read status                                        | DEFAULT false                          |
| created_at | TIMESTAMPTZ | Record creation timestamp                          | DEFAULT now()                          |

**Relationships:**

- Belongs to a teacher (teacher_id foreign key)

---

### 7. achievements

Student achievements and awards.

| Column       | Type        | Description                                                | Constraints                            |
| ------------ | ----------- | ---------------------------------------------------------- | -------------------------------------- |
| id           | UUID        | Primary key                                                | PRIMARY KEY, DEFAULT gen_random_uuid() |
| learner_id   | UUID        | Reference to learner                                       | FOREIGN KEY (learners.id), NOT NULL    |
| title        | TEXT        | Achievement title                                          | NOT NULL                               |
| description  | TEXT        | Achievement description                                    | NULLABLE                               |
| badge_type   | TEXT        | Type of badge ('Excellence', 'Improvement', 'Consistency') | DEFAULT 'Excellence'                   |
| awarded_date | DATE        | Date when achievement was awarded                          | DEFAULT CURRENT_DATE                   |
| created_at   | TIMESTAMPTZ | Record creation timestamp                                  | DEFAULT now()                          |

**Relationships:**

- Belongs to a learner (learner_id foreign key)

---

## Relationships Summary

```
teachers (1) ──┐
               ├── (1:M) ── learners (1) ──┐
               │                           ├── (1:M) ── performance_records
               │                           └── (1:M) ── achievements
               ├── (1:M) ── resources
               └── (1:M) ── notifications
```

---

## Index Recommendations

For optimal performance, consider creating the following indexes:

1. `learners(teacher_id)` - For filtering learners by teacher
2. `performance_records(learner_id)` - For retrieving learner performance history
3. `notifications(teacher_id, is_read)` - For fetching unread notifications
4. `resources(teacher_id, category)` - For filtering resources
5. `achievements(learner_id)` - For retrieving learner achievements

---

## Sample Data

Refer to `src/lib/mockData.ts` for sample data that matches these schemas.

---

## Supabase SQL Creation Script

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create teachers table
CREATE TABLE teachers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_id TEXT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject_specialization TEXT DEFAULT 'Life Orientation',
    school_name TEXT,
    experience_years INTEGER DEFAULT 0,
    profile_image TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create learners table
CREATE TABLE learners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    grade TEXT NOT NULL,
    student_number TEXT NOT NULL,
    email TEXT,
    date_of_birth DATE,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create performance_records table
CREATE TABLE performance_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    learner_id UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    term TEXT NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    grade_achieved TEXT,
    assessment_type TEXT DEFAULT 'Test',
    recorded_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create subjects table
CREATE TABLE subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3B82F6'
);

-- Create resources table
CREATE TABLE resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'Lesson Plans',
    file_url TEXT,
    tags TEXT[] DEFAULT '{}',
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'Info',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create achievements table
CREATE TABLE achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    learner_id UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    badge_type TEXT DEFAULT 'Excellence',
    awarded_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_learners_teacher_id ON learners(teacher_id);
CREATE INDEX idx_performance_records_learner_id ON performance_records(learner_id);
CREATE INDEX idx_notifications_teacher_id_read ON notifications(teacher_id, is_read);
CREATE INDEX idx_resources_teacher_id_category ON resources(teacher_id, category);
CREATE INDEX idx_achievements_learner_id ON achievements(learner_id);
```

---

## RLS (Row Level Security) Policies

For production use, enable RLS and create policies:

```sql
-- Enable RLS on all tables
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE learners ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Example policy for teachers table (users can only see their own profile)
CREATE POLICY "Users can view own teacher profile" ON teachers
    FOR SELECT USING (auth_id = auth.uid());

-- Example policy for learners (teachers can only see their own learners)
CREATE POLICY "Teachers can view their own learners" ON learners
    FOR SELECT USING (teacher_id IN (SELECT id FROM teachers WHERE auth_id = auth.uid()));
```

---

## AI Prompt for Supabase Assistance

When asking AI to help create these tables in Supabase, use this prompt:

```
I need to create a PostgreSQL database schema in Supabase for a Teacher Management Dashboard. Please create the following tables with the specified columns and relationships:

1. teachers table with columns: id (UUID PK), auth_id (text), full_name (text), email (text), subject_specialization (text), school_name (text), experience_years (integer), profile_image (text), created_at (timestamptz)

2. learners table with columns: id (UUID PK), teacher_id (UUID FK to teachers), full_name (text), grade (text), student_number (text), email (text), date_of_birth (date), enrollment_date (date), status (text), created_at (timestamptz)

3. performance_records table with columns: id (UUID PK), learner_id (UUID FK to learners), subject (text), term (text), score (integer 0-100), grade_achieved (text), assessment_type (text), recorded_date (date), notes (text), created_at (timestamptz)

4. subjects table with columns: id (UUID PK), name (text), code (text), description (text), color (text)

5. resources table with columns: id (UUID PK), teacher_id (UUID FK to teachers), title (text), description (text), category (text), file_url (text), tags (text array), downloads (integer), created_at (timestamptz)

6. notifications table with columns: id (UUID PK), teacher_id (UUID FK to teachers), title (text), message (text), type (text), is_read (boolean), created_at (timestamptz)

7. achievements table with columns: id (UUID PK), learner_id (UUID FK to learners), title (text), description (text), badge_type (text), awarded_date (date), created_at (timestamptz)

Please generate the SQL CREATE TABLE statements with proper foreign key constraints, default values, and appropriate indexes. Also include RLS (Row Level Security) policies for a multi-tenant application where teachers can only access their own data.
```

---

## Notes for Implementation

1. The `auth_id` in the teachers table should be linked to Supabase Auth users
2. Consider adding soft delete functionality with a `deleted_at` column
3. Add validation constraints for email formats and date ranges
4. Consider adding full-text search indexes for search functionality
5. For production, add audit trails for critical operations

---

_Last Updated: 2026-02-09_
