import axiosInstance from './axiosInstance'

export const getAllUsers       = ()         => axiosInstance.get('/users').then(r => r.data)
export const getUserById       = (id)       => axiosInstance.get(`/users/${id}`).then(r => r.data)
export const getUserByUsername = (username) => axiosInstance.get(`/users/by-username/${username}`).then(r => r.data)
export const createUser        = (data)     => axiosInstance.post('/users', data).then(r => r.data)
export const updateUser        = (id, data) => axiosInstance.put(`/users/${id}`, data).then(r => r.data)
export const deleteUser        = (id)       => axiosInstance.delete(`/users/${id}`)
