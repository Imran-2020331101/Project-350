const Trip = require('../models/trip');
// const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const firebaseApp = require('../config/firebase');
const multer = require('multer');
const upload = multer();

const uploadImage = async (req, res) => {

    // const file = req.file;

    // const { tripId, caption,email,name } = req.body;
    // console.log(caption)

    // if (!file || !details) {
    //     return res.status(400).json({ error: 'No file or details uploaded from user' });
    // }

    // const storage = getStorage(firebaseApp);
    // const storageRef = ref(storage, `images/${req.file.originalname}`);
    
    // try {
    //     const snapshot = await uploadBytes(storageRef, req.file.buffer);
    //     const downloadURL = await getDownloadURL(snapshot.ref);

    //     //Update the trip with the new image address        
    //     const trip = await Trip.find({email:email,name:name}); 
    //     if (!trip) {
    //         trip = await Trip.create({ email, name, Images: [] });
    //     }
    //     trip.Images.push({ downloadURL,getImageDescription(downloadURL), caption });
    //     const updatedTrip = await trip.save();
    //     res.status(200).json(updatedTrip);

    // } catch (error) {
    //     res.status(500).json({ error: 'Failed to upload image' });
    // }
};

const searchImages = async (req, res) => {
    // const { searchTerm } = req.body;

    // if (!searchTerm) {
    //     return res.status(400).json({ error: 'Search term is required' });
    // }

    // try {
    //     const regex = new RegExp(searchTerm, 'i');
    //     const trips = await Trip.find({ 'Images.imageDetails': regex });
    //     const images = trips.flatMap(trip => trip.Images.filter(image => regex.test(image.imageDetails)));
    //     res.status(200).json({ images });
    // } catch (error) {
    //     res.status(500).json({ error: 'Failed to search images' });
    // }
};

module.exports = { uploadImage, searchImages };