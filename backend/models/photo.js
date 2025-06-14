const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    photoID: { type: String, required: true, unique: true },
    userID: { type: String, required: true, ref: 'User' },
    uploadDate: { type: Date, default: Date.now },
    url: { type: String, required: true },
    caption: { type: String, required: true }
});

module.exports = mongoose.model('Photo', photoSchema);