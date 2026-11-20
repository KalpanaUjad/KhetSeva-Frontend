import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../../components/common/Navbar'
import { getActiveServices } from '../../api/serviceApi'
import { getAvailability } from '../../api/availabilityApi'
import { createBooking } from '../../api/bookingApi'
import { useAuth } from '../../context/AuthContext'
import './ServicesPage.css'
import {
  IconPlant2, IconCut, IconArrowsShuffle, IconDroplet,
  IconSettings2, IconRuler2, IconTruck, IconClipboardList,
  IconCalendar, IconMapPin, IconInfoCircle
} from '@tabler/icons-react'

const iconMap = {
  'Sowing': <IconPlant2 size={22} color="#3B6D11" />,
  'Harvesting': <IconCut size={22} color="#3B6D11" />,
  'Ploughing': <IconArrowsShuffle size={22} color="#3B6D11" />,
  'Spraying': <IconDroplet size={22} color="#3B6D11" />,
  'Rotavator': <IconSettings2 size={22} color="#3B6D11" />,
  'Levelling': <IconRuler2 size={22} color="#3B6D11" />,
  'Transportation': <IconTruck size={22} color="#3B6D11" />,
}

const ServicesPage = () => {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const [services, setServices] = useState([])
  const [selected, setSelected] = useState({})
  const [quantities, setQuantities] = useState({})
  const [filter, setFilter] = useState('all')
  const [preferredDate, setPreferredDate] = useState('')
  const [fieldAddress, setFieldAddress] = useState('')
  const [blockedDates, setBlockedDates] = useState([])
  const [loading, setLoading] = useState(false)

  // Load services on mount
  useEffect(() => {
    getActiveServices()
      .then(res => {
        setServices(res.data)
        const initQty = {}
        res.data.forEach(s => { initQty[s.id] = 1 })
        setQuantities(initQty)
      })
      .catch(() => toast.error('Failed to load services'))
  }, [])

  // Load blocked dates for current month
  useEffect(() => {
    const now = new Date()
    getAvailability(now.getMonth() + 1, now.getFullYear())
      .then(res => {
        const dates = res.data.map(d => d.date)
        setBlockedDates(dates)
      })
      .catch(() => { })
  }, [])

  const toggleService = (svc) => {
    setSelected(prev => ({
      ...prev,
      [svc.id]: !prev[svc.id]
    }))
  }

  const changeQty = (id, delta) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }))
  }

  const getRate = (svc) => svc.rate

  const getSubtotal = (svc) => getRate(svc) * (quantities[svc.id] || 1)

  const selectedServices = services.filter(s => selected[s.id])

  const totalAmount = selectedServices.reduce(
    (sum, s) => sum + getSubtotal(s), 0
  )

  const advanceAmount = Math.round(totalAmount * 0.1)

  const filteredServices = services.filter(s => {
    if (filter === 'all') return true
    if (filter === 'acre') return s.unit === 'acre'
    if (filter === 'km') return s.unit === 'km'
    return true
  })

  const isDateBlocked = (dateStr) => blockedDates.includes(dateStr)

  const handleBooking = async () => {
    if (!isLoggedIn()) {
      toast.error('Please login to book a service')
      navigate('/login')
      return
    }

    if (selectedServices.length === 0) {
      toast.error('Please select at least one service')
      return
    }

    if (!preferredDate) {
      toast.error('Please select a preferred date')
      return
    }

    if (isDateBlocked(preferredDate)) {
      toast.error('This date is not available. Please choose another date.')
      return
    }

    if (!fieldAddress.trim()) {
      toast.error('Please enter your field address')
      return
    }

    const bookingData = {
      preferredDate,
      fieldAddress,
      items: selectedServices.map(s => ({
        serviceId: s.id,
        quantity: quantities[s.id] || 1,
        unit: s.unit,
      }))
    }

    try {
      setLoading(true)
      await createBooking(bookingData)
      toast.success('Booking request sent! Owner will confirm shortly.')
      setSelected({})
      setPreferredDate('')
      setFieldAddress('')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div>
      <Navbar />

      {/* Page hero */}
      <div className="svc-page-hero">
        <div className="svc-page-hero-tag">7 services available</div>
        <h1>Choose Your Farm Service</h1>
        <p>
          Select one or more services, set your field size,
          pick a date — and send your booking request.
        </p>
      </div>

      <div className="svc-body">

        {/* Left — service list */}
        <div>
          {/* Filter buttons */}
          <div className="svc-filter-row">
            {['all', 'acre', 'km'].map(f => (
              <button
                key={f}
                className={`svc-filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All Services' : f === 'acre' ? 'Per Acre' : 'Per KM'}
              </button>
            ))}
          </div>

          {/* Service cards */}
          <div className="svc-list">
            {filteredServices.map(svc => (
              <div
                key={svc.id}
                className={`svc-card ${selected[svc.id] ? 'selected' : ''}`}
              >
                <div className="svc-card-top">
                  <div className="svc-icon">
                    {iconMap[svc.name] || <IconSettings2 size={22} color="#3B6D11" />}
                  </div>
                  <div className="svc-info">
                    <div className="svc-name">{svc.name}</div>
                    <div className="svc-desc">{svc.description}</div>
                  </div>
                  <div className="svc-right">
                    <div className="svc-rate">₹{svc.rate} / {svc.unit}</div>
                    <div className="svc-unit">per {svc.unit}</div>
                    <button
                      className="svc-add-btn"
                      onClick={() => toggleService(svc)}
                    >
                      {selected[svc.id] ? '− Remove' : '+ Add to booking'}
                    </button>
                  </div>
                </div>

                {/* Controls — show only when selected */}
                {selected[svc.id] && (
                  <div className="svc-controls">
                    <span className="svc-ctrl-label">Quantity</span>
                    <div className="svc-qty-row">
                      <button
                        className="svc-qty-btn"
                        onClick={() => changeQty(svc.id, -1)}
                      >−</button>
                      <span className="svc-qty-val">{quantities[svc.id] || 1}</span>
                      <span className="svc-qty-unit">{svc.unit}</span>
                      <button
                        className="svc-qty-btn"
                        onClick={() => changeQty(svc.id, 1)}
                      >+</button>
                    </div>
                    <span className="svc-subtotal">
                      ₹{getSubtotal(svc).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right — booking summary cart */}
        <div>
          <div className="svc-cart">
            <div className="svc-cart-title">
              <IconClipboardList size={20} color="#639922" />
              Booking Summary
            </div>

            {/* Empty state */}
            {selectedServices.length === 0 && (
              <div className="svc-cart-empty">
                No services selected yet.<br />
                Pick a service from the left to begin.
              </div>
            )}

            {/* Cart items */}
            {selectedServices.length > 0 && (
              <>
                <div className="svc-cart-items">
                  {selectedServices.map(svc => (
                    <div key={svc.id} className="svc-cart-item">
                      <div>
                        <div className="svc-ci-name">{svc.name}</div>
                        <div className="svc-ci-detail">
                          {quantities[svc.id]} {svc.unit} × ₹{getRate(svc)}
                        </div>
                      </div>
                      <div className="svc-ci-price">
                        ₹{getSubtotal(svc).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="svc-divider" />

                <div className="svc-total-row">
                  <span className="svc-total-label">Subtotal</span>
                  <span className="svc-total-val">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="svc-total-row">
                  <span className="svc-total-label">Advance (10%)</span>
                  <span className="svc-total-val">
                    ₹{advanceAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <hr className="svc-divider" />

                <div className="svc-total-row">
                  <span className="svc-grand-label">Total</span>
                  <span className="svc-grand-val">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#6c757d', marginTop: '4px' }}>
                  Balance paid after job completion
                </p>

                {/* Date picker */}
                <div className="svc-date-section">
                  <div className="svc-date-label">
                    <IconCalendar size={15} /> Preferred date
                  </div>
                  <input
                    type="date"
                    className="svc-date-input"
                    min={today}
                    value={preferredDate}
                    onChange={e => setPreferredDate(e.target.value)}
                  />
                  <div className="svc-avail-note">
                    <IconInfoCircle size={14} />
                    Only available dates can be selected
                  </div>
                </div>

                {/* Field address */}
                <div className="svc-date-label">
                  <IconMapPin size={15} /> Field address / village
                </div>
                <textarea
                  className="svc-addr-input"
                  rows={2}
                  placeholder="Village name, landmark, taluka…"
                  value={fieldAddress}
                  onChange={e => setFieldAddress(e.target.value)}
                />
              </>
            )}

            {/* Book button */}
            <button
              className="svc-book-btn"
              disabled={selectedServices.length === 0 || loading}
              onClick={handleBooking}
            >
              {loading ? 'Sending...' : 'Send Booking Request ↗'}
            </button>

            <div className="svc-login-note">
              Not registered?{' '}
              <Link to="/login">Register free</Link> to book
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ServicesPage