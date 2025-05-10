const Itinerary=require('../models/Itinerary');


const createItinerary=async ( req,res)=>{
    const {
        email, name, destination, date, budget, weather, costs
    }=req.body;
    
    try {
        Itinerary.create({
            email, name, destination, date, budget, costs
        })
        res.status(201).json({message: "Itinerary created successfully"});
    } catch (error) {
        console.log(error);
    }
    
}


const getAllItineraries=async (req,res)=>{
    const {email}=req.body;
    try {
        const itineraries=await Itinerary.find({email:email});
        res.status(200).json(itineraries);
    }
    catch(e){
        console.log(e);
    }
}


module.exports={createItinerary, getAllItineraries};
