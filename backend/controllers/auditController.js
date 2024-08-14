const ActivityLog = require('../model/activityLogModel');

const logActivity = async (userId, action, details) => {
    try {
        await ActivityLog.create({ userId, action, details });
    } catch (error) {
        console.error('Failed to log activity:', error);
    }
};

module.exports = { logActivity };
