const mapSchema = new mongoose.Schema({
    mapID: { type: String, required: true, unique: true },
    locationName: { type: String, required: true },
    coordinates: String,
    activityFilters: [String],
    directions: String,
});

module.exports = mongoose.model('Map', mapSchema);