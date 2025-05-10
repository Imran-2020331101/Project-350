const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Import your controller functions
const { createItinerary, getAllItineraries } = require('../controllers/ItineraryController');
const { getAllBlogs, createNewBlog, deleteBlog } = require('../controllers/BlogController');
const { handleLogin, handleRegister, handleLogout } = require('../controllers/AuthController');
const { updateTrip, createTrip } = require('../controllers/TripController');
const { uploadImage } = require('../controllers/ImageController');

const genAI = new GoogleGenerativeAI("AIzaSyDFQXhPWPhPiMumcCykcnx3XnxiRggpx_Q");

function fileToGenerativePart(data, mimeType) {
    return {
        inlineData: {
            data: data.toString('base64'),
            mimeType,
        },
    };
}

// Itinerary Routes
router.route('/itineraries')
  .post(createItinerary)
  .get(getAllItineraries);

// Blog Routes
router.route('/blogs/blog')
  .get(getAllBlogs)
  .post(createNewBlog)
  .delete(deleteBlog);

// Authentication Routes
router.post('/auth/login', handleLogin);
router.post('/auth/register', handleRegister);
// router.post('/auth/logout', handleLogout);

// Gemini Image Description Route
router.route('/gemini-describe')
    // Handle POST requests for image description
    .post(upload.single("file"), async (req, res) => {
        const imageFile = req.file;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const image = [fileToGenerativePart(imageFile.buffer, imageFile.mimetype)];

        const result = await model.generateContent(["describe the image ", ...image]);
        const response = await result.response;
        const text = response.text();

        console.log('Generated text:', text);

        res.json({ result: text });
    });

// Trip Creation Route
router.route('/trips')
  .post((req, res) => {
    const { email, name } = req.body;
    createTrip(email, name);
    res.status(200).send('Trip creation initiated'); // Send a response
  });

// Image Upload Route
router.route('/upload-image')
  .post(upload.single("file"), uploadImage);

module.exports = router;