const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({origin:"https://civicfix-1-ob7h.onrender.com"}));
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded images

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/civicfix', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/complaints', require('./routes/complaints'));

app.get('/', (req, res) => {
    res.send('CivicFix API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
