const mongoose = require('mongoose');


const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  description: String
});

const blogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  owner: { type: String, required: true },
  author: { type: String, required: true },
  destination: { type: String, required: true },
  title: { type: String, required: true },
  tags: [String],
  story: { type: String, required: true },
  images: [imageSchema],
  publishDate: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
