import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  IconClipboardList, IconReceipt,
  IconUser, IconHelp, IconPlus,
  IconPhone, IconMail, IconClock,
  IconChevronDown
} from '@tabler/icons-react'
import { useState } from 'react'

const faqs = [
  { q: 'How do I book a service?', a: 'Go to the Services page, select the service you need, set quantity, pick a date and enter your field address. Submit the booking request — the owner will confirm it shortly.' },
  { q: 'When do I pay?', a: 'You pay after the job is completed. A 10% advance is noted at booking time, and the balance is paid after the owner marks the job as done.' },
  { q: 'Can I cancel a booking?', a: 'Yes. You can cancel a PENDING or CONFIRMED booking from your dashboard. Once the job is ACTIVE or COMPLETED, cancellation is not allowed.' },
  { q: 'How long does approval take?', a: 'The owner usually approves within a few hours. You will see the status change from Pending to Confirmed in your dashboard.' },
  { q: 'How do I download my receipt?', a: 'Go to Bills & Receipts from the sidebar. Click Download Receipt next to any completed booking.' },
  { q: 'What if the owner rejects my booking?', a: 'The booking status will change to Cancelled with a reason. You can submit a new booking for a different date.' },
]

const HelpPage = () => {
  const { user, logout } = useAuth()
  const [openFaq, setOpenFaq] = useState(null)

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
        <Link to="/profile" className="ks-sidebar-item"><IconUser size={17} /> My profile</Link>
        <Link to="/help" className="ks-sidebar-item active"><IconHelp size={17} /> Help</Link>
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
          Help & Support
        </h1>

        {/* Contact cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
          {[
            { icon: <IconPhone size={20} color="#3B6D11" />, label: 'Call us', value: '+91 98765 00001' },
            { icon: <IconMail size={20} color="#3B6D11" />, label: 'Email us', value: 'support@khetseva.in' },
            { icon: <IconClock size={20} color="#3B6D11" />, label: 'Working hours', value: 'Mon–Sat, 6 AM – 7 PM' },
          ].map((c, i) => (
            <div key={i} style={{ background: 'white', border: '0.5px solid #dee2e6', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#EAF3DE', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {c.icon}
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '2px' }}>{c.label}</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#212529' }}>{c.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#173404', marginBottom: '1rem' }}>
          Frequently asked questions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: 'white', border: '0.5px solid #dee2e6', borderRadius: '10px', overflow: 'hidden' }}>
              <div
                style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {faq.q}
                <IconChevronDown size={16} color="#6c757d" style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
              {openFaq === i && (
                <div style={{ padding: '0 16px 14px', fontSize: '13px', color: '#6c757d', lineHeight: '1.6', borderTop: '0.5px solid #dee2e6' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HelpPage