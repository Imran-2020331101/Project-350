const Group = require("../models/group");

const createGroup = async (req, res) => {
  try {
    const {
      expectedCost,
      place,
      images,
      startDate,
      endDate,
      activities,
      about,
      owner,
      tripId,
      title,
      startingPointOfGroup,
      availableSpots,
      days,
    } = req.body;

    // Basic validation for required fields
    if (
      !owner ||
      !tripId ||
      !title ||
      !startingPointOfGroup ||
      !availableSpots ||
      !place ||
      !about ||
      !startDate ||
      !endDate ||
      !expectedCost ||
      !images
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (availableSpots <= 0) {
      return res
        .status(400)
        .json({ error: "Available spots must be a positive number" });
    }

    const newGroup = {
      trip: tripId,
      groupName: `Group_${tripId}`,
      title,
      place,
      about,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      days: parseInt(days) || 0,
      activities: activities ? activities.split(",").map(activity => activity.trim()) : [],
      expectedCost: parseFloat(expectedCost),
      startingPointOfGroup,
      images,
      owner,
      participants: [owner],
      availableSpots: parseInt(availableSpots),
      status: "public",
    };

    const createdGroup = await Group.create(newGroup);
    return res.status(201).json({
      status: 'success',
      createdGroup,
    });
  } catch (error) {
    console.error("Error creating group:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllGroups = async (req, res) => {
  const userId = req.query.userId; // Get userId from query parameter
  const groups = await Group.find({ status: "public" });

  // Add isBooked status for each group if userId is provided
  const groupsWithBookingStatus = groups.map((group) => ({
    ...group.toObject(), // Convert Mongoose document to plain object
    isBooked: userId ? group.participants.includes(userId) : false,
  }));

  res.status(200).json(groupsWithBookingStatus);
};

const joinGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user?.id || req.body.userId;
    const isCancellation = req.path.includes("/cancel");

    if (!groupId || !userId) {
      return res.status(400).json({ error: "Missing groupId or userId" });
    }

    const group = await Group.findOne({ _id: groupId });

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (isCancellation) {
      // Handle cancellation
      if (!group.participants.includes(userId)) {
        return res
          .status(409)
          .json({ error: "User is not a participant in this group" });
      }

      group.participants = group.participants.filter((id) => id !== userId);
      group.availableSpots += 1;

      await group.save();

      return res.status(200).json({
        message: "Successfully cancelled group participation",
        group,
        availableSpots: group.availableSpots,
        isBooked: false,
      });
    } else {
      // Handle booking
      if (group.participants.includes(userId)) {
        return res.status(409).json({ error: "User already joined the group" });
      }

      if (group.availableSpots <= 0) {
        return res
          .status(400)
          .json({ error: "No available spots in this group" });
      }

      group.participants.push(userId);
      group.availableSpots -= 1;

      await group.save();

      return res.status(200).json({
        message: "Successfully joined the group",
        group,
        availableSpots: group.availableSpots,
        isBooked: true,
      });
    }
  } catch (error) {
    console.error("Error in group operation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { createGroup, getAllGroups, joinGroup };
