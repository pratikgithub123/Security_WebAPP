const mongoose = require('mongoose');

const auditTrailSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: { type: String }, // Added field
    fullname: { type: String }, // Added field
    actionType: { type: String, required: true },
    details: { type: String, required: true },
    ipAddress: { type: String } // Optional
});

const AuditTrail = mongoose.model('AuditTrail', auditTrailSchema);

module.exports = AuditTrail;
