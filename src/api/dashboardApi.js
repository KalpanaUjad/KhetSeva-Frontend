import API from './axiosConfig'

export const getDashboardSummary = () =>
  API.get('/owner/dashboard/summary')

export const getInvoice = (bookingId) =>
  API.get(`/invoice/${bookingId}`)
