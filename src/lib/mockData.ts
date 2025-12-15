export const mockTeacher = {
  id: '1',
  full_name: 'Sarah Mitchell',
  email: 'sarah.mitchell@school.edu',
  subject_specialization: 'Life Orientation',
  school_name: 'Springfield High School',
  experience_years: 8,
  profile_image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
};

export const mockLearners = [
  {
    id: '1',
    full_name: 'Thabo Mbeki',
    grade: 'Grade 10',
    student_number: 'STU001',
    email: 'thabo.mbeki@student.edu',
    date_of_birth: '2007-03-15',
    enrollment_date: '2023-01-10',
    status: 'Active',
    avgScore: 78,
  },
  {
    id: '2',
    full_name: 'Lerato Khumalo',
    grade: 'Grade 10',
    student_number: 'STU002',
    email: 'lerato.khumalo@student.edu',
    date_of_birth: '2007-07-22',
    enrollment_date: '2023-01-10',
    status: 'Active',
    avgScore: 92,
  },
  {
    id: '3',
    full_name: 'Sipho Ndlovu',
    grade: 'Grade 11',
    student_number: 'STU003',
    email: 'sipho.ndlovu@student.edu',
    date_of_birth: '2006-11-08',
    enrollment_date: '2022-01-10',
    status: 'Active',
    avgScore: 85,
  },
  {
    id: '4',
    full_name: 'Nomsa Dlamini',
    grade: 'Grade 11',
    student_number: 'STU004',
    email: 'nomsa.dlamini@student.edu',
    date_of_birth: '2006-05-19',
    enrollment_date: '2022-01-10',
    status: 'Active',
    avgScore: 67,
  },
  {
    id: '5',
    full_name: 'Mandla Zulu',
    grade: 'Grade 12',
    student_number: 'STU005',
    email: 'mandla.zulu@student.edu',
    date_of_birth: '2005-09-30',
    enrollment_date: '2021-01-10',
    status: 'Active',
    avgScore: 88,
  },
  {
    id: '6',
    full_name: 'Zanele Moyo',
    grade: 'Grade 12',
    student_number: 'STU006',
    email: 'zanele.moyo@student.edu',
    date_of_birth: '2005-12-14',
    enrollment_date: '2021-01-10',
    status: 'Active',
    avgScore: 95,
  },
];

export const mockPerformanceRecords = [
  { learner_id: '1', subject: 'Life Orientation', term: 'Term 1', score: 75, grade_achieved: 'B', assessment_type: 'Test' },
  { learner_id: '1', subject: 'Life Orientation', term: 'Term 2', score: 82, grade_achieved: 'A', assessment_type: 'Exam' },
  { learner_id: '1', subject: 'Mathematics', term: 'Term 1', score: 68, grade_achieved: 'C', assessment_type: 'Test' },
  { learner_id: '1', subject: 'Mathematics', term: 'Term 2', score: 73, grade_achieved: 'B', assessment_type: 'Exam' },

  { learner_id: '2', subject: 'Life Orientation', term: 'Term 1', score: 90, grade_achieved: 'A+', assessment_type: 'Test' },
  { learner_id: '2', subject: 'Life Orientation', term: 'Term 2', score: 94, grade_achieved: 'A+', assessment_type: 'Exam' },
  { learner_id: '2', subject: 'Mathematics', term: 'Term 1', score: 88, grade_achieved: 'A', assessment_type: 'Test' },
  { learner_id: '2', subject: 'English', term: 'Term 1', score: 92, grade_achieved: 'A+', assessment_type: 'Test' },

  { learner_id: '3', subject: 'Life Orientation', term: 'Term 1', score: 83, grade_achieved: 'A', assessment_type: 'Test' },
  { learner_id: '3', subject: 'Life Orientation', term: 'Term 2', score: 87, grade_achieved: 'A', assessment_type: 'Exam' },
  { learner_id: '3', subject: 'Physical Sciences', term: 'Term 1', score: 79, grade_achieved: 'B', assessment_type: 'Test' },

  { learner_id: '4', subject: 'Life Orientation', term: 'Term 1', score: 65, grade_achieved: 'C', assessment_type: 'Test' },
  { learner_id: '4', subject: 'Life Orientation', term: 'Term 2', score: 69, grade_achieved: 'C', assessment_type: 'Exam' },
  { learner_id: '4', subject: 'History', term: 'Term 1', score: 71, grade_achieved: 'B', assessment_type: 'Test' },

  { learner_id: '5', subject: 'Life Orientation', term: 'Term 1', score: 86, grade_achieved: 'A', assessment_type: 'Test' },
  { learner_id: '5', subject: 'Life Orientation', term: 'Term 2', score: 90, grade_achieved: 'A+', assessment_type: 'Exam' },
  { learner_id: '5', subject: 'Accounting', term: 'Term 1', score: 84, grade_achieved: 'A', assessment_type: 'Test' },

  { learner_id: '6', subject: 'Life Orientation', term: 'Term 1', score: 93, grade_achieved: 'A+', assessment_type: 'Test' },
  { learner_id: '6', subject: 'Life Orientation', term: 'Term 2', score: 97, grade_achieved: 'A+', assessment_type: 'Exam' },
  { learner_id: '6', subject: 'Mathematics', term: 'Term 1', score: 96, grade_achieved: 'A+', assessment_type: 'Test' },
];

export const mockAchievements = [
  {
    learner_id: '2',
    title: 'Top Performer',
    description: 'Achieved highest average in Life Orientation',
    badge_type: 'Excellence',
    awarded_date: '2024-06-15',
  },
  {
    learner_id: '6',
    title: 'Academic Excellence',
    description: 'Maintained A+ average across all subjects',
    badge_type: 'Excellence',
    awarded_date: '2024-06-15',
  },
  {
    learner_id: '1',
    title: 'Most Improved',
    description: 'Improved score by 15% from Term 1 to Term 2',
    badge_type: 'Improvement',
    awarded_date: '2024-06-10',
  },
  {
    learner_id: '5',
    title: 'Consistent Performer',
    description: 'Maintained excellent grades throughout the year',
    badge_type: 'Consistency',
    awarded_date: '2024-06-12',
  },
];

export const mockResources = [
  {
    id: '1',
    title: 'Life Orientation Lesson Plans - Term 1',
    description: 'Comprehensive lesson plans covering constitutional rights and responsibilities',
    category: 'Lesson Plans',
    tags: ['Life Orientation', 'Term 1', 'Constitutional Rights'],
    downloads: 45,
    created_at: '2024-01-15',
  },
  {
    id: '2',
    title: 'Career Guidance Worksheets',
    description: 'Interactive worksheets for career exploration and planning',
    category: 'Worksheets',
    tags: ['Career Guidance', 'Interactive', 'Planning'],
    downloads: 67,
    created_at: '2024-02-20',
  },
  {
    id: '3',
    title: 'Health & Wellbeing Video Series',
    description: 'Educational videos on mental health and physical wellbeing',
    category: 'Videos',
    tags: ['Health', 'Mental Health', 'Wellbeing'],
    downloads: 89,
    created_at: '2024-03-10',
  },
  {
    id: '4',
    title: 'Assessment Rubrics for Life Skills',
    description: 'Standardized rubrics for evaluating life skills competencies',
    category: 'Assessment Tools',
    tags: ['Assessment', 'Rubrics', 'Life Skills'],
    downloads: 52,
    created_at: '2024-01-25',
  },
];

export const mockNotifications = [
  {
    id: '1',
    title: 'New Top Performer',
    message: 'Zanele Moyo has achieved the highest score in Term 2 with 97%',
    type: 'Achievement',
    is_read: false,
    created_at: '2024-06-15T10:30:00Z',
  },
  {
    id: '2',
    title: 'Performance Alert',
    message: 'Nomsa Dlamini needs additional support in Life Orientation',
    type: 'Alert',
    is_read: false,
    created_at: '2024-06-14T14:20:00Z',
  },
  {
    id: '3',
    title: 'New Resource Available',
    message: 'Career Guidance Worksheets have been added to the resource library',
    type: 'Info',
    is_read: true,
    created_at: '2024-06-10T09:00:00Z',
  },
];

export const getPerformanceDistribution = () => {
  const scores = mockPerformanceRecords.map(r => r.score);
  return {
    excellent: scores.filter(s => s >= 80).length,
    good: scores.filter(s => s >= 70 && s < 80).length,
    average: scores.filter(s => s >= 60 && s < 70).length,
    needsSupport: scores.filter(s => s < 60).length,
  };
};

export const getAverageAPS = () => {
  const totalScore = mockPerformanceRecords.reduce((sum, record) => sum + record.score, 0);
  const avgPercentage = totalScore / mockPerformanceRecords.length;
  const apsScore = (avgPercentage / 100) * 7;
  return apsScore.toFixed(1);
};

export const getTopPerformers = () => {
  return mockLearners
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 5);
};
