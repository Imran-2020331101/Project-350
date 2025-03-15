const messageSchema = new mongoose.Schema({
    messageID: { type: String, required: true, unique: true },
    senderID: { type: String, required: true, ref: 'User' },
    receiverID: { type: String, required: true, ref: 'User' },
    timestamp: Date,
    content: String,
    groupID: String,
});

module.exports = mongoose.model('Message', messageSchema);