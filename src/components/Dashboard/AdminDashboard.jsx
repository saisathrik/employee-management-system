import Header from '../others/Header'
import ManageEmployees from '../others/ManageEmployees'
import CreateTask from '../others/CreateTask'
import AllTask from '../others/AllTask'

const AdminDashboard = (props) => {
  return (
    <div className='h-screen w-full p-7 overflow-auto'>
        <Header changeUser={props.changeUser}/>
        <ManageEmployees/>
        <CreateTask/>
        <AllTask/>
    </div>
  )
}

export default AdminDashboard
