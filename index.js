const express = require('express');
const connectDB = require('./config/database');
const campaignRoutes = require('./routes/compainroute');
const { verifyCloudinaryConfig } = require('./config/cloudinary');
const userRoutes = require('./routes/userRoutes.js');
const categoryRoutes = require('./routes/categoryRoute');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Verify Cloudinary configuration on startup
verifyCloudinaryConfig();

// Connect to Database
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/category', categoryRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Something went wrong!',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});