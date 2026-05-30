export type NotificationType = 'inquiry_received' | 'inquiry_submitted';

export interface NotificationItem {
  id: string;
  recipient_user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  laporan_id: string | null;
  inquiry_id: string | null;
  read_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface NotificationListData {
  notifications: NotificationItem[];
  unread_count: number;
}
