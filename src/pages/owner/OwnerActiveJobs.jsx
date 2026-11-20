import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { OwnerSidebar } from './OwnerDashboard'
import {
  getAllBookings,
  completeBooking,
  rejectBooking
} from '../../api/bookingApi'
import {
  IconCheck, IconPhone,
  IconCalendar, IconMapPin
} from '@tabler/icons-react'
import './OwnerActiveJobs.css'

const OwnerActiveJobs = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      setLoading(true)
      const res = await getAllBookings('CONFIRMED')
      setJobs(res.data)
    } catch (err) {
      toast.error('Failed to load active jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (id) => {
    try {
      await completeBooking(id)
      toast.success('Job marked as completed! Farmer can now pay.')
      loadJobs()
    } catch (err) {
      toast.error('Failed to complete job')
    }
  }

  const handleCancel = async (id) => {
    const reason = window.prompt('Enter reason for cancellation:')
    if (!reason) return
    try {
      await rejectBooking(id, { reason })
      toast.success('Job cancelled. Farmer notified.')
      loadJobs()
    } catch (err) {
      toast.error('Failed to cancel job')
    }
  }

  const today = new Date().toISOString().split('T')[0]

  const getInitials = (name) =>
    name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const totalValue = jobs.reduce((s, j) => s + (j.totalAmount || 0), 0)
  const todayJobs = jobs.filter(j => j.preferredDate === today).length

  return (
    <div className="oaj-wrap">
      <OwnerSidebar active="/owner/active-jobs" />

      <div className="oaj-main">
        <div className="oaj-topbar">
          <h1>Active Jobs</h1>
          <div className="oaj-topbar-date">
            <IconCalendar size={15} />
            Today: {new Date().toLocaleDateString('en-IN')}
          </div>
        </div>

        {/* Summary */}
        <div className="oaj-sum-row">
          <div className="oaj-sum-card">
            <div className="oaj-sum-num">{jobs.length}</div>
            <div className="oaj-sum-lbl">Active jobs</div>
          </div>
          <div className="oaj-sum-card">
            <div className="oaj-sum-num" style={{ color: '#854F0B' }}>
              {todayJobs}
            </div>
            <div className="oaj-sum-lbl">Due today</div>
          </div>
          <div className="oaj-sum-card">
            <div className="oaj-sum-num">
              ₹{totalValue.toLocaleString('en-IN')}
            </div>
            <div className="oaj-sum-lbl">Total job value</div>
          </div>
        </div>

        {/* Job cards */}
        {loading ? (
          <div className="oaj-empty">Loading active jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="oaj-empty">No active jobs right now.</div>
        ) : (
          <div className="oaj-cards">
            {jobs.map(j => {
              const isToday = j.preferredDate === today
              return (
                <div
                  key={j.id}
                  className={`oaj-card ${isToday ? 'today' : ''}`}
                >
                  <div className="oaj-card-top">
                    <div className="oaj-farmer">
                      <div className="oaj-farmer-av">
                        {getInitials(j.farmerName)}
                      </div>
                      <div>
                        <div className="oaj-farmer-name">
                          {j.farmerName}
                          {isToday && (
                            <span className="oaj-today-tag">Today</span>
                          )}
                        </div>
                        <div className="oaj-farmer-meta">
                          <span>
                            <IconMapPin size={12} /> {j.farmerVillage}
                          </span>
                          <span>
                            <IconPhone size={12} /> {j.farmerMobile}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="oaj-date-badge">
                      <IconCalendar size={13} /> {j.preferredDate}
                    </div>
                  </div>

                  {/* Services */}
                  <div className="oaj-svcs">
                    {j.items?.map((item, i) => (
                      <div key={i} className="oaj-svc-pill">
                        {item.serviceName}
                      </div>
                    ))}
                  </div>

                  {/* Details */}
                  <div className="oaj-detail-grid">
                    <div className="oaj-detail-box">
                      <div className="oaj-detail-lbl">Field size</div>
                      <div className="oaj-detail-val">
                        {j.items?.[0]?.quantity} {j.items?.[0]?.unit}
                      </div>
                    </div>
                    <div className="oaj-detail-box">
                      <div className="oaj-detail-lbl">Total amount</div>
                      <div className="oaj-detail-val">
                        ₹{j.totalAmount?.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="oaj-detail-box">
                      <div className="oaj-detail-lbl">Advance paid</div>
                      <div className="oaj-detail-val" style={{ color: '#3B6D11' }}>
                        ₹{j.advanceAmount?.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="oaj-detail-box">
                      <div className="oaj-detail-lbl">Balance due</div>
                      <div className="oaj-detail-val">
                        ₹{j.balanceAmount?.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Field address */}
                  <div style={{
                    fontSize: '12px',
                    color: '#6c757d',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <IconMapPin size={13} /> {j.fieldAddress}
                  </div>

                  {/* Actions */}
                  <div className="oaj-actions">
                    <button
                      className="oaj-btn-done"
                      onClick={() => handleComplete(j.id)}
                    >
                      <IconCheck size={15} /> Mark as done
                    </button>
                    <button className="oaj-btn-call">
                      <a href={`tel:${j.farmerMobile}`} 
                      className="ob-btn-call"
                      style={{ textDecoration: 'none' }}>
                        <IconPhone size={14} /> Call farmer
                      </a>
                    </button>
                    <button
                      className="oaj-btn-cancel"
                      onClick={() => handleCancel(j.id)}
                    >
                      Cancel job
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default OwnerActiveJobs