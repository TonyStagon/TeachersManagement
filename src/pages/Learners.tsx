import { useState, useEffect } from 'react';
import { Search, Filter, UserPlus, Upload, Mail, Calendar, Users, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchLearners, createLearner, updateLearner, deleteLearner, bulkCreateLearners, generateMultipleStudentNumbers, type Learner } from '../lib/learnerService';
import AddLearnerModal, { LearnerFormData } from '../components/AddLearnerModal';
import EditLearnerModal from '../components/EditLearnerModal';
import ImportLearnersModal, { ImportedLearner } from '../components/ImportLearnersModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import SuccessNotification from '../components/SuccessNotification';
import { notificationManager } from '../lib/notificationManager';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function Learners() {
  const { teacher } = useAuth();
  const [learners, setLearners] = useState<Learner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const grades = ['All', 'Grade 10', 'Grade 11', 'Grade 12'];

  useEffect(() => {
    if (teacher) {
      loadLearners();
    }
  }, [teacher]);

  const loadLearners = async () => {
    if (!teacher) return;
    try {
      setLoading(true);
      const data = await fetchLearners(teacher.id);
      setLearners(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load learners');
    } finally {
      setLoading(false);
    }
  };

  const filteredLearners = learners.filter((learner) => {
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

  const handleAddLearner = async (learnerData: LearnerFormData) => {
    if (!teacher) return;

    try {
      const avgScoreValue = learnerData.avgScore ? parseFloat(learnerData.avgScore) : 0;
      const validatedAvgScore = Math.max(0, Math.min(100, avgScoreValue));

      const newLearner = await createLearner({
        teacher_id: teacher.id,
        full_name: learnerData.full_name,
        grade: learnerData.grade,
        student_number: learnerData.student_number,
        email: learnerData.email || null,
        date_of_birth: learnerData.date_of_birth || null,
        enrollment_date: learnerData.enrollment_date,
        status: learnerData.status || 'Active',
        avg_score: validatedAvgScore,
      });

      setLearners([...learners, newLearner]);
      setSuccessMessage(`${learnerData.full_name} has been successfully added!`);
      setShowSuccess(true);
      setIsModalOpen(false);

      // Create notifications based on score
      if (validatedAvgScore < 70) {
        // At-risk learner notification
        notificationManager.createAtRiskNotification(
          learnerData.full_name,
          validatedAvgScore,
          learnerData.student_number
        );
      } else if (validatedAvgScore >= 90) {
        // Top performer notification
        // Calculate rank (for new learner, we can't know exact rank yet, so we'll use 1 as placeholder)
        notificationManager.createTopPerformerNotification(
          learnerData.full_name,
          validatedAvgScore,
          learnerData.student_number,
          1, // placeholder rank
          learners.length + 1 // total learners including new one
        );
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add learner');
    }
  };

  const handleImportLearners = async (importedLearners: ImportedLearner[]) => {
    if (!teacher) return;

    try {
      // Generate unique student numbers for all imported learners
      const studentNumbers = await generateMultipleStudentNumbers(teacher.id, importedLearners.length);
      
      const learnersToImport = importedLearners.map((learnerData, index) => {
        const avgScoreValue = learnerData.avg_score ? parseFloat(learnerData.avg_score) : 0;
        return {
          teacher_id: teacher.id,
          full_name: learnerData.full_name,
          grade: learnerData.grade,
          student_number: studentNumbers[index], // Use generated student number
          email: learnerData.email || null,
          date_of_birth: learnerData.date_of_birth || null,
          enrollment_date: learnerData.enrollment_date,
          status: learnerData.status || 'Active',
          avg_score: Math.max(0, Math.min(100, avgScoreValue)),
        };
      });

      const newLearners = await bulkCreateLearners(learnersToImport);
      setLearners([...learners, ...newLearners]);
      setSuccessMessage(`Successfully imported ${newLearners.length} learners!`);
      setShowSuccess(true);
      setIsImportModalOpen(false);

      newLearners.forEach(learner => {
        if (learner.avg_score < 70) {
          notificationManager.createAtRiskNotification(
            learner.full_name,
            learner.avg_score,
            learner.student_number
          );
        }
      });
    } catch (err: any) {
      setError(err.message || 'Failed to import learners');
    }
  };

  const handleEditLearner = async (learnerData: LearnerFormData) => {
    if (!selectedLearner) return;

    try {
      const avgScoreValue = learnerData.avgScore ? parseFloat(learnerData.avgScore) : 0;
      const validatedAvgScore = Math.max(0, Math.min(100, avgScoreValue));

      const updatedLearner = await updateLearner(selectedLearner.id, {
        full_name: learnerData.full_name,
        grade: learnerData.grade,
        student_number: learnerData.student_number,
        email: learnerData.email || null,
        date_of_birth: learnerData.date_of_birth || null,
        enrollment_date: learnerData.enrollment_date,
        status: learnerData.status,
        avg_score: validatedAvgScore,
      });

      setLearners(learners.map((l) => (l.id === selectedLearner.id ? updatedLearner : l)));
      setSuccessMessage(`${learnerData.full_name}'s details have been updated!`);
      setShowSuccess(true);
      setIsEditModalOpen(false);
      setSelectedLearner(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update learner');
    }
  };

  const handleDeleteLearner = async () => {
    if (!selectedLearner) return;

    try {
      await deleteLearner(selectedLearner.id);
      setLearners(learners.filter((l) => l.id !== selectedLearner.id));
      setSuccessMessage(`${selectedLearner.full_name} has been removed.`);
      setShowSuccess(true);
      setSelectedLearner(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete learner');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Learner Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage and track all your learners</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md text-sm sm:text-base"
          >
            <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
            Import
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md text-sm sm:text-base"
          >
            <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
            Add Learner
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6">
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
                <option key={grade} value={grade}>{grade}</option>
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
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-base md:text-lg truncate">{learner.full_name}</h3>
                  <p className="text-xs md:text-sm text-gray-600 truncate">{learner.student_number}</p>
                </div>
                <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-semibold ${getScoreColor(learner.avg_score)}`}>
                  {learner.avg_score}%
                </span>
              </div>

              <div className="space-y-1 md:space-y-2">
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{learner.grade}</span>
                </div>
                {learner.email && (
                  <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                    <Mail className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="truncate">{learner.email}</span>
                  </div>
                )}
              </div>

              <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedLearner(learner);
                    setIsEditModalOpen(true);
                  }}
                  className="flex-1 px-2 py-1.5 md:px-3 md:py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs md:text-sm font-medium flex items-center justify-center gap-1"
                >
                  <Edit2 className="w-3 h-3 md:w-4 md:h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSelectedLearner(learner);
                    setIsDeleteModalOpen(true);
                  }}
                  className="flex-1 px-2 py-1.5 md:px-3 md:py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-xs md:text-sm font-medium flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredLearners.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No learners found</h3>
            <p className="text-gray-600">Try adjusting your search or add new learners</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Total Learners</h3>
          <p className="text-3xl md:text-4xl font-bold text-emerald-700">{learners.length}</p>
          <p className="text-xs md:text-sm text-gray-600 mt-2">Across all grades</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Active This Term</h3>
          <p className="text-3xl md:text-4xl font-bold text-blue-700">
            {learners.filter((l) => l.status === 'Active').length}
          </p>
          <p className="text-xs md:text-sm text-gray-600 mt-2">Currently enrolled</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Average Score</h3>
          <p className="text-3xl md:text-4xl font-bold text-purple-700">
            {learners.length > 0
              ? Math.round(learners.reduce((sum, l) => sum + l.avg_score, 0) / learners.length)
              : 0}%
          </p>
          <p className="text-xs md:text-sm text-gray-600 mt-2">Overall performance</p>
        </div>
      </div>

      <AddLearnerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddLearner}
      />

      <EditLearnerModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLearner(null);
        }}
        onSubmit={handleEditLearner}
        learner={selectedLearner ? { ...selectedLearner, avgScore: selectedLearner.avg_score } : null}
      />

      <ImportLearnersModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportLearners}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedLearner(null);
        }}
        onConfirm={handleDeleteLearner}
        learnerName={selectedLearner?.full_name || ''}
      />

      <SuccessNotification
        isVisible={showSuccess}
        message={successMessage}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
