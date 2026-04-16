import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Learners from './pages/Learners';
import Performance from './pages/Performance';
import Reports from './pages/Reports';
import Achievements from './pages/Achievements';
import Resources from './pages/Resources';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import { Funding } from './pages/Funding';
import Login from './pages/Login';
import Register from './pages/Register';
import { Menu, Loader, GraduationCap, Users } from 'lucide-react';
import { debugHelper } from './lib/debugHelper';
import { notificationManager } from './lib/notificationManager';

if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission().catch(err => {
    console.log('Notification permission request cancelled', err);
  });
}

notificationManager.initializeSoundReminders();

// Portal selector shown before any login
function PortalSelector({ onSelect }: { onSelect: (portal: 'teacher') => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">EduTrack</h1>
          <p className="text-gray-500 mt-2">Teacher Management Portal</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => onSelect('teacher')}
            className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-all duration-200 hover:-translate-y-1 text-left group border border-transparent hover:border-emerald-200"
          >
            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors">
              <Users className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Teacher Portal</h2>
            <p className="text-sm text-gray-500">Manage learners, track performance, generate reports and more.</p>
          </button>
        </div>
      </div>
    </div>
  );
}

function TeacherAppContent() {
  const { user, teacher, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'learners': return <Learners />;
      case 'performance': return <Performance />;
      case 'reports': return <Reports />;
      case 'achievements': return <Achievements />;
      case 'resources': return <Resources />;
      case 'funding': return <Funding />;
      case 'notifications': return <Notifications />;
      case 'profile': return <Profile />;
      default: return <Dashboard />;
    }
  };

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

  if (!user || !teacher) {
    return authMode === 'login' ? (
      <Login onSwitchToRegister={() => setAuthMode('register')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-64 p-4 md:p-6 lg:p-8 transition-all duration-300 min-h-screen">
        <div className="lg:hidden mb-6 bg-white rounded-xl shadow-md p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
          <div className="w-10"></div>
        </div>
        {renderContent()}
      </main>
    </div>
  );
}

function App() {
  const [portal, setPortal] = useState<'select' | 'teacher'>('select');

  if (portal === 'select') {
    return <PortalSelector onSelect={setPortal} />;
  }

  return (
    <AuthProvider>
      <div>
        {/* Back to portal selection - only show if not logged in as teacher */}
        <div className="fixed top-3 right-3 z-50">
          <button
            onClick={() => setPortal('select')}
            className="text-xs bg-white border border-gray-200 text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-full shadow-sm hover:shadow transition-all"
          >
            Switch Portal
          </button>
        </div>
        <TeacherAppContent />
      </div>
    </AuthProvider>
  );
}

export default App;
