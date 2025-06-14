const localEventSchema = new mongoose.Schema({
    location: { type: String, required: true },
    eventName:{type: String, required: true},
    eventDate: Date,
    eventType: String,
    description: String,
});

module.exports = mongoose.model('LocalEvent', localEventSchema);