import { useContext, useEffect, useState } from 'react'
import Login from './components/Auth/Login'
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard'
import AdminDashboard from './components/Dashboard/AdminDashboard'
import { AuthContext } from './context/AuthContext'

const App = () => {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const { userData, refreshEmployees, loading } = useContext(AuthContext)

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser')
    const token = localStorage.getItem('token')

    if (loggedInUser && token) {
      setUser(JSON.parse(loggedInUser).role)
    }

    setAuthLoading(false)
  }, [])

  const handleLoginSuccess = async (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem(
      'loggedInUser',
      JSON.stringify({
        role: data.user.role,
        email: data.user.email,
      })
    )

    if (data.user.role === 'employee') {
      localStorage.setItem('employeeData', JSON.stringify(data.user))
    }

    setUser(data.user.role)
    await refreshEmployees()
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('loggedInUser')
    localStorage.removeItem('employeeData')
    setUser(null)
  }

  const employeeData =
    user === 'employee'
      ? userData.employees?.find(
          (emp) => emp.email === JSON.parse(localStorage.getItem('loggedInUser') || '{}').email
        ) || JSON.parse(localStorage.getItem('employeeData') || 'null')
      : null

  if (authLoading || loading) {
    return (
      <div className='flex items-center justify-center h-screen bg-[#1C1C1C] text-white'>
        Loading...
      </div>
    )
  }

  return (
    <>
      {!user && <Login onLoginSuccess={handleLoginSuccess} />}

      {user === 'admin' && <AdminDashboard changeUser={handleLogout} />}

      {user === 'employee' && (
        <EmployeeDashboard changeUser={handleLogout} data={employeeData} />
      )}
    </>
  )
}

export default App
