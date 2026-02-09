import { useState, useEffect } from 'react';
import { Search, Filter, UserPlus, Upload, Mail, Phone, Calendar, Users, Edit2, Trash2 } from 'lucide-react';
import { mockLearners } from '../lib/mockData';
import AddLearnerModal, { LearnerFormData } from '../components/AddLearnerModal';
import EditLearnerModal from '../components/EditLearnerModal';
import ImportLearnersModal, { ImportedLearner } from '../components/ImportLearnersModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import SuccessNotification from '../components/SuccessNotification';

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

// Key for localStorage
const LOCAL_STORAGE_KEY = 'teacher-management-learners';

export default function Learners() {
  // Load learners from localStorage or use mock data as fallback
  const [learners, setLearners] = useState<Learner[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure we have at least the mock learners if saved data is empty
        return parsed.length > 0 ? parsed : mockLearners;
      }
    } catch (error) {
      console.error('Failed to load learners from localStorage:', error);
    }
    return mockLearners;
  });

  // Save learners to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(learners));
    } catch (error) {
      console.error('Failed to save learners to localStorage:', error);
    }
  }, [learners]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const grades = ['All', 'Grade 10', 'Grade 11', 'Grade 12'];

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

  const handleAddLearner = (learnerData: LearnerFormData) => {
    // Generate a unique ID (simple increment from existing IDs)
    let newId = '1';
    if (learners.length > 0) {
      // Extract numeric IDs safely
      const numericIds = learners
        .map((l: Learner) => {
          const num = parseInt(l.id, 10);
          return isNaN(num) ? 0 : num;
        })
        .filter((num: number) => num > 0);

      const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
      newId = (maxId + 1).toString();
    }

    // Generate a random average score between 60-95 for demonstration
    const randomScore = Math.floor(Math.random() * 36) + 60;

    const newLearner = {
      ...learnerData,
      id: newId,
      avgScore: randomScore,
      status: learnerData.status || 'Active',
    };

    setLearners([...learners, newLearner]);
    setSuccessMessage(`${learnerData.full_name} has been successfully added to ${learnerData.grade}!`);
    setShowSuccess(true);
    setIsModalOpen(false);
  };

  const handleImportLearners = (importedLearners: ImportedLearner[]) => {
    const numericIds = learners
      .map((l: Learner) => {
        const num = parseInt(l.id, 10);
        return isNaN(num) ? 0 : num;
      })
      .filter((num: number) => num > 0);

    let maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;

    const newLearners = importedLearners.map((learnerData) => {
      maxId += 1;
      const randomScore = Math.floor(Math.random() * 36) + 60;

      return {
        ...learnerData,
        id: maxId.toString(),
        avgScore: randomScore,
      };
    });

    setLearners([...learners, ...newLearners]);
    setSuccessMessage(`Successfully imported ${newLearners.length} learner${newLearners.length !== 1 ? 's' : ''}!`);
    setShowSuccess(true);
    setIsImportModalOpen(false);
  };

  const handleEditLearner = (learnerData: LearnerFormData) => {
    if (selectedLearner) {
      const updatedLearners = learners.map((l) =>
        l.id === selectedLearner.id ? { ...l, ...learnerData } : l
      );
      setLearners(updatedLearners);
      setSuccessMessage(`${learnerData.full_name}'s details have been updated!`);
      setShowSuccess(true);
      setIsEditModalOpen(false);
      setSelectedLearner(null);
    }
  };

  const handleDeleteLearner = () => {
    if (selectedLearner) {
      const updatedLearners = learners.filter((l) => l.id !== selectedLearner.id);
      setLearners(updatedLearners);
      setSuccessMessage(`${selectedLearner.full_name} has been removed from the system.`);
      setShowSuccess(true);
      setSelectedLearner(null);
    }
  };

  const openEditModal = (learner: Learner) => {
    setSelectedLearner(learner);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (learner: Learner) => {
    setSelectedLearner(learner);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Learner Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage and track all your learners in one place</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md text-sm sm:text-base"
          >
            <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
            Import Learners
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
          {filteredLearners.map((learner: Learner) => (
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
                <button
                  onClick={() => openEditModal(learner)}
                  className="flex-1 px-2 py-1.5 md:px-3 md:py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs md:text-sm font-medium flex items-center justify-center gap-1"
                >
                  <Edit2 className="w-3 h-3 md:w-4 md:h-4" />
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(learner)}
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
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
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
            {learners.filter((l: Learner) => l.status === 'Active').length}
          </p>
          <p className="text-xs md:text-sm text-gray-600 mt-2">Currently enrolled</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Average Score</h3>
          <p className="text-3xl md:text-4xl font-bold text-purple-700">
            {learners.length > 0 ? Math.round(learners.reduce((sum: number, l: Learner) => sum + l.avgScore, 0) / learners.length) : 0}%
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
        learner={selectedLearner}
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
