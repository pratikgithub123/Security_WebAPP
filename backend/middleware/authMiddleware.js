// middleware/auditMiddleware.js
const Audit = require('../models/Audit');

const logAudit = async (userId, action, details) => {
  try {
    await Audit.create({
      userId,
      action,
      details
    });
  } catch (error) {
    console.error('Failed to log audit:', error);
  }
};
const AuditLog = require('./models/AuditLog');

const logActivity = async (req, res, next) => {
  try {
    if (req.user) {
      const { userId } = req.user;
      const action = `${req.method} ${req.originalUrl}`;
      const details = JSON.stringify(req.body) || 'No details';

      await AuditLog.create({
        userId,
        action,
        details
      });

      console.log('Audit log entry created:', { userId, action, details });
    }
  } catch (error) {
    console.error('Error logging activity:', error);
  }
  next();
};

module.exports = logActivity;

module.exports = logAudit;
