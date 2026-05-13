import axiosInstance from './axiosInstance';

export interface EmployeeAnalytics {
  id: string;
  name: string;
  position: string;
  oceanLearningProfile: string;
  avgAiScore: number;
  trainingProgress: number;
  materialsCount: number;
  completedCount: number;
}

export interface AnalyticsOverview {
  totalEmployees: number;
  onboardingCompleted: number;
  inTraining: number;
  completed: number;
  avgAiScore: number;
}

export const analyticsApi = {
  overview: () => axiosInstance.get<AnalyticsOverview>('/analytics/overview').then(r => r.data),
  employees: () => axiosInstance.get<EmployeeAnalytics[]>('/analytics/employees').then(r => r.data),
  employee: (id: string) => axiosInstance.get(`/analytics/employees/${id}`).then(r => r.data),
};
