const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });
cloudinary.config({
    cloud_name: 'dvymgpgnt',
    api_key: '797527593986259',
    api_secret: 'kfjxuM1XT39cN9V6pJV_lfkZnkQ'
  });

  const verifyCloudinaryConfig = () => {
    console.log('Cloudinary Configuration:');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing');
    console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing');
    console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing');
};

module.exports = cloudinary;
module.exports.verifyCloudinaryConfig = verifyCloudinaryConfig;