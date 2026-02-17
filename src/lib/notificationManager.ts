/**
 * Notification Manager
 * Handles creating, reading, and managing notifications with sound alerts
 * for at-risk learners and other important events
 */

import { STORAGE_KEYS } from './mockData';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'Achievement' | 'Alert' | 'Info';
  is_read: boolean;
  created_at: string;
  learner_id?: string;
  learner_name?: string;
  sound_play_count?: number; // Track how many times sound has played
}

class NotificationManager {
  private soundReminderIntervals: Map<string, NodeJS.Timeout> = new Map();
  private refreshCallback?: () => void;

  // Play notification sound
  playNotificationSound(type: 'alert' | 'achievement' | 'info' = 'alert') {
    try {
      // Create audio context for sound generation
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioContext.currentTime;
      
      if (type === 'alert') {
        // Alert sound: 3 quick beeps
        this.playBeep(audioContext, now, 800, 0.1);
        this.playBeep(audioContext, now + 0.15, 800, 0.1);
        this.playBeep(audioContext, now + 0.3, 1000, 0.2);
      } else if (type === 'achievement') {
        // Achievement sound: ascending tone
        this.playBeep(audioContext, now, 600, 0.1);
        this.playBeep(audioContext, now + 0.1, 800, 0.1);
        this.playBeep(audioContext, now + 0.2, 1000, 0.2);
      } else {
        // Info sound: single beep
        this.playBeep(audioContext, now, 600, 0.2);
      }

      // Also try browser notification if available
      if ('Notification' in window && Notification.permission === 'granted') {
        this.showBrowserNotification(type);
      }
    } catch (error) {
      console.error('Could not play notification sound:', error);
    }
  }

  private playBeep(
    audioContext: AudioContext,
    startTime: number,
    frequency: number,
    duration: number
  ) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    // Envelope
    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }

  private showBrowserNotification(type: string) {
    const titles: Record<string, string> = {
      alert: '⚠️ Learner At Risk',
      achievement: '🏆 Achievement Unlocked',
      info: 'ℹ️ Information',
    };

    new Notification(titles[type] || 'Notification', {
      icon: '/favicon.ico',
      requireInteraction: type === 'alert',
    });
  }

  // Request notification permission from user (static method)
  static requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(err => {
        console.log('Notification permission request cancelled or failed', err);
      });
    }
  }

  // Create a new notification
  createNotification(
    title: string,
    message: string,
    type: 'Achievement' | 'Alert' | 'Info' = 'Info',
    learner_id?: string,
    learner_name?: string
  ): Notification {
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      message,
      type,
      is_read: false,
      created_at: new Date().toISOString(),
      learner_id,
      learner_name,
      sound_play_count: 0, // Initialize sound play counter
    };

    // Save to localStorage
    this.saveNotification(notification);

    // Play sound based on type
    const soundType = type === 'Alert' ? 'alert' : type === 'Achievement' ? 'achievement' : 'info';
    this.playNotificationSound(soundType);

    // Update sound play count
    this.incrementSoundPlayCount(notification.id);

    // Start reminder system for alerts
    if (type === 'Alert') {
      this.startSoundReminder(notification.id, soundType);
    }

    return notification;
  }

  // Save notification to localStorage
  private saveNotification(notification: Notification) {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]';
      const notifications: Notification[] = JSON.parse(saved);
      notifications.unshift(notification); // Add to beginning for newest first
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to save notification:', error);
    }
  }

  // Get all notifications
  getNotifications(): Notification[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to get notifications:', error);
      return [];
    }
  }

  // Get unread notifications count
  getUnreadCount(): number {
    return this.getNotifications().filter(n => !n.is_read).length;
  }

  // Mark notification as read
  markAsRead(notificationId: string) {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]';
      const notifications: Notification[] = JSON.parse(saved);
      const updated = notifications.map(n =>
        n.id === notificationId ? { ...n, is_read: true } : n
      );
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));

      // Stop sound reminder for this notification
      this.stopSoundReminder(notificationId);

      // Trigger UI refresh if callback is set
      if (this.refreshCallback) {
        this.refreshCallback();
      }

      return updated;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return [];
    }
  }

  // Mark all as read
  markAllAsRead() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]';
      const notifications: Notification[] = JSON.parse(saved);
      const updated = notifications.map(n => ({ ...n, is_read: true }));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));

      // Stop all sound reminders
      this.soundReminderIntervals.forEach((interval) => clearInterval(interval));
      this.soundReminderIntervals.clear();

      // Trigger UI refresh if callback is set
      if (this.refreshCallback) {
        this.refreshCallback();
      }

      return updated;
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      return [];
    }
  }

  // Delete a notification
  deleteNotification(notificationId: string) {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]';
      const notifications: Notification[] = JSON.parse(saved);
      const updated = notifications.filter(n => n.id !== notificationId);
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Failed to delete notification:', error);
      return [];
    }
  }

  // Create at-risk learner notification
  createAtRiskNotification(learnerName: string, learnerScore: number, student_number?: string) {
    return this.createNotification(
      'Performance Alert',
      `${learnerName} (${student_number || 'N/A'}) needs additional support in Life Orientation. Score: ${learnerScore}%`,
      'Alert',
      undefined,
      learnerName
    );
  }

  // Create achievement notification
  createAchievementNotification(learnerName: string, achievementTitle: string, student_number?: string) {
    return this.createNotification(
      'New Achievement',
      `${learnerName} (${student_number || 'N/A'}) has earned: ${achievementTitle}`,
      'Achievement',
      undefined,
      learnerName
    );
  }

  // Clear all notifications (use with caution)
  clearAll() {
    try {
      // Stop all sound reminders first
      this.soundReminderIntervals.forEach((interval) => clearInterval(interval));
      this.soundReminderIntervals.clear();

      localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }

  // ===== SOUND REMINDER SYSTEM =====

  /**
   * Start sound reminder for unread notifications
   * Plays sound up to 3 times with 30-second intervals
   */
  private startSoundReminder(notificationId: string, soundType: 'alert' | 'achievement' | 'info') {
    // Clear any existing interval for this notification
    this.stopSoundReminder(notificationId);

    // Schedule sound reminders every 30 seconds, up to 3 total plays
    const interval = setInterval(() => {
      const notification = this.getNotifications().find(n => n.id === notificationId);

      // Stop if notification is read or doesn't exist
      if (!notification || notification.is_read) {
        this.stopSoundReminder(notificationId);
        return;
      }

      // Get current play count
      const playCount = (notification.sound_play_count || 0) + 1;

      // Stop after 3 plays
      if (playCount >= 3) {
        this.stopSoundReminder(notificationId);
        return;
      }

      // Play sound
      this.playNotificationSound(soundType);

      // Update play count in localStorage
      this.incrementSoundPlayCount(notificationId);

      console.log(`🔔 Reminder ${playCount}/3 for notification: ${notification.title}`);
    }, 30000); // Play every 30 seconds

    // Store interval reference for cleanup
    this.soundReminderIntervals.set(notificationId, interval);
  }

  /**
   * Stop sound reminder for a notification
   */
  private stopSoundReminder(notificationId: string) {
    const interval = this.soundReminderIntervals.get(notificationId);
    if (interval) {
      clearInterval(interval);
      this.soundReminderIntervals.delete(notificationId);
    }
  }

  /**
   * Increment sound play count for a notification
   */
  private incrementSoundPlayCount(notificationId: string) {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]';
      const notifications: Notification[] = JSON.parse(saved);
      const updated = notifications.map(n => {
        if (n.id === notificationId) {
          return {
            ...n,
            sound_play_count: (n.sound_play_count || 0) + 1,
          };
        }
        return n;
      });
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to update sound play count:', error);
    }
  }

  /**
   * Initialize sound reminders for all existing unread alert notifications
   * Call this when the app loads or when visiting the notifications page
   */
  initializeSoundReminders() {
    const notifications = this.getNotifications();
    notifications.forEach(notif => {
      if (!notif.is_read && notif.type === 'Alert') {
        const playCount = notif.sound_play_count || 0;
        // Only start reminder if sound has been played less than 3 times
        if (playCount < 3) {
          this.startSoundReminder(notif.id, 'alert');
        }
      }
    });
  }

  /**
   * Set a callback to refresh UI when notifications are marked as read
   * Used by Notifications page to update display
   */
  setRefreshCallback(callback: () => void) {
    this.refreshCallback = callback;
  }

  /**
   * Cleanup all reminders when manager is destroyed
   */
  destroy() {
    this.soundReminderIntervals.forEach((interval) => clearInterval(interval));
    this.soundReminderIntervals.clear();
  }
}

// Export singleton instance
export const notificationManager = new NotificationManager();

// Make globally accessible in development
if (typeof window !== 'undefined') {
  (window as any).notificationManager = notificationManager;
}
