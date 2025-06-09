/**
 * app.js - Main application file for the Express.js backend.
 *
 * This file sets up the Express server, imports necessary middleware and controllers,
 * defines the API routes, and starts the server.
 */
const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
// const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./config/swagger-output.json');

// const { GoogleGenerativeAI } = require("@google/generative-ai"); // Uncomment and configure if using Gemini API
const { getAllBlogs, createBlog, deleteBlog, updateBlog } = require('./Service/BlogService');
const { handleLogin, handleRegister, handleLogout, handleProfileUpdate, refreshToken } = require('./Service/AuthService');
const { createTrip, getAllTrips, deleteTrip } = require('./Service/TripService');
const { uploadImage } = require('./Service/ImageService');
const { createGroup, getAllGroups } = require('./Service/GroupService');

const app = express();
const port = process.env.PORT || 3000;
const upload = multer();

const connectDB = require('./config/MongoConfig'); 
require('dotenv').config();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));



// Middleware
// app.use(helmet());

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('Registered Mongoose models:', mongoose.modelNames());

app.route('/api/trips/:id')
    .post(createTrip)
    .get(getAllTrips);

app.delete('/api/trips/:id',deleteTrip);

app.route('/api/blogs')
    .get(getAllBlogs)
    .post(createBlog)
    .put(updateBlog);

app.delete('/api/blogs/:id', deleteBlog); // Assumes blog ID is passed as URL param

app.post('/api/auth/login', handleLogin);
app.post('/api/auth/register', handleRegister);
app.post('/api/auth/logout', handleLogout);
app.post('/api/auth/profile/update', handleProfileUpdate);
app.post('/api/auth/refresh', refreshToken)

app.post('blogs/:id/comments', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    blog.comments.push(req.body); // assumes { user: {}, text: "" }
    await blog.save();
    res.status(200).json(blog.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a reply to a comment
app.post('blogs/:id/comments/:commentId/replies', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    const comment = blog.comments.id(req.params.commentId);
    comment.replies.push(req.body); // assumes { user: {}, text: "" }
    await blog.save();
    res.status(200).json(comment.replies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Routes - Groups
app.route('/api/groups')
    .post(createGroup)
    .get(getAllGroups);

// Routes - Image Upload
app.post('/api/upload-image', upload.single("file"), uploadImage);


/*
app.post('/api/gemini-describe', upload.single("file"), async (req, res) => {
    try {
        const imageFile = req.file;
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const image = [fileToGenerativePart(imageFile.buffer, imageFile.mimetype)];
        const result = await model.generateContent(["Describe the image", ...image]);
        const response = await result.response;
        const text = response.text();

        console.log('Generated text:', text);
        res.json({ result: text });
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "Failed to generate description." });
    }
});
*/

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Server Start

connectDB();

app.listen(port, () => {
    console.log(`✅ Server listening on port ${port}`);
});