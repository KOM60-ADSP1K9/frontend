import apiClient from './client';
import type { ApiResponse } from '../types/api.types';
import type { NotificationItem, NotificationListData } from '../types/notification.types';

export class NotificationApi {
  static async getAll(): Promise<ApiResponse<NotificationListData>> {
    const res = await apiClient.get<ApiResponse<NotificationListData>>('/notifications');
    return res.data;
  }

  static async markRead(notificationId: string): Promise<ApiResponse<NotificationItem>> {
    const res = await apiClient.patch<ApiResponse<NotificationItem>>(
      `/notifications/${notificationId}/read`,
    );
    return res.data;
  }
}
