import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface ActionItem {
  id: string;
  meetingId: string;
  description: string;
  assignee: string;
  dueDate: string | null;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'done' | 'overdue';
  createdAt: string;
  completedAt: string | null;
}

export interface DashboardMetrics {
  totalMeetings: number;
  activeActions: number;
  completedActions: number;
  overdueActions: number;
  completionRate: number;
  priorityBreakdown: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface UploadMeetingData {
  title: string;
  transcript: string;
  uploadedBy: string;
}

// API Functions
export const dashboardApi = {
  // Get dashboard metrics
  getMetrics: async (): Promise<DashboardMetrics> => {
    const response = await api.get('/dashboard');
    return response.data;
  },

  // Get all actions
  getActions: async (params?: {
    status?: string;
    priority?: string;
    assignee?: string;
  }): Promise<{ actions: ActionItem[]; total: number }> => {
    const response = await api.get('/actions', { params });
    return response.data;
  },

  // Update action
  updateAction: async (
    id: string,
    data: {
      status?: ActionItem['status'];
      assignee?: string;
      dueDate?: string | null;
    }
  ): Promise<ActionItem> => {
    const response = await api.put(`/actions/${id}`, data);
    return response.data;
  },

  // Upload meeting
  uploadMeeting: async (data: UploadMeetingData): Promise<any> => {
    const response = await api.post('/meetings/upload', data);
    return response.data;
  },
};