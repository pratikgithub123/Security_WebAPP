// controllers/auditLogController.js
const AuditLog = require('../model/auditLogModel'); // Adjust path as needed

exports.getLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audit logs' });
  }
};
