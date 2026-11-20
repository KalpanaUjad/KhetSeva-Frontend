import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { getDashboardSummary } from '../../api/dashboardApi'
import { getAllBookings } from '../../api/bookingApi'
import {
  IconClipboardList, IconTractor, IconCalendar,
  IconHistory, IconSettings2, IconChartBar,
  IconClock, IconCheck, IconX, IconMapPin
} from '@tabler/icons-react'
import './OwnerDashboard.css'

const OwnerSidebar = ({ active }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="od-sidebar">
      <Link to="/" className="od-sidebar-logo">
        Khet<span>Seva</span>
      </Link>
      {[
        { to: '/owner/dashboard', icon: <IconChartBar size={17} />, label: 'Dashboard' },
        { to: '/owner/bookings', icon: <IconClipboardList size={17} />, label: 'Booking requests' },
        { to: '/owner/active-jobs', icon: <IconTractor size={17} />, label: 'Active jobs' },
        { to: '/owner/calendar', icon: <IconCalendar size={17} />, label: 'Availability' },
        { to: '/owner/history', icon: <IconHistory size={17} />, label: 'History & records' },
        { to: '/owner/pricing', icon: <IconSettings2 size={17} />, label: 'Services & pricing' },
      ].map((item, i) => (
        <Link
          key={i}
          to={item.to}
          className={`ks-sidebar-item ${active === item.to ? 'active' : ''}`}
        >
          {item.icon} {item.label}
        </Link>
      ))}
      <div className="od-owner-info">
        <div className="od-owner-name">{user?.name}</div>
        <div
          className="od-owner-role"
          style={{ cursor: 'pointer', color: '#A32D2D' }}
          onClick={handleLogout}
        >Logout</div>
      </div>
    </div>
  )
}

export { OwnerSidebar }

const OwnerDashboard = () => {
  const [summary, setSummary] = useState(null)
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [sumRes, bookRes] = await Promise.all([
        getDashboardSummary(),
        getAllBookings()
      ])
      setSummary(sumRes.data)
      setRecentBookings(bookRes.data.slice(0, 5))
    } catch (err) {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric',
    month: 'long', year: 'numeric'
  })

  return (
    <div className="od-wrap">
      <OwnerSidebar active="/owner/dashboard" />

      <div className="od-main">
        <div className="od-topbar">
          <h1>Dashboard</h1>
          <div className="od-topbar-date">
            <IconCalendar size={15} /> {today}
          </div>
        </div>

        {loading ? (
          <div className="od-loading">Loading dashboard...</div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="od-sum-grid">
              {[
                { icon: <IconClock size={18} color="#854F0B" />, num: summary?.pendingBookings ?? 0, label: 'Pending requests', color: '#854F0B', bg: '#FAEEDA' },
                { icon: <IconCheck size={18} color="#3B6D11" />, num: summary?.confirmedBookings ?? 0, label: 'Confirmed bookings', color: '#3B6D11', bg: '#EAF3DE' },
                { icon: <IconTractor size={18} color="#3B6D11" />, num: summary?.activeJobs ?? 0, label: 'Active jobs', color: '#3B6D11', bg: '#EAF3DE' },
                { icon: <IconCheck size={18} color="#185FA5" />, num: summary?.completedJobs ?? 0, label: 'Completed jobs', color: '#185FA5', bg: '#E6F1FB' },
                { icon: <IconChartBar size={18} color="#3B6D11" />, num: `₹${(summary?.totalEarnings ?? 0).toLocaleString('en-IN')}`, label: 'Total earnings', color: '#3B6D11', bg: '#EAF3DE' },
                { icon: <IconMapPin size={18} color="#3B6D11" />, num: summary?.totalAcresCovered ?? 0, label: 'Acres covered', color: '#3B6D11', bg: '#EAF3DE' },
              ].map((s, i) => (
                <div key={i} className="od-sum-card">
                  <div className="od-sum-icon" style={{ background: s.bg }}>
                    {s.icon}
                  </div>
                  <div className="od-sum-num" style={{ color: s.color }}>{s.num}</div>
                  <div className="od-sum-lbl">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Two column */}
            <div className="od-two-col">

              {/* Recent bookings */}
              <div className="od-recent">
                <div className="od-section-title">Recent Bookings</div>
                {recentBookings.length === 0 ? (
                  <div style={{ fontSize: '13px', color: '#6c757d', textAlign: 'center', padding: '1rem' }}>
                    No bookings yet
                  </div>
                ) : recentBookings.map(b => (
                  <div key={b.id} className="od-recent-item">
                    <div>
                      <div className="od-recent-name">{b.farmerName}</div>
                      <div className="od-recent-meta">
                        {b.items?.map(i => i.serviceName).join(', ')}
                      </div>
                    </div>
                    <div>
                      <div className="od-recent-amount">
                        ₹{b.totalAmount?.toLocaleString('en-IN')}
                      </div>
                      <div className="od-recent-date">
                        <span className={`badge-${b.status.toLowerCase()}`}>
                          {b.status.charAt(0) + b.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <Link to="/owner/bookings" style={{
                  display: 'block',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: '#3B6D11',
                  marginTop: '1rem',
                  textDecoration: 'none',
                  fontWeight: '500',
                }}>
                  View all bookings →
                </Link>
              </div>

              {/* Quick actions */}
              <div className="od-actions">
                <div className="od-section-title">Quick Actions</div>
                {[
                  { to: '/owner/bookings', icon: <IconClipboardList size={18} color="#3B6D11" />, title: 'Review booking requests', sub: `${summary?.pendingBookings ?? 0} pending approval` },
                  { to: '/owner/active-jobs', icon: <IconTractor size={18} color="#3B6D11" />, title: 'View active jobs', sub: `${summary?.activeJobs ?? 0} jobs in progress` },
                  { to: '/owner/calendar', icon: <IconCalendar size={18} color="#3B6D11" />, title: 'Manage availability', sub: 'Block or open dates' },
                  { to: '/owner/pricing', icon: <IconSettings2 size={18} color="#3B6D11" />, title: 'Update service rates', sub: 'Change prices anytime' },
                  { to: '/owner/history', icon: <IconHistory size={18} color="#3B6D11" />, title: 'View job history', sub: `${summary?.completedJobs ?? 0} jobs completed` },
                ].map((a, i) => (
                  <Link key={i} to={a.to} className="od-action-btn">
                    <div className="od-action-icon">{a.icon}</div>
                    <div>
                      <div className="od-action-title">{a.title}</div>
                      <div className="od-action-sub">{a.sub}</div>
                    </div>
                  </Link>
                ))}
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default OwnerDashboard