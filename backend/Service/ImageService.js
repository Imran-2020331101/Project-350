const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const upload = multer();
const Photo = require('../models/photo');

const uploadImage = async (req, res) => {
    const files = req.files;
    const { description, userID } = req.body;

    if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    if (!description || !userID) {
        return res.status(400).json({ error: 'Description and User ID are required.' });
    }

    try {
        const photoArray = [];

        for (const file of files) {
            const b64 = Buffer.from(file.buffer).toString('base64');
            const dataURI = 'data:' + file.mimetype + ';base64,' + b64;

            const result = await cloudinary.uploader.upload(dataURI, {
                folder: 'trip-images',
                resource_type: 'auto'
            });

            photoArray.push({
                photoID: result.public_id,
                url: result.secure_url
            });
        }

        const newPhotoEntry = new Photo({
            userID: userID,
            caption: description,
            photos: photoArray
        });

        await newPhotoEntry.save();

        res.status(200).json(newPhotoEntry);

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload image(s)' });
    }
};

module.exports = { uploadImage };