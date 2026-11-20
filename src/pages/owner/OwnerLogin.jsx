import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { loginOwner } from '../../api/authApi'
import {
  IconTractor, IconClipboardCheck,
  IconCalendar, IconChartBar,
  IconSettings2, IconShieldCheck,
  IconArrowLeft
} from '@tabler/icons-react'
import './OwnerLogin.css'

const OwnerLogin = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    mobile: '', password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.mobile || !formData.password) {
      setError('Please fill all fields')
      return
    }

    try {
      setLoading(true)
      const res = await loginOwner(formData)
      const data = res.data

      if (!data.token) {
        setError(data.message || 'Login failed')
        return
      }

      login({
        name: data.name,
        role: data.role,
        userId: data.userId,
      }, data.token)

      toast.success(`Welcome, ${data.name}!`)
      navigate('/owner/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ol-wrap">
      <div className="ol-box">

        {/* Left panel */}
        <div className="ol-left">
          <Link to="/" className="ol-left-logo">
            Khet<span>Seva</span>
          </Link>
          <div className="ol-icon">
            <IconTractor size={28} color="#C0DD97" />
          </div>
          <div>
            <h2>Owner dashboard access</h2>
            <p style={{ marginTop: '0.5rem' }}>
              This area is restricted to the tractor owner only.
              Manage all your bookings, jobs, pricing, and
              availability from one place.
            </p>
          </div>
          <div className="ol-perks">
            {[
              { icon: <IconClipboardCheck size={16} color="#C0DD97" />, text: 'Approve or reject booking requests' },
              { icon: <IconCalendar size={16} color="#C0DD97" />, text: 'Manage your availability calendar' },
              { icon: <IconChartBar size={16} color="#C0DD97" />, text: 'View earnings and job history' },
              { icon: <IconSettings2 size={16} color="#C0DD97" />, text: 'Update service rates anytime' },
            ].map((p, i) => (
              <div key={i} className="ol-perk">
                {p.icon} {p.text}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="ol-right">
          <div className="ol-title">Owner login</div>
          <div className="ol-sub">
            Enter your credentials to access the dashboard
          </div>

          {error && <div className="ol-error">{error}</div>}

          <form className="ol-form" onSubmit={handleLogin}>
            <div>
              <label className="ol-label">Registered mobile number</label>
              <input
                className="ol-input"
                type="tel"
                placeholder="Your 10-digit mobile number"
                value={formData.mobile}
                onChange={e => setFormData({
                  ...formData, mobile: e.target.value
                })}
              />
            </div>
            <div>
              <label className="ol-label">Password</label>
              <input
                className="ol-input"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={e => setFormData({
                  ...formData, password: e.target.value
                })}
              />
            </div>
            <button
              className="ol-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login to owner dashboard'}
            </button>
            <div className="ol-security">
              <IconShieldCheck size={16} color="#3B6D11" style={{ flexShrink: 0, marginTop: '1px' }} />
              <p>
                This is a private, owner-only area.
                Unauthorised access attempts are logged and blocked.
              </p>
            </div>
          </form>

          <div className="ol-back">
            <Link to="/">
              <IconArrowLeft size={13} /> Back to main website
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default OwnerLogin