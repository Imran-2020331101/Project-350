const Places=require('../models/Places');
const {getPlaces,generateResponse} = require('./utils')

const createplaces = async (email,name,location, place, budget, resultCount) => {
    try {
        const t_places=getPlaces(location, place, budget, resultCount)
        const prompt=   `give me a generalized response on the best tourist Places in the ${location}`;
        const response= generateResponse(prompt);

        const places = await Places.create({
            email, name, t_places, response
        });

        res.status(201).json({places});
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' });
    }
}


const getAllPlaces= async (email)=>{
    try{
        const places=await Places.find({email});
        res.status(200).json({places});
    }
    catch(error){
        res.status(500).json({msg:'Internal server error'});
    }
}

module.exports()
