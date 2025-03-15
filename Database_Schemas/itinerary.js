const itinerarySchema = new mongoose.Schema({
    itineraryID: { type: String, required: true, unique: true },
    userID: { type: String, required: true, ref: 'User' },
    destination: { type: String, required: true },
    startDate: Date,
    endDate: Date,
    transportDetails: String,
    hotelDetails: String,
    mealRecommendations: String,
    costBreakdown: String,
});

module.exports = mongoose.model('Itinerary', itinerarySchema);