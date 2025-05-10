const express = require('express');
const multer = require("multer");
const upload = multer();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();

const genAI = new GoogleGenerativeAI("AIzaSyDFQXhPWPhPiMumcCykcnx3XnxiRggpx_Q");

function fileToGenerativePart(data, mimeType) {
    return {
        inlineData: {
            data: data.toString('base64'),
            mimeType,
        },
    };
}

router
    .route("/")
    // Handle POST requests
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
    module.exports = router;