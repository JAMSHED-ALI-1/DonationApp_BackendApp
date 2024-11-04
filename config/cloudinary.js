const cloudinary = require('cloudinary').v2;

// Ensure dotenv is loaded in the main server file, or require here as a backup
require('dotenv').config();

// Log environment variables for debugging
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const verifyCloudinaryConfig = () => {
  console.log('Cloudinary Configuration:');
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing');
  console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing');
  console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing');
};

module.exports = cloudinary;
module.exports.verifyCloudinaryConfig = verifyCloudinaryConfig;
