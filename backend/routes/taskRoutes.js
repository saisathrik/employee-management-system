import express from 'express'
import {
  getAllEmployeesWithTasks,
  getEmployeeTasks,
  createTask,
  acceptTask,
  updateTaskStatus,
} from '../controllers/taskController.js'
import { protect } from '../middleware/authMiddleware.js'
import { adminOnly } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/all', protect, adminOnly, getAllEmployeesWithTasks)
router.get('/employee', protect, getEmployeeTasks)
router.post('/', protect, adminOnly, createTask)
router.patch('/:id/accept', protect, acceptTask)
router.patch('/:id/status', protect, updateTaskStatus)

export default router
