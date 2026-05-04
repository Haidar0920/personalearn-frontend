import api from './axiosInstance'
import { supabase } from '../lib/supabase'

export interface Material {
  id: string
  title: string
  description?: string
  type: 'pdf' | 'audio' | 'video'
  fileUrl: string
  fileName?: string
  fileSize?: number
  goal?: string
  audience?: string
  durationMinutes?: number
  isPublished: boolean
  createdAt: string
}

export const materialsApi = {
  list: (type?: string) =>
    api.get<Material[]>('/materials', { params: type ? { type } : {} }).then(r => r.data),

  get: (id: string) =>
    api.get<Material>(`/materials/${id}`).then(r => r.data),

  /**
   * Upload to Supabase Storage, then register metadata in backend.
   */
  upload: async (file: File, meta: {
    title: string
    description?: string
    type: 'pdf' | 'audio' | 'video'
    goal?: string
    audience?: string
    publish?: boolean
  }) => {
    // 1. Upload file to Supabase Storage
    const ext = file.name.split('.').pop()
    const path = `materials/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('materials')
      .upload(path, file, { upsert: false })

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

    // 2. Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('materials')
      .getPublicUrl(path)

    // 3. Register in backend
    const params = new URLSearchParams({
      title: meta.title,
      type: meta.type,
      fileUrl: publicUrl,
      fileName: file.name,
      fileSize: String(file.size),
      ...(meta.description && { description: meta.description }),
      ...(meta.goal && { goal: meta.goal }),
      ...(meta.audience && { audience: meta.audience }),
      ...(meta.publish !== undefined && { publish: String(meta.publish) }),
    })

    return api.post<Material>(`/materials?${params.toString()}`).then(r => r.data)
  },

  publish: (id: string) =>
    api.patch<Material>(`/materials/${id}/publish`).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/materials/${id}`),
}
