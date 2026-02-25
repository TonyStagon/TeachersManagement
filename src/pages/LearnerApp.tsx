import { useState } from 'react';
import { LearnerAuthProvider, useLearnerAuth } from '../contexts/LearnerAuthContext';
import LearnerLogin from './LearnerLogin';
import LearnerProfile from './LearnerProfile';
import LearnerFunding from './LearnerFunding';
import { User, Banknote, GraduationCap } from 'lucide-react';
import { Loader } from 'lucide-react';

function LearnerAppContent() {
  const { learner, loading } = useLearnerAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'funding'>('profile');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!learner) {
    return <LearnerLogin />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-emerald-100">
      {/* Bottom Nav for mobile / Top nav for desktop */}
      <div className="max-w-2xl mx-auto px-4 pb-20 md:pb-0 md:pt-4">
        {/* Desktop top nav */}
        <div className="hidden md:flex items-center gap-4 mb-6 bg-white rounded-xl shadow-md p-3">
          <div className="flex items-center gap-2 px-3">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-gray-800">EduTrack</span>
            <span className="text-xs text-gray-400 ml-1">Learner Portal</span>
          </div>
          <div className="flex gap-1 ml-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${activeTab === 'profile' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <User className="w-4 h-4" />
              My Profile
            </button>
            <button
              onClick={() => setActiveTab('funding')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${activeTab === 'funding' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Banknote className="w-4 h-4" />
              Funding
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="py-4">
          {activeTab === 'profile' ? <LearnerProfile /> : <LearnerFunding />}
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${activeTab === 'profile' ? 'text-emerald-600' : 'text-gray-500'}`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs font-medium">My Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('funding')}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${activeTab === 'funding' ? 'text-emerald-600' : 'text-gray-500'}`}
          >
            <Banknote className="w-5 h-5" />
            <span className="text-xs font-medium">Funding</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LearnerApp() {
  return (
    <LearnerAuthProvider>
      <LearnerAppContent />
    </LearnerAuthProvider>
  );
}
