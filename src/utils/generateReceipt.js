import { jsPDF } from 'jspdf'

export const generateReceipt = (booking, payments) => {
  const doc = new jsPDF()

  const balancePayment = payments.find(
    p => p.type === 'BALANCE' && p.status === 'SUCCESS'
  )
  const advancePayment = payments.find(
    p => p.type === 'ADVANCE' && p.status === 'SUCCESS'
  )

  // Colors
  const green = [39, 80, 10]
  const lightGreen = [99, 153, 34]
  const darkGreen = [23, 52, 4]
  const gray = [108, 117, 125]

  // Header background
  doc.setFillColor(...darkGreen)
  doc.rect(0, 0, 210, 45, 'F')

  // Logo
  doc.setTextColor(234, 243, 222)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('KhetSeva', 15, 20)

  // Tagline
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(151, 196, 89)
  doc.text('Tax Invoice / Receipt', 15, 28)

  // PAID badge
  doc.setFillColor(...lightGreen)
  doc.roundedRect(155, 12, 40, 10, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('✓ PAID', 168, 19)

  // Invoice details
  doc.setTextColor(151, 196, 89)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`Invoice: KS-INV-${new Date().getFullYear()}-${String(booking.id).padStart(4, '0')}`, 15, 38)
  doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 100, 38)

  // Section — Billed by and to
  let y = 55

  doc.setTextColor(...gray)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('BILLED BY', 15, y)
  doc.text('BILLED TO', 110, y)

  y += 6
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(33, 37, 41)
  doc.text('Suresh Pawar', 15, y)
  doc.text(booking.farmerName || 'Farmer', 110, y)

  y += 5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...gray)
  doc.text('KhetSeva Tractor Services', 15, y)
  doc.text(booking.farmerVillage || '', 110, y)

  y += 5
  doc.text('Baramati, Pune — 413102', 15, y)
  doc.text(`Mobile: ${booking.farmerMobile || ''}`, 110, y)

  y += 5
  doc.text('Maharashtra, India', 15, y)
  doc.text(`Booking ID: ${booking.bookingNumber}`, 110, y)

  y += 5
  doc.text('+91 98765 00001', 15, y)

  // Divider
  y += 10
  doc.setDrawColor(222, 226, 230)
  doc.line(15, y, 195, y)

  // Booking details
  y += 8
  doc.setFillColor(248, 249, 250)
  doc.rect(15, y - 4, 180, 8, 'F')
  doc.setTextColor(33, 37, 41)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('Preferred Date', 18, y)
  doc.text('Field Address', 80, y)
  doc.text('Booking Status', 150, y)

  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...gray)
  doc.text(booking.preferredDate || '', 18, y)
  doc.text(
    (booking.fieldAddress || '').substring(0, 25),
    80, y
  )
  doc.setTextColor(...lightGreen)
  doc.text(booking.status || '', 150, y)

  // Services table
  y += 12
  doc.setFillColor(248, 249, 250)
  doc.rect(15, y - 4, 180, 8, 'F')
  doc.setTextColor(...gray)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('Service', 18, y)
  doc.text('Quantity', 90, y)
  doc.text('Rate', 130, y)
  doc.text('Amount', 170, y)

  y += 2
  doc.setDrawColor(222, 226, 230)
  doc.line(15, y, 195, y)

  // Service rows
  booking.items?.forEach(item => {
    y += 8
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(33, 37, 41)
    doc.setFontSize(10)
    doc.text(item.serviceName || '', 18, y)

    doc.setFontSize(9)
    doc.setTextColor(...gray)
    doc.text(`${item.quantity} ${item.unit}`, 90, y)
    doc.text(`₹${item.rate}/${item.unit}`, 130, y)

    doc.setTextColor(...green)
    doc.setFont('helvetica', 'bold')
    doc.text(
      `₹${item.subtotal?.toLocaleString('en-IN')}`,
      170, y
    )

    y += 2
    doc.setDrawColor(222, 226, 230)
    doc.line(15, y, 195, y)
  })

  // Totals
  y += 10
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...gray)
  doc.text('Subtotal', 130, y)
  doc.setTextColor(33, 37, 41)
  doc.text(
    `₹${booking.totalAmount?.toLocaleString('en-IN')}`,
    170, y
  )

  y += 7
  doc.setTextColor(...gray)
  doc.text('Advance paid (10%)', 130, y)
  doc.setTextColor(...lightGreen)
  doc.text(
    `- ₹${booking.advanceAmount?.toLocaleString('en-IN')}`,
    170, y
  )

  y += 2
  doc.setDrawColor(222, 226, 230)
  doc.line(130, y, 195, y)

  y += 7
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(33, 37, 41)
  doc.text('Balance paid', 130, y)
  doc.setTextColor(...green)
  doc.setFontSize(13)
  doc.text(
    `₹${booking.balanceAmount?.toLocaleString('en-IN')}`,
    165, y
  )

  // Payment details box
  y += 12
  doc.setFillColor(234, 243, 222)
  doc.roundedRect(15, y - 4, 180, 28, 3, 3, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...green)
  doc.text('Payment Details', 18, y + 2)

  y += 8
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...darkGreen)
  doc.setFontSize(9)

  if (balancePayment) {
    doc.text(`Method: ${balancePayment.method || 'UPI'}`, 18, y)
    doc.text(`Status: ${balancePayment.status}`, 80, y)
    y += 6
    doc.text(
      `Transaction ID: ${balancePayment.transactionId || ''}`,
      18, y
    )
    doc.text(
      `Paid on: ${balancePayment.paidAt
        ? new Date(balancePayment.paidAt)
            .toLocaleDateString('en-IN')
        : ''}`,
      80, y
    )
  } else {
    doc.text('Balance payment not yet received', 18, y)
  }

  // Footer
  y += 20
  doc.setDrawColor(222, 226, 230)
  doc.line(15, y, 195, y)

  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...gray)
  doc.text(
    'Thank you for choosing KhetSeva — serving farmers since 2012',
    105, y,
    { align: 'center' }
  )

  y += 5
  doc.text(
    `KS-INV-${new Date().getFullYear()}-${String(booking.id).padStart(4, '0')} · Generated on ${new Date().toLocaleDateString('en-IN')}`,
    105, y,
    { align: 'center' }
  )

  // Save
  doc.save(
    `KhetSeva-Receipt-${booking.bookingNumber}.pdf`
  )
}