import jwt from 'jsonwebtoken'
import Employee from '../models/Employee.js'
import Task from '../models/Task.js'

export const computeTaskNumbers = (tasks) => ({
  newTask: tasks.filter((t) => t.newTask).length,
  active: tasks.filter((t) => t.active).length,
  completed: tasks.filter((t) => t.completed).length,
  failed: tasks.filter((t) => t.failed).length,
})

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' })

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }

    const existing = await Employee.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(409).json({ message: 'Employee already exists with this email' })
    }

    const employee = await Employee.create({
      name,
      email,
      password,
      role: role === 'admin' ? 'admin' : 'employee',
    })

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
      },
      token: generateToken(employee._id, employee.role),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const employee = await Employee.findOne({ email: email.toLowerCase() })
    if (!employee || !(await employee.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    let userPayload = {
      id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
    }

    if (employee.role === 'employee') {
      const tasks = await Task.find({ employee: employee._id }).sort({ createdAt: -1 })
      userPayload = {
        ...userPayload,
        tasks,
        taskNumbers: computeTaskNumbers(tasks),
      }
    }

    res.json({
      message: 'Login successful',
      user: userPayload,
      token: generateToken(employee._id, employee.role),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.id).select('-password')
    if (!employee) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (employee.role === 'admin') {
      return res.json({ user: employee })
    }

    const tasks = await Task.find({ employee: employee._id }).sort({ createdAt: -1 })

    res.json({
      user: {
        ...employee.toObject(),
        tasks,
        taskNumbers: computeTaskNumbers(tasks),
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
