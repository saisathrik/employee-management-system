import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const AllTask = () => {
    const {userData}=useContext(AuthContext)
  return (
    <div className='bg-[#1c1c1c] p-5 rounded mt-5' >
        <div className='bg-red-400 mb-2 py-2 px-4 flex justify-between rounded'>
            <h2 className='w-1/5 text-lg font-medium '>Employee Name</h2>
            <h3 className='w-1/5 text-lg font-medium '>New Task</h3>
            <h5 className='w-1/5 text-lg font-medium'>Active Task</h5>
            <h5 className='w-1/5 text-lg font-medium'>Completed</h5>
            <h5 className='w-1/5 text-lg font-medium'>Failed</h5>
        </div>
   <div className=' overflow-auto'>
     {userData.employees?.length === 0 && (
       <p className='text-sm text-gray-400 py-2'>No employees yet — add one above.</p>
     )}
     {userData.employees?.map(function(elem,idx){
            return<div key={idx} className='border-2 border-emerald-500 mb-2 py-2 px-4 flex justify-between rounded'>

            <h2 className='w-1/5 text-lg font-medium '>{elem.name}</h2>
            <h3 className='w-1/5 text-lg font-medium text-blue-400'>{elem.taskNumbers.newTask}</h3>
            <h5 className='w-1/5 text-lg font-medium text-yellow-400'>{elem.taskNumbers.active}</h5>
            <h5 className='w-1/5 text-lg font-medium text-green-400'>{elem.taskNumbers.completed}</h5>
            <h5 className='w-1/5 text-lg font-medium text-red-400'>{elem.taskNumbers.failed}</h5>
        </div>
        })}
    </div>
    </div>
  )
}

export default AllTask
