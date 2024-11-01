const express = require('express');
const connectDB = require('./config/database');
const campaignRoutes = require('./routes/compainroute');
const { verifyCloudinaryConfig } = require('./config/cloudinary');
const userRoutes = require('./routes/userRoutes.js');
const categoryRoutes = require('./routes/categoryRoute');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Verify Cloudinary configuration on startup
verifyCloudinaryConfig();

// Connect to Database
connectDB();

const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  
  app.use(cors(corsOptions));

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
app.get("/",(req,res)=>{
res.json({message:'Hello Bhi kese Ho'})
})
// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});