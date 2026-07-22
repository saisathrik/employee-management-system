import { useState } from 'react'
import api from '../../services/api'

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data } = await api.post('/auth/login', { email, password })
      onLoginSuccess(data)
      setEmail('')
      setPassword('')
    } catch (error) {
      alert(error.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <div className='border-2 rounded-xl border-emerald-600 p-20'>
        <form onSubmit={submitHandler} className='flex flex-col items-center justify-center'>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='border-2 border-emerald-600 py-3 px-5 text-xl text-white rounded-full outline-none placeholder:text-gray-400'
            type='email'
            placeholder='Enter your email'
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='border-2 border-emerald-600 py-3 px-5 text-xl text-white rounded-full outline-none placeholder:text-gray-400 mt-3'
            type='password'
            placeholder='Enter password'
          />
          <button
            disabled={loading}
            className='mt-5 border-none bg-emerald-600 py-3 px-5 text-xl text-white rounded-full outline-none disabled:opacity-50'
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
