import AcceptTask from './AcceptTask'
import NewTask from './NewTask'
import CompleteTask from './CompleteTask'
import FailedTask from './FailedTask'

const TaskList = ({ data, onTaskUpdated }) => {
  return (
    <div
      id='tasklist'
      className='h-[55%] overflow-x-auto flex items-center justify-start gap-5 flex-nowrap w-full py-5 mt-10'
    >
      {data?.tasks?.map((task) => {
        const key = task._id || task.taskTitle

        if (task.active) {
          return (
            <AcceptTask
              key={key}
              data={task}
              onTaskUpdated={onTaskUpdated}
            />
          )
        }

        if (task.newTask) {
          return (
            <NewTask
              key={key}
              data={task}
              employeeData={data}
              onTaskUpdated={onTaskUpdated}
            />
          )
        }

        if (task.completed) {
          return <CompleteTask key={key} data={task} />
        }

        if (task.failed) {
          return <FailedTask key={key} data={task} />
        }

        return null
      })}
    </div>
  )
}

export default TaskList
