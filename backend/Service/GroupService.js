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
  const userId = req.query.userId; // Get userId from query parameter
  const groups = await Group.find({status : 'public'});

  // Add isBooked status for each group if userId is provided
  const groupsWithBookingStatus = groups.map(group => ({
    ...group.toObject(), // Convert Mongoose document to plain object
    isBooked: userId ? group.participants.includes(userId) : false,
  }));

  res.status(200).json(groupsWithBookingStatus);
};

const joinGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user?.id || req.body.userId;
    const isCancellation = req.path.includes('/cancel');

    if (!groupId || !userId) {
      return res.status(400).json({ error: 'Missing groupId or userId' });
    }

    const group = await Group.findOne({ _id: groupId });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    if (isCancellation) {
      // Handle cancellation
      if (!group.participants.includes(userId)) {
        return res.status(409).json({ error: 'User is not a participant in this group' });
      }

      group.participants = group.participants.filter(id => id !== userId);
      group.availableSpots += 1;

      await group.save();

      return res.status(200).json({
        message: 'Successfully cancelled group participation',
        group,
        availableSpots: group.availableSpots,
        isBooked: false
      });
    } else {
      // Handle booking
      if (group.participants.includes(userId)) {
        return res.status(409).json({ error: 'User already joined the group' });
      }

      if (group.availableSpots <= 0) {
        return res.status(400).json({ error: 'No available spots in this group' });
      }

      group.participants.push(userId);
      group.availableSpots -= 1;

      await group.save();

      return res.status(200).json({
        message: 'Successfully joined the group',
        group,
        availableSpots: group.availableSpots,
        isBooked: true
      });
    }
  } catch (error) {
    console.error('Error in group operation:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { createGroup, getAllGroups, joinGroup };
