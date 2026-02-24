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
import { Menu, Loader } from 'lucide-react';
import { debugHelper } from './lib/debugHelper';
import { notificationManager } from './lib/notificationManager';

if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission().catch(err => {
    console.log('Notification permission request cancelled', err);
  });
}

notificationManager.initializeSoundReminders();

function AppContent() {
  const { user, teacher, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'learners':
        return <Learners />;
      case 'performance':
        return <Performance />;
      case 'reports':
        return <Reports />;
      case 'achievements':
        return <Achievements />;
      case 'resources':
        return <Resources />;
      case 'funding':
        return <Funding />;
      case 'notifications':
        return <Notifications />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
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
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

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
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
