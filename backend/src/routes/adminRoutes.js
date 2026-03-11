const express = require('express');
const router = express.Router();
const { getAdminProfile, updateAdminProfile } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/me',  getAdminProfile);
router.put('/me',  updateAdminProfile);

module.exports = router;
