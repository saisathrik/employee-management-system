import { useEffect, useState } from 'react'
import Header from '../others/Header'
import TaskListNumbers from '../others/TaskListNumbers'
import TaskList from '../TaskList/TaskList'

const EmployeeDashboard = ({ changeUser, data: initialData }) => {
  const [data, setData] = useState(initialData)

  useEffect(() => {
    if (initialData) setData(initialData)
  }, [initialData])

  if (!data) {
    return (
      <div className='p-10 bg-[#1C1C1C] h-screen text-white'>
        Loading...
      </div>
    )
  }

  return (
    <div className='p-10 bg-[#1C1C1C] h-screen'>
      <Header changeUser={changeUser} data={data} />
      <TaskListNumbers data={data} />
      <TaskList data={data} onTaskUpdated={setData} />
    </div>
  )
}

export default EmployeeDashboard
