// middleware/auditLogger.js
const AuditLog = require('..\/model/auditLogModell');

const auditLogger = async (req, res, next) => {
  if (req.user) {
    await AuditLog.create({
      userId: req.user._id,
      action: `${req.method} ${req.originalUrl}`,
      details: JSON.stringify(req.body) // Customize as needed
    });
  }
  next();
};

module.exports = auditLogger;
