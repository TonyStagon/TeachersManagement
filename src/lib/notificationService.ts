import { supabase } from './supabase';

// Simple interface that matches what we need
export interface Notification {
  id: string;
  teacher_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  learner_id?: string | null;
  learner_name?: string | null;
  sound_play_count?: number;
}

export async function fetchNotifications(teacherId: string): Promise<Notification[]> {
  try {
    // Use type assertion to bypass TypeScript errors
    const { data, error } = await (supabase
      .from('notifications') as any)
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Error in fetchNotifications:', error);
    return [];
  }
}

export async function createNotification(notificationData: {
  teacher_id: string;
  title: string;
  message: string;
  type: string;
  is_read?: boolean;
  learner_id?: string | null;
  learner_name?: string | null;
}): Promise<Notification | null> {
  try {
    const notification = {
      ...notificationData,
      is_read: notificationData.is_read || false,
    };

    // Use type assertion to bypass TypeScript errors
    const { data, error } = await (supabase
      .from('notifications') as any)
      .insert([notification])
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error in createNotification:', error);
    return null;
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    const { error } = await (supabase
      .from('notifications') as any)
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in markNotificationAsRead:', error);
    return false;
  }
}

export async function markAllNotificationsAsRead(teacherId: string): Promise<boolean> {
  try {
    const { error } = await (supabase
      .from('notifications') as any)
      .update({ is_read: true })
      .eq('teacher_id', teacherId);

    if (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in markAllNotificationsAsRead:', error);
    return false;
  }
}

export async function getUnreadNotificationsCount(teacherId: string): Promise<number> {
  try {
    const { count, error } = await (supabase
      .from('notifications') as any)
      .select('*', { count: 'exact', head: true })
      .eq('teacher_id', teacherId)
      .eq('is_read', false);

    if (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
    return count || 0;
  } catch (error) {
    console.error('Error in getUnreadNotificationsCount:', error);
    return 0;
  }
}

export async function deleteNotification(notificationId: string): Promise<boolean> {
  try {
    const { error } = await (supabase
      .from('notifications') as any)
      .delete()
      .eq('id', notificationId);

    if (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in deleteNotification:', error);
    return false;
  }
}