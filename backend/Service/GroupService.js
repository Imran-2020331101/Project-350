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

const joinGroup = async (req, res) => {
  try {
    const groupId = req.params.id; // or req.body.groupId, depending on your route
    const userId = req.user?.id || req.body.userId; // Assuming auth middleware sets req.user, fallback to body

    if (!groupId || !userId) {
      return res.status(400).json({ error: 'Missing groupId or userId' });
    }

    const group = await Group.findOne({ _id: groupId });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    if (group.participants.includes(userId)) {
      return res.status(409).json({ error: 'User already joined the group' });
    }

    if (group.availableSpots <= 0) {
      return res.status(400).json({ error: 'No available spots in this group' });
    }

    group.participants.push(userId);
    group.availableSpots -= 1;

    await group.save();

    res.status(200).json({
      message: 'Successfully joined the group',
      group,
    });
  } catch (error) {
    console.error('Error joining Group:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports= { createGroup, getAllGroups, joinGroup };
