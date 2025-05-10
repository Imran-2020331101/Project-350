const mongoose = require('mongoose');

const connectDB=async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000 })
        console.log("Successfuly connected to database");
    } catch (error) {
        console.log('Unable to connect to database : '+error);
    }
    
}

module.exports= connectDB