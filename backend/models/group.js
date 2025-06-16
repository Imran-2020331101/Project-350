const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  trip: {
    type: String, //tripID
    // required: true,
  },
  groupName: {
    type: String,
    default: 'Group : '+Date.now,
  },
  title: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  days: {
    type: Number,
  },
  activities: [{
    type: String,
  }],
  expectedCost: {
    type: Number,
    required: true,
  },
  startingPointOfGroup: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  gatheringPoint: {
    type: String,
    // required: true,
  },
  owner: {
    type: String, // user ID or email
    required: true,
  },
  participants: [{
    type: String, // list of user IDs or emails
  }],
  availableSpots: {
    type: Number,
    required: true,
    min: 0,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  status: { 
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('group', groupSchema);
