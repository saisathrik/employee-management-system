import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import api from '../../services/api'

const ManageEmployees = () => {
  const { refreshEmployees } = useContext(AuthContext)

  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadEmployees = async () => {
    try {
      const { data } = await api.get('/employees')
      setEmployees(data.employees || [])
    } catch (error) {
      console.error(error.response?.data?.message || 'Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  const submitHandler = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await api.post('/employees', { name, email, password })
      setName('')
      setEmail('')
      setPassword('')
      await loadEmployees()
      await refreshEmployees()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add employee')
    } finally {
      setSubmitting(false)
    }
  }

  const deleteHandler = async (id) => {
    if (!confirm('Remove this employee and all their tasks?')) return

    try {
      await api.delete(`/employees/${id}`)
      await loadEmployees()
      await refreshEmployees()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete employee')
    }
  }

  return (
    <div className='p-5 bg-[#1c1c1c] mt-7 rounded'>
      <h2 className='text-lg font-medium mb-4'>Manage Employees</h2>

      <form onSubmit={submitHandler} className='flex flex-wrap gap-3 items-end mb-5'>
        <div>
          <h3 className='text-sm text-gray-300 mb-0.5'>Name</h3>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='text-sm py-1 px-2 rounded outline-none bg-transparent border border-gray-400'
            type='text'
            placeholder='Employee name'
          />
        </div>

        <div>
          <h3 className='text-sm text-gray-300 mb-0.5'>Email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='text-sm py-1 px-2 rounded outline-none bg-transparent border border-gray-400'
            type='email'
            placeholder='employee@example.com'
          />
        </div>

        <div>
          <h3 className='text-sm text-gray-300 mb-0.5'>Password</h3>
          <input
            required
            minLength={3}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='text-sm py-1 px-2 rounded outline-none bg-transparent border border-gray-400'
            type='password'
            placeholder='Temporary password'
          />
        </div>

        <button
          type='submit'
          disabled={submitting}
          className='bg-emerald-500 py-2 hover:bg-emerald-600 px-5 rounded text-sm disabled:opacity-50'
        >
          {submitting ? 'Adding...' : 'Add Employee'}
        </button>
      </form>

      {loading ? (
        <p className='text-sm text-gray-400'>Loading employees...</p>
      ) : employees.length === 0 ? (
        <p className='text-sm text-gray-400'>
          No employees yet. Add one above to start assigning tasks.
        </p>
      ) : (
        <div className='overflow-auto'>
          {employees.map((emp) => (
            <div
              key={emp._id}
              className='border-2 border-emerald-500 mb-2 py-2 px-4 flex justify-between items-center rounded'
            >
              <div>
                <p className='font-medium'>{emp.name}</p>
                <p className='text-sm text-gray-400'>{emp.email}</p>
              </div>
              <button
                onClick={() => deleteHandler(emp._id)}
                className='bg-red-600 hover:bg-red-700 text-sm px-3 py-1 rounded'
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageEmployees
