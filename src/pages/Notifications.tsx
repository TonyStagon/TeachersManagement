import { useState, useEffect } from 'react';
import { Bell, Award, AlertCircle, Info, Check } from 'lucide-react';
import { mockNotifications, STORAGE_KEYS } from '../lib/mockData';
import { notificationManager, type Notification } from '../lib/notificationManager';

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed : mockNotifications;
      }
    } catch (error) {
      console.error('Failed to load notifications from localStorage:', error);
    }
    return mockNotifications;
  });

  // Sync notifications from localStorage
  useEffect(() => {
    // Function to load notifications from localStorage
    const loadNotificationsFromStorage = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.length > 0) {
            setNotifications(parsed);
            return;
          }
        }
      } catch (error) {
        console.error('Failed to sync notifications:', error);
      }
      setNotifications(mockNotifications);
    };

    // Load immediately on component mount
    loadNotificationsFromStorage();

    // Initialize sound reminders for unread alerts
    notificationManager.initializeSoundReminders();

    // Set refresh callback so UI updates when marked as read
    notificationManager.setRefreshCallback(() => {
      loadNotificationsFromStorage();
    });

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = () => {
      loadNotificationsFromStorage();
    };

    window.addEventListener('storage', handleStorageChange);

    // Poll localStorage every 5000ms (5 seconds) to catch same-tab updates
    const pollInterval = setInterval(loadNotificationsFromStorage, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(pollInterval);
    };
  }, []);

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

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = (notificationId: string) => {
    const updated = notificationManager.markAsRead(notificationId);
    setNotifications(updated);
  };

  const handleMarkAllAsRead = () => {
    const updated = notificationManager.markAllAsRead();
    setNotifications(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated with learner activities and alerts</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md"
          >
            <Check className="w-4 h-4" />
            Mark All Read
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-gray-900">Total</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-700">{notifications.length}</p>
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
            {notifications.filter(n => n.type === 'Achievement').length}
          </p>
          <p className="text-sm text-gray-600 mt-1">This week</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Notifications</h2>
        <div className="space-y-3">
          {notifications.map((notification) => {
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
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{formatDate(notification.created_at)}</span>
                        {!notification.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-200 transition-colors"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{notification.message}</p>
                    {notification.learner_name && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Learner:</span>
                        <span>{notification.learner_name}</span>
                        {notification.learner_id && (
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                            ID: {notification.learner_id}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
