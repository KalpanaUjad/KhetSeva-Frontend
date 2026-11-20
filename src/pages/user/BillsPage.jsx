import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { initiateRazorpayPayment } from '../../utils/razorpayHelper'
import { useAuth } from '../../context/AuthContext'
import { getMyBookings } from '../../api/bookingApi'
import { getPayments } from '../../api/paymentApi'
import { generateReceipt } from '../../utils/generateReceipt'
import {
  IconClipboardList, IconReceipt,
  IconUser, IconHelp,
  IconPlus, IconDownload
} from '@tabler/icons-react'

const BillsPage = () => {
  const { user, logout } = useAuth()
  const [completedBookings, setCompletedBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBills()
  }, [])

  const loadBills = async () => {
    try {
      setLoading(true)
      const res = await getMyBookings()
      const completed = res.data.filter(b => b.status === 'COMPLETED')
      setCompletedBookings(completed)
    } catch (err) {
      toast.error('Failed to load bills')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (booking) => {
    try {
      const res = await getPayments(booking.id)
      generateReceipt(booking, res.data)
      toast.success('Receipt downloaded!')
    } catch (err) {
      toast.error('Failed to download receipt')
    }
  }

  const initials = user?.name
    ?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: '100vh', background: '#f8f9fa' }}>

      {/* Sidebar */}
      <div style={{ background: 'white', borderRight: '0.5px solid #dee2e6', display: 'flex', flexDirection: 'column', padding: '1.25rem 0' }}>
        <Link to="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: '900', color: '#27500A', padding: '0 1.25rem 1.25rem', borderBottom: '0.5px solid #dee2e6', marginBottom: '0.75rem', textDecoration: 'none' }}>
          Khet<span style={{ color: '#639922' }}>Seva</span>
        </Link>
        <Link to="/dashboard" className="ks-sidebar-item"><IconClipboardList size={17} /> My bookings</Link>
        <Link to="/services" className="ks-sidebar-item"><IconPlus size={17} /> Book a service</Link>
        <Link to="/bills" className="ks-sidebar-item active"><IconReceipt size={17} /> Bills & receipts</Link>
        <Link to="/profile" className="ks-sidebar-item"><IconUser size={17} /> My profile</Link>
        <Link to="/help" className="ks-sidebar-item"><IconHelp size={17} /> Help</Link>
        <div style={{ marginTop: 'auto', padding: '1rem 1.25rem', borderTop: '0.5px solid #dee2e6', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EAF3DE', color: '#3B6D11', fontSize: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{initials}</div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '500' }}>{user?.name}</div>
            <div style={{ fontSize: '11px', color: '#A32D2D', cursor: 'pointer' }} onClick={() => { logout(); window.location.href = '/' }}>Logout</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ padding: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#173404', marginBottom: '1.5rem' }}>
          Bills & Receipts
        </h1>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>Loading...</div>
        ) : completedBookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d', background: 'white', borderRadius: '12px', border: '0.5px solid #dee2e6' }}>
            No completed bookings yet.{' '}
            <Link to="/services" style={{ color: '#3B6D11' }}>Book a service</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {completedBookings.map(b => (
              <div key={b.id} style={{ background: 'white', border: '0.5px solid #dee2e6', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '500', marginBottom: '4px' }}>
                    Booking #{b.bookingNumber}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '6px' }}>
                    {b.preferredDate} · {b.items?.map(i => i.serviceName).join(', ')}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#3B6D11' }}>
                    ₹{b.totalAmount?.toLocaleString('en-IN')}
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(b)}
                  style={{ background: '#639922', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <IconDownload size={15} /> Download Receipt
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BillsPage