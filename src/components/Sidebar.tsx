import {
  LayoutDashboard,
  Users,
  TrendingUp,
  FileText,
  BookOpen,
  Bell,
  Settings,
  Award,
  GraduationCap,
  X,
  Banknote,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'learners', name: 'Learners', icon: Users },
  { id: 'performance', name: 'Performance', icon: TrendingUp },
  { id: 'reports', name: 'Reports', icon: FileText },
  { id: 'achievements', name: 'Achievements', icon: Award },
  { id: 'resources', name: 'Resources', icon: BookOpen },
  { id: 'funding', name: 'Funding', icon: Banknote },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'profile', name: 'Profile', icon: Settings },
];

export default function Sidebar({ activeTab, onTabChange, isOpen = false, onClose }: SidebarProps) {
  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    // Close sidebar on mobile after selecting a tab
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Sidebar - fixed on all screens, hidden on mobile when closed */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-emerald-800 to-emerald-900 text-white h-screen flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile close button */}
        <div className="lg:hidden p-4 border-b border-emerald-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">EduTrack</h1>
              <p className="text-xs text-emerald-300">Teacher Dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop header (without close button) */}
        <div className="hidden lg:block p-6 border-b border-emerald-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">EduTrack</h1>
              <p className="text-xs text-emerald-300">Teacher Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-700 shadow-lg scale-105'
                    : 'hover:bg-emerald-700/50 hover:scale-102'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-emerald-300'}`} />
                <span className={`font-medium ${isActive ? 'text-white' : 'text-emerald-100'}`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-emerald-700">
          <div className="text-xs text-emerald-300 text-center">
            © 2024 EduTrack Platform
          </div>
        </div>
      </div>
    </>
  );
}
