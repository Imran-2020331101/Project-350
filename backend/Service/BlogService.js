const mongoose = require("mongoose");
const Blog = require("../models/Blog");
const Photo = require("../models/photo");
const Trip = require("../models/trip");
const { generateResponse } = require("../utils/utils");

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

const createBlog = async (req, res) => {
  try {
    console.log('Create blog request:', req.body);
    
    const { blogInfo, user, selectedImages } = req.body;
    
    if (!blogInfo) {
      return res.status(400).json({ 
        success: false, 
        error: "Blog information is required" 
      });
    }

    if (!user || !user.id) {
      return res.status(400).json({ 
        success: false, 
        error: "User information is required" 
      });
    }

    const { selectedImageIds, howWhy, journey, experiences, insights, conclusion } = blogInfo;
    
    if (!selectedImageIds || selectedImageIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: "At least one image must be selected" 
      });
    }

    // Generate blog content using OpenAI
    const prompt = `
    Create a detailed, engaging travel blog post based on the following information:
    
    How and Why the trip happened: ${howWhy}
    Journey and first impressions: ${journey}
    Key experiences: ${experiences}
    Cultural insights and personal thoughts: ${insights}
    Conclusion and reflections: ${conclusion}
    
    Please write a compelling travel blog post that:
    - Has an engaging title (extract destination if mentioned)
    - Is well-structured with clear sections
    - Maintains a personal, storytelling tone
    - Is between 800-1200 words
    - Includes vivid descriptions and emotions
    - Flows naturally from one section to the next
    
    Return the response in the following JSON format:
    {
      "title": "Generated blog title",
      "story": "Complete blog story content",
      "destination": "Extracted destination name from content"
    }
    
    If no specific destination is mentioned, use a generic title and destination.
    `;

    console.log('Generating blog content with OpenAI...');
    let blogContent;
    
    try {
      const aiResponse = await generateResponse(prompt);
      console.log('AI Response received:', aiResponse.substring(0, 200) + '...');
      
      // Try to parse as JSON first
      try {
        blogContent = JSON.parse(aiResponse);
      } catch (parseError) {
        console.log('AI response not in JSON format, creating structured content');
        
        // Extract potential title from first line or create one
        const lines = aiResponse.split('\n').filter(line => line.trim());
        let extractedTitle = "My Travel Experience";
        
        if (lines.length > 0) {
          // Look for a title-like first line
          const firstLine = lines[0].replace(/^#+\s*/, '').trim();
          if (firstLine.length < 100) {
            extractedTitle = firstLine;
          }
        }
        
        // Extract destination from content
        let extractedDestination = "Travel Destination";
        const destinationMatch = aiResponse.match(/(?:to|in|at|visiting|from)\s+([A-Z][a-zA-Z\s,]+?)(?:\s|,|\.|\n)/g);
        if (destinationMatch && destinationMatch.length > 0) {
          const places = destinationMatch.map(match => 
            match.replace(/(?:to|in|at|visiting|from)\s+/i, '').replace(/[,\.].*/,'').trim()
          ).filter(place => place.length > 2 && place.length < 30);
          
          if (places.length > 0) {
            extractedDestination = places[0];
          }
        }
        
        blogContent = {
          title: extractedTitle,
          story: aiResponse,
          destination: extractedDestination
        };
      }
    } catch (aiError) {
      console.error('OpenAI generation failed:', aiError);
      
      // Fallback content if AI fails
      blogContent = {
        title: "My Travel Experience",
        story: `
        <h2>How It All Started</h2>
        <p>${howWhy || 'An exciting journey began...'}</p>
        
        <h2>The Journey Begins</h2>
        <p>${journey || 'The adventure unfolded beautifully...'}</p>
        
        <h2>Unforgettable Experiences</h2>
        <p>${experiences || 'Amazing moments were captured...'}</p>
        
        <h2>Insights and Reflections</h2>
        <p>${insights || 'This journey taught me so much...'}</p>
        
        <h2>Final Thoughts</h2>
        <p>${conclusion || 'A truly memorable experience that I will cherish forever.'}</p>
        `,
        destination: "Travel Destination"
      };
    }    // Handle images - either from frontend selectedImages or fetch from database
    let blogImages = [];
    
    if (selectedImages && selectedImages.length > 0) {
      // Use images provided by frontend
      blogImages = selectedImages.map(img => ({
        url: img.url,
        description: img.caption || `Travel image`
      }));
    } else {
      // Fallback: try to fetch images from database using selectedImageIds
      try {
        const userPhotos = await Photo.find({ 
          photoID: { $in: selectedImageIds },
          userID: user.id 
        });
        
        if (userPhotos.length > 0) {
          blogImages = userPhotos.map(photo => ({
            url: photo.url,
            description: photo.caption || `Travel image`
          }));
        } else {
          // Final fallback to placeholder images
          blogImages = selectedImageIds.map((imageId, index) => ({
            url: `https://source.unsplash.com/800x600/?travel,${index}`,
            description: `Travel image ${index + 1}`
          }));
        }
      } catch (fetchError) {
        console.error('Error fetching user photos:', fetchError);
        // Use placeholder images as last resort
        blogImages = selectedImageIds.map((imageId, index) => ({
          url: `https://source.unsplash.com/800x600/?travel,${index}`,
          description: `Travel image ${index + 1}`
        }));
      }
    }

    // Generate tags based on content
    const tags = ["travel", "adventure", "blog"];
    if (blogContent.destination && blogContent.destination !== "Travel Destination") {
      tags.push(blogContent.destination.toLowerCase());
    }

    // Create the blog
    const newBlog = await Blog.create({
      owner: user.id,
      author: user.name || "Anonymous Traveler",
      destination: blogContent.destination,
      title: blogContent.title,
      tags: tags,
      story: blogContent.story,
      images: blogImages,
      likes: 0,
      publishDate: new Date(),
      comments: []
    });

    console.log('Blog created successfully:', newBlog._id);

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog: newBlog,
      body: { id: newBlog._id } // For frontend compatibility
    });

  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to create blog",
      details: error.message 
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ success: false, msg: "Invalid blog ID" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, msg: "Blog not found" });
    }

    if (blog.authorEmail !== req.user.email) {
      return res
        .status(403)
        .json({ success: false, msg: "Forbidden: Not the blog owner" });
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

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ success: false, msg: "Invalid blog ID" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, msg: "Blog not found" });
    }

    if (blog.owner !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, msg: "Forbidden: Not the blog owner" });
    }

    const allowedFields = [
      "author",
      "destination",
      "title",
      "tags",
      "story",
      "images",
      "publishDate",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        blog[field] = req.body[field];
      }
    });

    const updatedBlog = await blog.save();

    return res.status(200).json({
      success: true,
      msg: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
};

// POST /api/blogs/:id/comments
const addCommentToBlog = async (req, res) => {
  try {

    console.log('blog service : ', req.body)

    const { id } = req.params;
    const { user, text } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, msg: "Blog not found" });

    const newComment = { user, text };
    blog.comments.push(newComment);
    await blog.save();

    res.status(200).json({ success: true, msg: "Comment added", comments: blog.comments });
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};


// POST /api/blogs/:blogId/comments/:commentId/replies
const addReplyToComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const { user, text } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ success: false, msg: "Blog not found" });

    const comment = blog.comments.id(commentId);
    if (!comment) return res.status(404).json({ success: false, msg: "Comment not found" });

    comment.replies.push({ user, text });
    await blog.save();

    res.status(200).json({ success: true, msg: "Reply added", comments: blog.comments });
  } catch (err) {
    console.error("Add reply error:", err);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

// POST /api/blogs/:id/like
const addLikeToBlog = async (req,res)=>{
  try {
    const { id } = req.params;
    const {blogLiked}  = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, msg: "Blog not found" });

    blog.likes = !blogLiked ? blog.likes + 1: blog.likes - 1;
    await blog.save();

    return res.status(200).json({ success: true, likes: blog.likes });
  } catch (error) {
    console.error("like blog error:", err);
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
}



module.exports = {
  getAllBlogs,
  createBlog,
  deleteBlog,
  updateBlog,
  addCommentToBlog,
  addReplyToComment,
  addLikeToBlog
};
