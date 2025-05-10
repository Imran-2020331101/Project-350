const express = require('express');
const app = express();
const port = 3000;
const multer = require("multer");
const upload = multer();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Import your controller functions (assuming these are in '../controllers/')
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

// Define your routes directly on the app object
app.route('/api/itineraries')
    .post(createItinerary)
    .get(getAllItineraries);

app.route('/api/blogs/blog')
    .get(getAllBlogs)
    .post(createNewBlog)
    .delete(deleteBlog);

app.post('/api/auth/login', handleLogin);
app.post('/api/auth/register', handleRegister);
// app.post('/api/auth/logout', handleLogout);

app.route('/api/gemini-describe')
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

app.route('/api/trips')
    .post((req, res) => {
        const { email, name } = req.body;
        createTrip(email, name);
        res.status(200).send('Trip creation initiated'); // Send a response
    });

app.route('/api/upload-image')
    .post(upload.single("file"), uploadImage);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});