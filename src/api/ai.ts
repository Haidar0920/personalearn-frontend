import api from './axiosInstance'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface ChatRequest {
  employeeId: string
  materialId?: string
  message: string
  chatType?: 'employee_chat' | 'admin_chat' | 'material' | 'general'
}

export interface OnboardingResponse {
  reply: string
  completed: boolean
  learningProfile: string
}

export const aiApi = {
  chat: (req: ChatRequest) =>
    api.post<{ reply: string }>('/ai/chat', req).then(r => r.data.reply),

  history: (employeeId: string, materialId?: string, chatType = 'employee_chat') =>
    api.get<ChatMessage[]>('/ai/history', {
      params: { employeeId, ...(materialId && { materialId }), chatType }
    }).then(r => r.data),

  onboarding: (message: string) =>
    api.post<OnboardingResponse>('/ai/onboarding', { message }).then(r => r.data),
}
