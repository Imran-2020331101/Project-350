const Group = require('../models/group');

const createGroup = async (req, res) => {
  try {
    const { tripId, groupName, gatheringPoint, availableSpots } = req.body;
    const owner = req.user?.id || req.user?.email; // Assuming you use middleware to attach the logged-in user

    // Validate required fields
    if (!tripId || !groupName || !gatheringPoint || !availableSpots) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (typeof availableSpots !== 'number' || availableSpots <= 0) {
      return res.status(400).json({ error: "Available spots must be a positive number" });
    }

    const newGroup = {
      trip: tripId,
      groupName,
      gatheringPoint: gatheringPoint,
      owner,
      availableSpots,
      participants: [owner] 
    };

    const createdGroup = await Group.create(newGroup);
    return res.status(201).json(createdGroup);

  } catch (error) {
    console.error('Error creating group:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllGroups = async (req,res) => {
  const groups = await Group.find({status : 'public'});
  res.status(200).json(groups);
};

module.exports= { createGroup, getAllGroups };
