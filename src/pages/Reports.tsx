import { FileText, Download, Calendar, Filter } from 'lucide-react';
import { mockLearners, mockPerformanceRecords } from '../lib/mockData';

export default function Reports() {
  const reportTypes = [
    {
      id: '1',
      title: 'Term Performance Report',
      description: 'Comprehensive overview of learner performance for the term',
      type: 'Performance',
      date: '2024-06-15',
      learners: mockLearners.length,
    },
    {
      id: '2',
      title: 'Life Orientation Subject Report',
      description: 'Detailed analysis of Life Orientation subject performance',
      type: 'Subject',
      date: '2024-06-10',
      learners: mockLearners.length,
    },
    {
      id: '3',
      title: 'At-Risk Learners Report',
      description: 'Identification and tracking of learners needing support',
      type: 'Alert',
      date: '2024-06-12',
      learners: mockLearners.filter(l => l.avgScore < 70).length,
    },
    {
      id: '4',
      title: 'Progress Tracking Report',
      description: 'Term-over-term progress comparison for all learners',
      type: 'Progress',
      date: '2024-06-14',
      learners: mockLearners.length,
    },
    {
      id: '5',
      title: 'Achievement & Recognition Report',
      description: 'Summary of awards and achievements earned this term',
      type: 'Achievement',
      date: '2024-06-16',
      learners: 4,
    },
    {
      id: '6',
      title: 'Grade Distribution Report',
      description: 'Analysis of grade distribution across all subjects',
      type: 'Analytics',
      date: '2024-06-11',
      learners: mockLearners.length,
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Performance':
        return 'bg-blue-100 text-blue-700';
      case 'Subject':
        return 'bg-emerald-100 text-emerald-700';
      case 'Alert':
        return 'bg-red-100 text-red-700';
      case 'Progress':
        return 'bg-purple-100 text-purple-700';
      case 'Achievement':
        return 'bg-amber-100 text-amber-700';
      case 'Analytics':
        return 'bg-cyan-100 text-cyan-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Generate and download detailed performance reports</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md">
          <FileText className="w-4 h-4" />
          Create Custom Report
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 flex items-center gap-2">
            <Calendar className="text-gray-400 w-5 h-5" />
            <select className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option>All Terms</option>
              <option>Term 1</option>
              <option>Term 2</option>
              <option>Term 3</option>
              <option>Term 4</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option>All Types</option>
              <option>Performance</option>
              <option>Subject</option>
              <option>Alert</option>
              <option>Progress</option>
              <option>Achievement</option>
              <option>Analytics</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTypes.map((report) => (
            <div
              key={report.id}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all duration-200 hover:border-emerald-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{report.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(report.type)}`}>
                  {report.type}
                </span>
                <span className="text-sm text-gray-600">{report.learners} learners</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{report.date}</span>
                </div>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Assessments</span>
              <span className="font-bold text-gray-900">{mockPerformanceRecords.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Learners</span>
              <span className="font-bold text-gray-900">{mockLearners.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Score</span>
              <span className="font-bold text-emerald-700">
                {Math.round(mockPerformanceRecords.reduce((sum, r) => sum + r.score, 0) / mockPerformanceRecords.length)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-gray-900 mb-4">Report Formats</h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              PDF Document
            </button>
            <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              Excel Spreadsheet
            </button>
            <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              CSV Export
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl shadow-md p-6 border border-emerald-200">
          <h3 className="font-bold text-gray-900 mb-2">Custom Reports</h3>
          <p className="text-sm text-gray-600 mb-4">
            Need a specific report? Create custom reports tailored to your needs.
          </p>
          <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
