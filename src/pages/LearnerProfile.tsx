import { User, Hash, Mail, Calendar, BookOpen, TrendingUp, GraduationCap, LogOut, Award } from 'lucide-react';
import { useLearnerAuth } from '../contexts/LearnerAuthContext';

export default function LearnerProfile() {
  const { learner, signOut } = useLearnerAuth();

  if (!learner) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return { text: 'text-emerald-700', bg: 'bg-emerald-100', label: 'Excellent' };
    if (score >= 70) return { text: 'text-blue-700', bg: 'bg-blue-100', label: 'Good' };
    if (score >= 60) return { text: 'text-amber-700', bg: 'bg-amber-100', label: 'Average' };
    return { text: 'text-red-700', bg: 'bg-red-100', label: 'Needs Support' };
  };

  const scoreInfo = getScoreColor(learner.avg_score);

  const getProgressBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-emerald-100 p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">EduTrack</h1>
              <p className="text-xs text-gray-500">Learner Portal</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{learner.full_name}</h2>
                <p className="text-emerald-100 text-sm mt-1">{learner.grade} • {learner.status}</p>
              </div>
            </div>
          </div>

          {/* Score Banner */}
          <div className={`px-6 py-4 ${scoreInfo.bg} border-b border-gray-100`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-700 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Academic Performance
              </span>
              <span className={`text-2xl font-bold ${scoreInfo.text}`}>{learner.avg_score}%</span>
            </div>
            <div className="w-full bg-white bg-opacity-60 rounded-full h-3">
              <div
                className={`${getProgressBarColor(learner.avg_score)} h-3 rounded-full transition-all duration-700`}
                style={{ width: `${learner.avg_score}%` }}
              />
            </div>
            <p className={`text-sm font-medium mt-2 ${scoreInfo.text}`}>{scoreInfo.label}</p>
          </div>

          {/* Info Grid */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Hash className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Student Number</p>
                <p className="font-semibold text-gray-900 mt-0.5">{learner.student_number}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Email</p>
                <p className="font-semibold text-gray-900 mt-0.5 text-sm break-all">{learner.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <BookOpen className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Grade</p>
                <p className="font-semibold text-gray-900 mt-0.5">{learner.grade}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Enrolled</p>
                <p className="font-semibold text-gray-900 mt-0.5">{formatDate(learner.enrollment_date)}</p>
              </div>
            </div>

            {learner.date_of_birth && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg sm:col-span-2">
                <Calendar className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Date of Birth</p>
                  <p className="font-semibold text-gray-900 mt-0.5">{formatDate(learner.date_of_birth)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Performance Badge */}
        {learner.avg_score >= 80 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-amber-800">Top Performer</p>
              <p className="text-sm text-amber-700">You're excelling with a score of {learner.avg_score}%!</p>
            </div>
          </div>
        )}

        {learner.avg_score < 70 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-400 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-red-800">Keep Going!</p>
              <p className="text-sm text-red-700">Your teacher has support resources available to help you improve.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
