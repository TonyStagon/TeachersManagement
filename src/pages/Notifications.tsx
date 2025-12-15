import { Bell, Award, AlertCircle, Info, Check } from 'lucide-react';
import { mockNotifications } from '../lib/mockData';

export default function Notifications() {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'Achievement':
        return Award;
      case 'Alert':
        return AlertCircle;
      case 'Info':
        return Info;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'Achievement':
        return { bg: 'bg-amber-100', text: 'text-amber-700', icon: 'text-amber-600' };
      case 'Alert':
        return { bg: 'bg-red-100', text: 'text-red-700', icon: 'text-red-600' };
      case 'Info':
        return { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'text-blue-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-600' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
  };

  const unreadCount = mockNotifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated with learner activities and alerts</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md">
          <Check className="w-4 h-4" />
          Mark All Read
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-gray-900">Total</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-700">{mockNotifications.length}</p>
          <p className="text-sm text-gray-600 mt-1">All notifications</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center relative">
              <Bell className="w-5 h-5 text-blue-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <h3 className="font-bold text-gray-900">Unread</h3>
          </div>
          <p className="text-3xl font-bold text-blue-700">{unreadCount}</p>
          <p className="text-sm text-gray-600 mt-1">Needs attention</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-bold text-gray-900">Achievements</h3>
          </div>
          <p className="text-3xl font-bold text-amber-700">
            {mockNotifications.filter(n => n.type === 'Achievement').length}
          </p>
          <p className="text-sm text-gray-600 mt-1">This week</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Notifications</h2>
        <div className="space-y-3">
          {mockNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const colors = getNotificationColor(notification.type);

            return (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border-l-4 ${
                  notification.is_read
                    ? 'bg-gray-50 border-gray-300'
                    : 'bg-white border-emerald-500 shadow-md'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 ${colors.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-bold ${notification.is_read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                        {formatDate(notification.created_at)}
                      </span>
                    </div>
                    <p className={`text-sm ${notification.is_read ? 'text-gray-600' : 'text-gray-700'} mb-3`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
                        {notification.type}
                      </span>
                      {!notification.is_read && (
                        <button className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {mockNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">You're all caught up!</p>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl shadow-md p-6 border border-emerald-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Info className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2">Notification Preferences</h3>
            <p className="text-gray-600 mb-4">
              Customize which notifications you receive and how often you'd like to be updated.
            </p>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
              Manage Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
