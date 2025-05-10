const Trip = require('../models/Trip');
const User = require('../models/User');

// Create a new trip
const createTrip = async (email,name) => {
    try {
        const newTrip = await Trip.create({email,name,Images:[] });
        res.status(201).json(newTrip);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Adds new image and caption to a trip
const updateTrip = async (email,name,imageUrl,caption) => {
    try {
        const trip = await Trip.find({ email:email });
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        trip.Images.push({ imageUrl, caption });
        const updatedTrip = await trip.save();
        res.status(200).json(updatedTrip);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a trip
const deleteTrip = async (req, res) => {
    try {
        const {title}= req.body;

        const user=User.findOne({email:req.email});
        Plans=user.plans;
        Plans.forEach(element => {
            if(element.title===title){
                element.trip=null;
            }
        });
        user.plans=Plans;
        await user.save();
        res.status(200).json({ message: "Trip deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete Trip" });
    }
};

module.exports = {
    updateTrip,
    createTrip,
    deleteTrip
};