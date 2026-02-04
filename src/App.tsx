import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Learners from './pages/Learners';
import Performance from './pages/Performance';
import Reports from './pages/Reports';
import Achievements from './pages/Achievements';
import Resources from './pages/Resources';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import { Menu, X } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      case 'notifications':
        return <Notifications />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
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
        {/* Mobile header with menu button */}
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
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
        
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
