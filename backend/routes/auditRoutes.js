const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');

// Get all audit logs
router.get('/get_logs', auditLogController.getLogs);

module.exports = router;
