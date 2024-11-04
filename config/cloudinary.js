const cloudinary = require('cloudinary').v2;


// Validate Cloudinary configuration
const verifyCloudinaryConfig = () => {
    const { 
        CLOUDINARY_CLOUD_NAME, 
        CLOUDINARY_API_KEY, 
        CLOUDINARY_API_SECRET 
    } = process.env;

    // Comprehensive validation
    if (!CLOUDINARY_CLOUD_NAME) {
        console.error('❌ Cloudinary Cloud Name is missing');
        throw new Error('Cloudinary Cloud Name is not set in .env');
    }

    if (!CLOUDINARY_API_KEY) {
        console.error('❌ Cloudinary API Key is missing');
        throw new Error('Cloudinary API Key is not set in .env');
    }

    if (!CLOUDINARY_API_SECRET) {
        console.error('❌ Cloudinary API Secret is missing');
        throw new Error('Cloudinary API Secret is not set in .env');
    }

    try {
        // Configure Cloudinary with environment variables
        cloudinary.config({
            cloud_name: CLOUDINARY_CLOUD_NAME,
            api_key: CLOUDINARY_API_KEY,
            api_secret: CLOUDINARY_API_SECRET
        });
     

        console.log('✅ Cloudinary Configuration Verified');
    } catch (error) {
        console.error('❌ Cloudinary Configuration Error:', error);
        throw error;
    }
};

// Export Cloudinary with uploader
module.exports = {
    cloudinaryUploader: cloudinary.uploader,
    verifyCloudinaryConfig,
    cloudinary
};