const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { analyzeComplaint } = require('../lib/geminiAgent');
const multer = require('multer');
const path = require('path');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});

const upload = multer({ storage: storage });

// Get all complaints (Feed)
router.get('/', async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ date: -1 });
        res.json(complaints);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create Complaint (with Image Upload)
router.post('/', upload.single('image'), async (req, res) => {
    const { title, description, location, userId } = req.body;
    let imageUrl = '';

    if (req.file) {
        // Construct full URL (assuming server runs on localhost:5000)
        // In production, use env var for BASE_URL
        imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    try {
        // AI Analysis
        // TODO: Ideally pass image to Gemini Vision if available, for now just text
        const analysis = await analyzeComplaint(title, description);

        const newComplaint = new Complaint({
            user: userId !== 'null' ? userId : null, // Handle 'null' string from FormData
            title,
            description,
            location,
            imageUrl,
            category: analysis.category,
            priority: analysis.priority,
            department: analysis.department,
            isEmergency: analysis.isEmergency,
            aiAnalysis: analysis
        });

        const complaint = await newComplaint.save();
        res.json(complaint);

        if (complaint.isEmergency) {
            console.log("🚨 EMERGENCY TRIGGERED: " + complaint.title);
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update Complaint Status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ msg: 'Complaint not found' });
        }

        complaint.status = status;
        await complaint.save();

        // Mock Notification
        console.log(`🔔 Notification Sent to User ${complaint.user}: Status updated to ${status}`);

        res.json(complaint);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Upvote Complaint
router.post('/upvote/:id', async (req, res) => {
    try {
        const { userId } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ msg: 'Complaint not found' });
        }

        // Check if user already upvoted
        if (complaint.upvotes.includes(userId)) {
            // Optional: Toggle upvote (remove if already upvoted)
            complaint.upvotes = complaint.upvotes.filter(id => id.toString() !== userId);
        } else {
            complaint.upvotes.push(userId);
        }

        await complaint.save();
        res.json(complaint);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
