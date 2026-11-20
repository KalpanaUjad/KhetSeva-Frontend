import API from './axiosConfig'

export const getAvailability = (month, year) =>
  API.get(`/availability?month=${month}&year=${year}`)

export const blockDates = (data) =>
  API.post('/availability/block', data)

export const unblockDates = (data) =>
  API.delete('/availability/unblock', { data })
