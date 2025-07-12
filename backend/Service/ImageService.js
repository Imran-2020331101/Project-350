const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const upload = multer();
const Photo = require('../models/photo');
const User = require('../models/User')

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

//GET /api/photos/:id
const getPhotos= async (req,res)=>{
  try {
    const {id} = req.params;

    const photos = await Photo.find({userID: id}).sort({ createdAt: -1 }); // sort latest first

    res.status(200).json({
      success: true,
      count: photos.length,
      photos,
    });

  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

//POST 
const uploadProfilePicture = async (req, res) => {
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

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        user.images.push(result.secure_url);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Image uploaded and added to user profile successfully',
            imageUrl: result.secure_url,
            user: user.toJSON()
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


module.exports = { uploadImage, getPhotos, uploadProfilePicture};