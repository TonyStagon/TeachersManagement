import { Users, TrendingUp, Award, Target } from 'lucide-react';
import StatCard from '../components/StatCard';
import {
  mockLearners,
  mockPerformanceRecords,
  getPerformanceDistribution,
  getAverageAPS,
  getTopPerformers,
  mockAchievements,
} from '../lib/mockData';

export default function Dashboard() {
  const performanceDistribution = getPerformanceDistribution();
  const averageAPS = getAverageAPS();
  const topPerformers = getTopPerformers();

  const totalLearners = mockLearners.length;
  const activeLearners = mockLearners.filter(l => l.status === 'Active').length;
  const totalAssessments = mockPerformanceRecords.length;

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
            const learner = mockLearners.find(l => l.id === achievement.learner_id);
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
