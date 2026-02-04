import { useState } from 'react';
import { Search, Filter, UserPlus, Mail, Phone, Calendar, Users } from 'lucide-react';
import { mockLearners } from '../lib/mockData';

export default function Learners() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');

  const grades = ['All', 'Grade 10', 'Grade 11', 'Grade 12'];

  const filteredLearners = mockLearners.filter((learner) => {
    const matchesSearch = learner.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      learner.student_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'All' || learner.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-100';
    if (score >= 70) return 'text-blue-700 bg-blue-100';
    if (score >= 60) return 'text-amber-700 bg-amber-100';
    return 'text-red-700 bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Learner Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage and track all your learners in one place</p>
        </div>
        <button className="px-3 py-2 sm:px-4 sm:py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md text-sm sm:text-base">
          <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
          Add Learner
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
            <input
              type="text"
              placeholder="Search by name or student number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-4 h-4 md:w-5 md:h-5" />
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base"
            >
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {filteredLearners.map((learner) => (
            <div
              key={learner.id}
              className="border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-lg transition-all duration-200 hover:border-emerald-300"
            >
              <div className="flex items-start justify-between mb-2 md:mb-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-base md:text-lg truncate">{learner.full_name}</h3>
                  <p className="text-xs md:text-sm text-gray-600 truncate">{learner.student_number}</p>
                </div>
                <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-semibold ${getScoreColor(learner.avgScore)}`}>
                  {learner.avgScore}%
                </span>
              </div>

              <div className="space-y-1 md:space-y-2">
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{learner.grade}</span>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                  <Mail className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="truncate">{learner.email}</span>
                </div>
              </div>

              <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200 flex gap-2">
                <button className="flex-1 px-2 py-1.5 md:px-3 md:py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-xs md:text-sm font-medium">
                  View Details
                </button>
                <button className="flex-1 px-2 py-1.5 md:px-3 md:py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs md:text-sm font-medium">
                  Performance
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredLearners.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No learners found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Total Learners</h3>
          <p className="text-3xl md:text-4xl font-bold text-emerald-700">{mockLearners.length}</p>
          <p className="text-xs md:text-sm text-gray-600 mt-2">Across all grades</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Active This Term</h3>
          <p className="text-3xl md:text-4xl font-bold text-blue-700">
            {mockLearners.filter(l => l.status === 'Active').length}
          </p>
          <p className="text-xs md:text-sm text-gray-600 mt-2">Currently enrolled</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Average Score</h3>
          <p className="text-3xl md:text-4xl font-bold text-purple-700">
            {Math.round(mockLearners.reduce((sum, l) => sum + l.avgScore, 0) / mockLearners.length)}%
          </p>
          <p className="text-xs md:text-sm text-gray-600 mt-2">Overall performance</p>
        </div>
      </div>
    </div>
  );
}
