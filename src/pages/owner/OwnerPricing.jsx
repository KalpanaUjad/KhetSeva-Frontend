import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { OwnerSidebar } from './OwnerDashboard'
import {
  getAllServices,
  updateServiceRate,
  toggleService
} from '../../api/serviceApi'
import {
  IconPlant2, IconCut, IconArrowsShuffle,
  IconDroplet, IconSettings2, IconRuler2,
  IconTruck, IconEdit, IconInfoCircle
} from '@tabler/icons-react'
import './OwnerPricing.css'

const iconMap = {
  'Sowing': <IconPlant2 size={20} color="#3B6D11" />,
  'Harvesting': <IconCut size={20} color="#3B6D11" />,
  'Ploughing': <IconArrowsShuffle size={20} color="#3B6D11" />,
  'Spraying': <IconDroplet size={20} color="#3B6D11" />,
  'Rotavator': <IconSettings2 size={20} color="#3B6D11" />,
  'Levelling': <IconRuler2 size={20} color="#3B6D11" />,
  'Transportation': <IconTruck size={20} color="#3B6D11" />,
}

const OwnerPricing = () => {
  const [services, setServices] = useState([])
  const [editing, setEditing] = useState({})
  const [newRates, setNewRates] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      setLoading(true)
      const res = await getAllServices()
      setServices(res.data)
      const rates = {}
      res.data.forEach(s => { rates[s.id] = s.rate })
      setNewRates(rates)
    } catch (err) {
      toast.error('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (id) => {
    try {
      await toggleService(id)
      toast.success('Service updated!')
      loadServices()
    } catch (err) {
      toast.error('Failed to update service')
    }
  }

  const handleSaveRate = async (id) => {
    try {
      await updateServiceRate(id, { rate: newRates[id] })
      toast.success('Rate updated successfully!')
      setEditing(prev => ({ ...prev, [id]: false }))
      loadServices()
    } catch (err) {
      toast.error('Failed to update rate')
    }
  }

  return (
    <div className="op-wrap">
      <OwnerSidebar active="/owner/pricing" />

      <div className="op-main">
        <div className="op-topbar">
          <h1>Services & Pricing</h1>
        </div>

        <div className="op-info">
          <IconInfoCircle size={16} color="#3B6D11" style={{ flexShrink: 0 }} />
          Changes you make here reflect immediately on the services page.
          Toggling a service off hides it from farmers.
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
            Loading services...
          </div>
        ) : (
          <div className="op-cards">
            {services.map(svc => (
              <div
                key={svc.id}
                className={`op-card ${editing[svc.id] ? 'editing' : ''}`}
              >
                {/* Top row */}
                <div className="op-card-top">
                  <div className="op-icon">
                    {iconMap[svc.name] || <IconSettings2 size={20} color="#3B6D11" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="op-svc-name">{svc.name}</div>
                    <div className="op-svc-desc">{svc.description}</div>
                  </div>
                  <div className="op-toggle">
                    <span
                      className="op-toggle-label"
                      style={{ color: svc.enabled ? '#3B6D11' : '#6c757d' }}
                    >
                      {svc.enabled ? 'Active' : 'Hidden'}
                    </span>
                    <button
                      className={`op-switch ${svc.enabled ? '' : 'off'}`}
                      onClick={() => handleToggle(svc.id)}
                    >
                      <div className="op-switch-dot" />
                    </button>
                  </div>
                </div>

                {/* Rate row */}
                {!editing[svc.id] ? (
                  <div className="op-rate-row">
                    <div>
                      <span className="op-current-rate">
                        ₹{svc.rate}
                      </span>
                      <span className="op-current-unit">
                        {' '}/ {svc.unit}
                      </span>
                    </div>
                    {svc.enabled && (
                      <button
                        className="op-edit-btn"
                        onClick={() => setEditing(prev => ({
                          ...prev, [svc.id]: true
                        }))}
                      >
                        <IconEdit size={13} /> Edit rate
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="op-edit-form">
                    <div className="op-edit-field">
                      <div className="op-edit-label">New rate per {svc.unit}</div>
                      <div className="op-edit-input-row">
                        <div className="op-edit-prefix">₹</div>
                        <input
                          className="op-edit-input"
                          type="number"
                          value={newRates[svc.id]}
                          onChange={e => setNewRates(prev => ({
                            ...prev,
                            [svc.id]: parseFloat(e.target.value)
                          }))}
                        />
                        <div className="op-edit-suffix">/{svc.unit}</div>
                      </div>
                    </div>
                    <button
                      className="op-save-btn"
                      onClick={() => handleSaveRate(svc.id)}
                    >
                      Save
                    </button>
                    <button
                      className="op-cancel-btn"
                      onClick={() => setEditing(prev => ({
                        ...prev, [svc.id]: false
                      }))}
                    >
                      Cancel
                    </button>
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

export default OwnerPricing