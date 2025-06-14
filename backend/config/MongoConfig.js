const mongoose = require('mongoose');

const connectDB=async ()=>{
    console.log(process.env.MONGO_URI)
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000 })
        console.log("✅ Successfully connected to database");
    } catch (error) {
        console.log('Unable to connect to database : '+error);
    }
    
}

module.exports= connectDB