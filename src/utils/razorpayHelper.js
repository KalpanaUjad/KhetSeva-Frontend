import { createRazorpayOrder, verifyRazorpayPayment } from '../api/paymentApi'

export const initiateRazorpayPayment = async ({
  bookingId,
  type,
  farmerName,
  farmerMobile,
  onSuccess,
  onError,
}) => {

  try {
    // Step 1 — Create order on backend
    const res = await createRazorpayOrder({ bookingId, type })
    const order = res.data

    // Step 2 — Open Razorpay popup
    const options = {
      key: order.keyId,
      amount: order.amount * 100,
      currency: order.currency,
      name: 'KhetSeva',
      description: `${type} Payment — ${order.bookingNumber}`,
      order_id: order.orderId,
      prefill: {
        name: farmerName,
        contact: farmerMobile,
      },
      theme: {
        color: '#639922',
      },
      handler: async (response) => {
        // Step 3 — Verify payment on backend
        try {
          const verifyRes = await verifyRazorpayPayment({
            bookingId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            type,
            method: 'UPI',
          })
          onSuccess(verifyRes.data)
        } catch (err) {
          onError('Payment verification failed. Contact support.')
        }
      },
      modal: {
        ondismiss: () => {
          onError('Payment cancelled by user.')
        },
      },
    }

    // Open Razorpay checkout
    const rzp = new window.Razorpay(options)
    rzp.open()

  } catch (err) {
    onError(
      err.response?.data?.message ||
      'Failed to initiate payment. Try again.'
    )
  }
}