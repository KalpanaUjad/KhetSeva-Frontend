import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { logoutUser } from '../../api/authApi'
import toast from 'react-hot-toast'
import { IconTractor } from '@tabler/icons-react'

const Navbar = () => {
  const { isLoggedIn, isUser, isOwner, logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (err) {
      // ignore error — logout locally anyway
    }
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      background: 'white',
      borderBottom: '0.5px solid #dee2e6',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>

      {/* Logo */}
      <Link to="/" style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: '22px',
        fontWeight: '900',
        color: '#27500A',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <IconTractor size={24} color="#639922" />
        Khet<span style={{ color: '#639922' }}>Seva</span>
      </Link>

      {/* Nav links */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
      }}>
        <Link to="/" style={{
          fontSize: '14px',
          color: '#6c757d',
          textDecoration: 'none',
        }}>Home</Link>

        <Link to="/services" style={{
          fontSize: '14px',
          color: '#6c757d',
          textDecoration: 'none',
        }}>Services</Link>

        <Link to="/about" style={{
          fontSize: '14px',
          color: '#6c757d',
          textDecoration: 'none',
        }}>About</Link>

        {/* Not logged in */}
        {!isLoggedIn() && <>
          <Link to="/login">
            <button className="btn-ks-outline">Login</button>
          </Link>
          <Link to="/login">
            <button className="btn-ks-primary">Register</button>
          </Link>
        </>}

        {/* Logged in as farmer */}
        {isLoggedIn() && isUser() && <>
          <Link to="/dashboard" style={{
            fontSize: '14px',
            color: '#6c757d',
            textDecoration: 'none',
          }}>My Bookings</Link>
          <span style={{
            fontSize: '14px',
            color: '#3B6D11',
            fontWeight: '500',
          }}>Hi, {user?.name?.split(' ')[0]}</span>
          <button
            className="btn-ks-outline"
            onClick={handleLogout}>
            Logout
          </button>
        </>}

        {/* Logged in as owner */}
        {isLoggedIn() && isOwner() && <>
          <Link to="/owner/dashboard" style={{
            fontSize: '14px',
            color: '#6c757d',
            textDecoration: 'none',
          }}>Dashboard</Link>
          <span style={{
            fontSize: '14px',
            color: '#3B6D11',
            fontWeight: '500',
          }}>Hi, {user?.name?.split(' ')[0]}</span>
          <button
            className="btn-ks-outline"
            onClick={handleLogout}>
            Logout
          </button>
        </>}

      </div>
    </nav>
  )
}

export default Navbar