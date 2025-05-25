const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: {type: String,required: true},
  bio: { type: String },
  location: { type: String },
  profilePicture: { type: String },
  coverPhoto: { type: String },
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
  joinedDate: { type: Date, default: Date.now },
  images: [{ type: String }],
  preferences: {
    travelStyle: { type: String },
    preferredClimate: { type: String },
    language: { type: String }
  }
}, { timestamps: true }); // Consider adding timestamps here

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;