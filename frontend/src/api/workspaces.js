import axiosInstance from './axiosInstance'

export const getAllWorkspaces        = ()              => axiosInstance.get('/workspaces').then(r => r.data)
export const getWorkspaceById       = (id)            => axiosInstance.get(`/workspaces/${id}`).then(r => r.data)
export const getWorkspacesByOwner   = (ownerId)       => axiosInstance.get(`/workspaces/by-owner/${ownerId}`).then(r => r.data)
export const createWorkspace        = (ownerId, data) => axiosInstance.post(`/workspaces/owner/${ownerId}`, data).then(r => r.data)
export const updateWorkspace        = (id, data)      => axiosInstance.put(`/workspaces/${id}`, data).then(r => r.data)
export const deleteWorkspace        = (id)            => axiosInstance.delete(`/workspaces/${id}`)
