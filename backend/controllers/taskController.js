import Employee from '../models/Employee.js'
import Task from '../models/Task.js'
import { computeTaskNumbers } from './authController.js'

const formatEmployeeWithTasks = async (employee) => {
  const tasks = await Task.find({ employee: employee._id }).sort({ createdAt: -1 })

  return {
    id: employee._id,
    name: employee.name,
    email: employee.email,
    role: employee.role,
    tasks,
    taskNumbers: computeTaskNumbers(tasks),
  }
}

export const getAllEmployeesWithTasks = async (req, res) => {
  try {
    const employees = await Employee.find({ role: 'employee' }).select('-password')
    const formatted = await Promise.all(employees.map(formatEmployeeWithTasks))

    res.json({ employees: formatted })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getEmployeeTasks = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.id).select('-password')
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' })
    }

    const data = await formatEmployeeWithTasks(employee)
    res.json({ employee: data })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createTask = async (req, res) => {
  try {
    const { taskTitle, taskDescription, taskDate, category, assignTo } = req.body

    if (!taskTitle || !taskDescription || !taskDate || !category || !assignTo) {
      return res.status(400).json({ message: 'All task fields are required' })
    }

    const employee = await Employee.findOne({
      name: { $regex: new RegExp(`^${assignTo.trim()}$`, 'i') },
      role: 'employee',
    })

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' })
    }

    const task = await Task.create({
      employee: employee._id,
      taskTitle,
      taskDescription,
      taskDate,
      category,
      active: false,
      newTask: true,
      completed: false,
      failed: false,
    })

    res.status(201).json({
      message: 'Task assigned successfully',
      task,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const acceptTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (task.employee.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' })
    }

    task.newTask = false
    task.active = true
    task.completed = false
    task.failed = false
    await task.save()

    const employee = await Employee.findById(req.user.id).select('-password')
    const data = await formatEmployeeWithTasks(employee)

    res.json({ message: 'Task accepted', employee: data })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body

    if (!['completed', 'failed'].includes(status)) {
      return res.status(400).json({ message: 'Status must be completed or failed' })
    }

    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (task.employee.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' })
    }

    task.active = false
    task.newTask = false
    task.completed = status === 'completed'
    task.failed = status === 'failed'
    await task.save()

    const employee = await Employee.findById(req.user.id).select('-password')
    const data = await formatEmployeeWithTasks(employee)

    res.json({ message: `Task marked as ${status}`, employee: data })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
