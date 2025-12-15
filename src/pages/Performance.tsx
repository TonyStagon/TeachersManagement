import { TrendingUp, TrendingDown, Target, AlertCircle } from 'lucide-react';
import { mockLearners, mockPerformanceRecords } from '../lib/mockData';

export default function Performance() {
  const learnerPerformance = mockLearners.map(learner => {
    const records = mockPerformanceRecords.filter(r => r.learner_id === learner.id);
    const loRecords = records.filter(r => r.subject === 'Life Orientation');
    const avgScore = loRecords.reduce((sum, r) => sum + r.score, 0) / (loRecords.length || 1);

    const term1Score = loRecords.find(r => r.term === 'Term 1')?.score || 0;
    const term2Score = loRecords.find(r => r.term === 'Term 2')?.score || 0;
    const trend = term2Score - term1Score;

    return {
      ...learner,
      avgScore: Math.round(avgScore),
      trend,
      successProbability: avgScore >= 80 ? 95 : avgScore >= 70 ? 85 : avgScore >= 60 ? 70 : 50,
    };
  });

  const getSuccessColor = (probability: number) => {
    if (probability >= 85) return 'text-emerald-700 bg-emerald-100';
    if (probability >= 70) return 'text-blue-700 bg-blue-100';
    if (probability >= 60) return 'text-amber-700 bg-amber-100';
    return 'text-red-700 bg-red-100';
  };

  const atRiskLearners = learnerPerformance.filter(l => l.successProbability < 70);
  const excellentLearners = learnerPerformance.filter(l => l.avgScore >= 80);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
        <p className="text-gray-600 mt-1">Track learner progress and identify areas for improvement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Excellent Performers</h3>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-4xl font-bold text-emerald-700">{excellentLearners.length}</p>
          <p className="text-sm text-gray-600 mt-2">Scoring 80% and above</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">At Risk</h3>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-4xl font-bold text-red-700">{atRiskLearners.length}</p>
          <p className="text-sm text-gray-600 mt-2">Need additional support</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Average Score</h3>
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-4xl font-bold text-blue-700">
            {Math.round(learnerPerformance.reduce((sum, l) => sum + l.avgScore, 0) / learnerPerformance.length)}%
          </p>
          <p className="text-sm text-gray-600 mt-2">Life Orientation</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Learner Performance Tracker</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Learner</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Grade</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Avg Score</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Trend</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Success Probability</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {learnerPerformance.map((learner) => (
                <tr key={learner.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-semibold text-gray-900">{learner.full_name}</p>
                      <p className="text-sm text-gray-600">{learner.student_number}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-700">{learner.grade}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-lg font-bold text-gray-900">{learner.avgScore}%</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {learner.trend > 0 ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">+{learner.trend}%</span>
                        </>
                      ) : learner.trend < 0 ? (
                        <>
                          <TrendingDown className="w-4 h-4 text-red-600" />
                          <span className="text-red-700 font-semibold">{learner.trend}%</span>
                        </>
                      ) : (
                        <span className="text-gray-500 font-semibold">—</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSuccessColor(learner.successProbability)}`}>
                      {learner.successProbability}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {learner.successProbability >= 85 ? (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                        Excellent
                      </span>
                    ) : learner.successProbability >= 70 ? (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        Good
                      </span>
                    ) : learner.successProbability >= 60 ? (
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
                        Needs Work
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                        At Risk
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {atRiskLearners.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-red-900 mb-2">Learners Requiring Attention</h3>
              <p className="text-red-800 mb-3">
                The following learners have a success probability below 70% and may benefit from additional support:
              </p>
              <div className="flex flex-wrap gap-2">
                {atRiskLearners.map(learner => (
                  <span key={learner.id} className="px-3 py-1 bg-white text-red-700 rounded-lg text-sm font-medium">
                    {learner.full_name} ({learner.avgScore}%)
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
