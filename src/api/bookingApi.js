import API from './axiosConfig'

export const createBooking = (data) =>
  API.post('/bookings', data)

export const getMyBookings = () =>
  API.get('/bookings/my')

export const getBookingById = (id) =>
  API.get(`/bookings/${id}`)

export const cancelBooking = (id, data) =>
  API.delete(`/bookings/${id}/cancel`, { data })

export const getAllBookings = (status) =>
  API.get(`/owner/bookings${status ? `?status=${status}` : ''}`)

export const approveBooking = (id) =>
  API.put(`/owner/bookings/${id}/approve`)

export const rejectBooking = (id, data) =>
  API.put(`/owner/bookings/${id}/reject`, data)

export const completeBooking = (id) =>
  API.put(`/owner/bookings/${id}/complete`)
