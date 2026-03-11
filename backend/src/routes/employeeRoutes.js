const express = require('express');
const router = express.Router();
const { 
  getAllEmployees, 
  getEmployeeById, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee,
  getDeletedEmployees,
  restoreEmployee
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All employee routes are protected

router.get('/', getAllEmployees);
router.get('/trash', getDeletedEmployees);
router.get('/:id', getEmployeeById);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);
router.post('/:id/restore', restoreEmployee);

module.exports = router;
