const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String, // Electricity, Water, Road, etc.
        default: 'General'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Emergency'],
        default: 'Low'
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
        default: 'Pending'
    },
    location: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    aiAnalysis: {
        type: Object // Store raw AI response
    },
    department: {
        type: String,
        default: 'Unassigned'
    },
    isEmergency: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
