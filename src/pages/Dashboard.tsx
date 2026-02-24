import { useState, useEffect } from 'react';
import { Users, TrendingUp, Award, Target } from 'lucide-react';
import StatCard from '../components/StatCard';
import { useAuth } from '../contexts/AuthContext';
import { fetchLearners } from '../lib/learnerService';
import {
  mockPerformanceRecords,
  getPerformanceDistribution,
  getAverageAPS,
  mockAchievements,
} from '../lib/mockData';

interface Learner {
  id: string;
  full_name: string;
  grade: string;
  student_number: string;
  email: string;
  date_of_birth: string;
  enrollment_date: string;
  status: string;
  avgScore: number;
  teacher_id?: string;
  created_at?: string;
}

export default function Dashboard() {
  const { teacher } = useAuth();
  const [learners, setLearners] = useState<Learner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch learners from Supabase
  useEffect(() => {
    const loadLearners = async () => {
      if (!teacher?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const fetchedLearners = await fetchLearners(teacher.id);
        
        // Transform the fetched learners to match the local Learner interface
        const transformedLearners: Learner[] = fetchedLearners.map(learner => ({
          id: learner.id,
          full_name: learner.full_name,
          grade: learner.grade,
          student_number: learner.student_number,
          email: learner.email || '',
          date_of_birth: learner.date_of_birth || '',
          enrollment_date: learner.enrollment_date,
          status: learner.status,
          avgScore: learner.avg_score || 0,
          teacher_id: learner.teacher_id,
          created_at: learner.created_at
        }));
        
        setLearners(transformedLearners);
      } catch (err: any) {
        console.error('Failed to fetch learners:', err);
        setError(err.message || 'Failed to load learner data');
      } finally {
        setLoading(false);
      }
    };

    loadLearners();
  }, [teacher?.id]);

  const performanceDistribution = getPerformanceDistribution();
  
  // Calculate top performers from real data
  const topPerformers = learners.length > 0
    ? learners.sort((a, b) => b.avgScore - a.avgScore).slice(0, 5)
    : [];

  const totalLearners = learners.length;
  const activeLearners = learners.filter((l: Learner) => l.status === 'Active').length;
  const totalAssessments = mockPerformanceRecords.length; // TODO: Replace with real performance records
  
  // Calculate average APS from real learner data
  const averageAPS = learners.length > 0
    ? (learners.reduce((sum, learner) => sum + (learner.avgScore || 0), 0) / learners.length).toFixed(1)
    : "0.0"; // Fallback if no learners

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Dashboard</h2>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your learners.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Learners"
          value={totalLearners}
          icon={Users}
          trend={`${activeLearners} active`}
          color="text-emerald-700"
        />
        <StatCard
          title="Average APS"
          value={averageAPS}
          icon={Target}
          trend="Out of 7.0"
          color="text-blue-700"
        />
        <StatCard
          title="Assessments"
          value={totalAssessments}
          icon={TrendingUp}
          trend="This term"
          color="text-purple-700"
        />
        <StatCard
          title="Achievements"
          value={mockAchievements.length}
          icon={Award}
          trend="Awarded this term"
          color="text-amber-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Distribution</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Excellent (80-100%)</span>
                <span className="text-sm font-bold text-emerald-700">{performanceDistribution.excellent}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(performanceDistribution.excellent / totalAssessments) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Good (70-79%)</span>
                <span className="text-sm font-bold text-blue-700">{performanceDistribution.good}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(performanceDistribution.good / totalAssessments) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Average (60-69%)</span>
                <span className="text-sm font-bold text-amber-700">{performanceDistribution.average}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-amber-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(performanceDistribution.average / totalAssessments) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Needs Support (&lt;60%)</span>
                <span className="text-sm font-bold text-red-700">{performanceDistribution.needsSupport}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-red-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(performanceDistribution.needsSupport / totalAssessments) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Performers</h2>
          <div className="space-y-3">
            {topPerformers.map((learner, index) => (
              <div
                key={learner.id}
                className="flex items-center gap-4 p-3 bg-gradient-to-r from-emerald-50 to-white rounded-lg hover:shadow-md transition-shadow"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-700' : 'bg-emerald-600'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{learner.full_name}</p>
                  <p className="text-sm text-gray-600">{learner.grade}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-700">{learner.avgScore}%</p>
                  <p className="text-xs text-gray-500">Average</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockAchievements.map((achievement) => {
            const learner = learners.find(l => l.id === achievement.learner_id);
            return (
              <div
                key={achievement.learner_id}
                className="p-4 bg-gradient-to-br from-amber-50 to-emerald-50 rounded-lg border border-emerald-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mb-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{achievement.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{learner?.full_name}</p>
                <p className="text-xs text-gray-500">{achievement.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
