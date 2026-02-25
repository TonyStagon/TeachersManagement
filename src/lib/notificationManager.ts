/**
 * Notification Manager
 * Handles creating, reading, and managing notifications with sound alerts
 * for at-risk learners, top performers, and other important events
 */

import { STORAGE_KEYS } from './mockData';
import { sendTeacherNotificationEmail, type NotificationEmailData } from './emailService';
import { createNotification as createDbNotification } from './notificationService';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
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
      // Check if AudioContext is available
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('AudioContext not available in this browser');
        this.fallbackNotification(type);
        return;
      }

      // Create audio context for sound generation
      const audioContext = new AudioContextClass();
      
      // Check if audio context is suspended (requires user interaction)
      if (audioContext.state === 'suspended') {
        console.warn('AudioContext suspended, requires user interaction. Using fallback notification.');
        this.fallbackNotification(type);
        return;
      }

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
      // Fallback to simple console notification
      console.log(`🔔 ${type.toUpperCase()} Notification: Check the notifications page`);
    }
  }

  // Fallback notification when AudioContext is not available
  private fallbackNotification(type: string) {
    // Try browser notification if available
    if ('Notification' in window && Notification.permission === 'granted') {
      this.showBrowserNotification(type as any);
    } else {
      // Last resort: console log
      console.log(`🔔 ${type.toUpperCase()} Notification (sound unavailable): Check the notifications page`);
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
    type: string = 'Info',
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

    console.log('Creating notification:', { title, message, type, learner_id, learner_name });

    // Save to localStorage
    this.saveNotification(notification);
    console.log('Notification saved to localStorage');

    // Also save to database if teacher is available
    this.saveNotificationToDatabase(notification).catch(error => {
      console.error('Failed to save notification to database:', error);
    });

    // Play sound based on type (try-catch to handle AudioContext issues)
    const soundType = type === 'Alert' ? 'alert' : type === 'Achievement' ? 'achievement' : 'info';
    try {
      this.playNotificationSound(soundType);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
      // Still continue with notification creation even if sound fails
    }

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

  // Save notification to database
  private async saveNotificationToDatabase(notification: Notification): Promise<void> {
    try {
      const teacherId = this.getTeacherId();
      console.log('Attempting to save notification to database. Teacher ID:', teacherId);
      
      if (!teacherId) {
        console.warn('Cannot save notification to database: Teacher ID not available');
        return;
      }

      console.log('Saving notification to database with data:', {
        teacher_id: teacherId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        is_read: notification.is_read,
        learner_id: notification.learner_id || null,
        learner_name: notification.learner_name || null,
      });

      const result = await createDbNotification({
        teacher_id: teacherId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        is_read: notification.is_read,
        learner_id: notification.learner_id || null,
        learner_name: notification.learner_name || null,
      });
      
      if (!result) {
        console.warn('Failed to save notification to database: No result returned');
      } else {
        console.log('Notification saved to database successfully:', result.id);
      }
    } catch (error) {
      console.error('Failed to save notification to database:', error);
    }
  }

  // Get teacher ID from localStorage or AuthContext
  private getTeacherId(): string | null {
    try {
      // Try to get teacher info from localStorage
      const teacherData = localStorage.getItem('teacher_profile');
      if (teacherData) {
        const teacher = JSON.parse(teacherData);
        if (teacher.id) {
          return teacher.id;
        }
      }

      // Try to get from AuthContext via global window object
      if (typeof window !== 'undefined' && (window as any).teacherId) {
        return (window as any).teacherId;
      }

      // Return null if no ID found
      return null;
    } catch (error) {
      console.error('Error getting teacher ID:', error);
      return null;
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
    const notification = this.createNotification(
      'Performance Alert',
      `${learnerName} (${student_number || 'N/A'}) needs additional support in Life Orientation. Score: ${learnerScore}%`,
      'Alert',
      undefined,
      learnerName
    );

    // Send email notification if teacher email is available
    this.sendEmailNotification({
      teacherEmail: this.getTeacherEmail(),
      notificationType: 'at-risk',
      learnerName,
      learnerScore,
      studentNumber: student_number,
      notificationMessage: `${learnerName} needs additional support in Life Orientation. Score: ${learnerScore}%`,
    });

    return notification;
  }

  // Create top performer notification
  createTopPerformerNotification(learnerName: string, learnerScore: number, student_number?: string, rank?: number, totalLearners?: number) {
    const rankText = rank ? `Rank #${rank}${totalLearners ? ` out of ${totalLearners}` : ''}` : 'Top Performer';
    const notification = this.createNotification(
      'Top Performer Alert',
      `${learnerName} (${student_number || 'N/A'}) is excelling in Life Orientation. Score: ${learnerScore}% (${rankText})`,
      'Achievement',
      undefined,
      learnerName
    );

    // Send email notification if teacher email is available
    this.sendEmailNotification({
      teacherEmail: this.getTeacherEmail(),
      notificationType: 'top-performer',
      learnerName,
      learnerScore,
      studentNumber: student_number,
      notificationMessage: `${learnerName} is excelling in Life Orientation. Score: ${learnerScore}% (${rankText})`,
      rank,
      totalLearners,
    });

    return notification;
  }

  // Create achievement notification
  createAchievementNotification(learnerName: string, achievementTitle: string, student_number?: string) {
    const notification = this.createNotification(
      'New Achievement',
      `${learnerName} (${student_number || 'N/A'}) has earned: ${achievementTitle}`,
      'Achievement',
      undefined,
      learnerName
    );

    // Send email notification if teacher email is available
    this.sendEmailNotification({
      teacherEmail: this.getTeacherEmail(),
      notificationType: 'achievement',
      learnerName,
      achievementTitle,
      studentNumber: student_number,
      notificationMessage: `${learnerName} has earned: ${achievementTitle}`,
    });

    return notification;
  }

  // Get teacher email from localStorage or AuthContext
  private getTeacherEmail(): string {
    try {
      // Try to get teacher info from localStorage
      const teacherData = localStorage.getItem('teacher_profile');
      if (teacherData) {
        const teacher = JSON.parse(teacherData);
        if (teacher.email) {
          return teacher.email;
        }
      }

      // Try to get from AuthContext via global window object
      if (typeof window !== 'undefined' && (window as any).teacherEmail) {
        return (window as any).teacherEmail;
      }

      // Return empty string if no email found
      return '';
    } catch (error) {
      console.error('Error getting teacher email:', error);
      return '';
    }
  }

  // Get teacher name from localStorage or AuthContext
  private getTeacherName(): string {
    try {
      // Try to get teacher info from localStorage
      const teacherData = localStorage.getItem('teacher_profile');
      if (teacherData) {
        const teacher = JSON.parse(teacherData);
        if (teacher.full_name) {
          return teacher.full_name;
        }
      }

      // Try to get from AuthContext via global window object
      if (typeof window !== 'undefined' && (window as any).teacherName) {
        return (window as any).teacherName;
      }

      // Return default if no name found
      return 'Teacher';
    } catch (error) {
      console.error('Error getting teacher name:', error);
      return 'Teacher';
    }
  }

  // Send email notification
  private async sendEmailNotification(data: Omit<NotificationEmailData, 'teacherName'>) {
    try {
      const teacherName = this.getTeacherName();
      const teacherEmail = this.getTeacherEmail();

      if (!teacherEmail) {
        console.warn('Cannot send email notification: Teacher email not available');
        return;
      }

      const emailData: NotificationEmailData = {
        ...data,
        teacherName,
        teacherEmail,
      };

      // Send email in background (don't wait for response)
      sendTeacherNotificationEmail(emailData).then(success => {
        if (success) {
          console.log('Email notification sent successfully');
        } else {
          console.warn('Failed to send email notification');
        }
      }).catch(error => {
        console.error('Error sending email notification:', error);
      });
    } catch (error) {
      console.error('Error preparing email notification:', error);
    }
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

// For development/debugging: expose on window
if (typeof window !== 'undefined') {
  (window as any).notificationManager = notificationManager;
}
