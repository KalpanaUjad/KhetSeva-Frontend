import API from './axiosConfig'

export const getActiveServices = () =>
  API.get('/services')

export const getAllServices = () =>
  API.get('/services/all')

export const updateServiceRate = (id, data) =>
  API.put(`/services/${id}/rate`, data)

export const toggleService = (id) =>
  API.put(`/services/${id}/toggle`)
