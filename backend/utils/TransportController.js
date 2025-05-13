const Transport=require('../models/transports');

const {getTransport}=require('./utils');


const createItinerary=async (type, startingPoint, destination,name,email)=>{
    
    try {
        const transport= await getTransport();
        Transport.create({
            email, name, transport
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
