import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Target, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchLearners } from '../lib/learnerService';
import { fetchPerformanceRecordsBySubject, type PerformanceRecord as DbPerformanceRecord } from '../lib/performanceService';

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

interface PerformanceRecord {
  learner_id: string;
  subject: string;
  term: string;
  score: number;
  grade_achieved: string;
  assessment_type: string;
}

export default function Performance() {
  const { teacher } = useAuth();
  const [learners, setLearners] = useState<Learner[]>([]);
  const [performanceRecords, setPerformanceRecords] = useState<PerformanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch learners and performance records from database
  useEffect(() => {
    const loadData = async () => {
      if (!teacher) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch learners from database
        const fetchedLearners = await fetchLearners(teacher.id);
        
        // Transform learners to match the interface
        const transformedLearners: Learner[] = fetchedLearners.map(learner => ({
          id: learner.id,
          full_name: learner.full_name,
          grade: learner.grade,
          student_number: learner.student_number,
          email: learner.email || '',
          date_of_birth: learner.date_of_birth || '',
          enrollment_date: learner.enrollment_date,
          status: learner.status,
          avgScore: learner.avg_score,
          teacher_id: learner.teacher_id,
          created_at: learner.created_at
        }));

        setLearners(transformedLearners);

        // Fetch performance records for Life Orientation from database
        const fetchedPerformanceRecords = await fetchPerformanceRecordsBySubject(teacher.id, 'Life Orientation');
        
        // Transform performance records to match the interface
        const transformedRecords: PerformanceRecord[] = fetchedPerformanceRecords.map(record => ({
          learner_id: record.learner_id,
          subject: record.subject,
          term: record.term,
          score: record.score,
          grade_achieved: record.grade_achieved || '',
          assessment_type: record.assessment_type
        }));

        setPerformanceRecords(transformedRecords);
      } catch (err: any) {
        console.error('Failed to load performance data:', err);
        setError(err.message || 'Failed to load performance data');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [teacher]);

  const learnerPerformance = learners.map(learner => {
    const records = performanceRecords.filter(r => r.learner_id === learner.id);
    const loRecords = records.filter(r => r.subject === 'Life Orientation');
    const avgScore = loRecords.length > 0 
      ? loRecords.reduce((sum, r) => sum + r.score, 0) / loRecords.length
      : learner.avgScore || 0; // Use learner's avgScore as fallback if no records

    const successProbability = Math.min(100, Math.max(0, avgScore));

    return {
      ...learner,
      avgScore,
      successProbability,
      records,
      loRecords,
      trend: loRecords.length >= 2 
        ? loRecords[0].score - loRecords[loRecords.length - 1].score 
        : 0,
    };
  });

  // Sort by success probability (highest first)
  const sortedPerformance = [...learnerPerformance].sort((a, b) => b.successProbability - a.successProbability);

  // Top performers (top 25%)
  const topPerformers = sortedPerformance.filter(l => l.successProbability >= 85);

  // At-risk learners (bottom 25%)
  const atRiskLearners = sortedPerformance.filter(l => l.successProbability < 70);

  const getSuccessColor = (probability: number) => {
    if (probability >= 85) return 'text-emerald-700 bg-emerald-100';
    if (probability >= 70) return 'text-blue-700 bg-blue-100';
    if (probability >= 60) return 'text-amber-700 bg-amber-100';
    return 'text-red-700 bg-red-100';
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 5) return <TrendingUp className="w-4 h-4 text-emerald-600" />;
    if (trend < -5) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Target className="w-4 h-4 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading performance data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error loading performance data</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Authentication required</h3>
                <p className="text-sm text-yellow-700 mt-1">Please log in to view performance data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Performance Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Monitor learner performance in Life Orientation with real-time data
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Learners</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{learners.length}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Performers</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{topPerformers.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">At-Risk Learners</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{atRiskLearners.length}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Learner Performance</h2>
            <p className="text-gray-600 text-sm mt-1">
              Sorted by success probability in Life Orientation
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-900">Learner</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-900">Grade</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-900">Avg Score</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-900">Success Probability</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-900">Trend</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {sortedPerformance.map((learner) => (
                  <tr key={learner.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{learner.full_name}</p>
                        <p className="text-sm text-gray-500">{learner.student_number}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                        {learner.grade}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-lg font-semibold text-gray-900">
                        {learner.avgScore.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSuccessColor(learner.successProbability)}`}>
                        {learner.successProbability.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center">
                        {getTrendIcon(learner.trend)}
                        <span className={`ml-2 text-sm font-medium ${learner.trend > 0 ? 'text-emerald-600' : learner.trend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          {learner.trend > 0 ? '+' : ''}{learner.trend.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {learner.successProbability >= 85 ? (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                          Top Performer
                        </span>
                      ) : learner.successProbability >= 70 ? (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          On Track
                        </span>
                      ) : learner.successProbability >= 60 ? (
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                          Needs Attention
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                          At Risk
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* At-risk learners section */}
          {atRiskLearners.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-red-50">
              <div className="flex items-center mb-3">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <h3 className="text-lg font-semibold text-red-800">At-Risk Learners Requiring Support</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {atRiskLearners.map(learner => (
                  <div key={learner.id} className="px-3 py-2 bg-white border border-red-200 rounded-lg">
                    <p className="font-medium text-red-700">{learner.full_name}</p>
                    <p className="text-sm text-red-600">{learner.successProbability.toFixed(1)}% success probability</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Data freshness note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Data refreshes automatically every 30 seconds. Last updated: {new Date().toLocaleTimeString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Showing performance data for Life Orientation only
          </p>
        </div>
      </div>
    </div>
  );
}
