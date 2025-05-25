const mongoose = require("mongoose");
const Blog = require("../models/Blog");
const Trip = require("../models/Trip");
// const { generateResponse } = require("../utils/utils");
// const { GoogleGenerativeAI } = require("@google/generative-ai");


const getAllBlogs = async (req, res) => {
  try {
    // Optional: Add filters, pagination, or search here
    const blogs = await Blog.find().sort({ createdAt: -1 }); // sort latest first

    res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Function to create a new blog
const createBlog = async (req, res) => {
  try {
    const { tripId } = req.body;
    const trip = await Trip.findOne({ _id: tripId });

    const prompt =
      "Write a blog about my trip to " +
      trip.Place +
      " that started on " +
      trip.StartDate +
      ".\n\n";
    const result = generateResponse(prompt);

    res.status(201).json(result.response.text());
  } catch (error) {
    res.status(500).json({ error: "Failed to create Blog" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    // 1. Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ success: false, msg: "Invalid blog ID" });
    }

    // 2. Find blog
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, msg: "Blog not found" });
    }

    // 3. Ownership check (assumes req.user is set by auth middleware)
    if (blog.authorEmail !== req.user.email) {
      return res.status(403).json({ success: false, msg: "Forbidden: Not the blog owner" });
    }

    await blog.deleteOne();

    res.status(200).json({ success: true, msg: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    // 1. Validate ID
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ success: false, msg: "Invalid blog ID" });
    }

    // 2. Find the blog
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, msg: "Blog not found" });
    }

    // 3. Check if the current user owns the blog
    if (blog.owner !== req.user.id) {
      return res.status(403).json({ success: false, msg: "Forbidden: Not the blog owner" });
    }

    // 4. Update allowed fields only
    const allowedFields = [
      "author",
      "destination",
      "title",
      "tags",
      "story",
      "images",
      "publishDate"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        blog[field] = req.body[field];
      }
    });

    // 5. Save the updated blog
    const updatedBlog = await blog.save();

    return res.status(200).json({
      success: true,
      msg: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

module.exports = {
  getAllBlogs,
  createBlog,
  deleteBlog,
  updateBlog,
};
