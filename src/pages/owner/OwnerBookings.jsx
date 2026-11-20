import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { OwnerSidebar } from './OwnerDashboard'
import {
  getAllBookings,
  approveBooking,
  rejectBooking
} from '../../api/bookingApi'
import {
  IconCheck, IconX, IconPhone,
  IconMapPin, IconCalendar
} from '@tabler/icons-react'
import './OwnerBookings.css'

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([])
  const [tab, setTab] = useState('PENDING')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const res = await getAllBookings()
      setBookings(res.data)
    } catch (err) {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      await approveBooking(id)
      toast.success('Booking approved! Farmer has been notified.')
      loadBookings()
    } catch (err) {
      toast.error('Failed to approve booking')
    }
  }

  const handleReject = async (id) => {
    const reason = window.prompt('Enter reason for rejection:')
    if (!reason) return
    try {
      await rejectBooking(id, { reason })
      toast.success('Booking rejected. Farmer notified.')
      loadBookings()
    } catch (err) {
      toast.error('Failed to reject booking')
    }
  }

  const filtered = tab === 'ALL'
    ? bookings
    : bookings.filter(b => b.status === tab)

  const counts = {
    pending: bookings.filter(b => b.status === 'PENDING').length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
  }

  const getInitials = (name) =>
    name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="ob-wrap">
      <OwnerSidebar active="/owner/bookings" />

      <div className="ob-main">
        <div className="ob-topbar">
          <h1>Booking Requests</h1>
        </div>

        {/* Summary */}
        <div className="ob-sum-row">
          <div className="ob-sum-card">
            <div className="ob-sum-num" style={{ color: '#854F0B' }}>
              {counts.pending}
            </div>
            <div className="ob-sum-lbl">Pending approval</div>
          </div>
          <div className="ob-sum-card">
            <div className="ob-sum-num">{counts.confirmed}</div>
            <div className="ob-sum-lbl">Confirmed today</div>
          </div>
          <div className="ob-sum-card">
            <div className="ob-sum-num" style={{ color: '#A32D2D' }}>
              {counts.cancelled}
            </div>
            <div className="ob-sum-lbl">Cancelled</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="ob-tabs">
          {['PENDING', 'CONFIRMED', 'CANCELLED', 'ALL'].map(t => (
            <button
              key={t}
              className={`ob-tab ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Cards */}
        {loading ? (
          <div className="ob-empty">Loading bookings...</div>
        ) : filtered.length === 0 ? (
          <div className="ob-empty">No bookings in this category.</div>
        ) : (
          <div className="ob-cards">
            {filtered.map(b => (
              <div
                key={b.id}
                className={`ob-card ${b.status === 'PENDING' ? 'new' : ''}`}
              >
                {/* Top */}
                <div className="ob-card-top">
                  <div className="ob-farmer-av">
                    {getInitials(b.farmerName)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="ob-farmer-name">{b.farmerName}</div>
                    <div className="ob-farmer-meta">
                      <span>
                        <IconMapPin size={12} /> {b.farmerVillage}
                      </span>
                      <span>
                        <IconPhone size={12} /> {b.farmerMobile}
                      </span>
                    </div>
                  </div>
                  <div className="ob-card-right">
                    <div className="ob-card-time">
                      {new Date(b.createdAt).toLocaleDateString('en-IN')}
                    </div>
                    <span className={`badge-${b.status.toLowerCase()}`}>
                      {b.status.charAt(0) + b.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                </div>

                {/* Services */}
                <div className="ob-svcs">
                  {b.items?.map((item, i) => (
                    <div key={i} className="ob-svc-pill">
                      {item.serviceName} — {item.quantity} {item.unit}
                      (₹{item.subtotal?.toLocaleString('en-IN')})
                    </div>
                  ))}
                </div>

                {/* Details */}
                <div className="ob-detail-grid">
                  <div className="ob-detail-box">
                    <div className="ob-detail-lbl">Preferred date</div>
                    <div className="ob-detail-val">{b.preferredDate}</div>
                  </div>
                  <div className="ob-detail-box">
                    <div className="ob-detail-lbl">Total amount</div>
                    <div className="ob-detail-val">
                      ₹{b.totalAmount?.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="ob-detail-box">
                    <div className="ob-detail-lbl">Field address</div>
                    <div className="ob-detail-val">{b.fieldAddress}</div>
                  </div>
                </div>

                {/* Actions */}
                {b.status === 'PENDING' && (
                  <div className="ob-actions">
                    <button
                      className="ob-btn-approve"
                      onClick={() => handleApprove(b.id)}
                    >
                      <IconCheck size={15} /> Approve & confirm
                    </button>
                    <button className="ob-btn-call">
                      <a
                        href={`tel:${b.farmerMobile}`}
                        className="ob-btn-call"
                        style={{ textDecoration: 'none' }}
                      >
                        <IconPhone size={14} /> Call farmer
</a>
                    </button>
                    <button
                      className="ob-btn-reject"
                      onClick={() => handleReject(b.id)}
                    >
                      <IconX size={14} /> Reject
                    </button>
                  </div>
                )}

                {b.status === 'CONFIRMED' && (
                  <div className="ob-actions">
                    <button className="ob-btn-call">
                      <a
                        href={`tel:${b.farmerMobile}`}
                        className="ob-btn-call"
                        style={{ textDecoration: 'none' }}
                      >
                        <IconPhone size={14} /> Call farmer
                      </a>  
                    </button>
                    <button
                      className="ob-btn-reject"
                      onClick={() => handleReject(b.id)}
                    >
                      <IconX size={14} /> Cancel job
                    </button>
                  </div>
                )}

                {b.status === 'CANCELLED' && (
                  <div style={{
                    fontSize: '13px',
                    color: '#6c757d',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <IconX size={16} /> Booking was cancelled
                    {b.cancelReason && ` — ${b.cancelReason}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OwnerBookings