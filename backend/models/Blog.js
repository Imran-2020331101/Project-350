const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  user: {
    name: String,
    profilePic: String,
  },
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema({
  user: {
    name: String,
    profilePic: String,
  },
  text: String,
  replies: [replySchema],
  createdAt: { type: Date, default: Date.now },
});

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  description: String
});

const blogSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  author: { type: String, required: true },
  destination: { type: String, required: true },
  title: { type: String, required: true },
  tags: [String],
  story: { type: String, required: true },
  images: [imageSchema],
  publishDate: { type: Date, required: true },
  likes: {type:Number, default: 0 },
  comments: [commentSchema],
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
