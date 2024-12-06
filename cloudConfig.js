const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Cloudinary storage configuration for multer

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder:'wanderlust_DEV', // Folder in Cloudinary
        allowerdFormats: ["png", "jpg", "jpeg"], // Correct key name
    },
}); 


module.exports = {
    cloudinary,
    storage,
};
