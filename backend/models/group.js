const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  trip: {
    type: String, //tripID
    required: true,
  },
  groupName: {
    type: String,
    default: 'Group : '+Date.now,
  },
  gatheringPoint: {
    type: String,
    required: true,
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
