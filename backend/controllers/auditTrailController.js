const mongoose = require('mongoose');
const AuditTrail = require('../model/auditTrailModel');
const User = require('../model/userModel'); // Import the User model

const getAuditLogs = async (req, res) => {
    const { userId, actionType, startDate, endDate } = req.query;

    try {
        const query = {};
        if (userId) query.userId = userId;
        if (actionType) query.actionType = actionType;
        if (startDate && endDate) query.timestamp = { $gte: new Date(startDate), $lte: new Date(endDate) };

        const auditLogs = await AuditTrail.find(query).sort({ timestamp: -1 });

        res.status(200).json({
            success: true,
            auditLogs
        });
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


const logAuditTrail = async (userId, actionType, details, ipAddress) => {
    try {
        // Fetch user details
        const user = await User.findById(userId).select('email fullname'); // Fetch email and fullname

        // Create a new audit trail entry
        await new AuditTrail({
            userId,
            email: user ? user.email : 'Unknown', // Default to 'Unknown' if user is not found
            fullname: user ? user.fullname : 'Unknown', // Default to 'Unknown' if user is not found
            actionType,
            details,
            ipAddress
        }).save();
    } catch (error) {
        console.error('Error logging audit trail:', error);
    }
};

module.exports = {
    getAuditLogs,
    logAuditTrail
};
