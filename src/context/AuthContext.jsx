import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('ksToken')
    const savedUser = localStorage.getItem('ksUser')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
    localStorage.setItem('ksToken', jwtToken)
    localStorage.setItem('ksUser', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('ksToken')
    localStorage.removeItem('ksUser')
  }

  const isOwner = () => user?.role === 'ROLE_OWNER'
  const isUser = () => user?.role === 'ROLE_USER'
  const isLoggedIn = () => !!token

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, logout,
      isOwner, isUser, isLoggedIn
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
