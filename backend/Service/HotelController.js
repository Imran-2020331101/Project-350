const Hotel=require('../models/Hotel');
const {getPlaces,generateResponse} = require('../utils/utils')

const createHotel = async (email,name,location, place, budget, resultCount) => {
    try {
        const hotels=getPlaces(location, place, budget, resultCount)
        const prompt=   `give me a generalized response on the best hotels in the ${location}`;
        const response= generateResponse(prompt);
        const hotel = await Hotel.create({
            email, name, hotel,
        });
        res.status(201).json({ hotel });
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' });
    }
}


const getAllHotels= async (email)=>{
    try{
        const hotels=await Hotel.find({email});
        res.status(200).json({hotels});
    }
    catch(error){
        res.status(500).json({msg:'Internal server error'});
    }
}


