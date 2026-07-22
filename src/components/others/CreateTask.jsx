import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import api from '../../services/api'

const CreateTask = () => {
  const { refreshEmployees } = useContext(AuthContext)

  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskDate, setTaskDate] = useState('')
  const [assignTo, setAssignTo] = useState('')
  const [category, setCategory] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submitHandler = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await api.post('/tasks', {
        taskTitle,
        taskDescription,
        taskDate,
        category,
        assignTo,
      })

      await refreshEmployees()
      alert('Task assigned successfully')

      setTaskTitle('')
      setTaskDescription('')
      setTaskDate('')
      setAssignTo('')
      setCategory('')
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create task')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='p-5 bg-[#1c1c1c] mt-7 rounded'>
      <form
        onSubmit={submitHandler}
        className='flex flex-wrap w-full items-start justify-between'
      >
        <div className='w-1/2'>
          <div>
            <h3 className='text-sm text-gray-300 mb-0.5'>Task Title</h3>
            <input
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className='text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border border-gray-400 mb-4'
              type='text'
              placeholder='Make a UI design'
            />
          </div>

          <div>
            <h3 className='text-sm text-gray-300 mb-0.5'>Date</h3>
            <input
              required
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              className='text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border border-gray-400 mb-4'
              type='date'
            />
          </div>

          <div>
            <h3 className='text-sm text-gray-300 mb-0.5'>Assign To</h3>
            <input
              required
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              className='text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border border-gray-400 mb-4'
              type='text'
              placeholder='Employee name'
            />
          </div>

          <div>
            <h3 className='text-sm text-gray-300 mb-0.5'>Category</h3>
            <input
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border border-gray-400 mb-4'
              type='text'
              placeholder='Design, Development, Testing'
            />
          </div>
        </div>

        <div className='w-2/5 flex flex-col items-start'>
          <h3 className='text-sm text-gray-300 mb-0.5'>Description</h3>
          <textarea
            required
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className='w-full h-44 text-sm py-2 px-4 rounded outline-none bg-transparent border border-gray-400'
          />

          <button
            type='submit'
            disabled={submitting}
            className='bg-emerald-500 py-3 hover:bg-emerald-600 px-5 rounded text-sm mt-4 w-full disabled:opacity-50'
          >
            {submitting ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateTask
