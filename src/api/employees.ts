import api from './axiosInstance'

export interface Employee {
  id: string
  name: string
  email: string
  position: string
  department?: string
  avatarInitials: string
  avatarColor: string
  trainingProgress: number
  createdAt: string
  onboardingCompleted?: boolean
  oceanLearningProfile?: string
  materialsCount?: number
}

export interface DashboardStats {
  totalEmployees: number
  inTraining: number
  completedCourse: number
  averageAiScore: number
}

export interface CreateEmployeeDto {
  name: string
  email: string
  position: string
  department?: string
  materialIds?: string[]
  deadline?: string
  goal?: string
}

export const employeesApi = {
  list: (search?: string) =>
    api.get<Employee[]>('/employees', { params: search ? { search } : {} }).then(r => r.data),

  get: (id: string) =>
    api.get<Employee>(`/employees/${id}`).then(r => r.data),

  me: () =>
    api.get<Employee>('/employees/me').then(r => r.data),

  create: (dto: CreateEmployeeDto) =>
    api.post<Employee>('/employees', dto).then(r => r.data),

  update: (id: string, data: Partial<Employee>) =>
    api.patch<Employee>(`/employees/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/employees/${id}`),

  invite: (id: string) =>
    api.post(`/employees/${id}/invite`),

  linkUser: () =>
    api.post<Employee>('/employees/link-user').then(r => r.data),

  assignMaterial: (employeeId: string, materialId: string, deadline?: string, goal?: string) =>
    api.post(`/employees/${employeeId}/assign-material`, { materialId, deadline, goal }),

  startMaterial: (employeeId: string, materialId: string) =>
    api.post(`/employees/${employeeId}/start-material`, { materialId }),

  completeMaterial: (employeeId: string, materialId: string, aiScore: number) =>
    api.post(`/employees/${employeeId}/complete-material`, { materialId, aiScore }),

  dashboardStats: () =>
    api.get<DashboardStats>('/employees/dashboard-stats').then(r => r.data),
}
