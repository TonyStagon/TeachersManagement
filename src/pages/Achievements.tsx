import { Award, Star, TrendingUp, Trophy } from 'lucide-react';
import { mockAchievements, mockLearners } from '../lib/mockData';
import { useState, useEffect } from 'react';

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
}

const LOCAL_STORAGE_KEY = 'teacher-management-learners';

export default function Achievements() {
  const [learners, setLearners] = useState<Learner[]>(mockLearners);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setLearners(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load learners from localStorage:', error);
    }
  }, []);

  const achievementsByType = {
    Excellence: mockAchievements.filter(a => a.badge_type === 'Excellence'),
    Improvement: mockAchievements.filter(a => a.badge_type === 'Improvement'),
    Consistency: mockAchievements.filter(a => a.badge_type === 'Consistency'),
  };

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'Excellence':
        return Trophy;
      case 'Improvement':
        return TrendingUp;
      case 'Consistency':
        return Star;
      default:
        return Award;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'Excellence':
        return 'bg-amber-500';
      case 'Improvement':
        return 'bg-emerald-500';
      case 'Consistency':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Achievements & Recognition</h1>
        <p className="text-gray-600 mt-1">Celebrate learner success and milestones</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-md p-6 border border-amber-200">
          <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Excellence</h3>
          <p className="text-3xl font-bold text-amber-700 mb-2">{achievementsByType.Excellence.length}</p>
          <p className="text-sm text-gray-600">Outstanding performers</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-md p-6 border border-emerald-200">
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Improvement</h3>
          <p className="text-3xl font-bold text-emerald-700 mb-2">{achievementsByType.Improvement.length}</p>
          <p className="text-sm text-gray-600">Most improved learners</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 border border-blue-200">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
            <Star className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Consistency</h3>
          <p className="text-3xl font-bold text-blue-700 mb-2">{achievementsByType.Consistency.length}</p>
          <p className="text-sm text-gray-600">Consistent performers</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Achievements</h2>
        <div className="space-y-4">
          {mockAchievements.map((achievement) => {
            const learner = learners.find(l => l.id === achievement.learner_id);
            const Icon = getBadgeIcon(achievement.badge_type);
            const colorClass = getBadgeColor(achievement.badge_type);

            return (
              <div
                key={`${achievement.learner_id}-${achievement.title}`}
                className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className={`w-14 h-14 ${colorClass} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{achievement.title}</h3>
                      <p className="text-emerald-700 font-semibold">{learner?.full_name}</p>
                    </div>
                    <span className="text-sm text-gray-500">{achievement.awarded_date}</span>
                  </div>
                  <p className="text-gray-600">{achievement.description}</p>
                  <div className="mt-3">
                    <span className={`px-3 py-1 ${colorClass.replace('bg-', 'bg-').replace('500', '100')} ${colorClass.replace('bg-', 'text-').replace('500', '700')} rounded-full text-xs font-semibold`}>
                      {achievement.badge_type}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Achievement Leaderboard</h2>
        <div className="space-y-3">
          {learners
            .map(learner => ({
              ...learner,
              achievementCount: mockAchievements.filter(a => a.learner_id === learner.id).length,
            }))
            .filter(l => l.achievementCount > 0)
            .sort((a, b) => b.achievementCount - a.achievementCount)
            .map((learner, index) => (
              <div
                key={learner.id}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-white rounded-lg"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                  index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-700' : 'bg-emerald-600'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{learner.full_name}</p>
                  <p className="text-sm text-gray-600">{learner.grade} • Avg: {learner.avgScore}%</p>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span className="text-lg font-bold text-emerald-700">{learner.achievementCount}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
