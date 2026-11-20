import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { loginFarmer, registerFarmer } from '../../api/authApi'
import { IconTractor } from '@tabler/icons-react'
import './LoginPage.css'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Login form state
  const [loginData, setLoginData] = useState({
    mobile: '', password: ''
  })

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '', mobile: '', village: '', password: ''
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!loginData.mobile || !loginData.password) {
      setError('Please fill all fields')
      return
    }

    try {
      setLoading(true)
      const res = await loginFarmer(loginData)
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

      toast.success(`Welcome back, ${data.name}!`)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (!registerData.name || !registerData.mobile ||
        !registerData.village || !registerData.password) {
      setError('Please fill all fields')
      return
    }

    if (registerData.mobile.length !== 10) {
      setError('Mobile number must be 10 digits')
      return
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)
      const res = await registerFarmer(registerData)

      if (res.data.success) {
        toast.success('Registration successful! Please login.')
        setTab('login')
        setLoginData({ mobile: registerData.mobile, password: '' })
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-box">

        {/* Left panel */}
        <div className="login-left">
          <Link to="/" className="login-left-logo">
            Khet<span>Seva</span>
          </Link>
          <div>
            <h2>Book farm services in minutes</h2>
            <p style={{ marginTop: '0.5rem' }}>
              Register once, book anytime. Track every job,
              pay after completion.
            </p>
          </div>
          <div className="login-steps">
            {[
              { num: 1, bold: 'Register free', text: ' with your mobile number' },
              { num: 2, bold: 'Choose a service', text: ' and set your field size' },
              { num: 3, bold: 'Owner confirms', text: ' and comes to your field' },
              { num: 4, bold: 'Pay after', text: ' the job is done' },
            ].map((s, i) => (
              <div key={i} className="login-step">
                <div className="login-step-dot">{s.num}</div>
                <div className="login-step-text">
                  <strong>{s.bold}</strong>{s.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="login-right">

          {/* Tabs */}
          <div className="login-tabs">
            <button
              className={`login-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => { setTab('login'); setError('') }}
            >Login</button>
            <button
              className={`login-tab ${tab === 'register' ? 'active' : ''}`}
              onClick={() => { setTab('register'); setError('') }}
            >Register</button>
          </div>

          {/* Error */}
          {error && <div className="login-error">{error}</div>}

          {/* Login form */}
          {tab === 'login' && (
            <form className="login-form" onSubmit={handleLogin}>
              <div className="login-field">
                <label className="login-label">Mobile number</label>
                <input
                  className="login-input"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={loginData.mobile}
                  onChange={e => setLoginData({
                    ...loginData, mobile: e.target.value
                  })}
                />
              </div>
              <div className="login-field">
                <label className="login-label">Password</label>
                <input
                  className="login-input"
                  type="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={e => setLoginData({
                    ...loginData, password: e.target.value
                  })}
                />
              </div>
              <button
                className="login-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login to KhetSeva'}
              </button>
              <div className="login-switch">
                Don't have an account?{' '}
                <a onClick={() => { setTab('register'); setError('') }}>
                  Register free
                </a>
              </div>
            </form>
          )}

          {/* Register form */}
          {tab === 'register' && (
            <form className="login-form" onSubmit={handleRegister}>
              <div className="login-row">
                <div className="login-field">
                  <label className="login-label">First name</label>
                  <input
                    className="login-input"
                    type="text"
                    placeholder="Ramesh"
                    value={registerData.name.split(' ')[0]}
                    onChange={e => setRegisterData({
                      ...registerData,
                      name: e.target.value + ' ' + (registerData.name.split(' ')[1] || '')
                    })}
                  />
                </div>
                <div className="login-field">
                  <label className="login-label">Last name</label>
                  <input
                    className="login-input"
                    type="text"
                    placeholder="Shinde"
                    value={registerData.name.split(' ')[1] || ''}
                    onChange={e => setRegisterData({
                      ...registerData,
                      name: (registerData.name.split(' ')[0] || '') + ' ' + e.target.value
                    })}
                  />
                </div>
              </div>
              <div className="login-field">
                <label className="login-label">Mobile number</label>
                <input
                  className="login-input"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={registerData.mobile}
                  onChange={e => setRegisterData({
                    ...registerData, mobile: e.target.value
                  })}
                />
              </div>
              <div className="login-field">
                <label className="login-label">Village / town</label>
                <input
                  className="login-input"
                  type="text"
                  placeholder="Baramati, Pune"
                  value={registerData.village}
                  onChange={e => setRegisterData({
                    ...registerData, village: e.target.value
                  })}
                />
              </div>
              <div className="login-field">
                <label className="login-label">Password</label>
                <input
                  className="login-input"
                  type="password"
                  placeholder="Create a password (min 6 characters)"
                  value={registerData.password}
                  onChange={e => setRegisterData({
                    ...registerData, password: e.target.value
                  })}
                />
              </div>
              <button
                className="login-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create free account'}
              </button>
              <div className="login-switch">
                Already registered?{' '}
                <a onClick={() => { setTab('login'); setError('') }}>
                  Login here
                </a>
              </div>
            </form>
          )}

          {/* Owner link */}
          <div className="login-owner-link">
            Tractor owner?{' '}
            <Link to="/owner/login">
              <IconTractor size={14} /> Owner login
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default LoginPage