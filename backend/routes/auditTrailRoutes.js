const express = require('express');
const router = express.Router();
const { getAuditLogs } = require('../controllers/auditTrailController');

router.get('/', getAuditLogs);

module.exports = router;
