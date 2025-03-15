const emergencyContactSchema = new mongoose.Schema({
    contactID: { type: String, required: true, unique: true },
    locationID: { type: String, required: true, ref: 'Map' },
    contactType: String,
    name: String,
    phoneNumber: String,
    address: String,
});

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);