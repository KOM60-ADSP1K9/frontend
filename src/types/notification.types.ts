export type NotificationType = 'inquiry_received' | 'inquiry_submitted';

export class NotificationItem {
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

  constructor(data: {
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
  }) {
    this.id = data.id;
    this.recipient_user_id = data.recipient_user_id;
    this.type = data.type;
    this.title = data.title;
    this.message = data.message;
    this.is_read = data.is_read;
    this.laporan_id = data.laporan_id;
    this.inquiry_id = data.inquiry_id;
    this.read_at = data.read_at;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}

export class NotificationListData {
  notifications: NotificationItem[];
  unread_count: number;

  constructor(data: { notifications: NotificationItem[]; unread_count: number }) {
    this.notifications = data.notifications;
    this.unread_count = data.unread_count;
  }
}
