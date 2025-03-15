const blogSchema = new mongoose.Schema({
    blogID: { type: String, required: true, unique: true },
    userID: { type: String, required: true, ref: 'User' },
    title: String,
    content: String,
    creationDate: Date,
    photos: [{ type: String, ref: 'Photo' }],
});

module.exports = mongoose.model('Blog', blogSchema);