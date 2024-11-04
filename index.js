const express = require('express');
const connectDB = require('./config/database');
const campaignRoutes = require('./routes/compainroute');
const { verifyCloudinaryConfig } = require('./config/cloudinary');
const userRoutes = require('./routes/userRoutes.js');
const categoryRoutes = require('./routes/categoryRoute');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
    origin: '*', // Allow all origins (or specify your frontend URL)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true
}));
// Define allowed origins - make sure to include all your production and development URLs


// CORS configuration



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

// Welcome route
app.get("/", (req, res) => {
    res.json({ message: 'Hello Bhi kese Ho' });
});



// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});