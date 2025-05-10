const asyncWrapper = require('../middleware/asyncWrapper');
const Blog = require('../models/Blog');
const Trip =require('../models/Trip');
const {generateResponse}=require('../utils/utils')
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Function to get all blogs
const getAllBlogs = async (req, res)=> {
    try {
        
    
        const plans = await Blog.find();
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ error: "Failed to get Blogs" });
        
    }
}

// Function to create a new blog
const createNewBlog=async (req, res)=>{
    try {
        
    
    const { tripId } = req.body;
    const trip= await Trip.findOne({_id:tripId});

    const prompt = "Write a blog about my trip to " + trip.Place + " that started on " + trip.StartDate + ".\n\n";
    const result = generateResponse(prompt);

    res.status(201).json(result.response.text());
} catch (error) {
    res.status(500).json({ error: "Failed to create Blog" });
}
}

const deleteBlog = async (req, res)=> {
    try {
        
    
    const plans = await Blog.findOneAndDelete({_id: req.params.id});
    if (!plans) {
        return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog deleted successfully' });
} catch (error) {
    res.status(500).json({ error: "Failed to delete Blog" });
    
}
}

module.exports = {
    getAllBlogs,
    createNewBlog,
    deleteBlog
};