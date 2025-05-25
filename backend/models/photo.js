const photoSchema = new mongoose.Schema({
    photoID: { type: String, required: true, unique: true },
    userID: { type: String, required: true, ref: 'User' },
    uploadDate: Date,
    caption: String,
    storagePath: String,
});

module.exports = mongoose.model('Photo', photoSchema);