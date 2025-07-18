const Group = require("../models/group");
const GroupTravelService = require("./GroupTravelService");

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
      activities: activities
        ? activities.split(",").map((activity) => activity.trim())
        : [],
      expectedCost: parseFloat(expectedCost),
      startingPointOfGroup,
      images,
      owner,
      organizers: [owner], // Owner is automatically an organizer
      participants: [owner],
      availableSpots: parseInt(availableSpots),
      status: "public",
      groupExpenses: [],
      attendanceChecks: [],
      sosAlerts: [],
      announcements: [],
      settings: {
        allowExpenseSubmission: true,
        requireExpenseApproval: true,
        emergencyContacts: [],
        sosSettings: {
          autoNotifyEmergencyServices: false,
          emergencyServiceNumber: "",
        },
      },
    };

    const createdGroup = await Group.create(newGroup);
    return res.status(201).json({
      status: "success",
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

// New Group Travel Feature Routes

// 1. Organizer Management
const addOrganizer = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { newOrganizerUserId } = req.body;
    const { userID } = req.user;

    const result = await GroupTravelService.addOrganizer(
      groupId,
      userID,
      newOrganizerUserId
    );

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error adding organizer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const removeOrganizer = async (req, res) => {
  try {
    const { groupId, organizerId } = req.params;
    const { userID } = req.user;

    const result = await GroupTravelService.removeOrganizer(
      groupId,
      userID,
      organizerId
    );

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error removing organizer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 2. Group Expense Management
const addGroupExpense = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userID } = req.user;

    const result = await GroupTravelService.addGroupExpense(
      groupId,
      userID,
      req.body
    );

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const approveExpense = async (req, res) => {
  try {
    const { groupId, expenseId } = req.params;
    const { action } = req.body; // 'approved' or 'rejected'
    const { userID } = req.user;

    const result = await GroupTravelService.approveExpense(
      groupId,
      expenseId,
      userID,
      action
    );

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error approving expense:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userID } = req.user;

    const result = await GroupTravelService.getGroupExpenses(groupId, userID);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error getting expenses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 3. Attendance Tracking
const createAttendanceCheck = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userID } = req.user;

    const result = await GroupTravelService.createAttendanceCheck(
      groupId,
      userID,
      req.body
    );

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error creating attendance check:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { groupId, attendanceId } = req.params;
    const { status } = req.body; // 'present' or 'absent'
    const { userID } = req.user;

    const result = await GroupTravelService.markAttendance(
      groupId,
      attendanceId,
      userID,
      status
    );

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAttendanceReport = async (req, res) => {
  try {
    const { groupId, attendanceId } = req.params;
    const { userID } = req.user;

    const result = await GroupTravelService.getAttendanceReport(
      groupId,
      attendanceId,
      userID
    );

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error getting attendance report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 4. SOS Emergency System
const createSOS = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userID } = req.user;

    const result = await GroupTravelService.createSOS(
      groupId,
      userID,
      req.body
    );

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error creating SOS alert:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const respondToSOS = async (req, res) => {
  try {
    const { groupId, sosId } = req.params;
    const { response } = req.body; // 'acknowledged', 'on-way', 'reached', 'resolved'
    const { userID } = req.user;

    const result = await GroupTravelService.respondToSOS(
      groupId,
      sosId,
      userID,
      response
    );

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error responding to SOS:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getActiveSOS = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userID } = req.user;

    const result = await GroupTravelService.getActiveSOS(groupId, userID);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error getting active SOS:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 5. Group Announcements
const createAnnouncement = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userID } = req.user;

    const result = await GroupTravelService.createAnnouncement(
      groupId,
      userID,
      req.body
    );

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const markAnnouncementAsRead = async (req, res) => {
  try {
    const { groupId, announcementId } = req.params;
    const { userID } = req.user;

    const result = await GroupTravelService.markAnnouncementAsRead(
      groupId,
      announcementId,
      userID
    );

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error marking announcement as read:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getGroupAnnouncements = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userID } = req.user;

    const result = await GroupTravelService.getGroupAnnouncements(
      groupId,
      userID
    );

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error getting announcements:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 6. Dashboard and Statistics
const getGroupDashboard = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userID } = req.user;

    const result = await GroupTravelService.getGroupDashboard(groupId, userID);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error getting dashboard:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getGroupStatistics = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userID } = req.user;

    const result = await GroupTravelService.getGroupStatistics(groupId, userID);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error getting statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createGroup,
  getAllGroups,
  joinGroup,
  // New Group Travel Features
  addOrganizer,
  removeOrganizer,
  addGroupExpense,
  approveExpense,
  getGroupExpenses,
  createAttendanceCheck,
  markAttendance,
  getAttendanceReport,
  createSOS,
  respondToSOS,
  getActiveSOS,
  createAnnouncement,
  markAnnouncementAsRead,
  getGroupAnnouncements,
  getGroupDashboard,
  getGroupStatistics,
};
