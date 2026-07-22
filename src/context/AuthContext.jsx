import { createContext, useCallback, useEffect, useState } from 'react'
import api from '../services/api'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    employees: [],
    admin: [],
  })
  const [loading, setLoading] = useState(true)

  const refreshEmployees = useCallback(async () => {
    const token = localStorage.getItem('token')
    const loggedInUser = localStorage.getItem('loggedInUser')

    if (!token || !loggedInUser) {
      setUserData({ employees: [], admin: [] })
      setLoading(false)
      return
    }

    const { role } = JSON.parse(loggedInUser)

    try {
      if (role === 'admin') {
        const { data } = await api.get('/tasks/all')
        setUserData({ employees: data.employees || [], admin: [] })
      } else {
        const { data } = await api.get('/auth/profile')
        setUserData({ employees: [data.user], admin: [] })
      }
    } catch {
      setUserData({ employees: [], admin: [] })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshEmployees()
  }, [refreshEmployees])

  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        refreshEmployees,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
