const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const upload = multer();
const Photo = require('../models/photo');

const uploadImage = async (req, res) => {
    try {
        const files = req.files;
        const { caption, userID } = req.body;

        // Validate request
        if (!files || files.length === 0) {
            return res.status(400).json({ 
                success: false,
                error: 'No files uploaded' 
            });
        }

        if (!caption || !userID) {
            return res.status(400).json({ 
                success: false,
                error: 'Caption and User ID are required.' 
            });
        }

        // Validate file type
        const file = files[0];
        if (!file.mimetype.startsWith('image/')) {
            return res.status(400).json({
                success: false,
                error: 'Only image files are allowed'
            });
        }

        // Convert to base64
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = 'data:' + file.mimetype + ';base64,' + b64;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'trip-images',
            resource_type: 'auto',
            timeout: 60000 // Increase timeout to 60 seconds
        });

        if (!result || !result.secure_url) {
            throw new Error('Failed to upload to Cloudinary');
        }

        // Create photo document
        const newPhoto = new Photo({
            photoID: result.public_id,
            userID: userID,
            url: result.secure_url,
            caption: caption
        });

        // Save to database
        await newPhoto.save();

        res.status(200).json({
            success: true,
            message: 'Photo uploaded successfully',
            data: newPhoto
        });

    } catch (error) {
        console.error('Upload error:', error);
        
        // Handle specific error types
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: error.message
            });
        }

        if (error.name === 'MongoError') {
            return res.status(500).json({
                success: false,
                error: 'Database error',
                details: error.message
            });
        }

        res.status(500).json({ 
            success: false,
            error: 'Failed to upload image',
            details: error.message 
        });
    }
};

module.exports = { uploadImage };