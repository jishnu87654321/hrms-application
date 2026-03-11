const express = require('express');
const router = express.Router();
const multer = require('multer');
const { bulkUploadEmployees, bulkUploadJson, getUploadLogs, downloadTemplate } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' });

router.use(protect);

router.post('/bulk', upload.single('file'), bulkUploadEmployees);
router.post('/json', express.json({ limit: '50mb' }), bulkUploadJson);
router.get('/logs', getUploadLogs);
router.get('/template', downloadTemplate);

module.exports = router;
