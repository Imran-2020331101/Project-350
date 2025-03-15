const localEventSchema = new mongoose.Schema({
    eventID: { type: String, required: true, unique: true },
    locationID: { type: String, required: true, ref: 'Map' },
    eventName: String,
    eventDate: Date,
    eventType: String,
    description: String,
});

module.exports = mongoose.model('LocalEvent', localEventSchema);