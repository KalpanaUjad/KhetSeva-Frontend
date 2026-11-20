import API from './axiosConfig'

// Create Razorpay order
export const createRazorpayOrder = (data) =>
  API.post('/payments/create-order', data)

// Verify payment after success
export const verifyRazorpayPayment = (data) =>
  API.post('/payments/verify', data)

// Get all payments for a booking
export const getPayments = (bookingId) =>
  API.get(`/payments/${bookingId}`)