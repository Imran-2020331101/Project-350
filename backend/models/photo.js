const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    photoID: { type: String, required: true, unique: true },
    userID: { type: String, required: true, ref: 'User' },
    uploadDate: { 
        type: Date, 
        default: () => {
            const now = new Date();
            now.setHours(now.getHours() + 6);
            return now.toLocaleString('en-US', {
                timeZone: 'Asia/Dhaka',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        }
    },
    url: { type: String, required: true },
    caption: { type: String, required: true }
});

module.exports = mongoose.model('Photo', photoSchema);