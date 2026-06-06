import axiosInstance from './axiosInstance'

export const getAllPrompts         = ()                  => axiosInstance.get('/prompts').then(r => r.data)
export const getPromptById        = (id)                => axiosInstance.get(`/prompts/${id}`).then(r => r.data)
export const getPromptsByAuthor   = (authorId)          => axiosInstance.get(`/prompts/by-author/${authorId}`).then(r => r.data)
export const getPromptsByWorkspace= (workspaceId)       => axiosInstance.get(`/prompts/by-workspace/${workspaceId}`).then(r => r.data)
export const createPrompt         = (authorId, data)    => axiosInstance.post(`/prompts/author/${authorId}`, data).then(r => r.data)
export const updatePrompt         = (id, data)          => axiosInstance.put(`/prompts/${id}`, data).then(r => r.data)
export const deletePrompt         = (id)                => axiosInstance.delete(`/prompts/${id}`)
export const starPrompt           = (promptId, userId)  => axiosInstance.post(`/prompts/${promptId}/star/${userId}`)
export const unstarPrompt         = (promptId, userId)  => axiosInstance.delete(`/prompts/${promptId}/star/${userId}`)
export const getStarredPrompts    = (userId)            => axiosInstance.get(`/prompts/starred/${userId}`).then(r => r.data)
