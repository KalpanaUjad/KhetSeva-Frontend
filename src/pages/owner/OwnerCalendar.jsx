import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { OwnerSidebar } from './OwnerDashboard'
import {
  getAvailability,
  blockDates,
  unblockDates
} from '../../api/availabilityApi'
import { IconChevronLeft, IconChevronRight, IconInfoCircle } from '@tabler/icons-react'
import './OwnerCalendar.css'

const months = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const OwnerCalendar = () => {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [availability, setAvailability] = useState([])
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAvailability()
  }, [month, year])

  const loadAvailability = async () => {
    try {
      const res = await getAvailability(month + 1, year)
      setAvailability(res.data)
    } catch (err) {
      toast.error('Failed to load availability')
    }
  }

  const changeMonth = (dir) => {
    let newMonth = month + dir
    let newYear = year
    if (newMonth > 11) { newMonth = 0; newYear++ }
    if (newMonth < 0) { newMonth = 11; newYear-- }
    setMonth(newMonth)
    setYear(newYear)
  }

  const getDayStatus = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const found = availability.find(a => a.date === dateStr)
    return found ? found.type : 'AVAILABLE'
  }

  const handleBlock = async () => {
    if (!fromDate || !toDate) {
      toast.error('Please select both from and to dates')
      return
    }
    try {
      setLoading(true)
      const res = await blockDates({ fromDate, toDate, reason: 'Blocked by owner' })
      toast.success(res.data.message)
      loadAvailability()
      setFromDate('')
      setToDate('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to block dates')
    } finally {
      setLoading(false)
    }
  }

  const handleUnblock = async () => {
    if (!fromDate || !toDate) {
      toast.error('Please select both from and to dates')
      return
    }
    try {
      setLoading(true)
      const res = await unblockDates({ fromDate, toDate })
      toast.success(res.data.message)
      loadAvailability()
      setFromDate('')
      setToDate('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to unblock dates')
    } finally {
      setLoading(false)
    }
  }

  // Build calendar days
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayStr = today.toISOString().split('T')[0]

  const availableCount = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    .filter(d => {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const isPast = dateStr < todayStr
      const status = getDayStatus(d)
      return !isPast && status === 'AVAILABLE'
    }).length

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: '100vh', background: '#f8f9fa' }}>
      <OwnerSidebar active="/owner/calendar" />

      <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 240px', gap: '1.25rem', alignItems: 'start' }}>

        {/* Left — calendar */}
        <div>
          <div className="oc-topbar">
            <h1>Availability Calendar</h1>
            <div className="oc-month-nav">
              <button className="oc-month-btn" onClick={() => changeMonth(-1)}>
                <IconChevronLeft size={14} />
              </button>
              <div className="oc-month-label">
                {months[month]} {year}
              </div>
              <button className="oc-month-btn" onClick={() => changeMonth(1)}>
                <IconChevronRight size={14} />
              </button>
            </div>
          </div>

          <div className="oc-cal">
            <div className="oc-weekdays">
              {weekdays.map(d => (
                <div key={d} className="oc-wd">{d}</div>
              ))}
            </div>
            <div className="oc-grid">
              {/* Empty cells */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="oc-day empty" />
              ))}
              {/* Day cells */}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const isPast = dateStr < todayStr
                const isToday = dateStr === todayStr
                const status = getDayStatus(day)
                let cls = isPast ? 'past' : status === 'BLOCKED' ? 'blocked' : status === 'BOOKED' ? 'booked' : 'available'

                return (
                  <div
                    key={day}
                    className={`oc-day ${cls} ${isToday ? 'today-mark' : ''}`}
                  >
                    <div className="oc-day-num">{day}</div>
                    {status === 'BLOCKED' && !isPast && (
                      <span className="oc-day-tag blocked">blocked</span>
                    )}
                    {status === 'BOOKED' && !isPast && (
                      <span className="oc-day-tag booked">booked</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="oc-legend">
            <div className="oc-leg">
              <div className="oc-leg-dot" style={{ background: '#EAF3DE', border: '0.5px solid #C0DD97' }} />
              Booked
            </div>
            <div className="oc-leg">
              <div className="oc-leg-dot" style={{ background: '#FAEEDA', border: '0.5px solid #FAC775' }} />
              Blocked by you
            </div>
            <div className="oc-leg">
              <div className="oc-leg-dot" style={{ background: 'white', border: '0.5px solid #dee2e6' }} />
              Available
            </div>
          </div>
        </div>

        {/* Right — actions */}
        <div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', fontWeight: '700', color: '#173404', marginBottom: '1rem' }}>
            Manage dates
          </h2>

          {/* Available count */}
          <div className="oc-info-card">
            <div className="oc-info-title">This month</div>
            <div className="oc-info-val">{availableCount}</div>
            <div className="oc-info-sub">available days remaining</div>
          </div>

          {/* Block/Unblock */}
          <div className="oc-block-section">
            <div className="oc-block-title">Block or unblock dates</div>
            <input
              type="date"
              className="oc-date-input"
              value={fromDate}
              min={todayStr}
              onChange={e => setFromDate(e.target.value)}
              placeholder="From date"
            />
            <input
              type="date"
              className="oc-date-input"
              value={toDate}
              min={fromDate || todayStr}
              onChange={e => setToDate(e.target.value)}
              placeholder="To date"
            />
            <button
              className="oc-block-btn"
              onClick={handleBlock}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Block these dates'}
            </button>
            <button
              className="oc-unblock-btn"
              onClick={handleUnblock}
              disabled={loading}
            >
              Unblock these dates
            </button>
          </div>

          {/* Tip */}
          <div className="oc-tip">
            <IconInfoCircle size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
            Farmers only see available dates when booking.
            Blocked and booked dates are greyed out for them.
          </div>
        </div>

      </div>
    </div>
  )
}

export default OwnerCalendar