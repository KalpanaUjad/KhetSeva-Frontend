import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import {
  IconClipboardList, IconReceipt,
  IconUser, IconHelp, IconPlus
} from '@tabler/icons-react'

const ProfilePage = () => {
  const { user, logout } = useAuth()

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
        <Link to="/bills" className="ks-sidebar-item"><IconReceipt size={17} /> Bills & receipts</Link>
        <Link to="/profile" className="ks-sidebar-item active"><IconUser size={17} /> My profile</Link>
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
          My Profile
        </h1>

        <div style={{ background: 'white', border: '0.5px solid #dee2e6', borderRadius: '12px', padding: '1.5rem', maxWidth: '480px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.5rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#EAF3DE', color: '#3B6D11', fontSize: '20px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '500', color: '#173404' }}>{user?.name}</div>
              <div style={{ fontSize: '13px', color: '#639922', marginTop: '2px' }}>Registered farmer</div>
            </div>
          </div>

          {[
            { label: 'Full name', value: user?.name },
            { label: 'Role', value: 'Farmer' },
            { label: 'Account ID', value: `USR-${String(user?.userId).padStart(4, '0')}` },
          ].map((item, i) => (
            <div key={i} style={{ padding: '12px 0', borderBottom: '0.5px solid #dee2e6' }}>
              <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '3px' }}>{item.label}</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#212529' }}>{item.value}</div>
            </div>
          ))}

          <div style={{ marginTop: '1.5rem', padding: '12px', background: '#EAF3DE', borderRadius: '8px', fontSize: '13px', color: '#27500A' }}>
            To update your mobile number or village, please contact KhetSeva support.
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage