const weatherSchema = new mongoose.Schema({
    weatherID: { type: String, required: true, unique: true },
    locationID: { type: String, required: true, ref: 'Map' },
    forecastDate: Date,
    temperature: String,
    weatherCondition: String,
    severeWeatherAlerts: String,
    packingSuggestions: String,
});

module.exports = mongoose.model('Weather', weatherSchema);