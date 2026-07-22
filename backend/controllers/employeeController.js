import Employee from '../models/Employee.js'
import Task from '../models/Task.js'

// @desc    Get all employees (admin management list)
// @route   GET /api/employees
// @access  Admin
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ role: 'employee' })
      .select('-password')
      .sort({ createdAt: -1 })

    res.json({ employees })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get a single employee by id
// @route   GET /api/employees/:id
// @access  Admin
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select('-password')

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' })
    }

    res.json({ employee })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Create a new employee
// @route   POST /api/employees
// @access  Admin
export const createEmployee = async (req, res) => {
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
      message: 'Employee created successfully',
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update an employee's details
// @route   PUT /api/employees/:id
// @access  Admin
export const updateEmployee = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    const employee = await Employee.findById(req.params.id)

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' })
    }

    if (name) employee.name = name
    if (email) employee.email = email
    if (role) employee.role = role === 'admin' ? 'admin' : 'employee'
    if (password) employee.password = password // re-hashed automatically by the model's pre-save hook

    const updated = await employee.save()

    res.json({
      message: 'Employee updated successfully',
      employee: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Delete an employee and their tasks
// @route   DELETE /api/employees/:id
// @access  Admin
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' })
    }

    await Task.deleteMany({ employee: employee._id })
    await employee.deleteOne()

    res.json({ message: 'Employee deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
