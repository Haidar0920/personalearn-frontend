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

  create: (dto: CreateEmployeeDto) =>
    api.post<Employee>('/employees', dto).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/employees/${id}`),

  assignMaterial: (employeeId: string, materialId: string, deadline?: string, goal?: string) =>
    api.post(`/employees/${employeeId}/assign-material`, { materialId, deadline, goal }),

  dashboardStats: () =>
    api.get<DashboardStats>('/employees/dashboard-stats').then(r => r.data),
}
