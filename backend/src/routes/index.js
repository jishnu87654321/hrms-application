const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const employeeRoutes = require('./employeeRoutes');
const uploadRoutes = require('./uploadRoutes');
const adminRoutes = require('./adminRoutes');
const { getStats, getAuditLogs, getDepartments } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/upload', uploadRoutes);
router.use('/admin', adminRoutes);

// Dashboard & Misc
router.get('/stats', protect, getStats);
router.get('/audit-logs', protect, getAuditLogs);
router.get('/departments', getDepartments);

module.exports = router;
