import express from 'express'
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController.js'
import { protect } from '../middleware/authMiddleware.js'
import { adminOnly } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/', protect, adminOnly, getEmployees)
router.get('/:id', protect, adminOnly, getEmployeeById)
router.post('/', protect, adminOnly, createEmployee)
router.put('/:id', protect, adminOnly, updateEmployee)
router.delete('/:id', protect, adminOnly, deleteEmployee)

export default router
