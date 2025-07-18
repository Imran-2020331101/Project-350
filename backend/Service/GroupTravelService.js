const Group = require("../models/group");
const { v4: uuidv4 } = require("uuid");

// Group Travel Management System
// This service handles all advanced group travel features

class GroupTravelService {
  // 1. ORGANIZER MANAGEMENT

  /**
   * Add a new organizer to the group
   */
  static async addOrganizer(groupId, currentUserID, newOrganizerUserId) {
    try {
      const group = await Group.findById(groupId);

      if (!group) {
        return { success: false, message: "Group not found" };
      }

      // Check if user is owner or organizer
      if (
        group.owner !== currentUserID &&
        !group.organizers.includes(currentUserID)
      ) {
        return {
          success: false,
          message: "Only owners and organizers can add organizers",
        };
      }

      // Check if user is already an organizer
      if (group.organizers.includes(newOrganizerUserId)) {
        return { success: false, message: "User is already an organizer" };
      }

      // Check if user is a participant
      if (!group.participants.includes(newOrganizerUserId)) {
        return { success: false, message: "User must be a participant first" };
      }

      group.organizers.push(newOrganizerUserId);
      await group.save();

      return {
        success: true,
        message: "Organizer added successfully",
        organizers: group.organizers,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error adding organizer",
        error: error.message,
      };
    }
  }

  /**
   * Remove an organizer from the group
   */
  static async removeOrganizer(groupId, currentUserID, organizerToRemove) {
    try {
      const group = await Group.findById(groupId);

      if (!group) {
        return { success: false, message: "Group not found" };
      }

      // Only owner can remove organizers
      if (group.owner !== currentUserID) {
        return {
          success: false,
          message: "Only the group owner can remove organizers",
        };
      }

      // Cannot remove the owner
      if (organizerToRemove === group.owner) {
        return { success: false, message: "Cannot remove the group owner" };
      }

      group.organizers = group.organizers.filter(
        (org) => org !== organizerToRemove
      );
      await group.save();

      return {
        success: true,
        message: "Organizer removed successfully",
        organizers: group.organizers,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error removing organizer",
        error: error.message,
      };
    }
  }

  // 2. GROUP EXPENSE MANAGEMENT

  /**
   * Add a new expense to the group
   */
  static async addGroupExpense(groupId, userID, expenseData) {
    try {
      const { amount, description, category, splitAmong, receiptImage } =
        expenseData;

      const group = await Group.findById(groupId);

      if (!group) {
        return { success: false, message: "Group not found" };
      }

      // Check if user is a participant
      if (!group.participants.includes(userID)) {
        return {
          success: false,
          message: "Only group participants can add expenses",
        };
      }

      // Check if expense submission is allowed
      if (!group.settings.allowExpenseSubmission) {
        return {
          success: false,
          message: "Expense submission is not allowed for this group",
        };
      }

      const expense = {
        expenseID: uuidv4(),
        paidBy: userID,
        amount: parseFloat(amount),
        description,
        category,
        splitAmong: splitAmong || [],
        receiptImage,
        date: new Date(),
        status: group.settings.requireExpenseApproval ? "pending" : "approved",
      };

      group.groupExpenses.push(expense);
      await group.save();

      return {
        success: true,
        message: "Expense added successfully",
        expense,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error adding expense",
        error: error.message,
      };
    }
  }

  /**
   * Approve or reject an expense
   */
  static async approveExpense(groupId, expenseId, userID, action) {
    try {
      const group = await Group.findById(groupId);

      if (!group) {
        return { success: false, message: "Group not found" };
      }

      // Check if user is organizer
      if (!group.organizers.includes(userID)) {
        return {
          success: false,
          message: "Only organizers can approve expenses",
        };
      }

      const expense = group.groupExpenses.find(
        (exp) => exp.expenseID === expenseId
      );

      if (!expense) {
        return { success: false, message: "Expense not found" };
      }

      expense.status = action; // 'approved' or 'rejected'
      expense.approvedBy = userID;
      await group.save();

      return {
        success: true,
        message: `Expense ${action} successfully`,
        expense,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error ${action} expense`,
        error: error.message,
      };
    }
  }

  /**
   * Get all group expenses with summary
   */
  static async getGroupExpenses(groupId, userID) {
    try {
      const group = await Group.findById(groupId);

      if (!group) {
        return { success: false, message: "Group not found" };
      }

      // Check if user is participant
      if (!group.participants.includes(userID)) {
        return {
          success: false,
          message: "Only group participants can view expenses",
        };
      }

      const expenses = group.groupExpenses;
      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const approvedExpenses = expenses.filter(
        (exp) => exp.status === "approved"
      );
      const totalApproved = approvedExpenses.reduce(
        (sum, exp) => sum + exp.amount,
        0
      );

      return {
        success: true,
        expenses,
        summary: {
          totalExpenses,
          totalApproved,
          pendingExpenses: expenses.filter((exp) => exp.status === "pending")
            .length,
          approvedExpenses: approvedExpenses.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Error getting expenses",
        error: error.message,
      };
    }
  }

  // 3. ATTENDANCE TRACKING

  /**
   * Create a new attendance check
   */
  static async createAttendanceCheck(groupId, userID, attendanceData) {
    try {
      const {
        title,
        description,
        location,
        expirationMinutes = 30,
      } = attendanceData;

      const group = await Group.findById(groupId);

      if (!group) {
        return { success: false, message: "Group not found" };
      }

      // Check if user is organizer
      if (!group.organizers.includes(userID)) {
        return {
          success: false,
          message: "Only organizers can create attendance checks",
        };
      }

      const attendanceCheck = {
        attendanceID: uuidv4(),
        createdBy: userID,
        title,
        description,
        location,
        responses: group.participants.map((participantId) => ({
          userID: participantId,
          status: "no-response",
        })),
        expiresAt: new Date(Date.now() + expirationMinutes * 60 * 1000),
        isActive: true,
        createdAt: new Date(),
      };

      group.attendanceChecks.push(attendanceCheck);
      await group.save();

      return {
        success: true,
        message: "Attendance check created successfully",
        attendanceCheck,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error creating attendance check",
        error: error.message,
      };
    }
  }

  /**
   * Mark attendance for a user
   */
  static async markAttendance(groupId, attendanceId, userID, status) {
    try {
      const group = await Group.findById(groupId);

      if (!group) {
        return { success: false, message: "Group not found" };
      }

      // Check if user is participant
      if (!group.participants.includes(userID)) {
        return {
          success: false,
          message: "Only group participants can mark attendance",
        };
      }

      const attendanceCheck = group.attendanceChecks.find(
        (check) => check.attendanceID === attendanceId
      );

      if (!attendanceCheck) {
        return { success: false, message: "Attendance check not found" };
      }

      if (!attendanceCheck.isActive || new Date() > attendanceCheck.expiresAt) {
        return { success: false, message: "Attendance check has expired" };
      }

      const userResponse = attendanceCheck.responses.find(
        (resp) => resp.userID === userID
      );

      if (userResponse) {
        userResponse.status = status;
        userResponse.timestamp = new Date();
        await group.save();
      }

      return {
        success: true,
        message: "Attendance marked successfully",
        response: userResponse,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error marking attendance",
        error: error.message,
      };
    }
  }

  /**
   * Get attendance report for organizers
   */
  static async getAttendanceReport(groupId, attendanceId, userID) {
    try {
      const group = await Group.findById(groupId);

      if (!group) {
        return { success: false, message: "Group not found" };
      }

      // Check if user is organizer
      if (!group.organizers.includes(userID)) {
        return {
          success: false,
          message: "Only organizers can view attendance reports",
        };
      }

      const attendanceCheck = group.attendanceChecks.find(
        (check) => check.attendanceID === attendanceId
      );

      if (!attendanceCheck) {
        return { success: false, message: "Attendance check not found" };
      }

      const summary = {
        total: attendanceCheck.responses.length,
        present: attendanceCheck.responses.filter((r) => r.status === "present")
          .length,
        absent: attendanceCheck.responses.filter((r) => r.status === "absent")
          .length,
        noResponse: attendanceCheck.responses.filter(
          (r) => r.status === "no-response"
        ).length,
      };

      return {
        success: true,
        attendanceCheck,
        summary,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error getting attendance report",
        error: error.message,
      };
    }
  }

  // 4. SOS EMERGENCY SYSTEM

  /**
   * Create a new SOS alert
   */
  static async createSOS(groupId, userID, sosData) {
    try {
      const { message, location, priority = "high" } = sosData;

      const group = await Group.findById(groupId);

      if (!group) {
        return { success: false, message: "Group not found" };
      }

      // Check if user is participant
      if (!group.participants.includes(userID)) {
        return {
          success: false,
          message: "Only group participants can create SOS alerts",
        };
      }

      const sosAlert = {
        sosID: uuidv4(),
        createdBy: userID,
        message: message || "Emergency! Need immediate help!",
        location,
        priority,
        status: "active",
        respondedBy: [],
        createdAt: new Date(),
      };

      group.sosAlerts.push(sosAlert);
      await group.save();

      // TODO: Send push notifications to all group members and organizers
      // TODO: If autoNotifyEmergencyServices is enabled, call emergency services

      return {
        success: true,
        message: "SOS alert created successfully",
        sosAlert,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error creating SOS alert",
        error: error.message,
      };
    }
  }

  /**
   * Respond to an SOS alert
   */
  static async respondToSOS(groupId, sosId, userID, response) {
    try {
      const group = await Group.findById(groupId);

      if (!group) {
        return { success: false, message: "Group not found" };
      }

      // Check if user is participant
      if (!group.participants.includes(userID)) {
        return {
          success: false,
          message: "Only group participants can respond to SOS",
        };
      }

      const sosAlert = group.sosAlerts.find((alert) => alert.sosID === sosId);

      if (!sosAlert) {
        return { success: false, message: "SOS alert not found" };
      }

      if (sosAlert.status !== "active") {
        return { success: false, message: "SOS alert is not active" };
      }

      // Update or add response
      const existingResponse = sosAlert.respondedBy.find(
        (resp) => resp.userID === userID
      );

      if (existingResponse) {
        existingResponse.response = response;
        existingResponse.timestamp = new Date();
      } else {
        sosAlert.respondedBy.push({
          userID,
          response,
          timestamp: new Date(),
        });
      }

      // If someone resolved the SOS, mark it as resolved
      if (response === "resolved") {
        sosAlert.status = "resolved";
        sosAlert.resolvedAt = new Date();
      }

      await group.save();

      return {
        success: true,
        message: "SOS response recorded successfully",
        sosAlert,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error responding to SOS",
        error: error.message,
      };
    }
  }

  /**
   * Get all active SOS alerts
   */
  static async getActiveSOS(groupId, userID) {
    try {
      const group = await Group.findById(groupId);

      if (!group) {
        return { success: false, message: "Group not found" };
      }

      // Check if user is participant
      if (!group.participants.includes(userID)) {
        return {
          success: false,
          message: "Only group participants can view SOS alerts",
        };
      }

      const activeSOS = group.sosAlerts.filter(
        (alert) => alert.status === "active"
      );

      return {
        success: true,
        activeSOS,
        count: activeSOS.length,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error getting active SOS",
        error: error.message,
      };
    }
  }

  // 5. GROUP ANNOUNCEMENTS

  /**
   * Create a new announcement
   */
  static async createAnnouncement(groupId, userID, announcementData) {
    try {
      const {
        title,
        message,
        priority = "medium",
        attachments,
      } = announcementData;

      const group = await Group.findById(groupId);

      if (!group) {
        return { success: false, message: "Group not found" };
      }

      // Check if user is organizer
      if (!group.organizers.includes(userID)) {
        return {
          success: false,
          message: "Only organizers can create announcements",
        };
      }

      const announcement = {
        announcementID: uuidv4(),
        createdBy: userID,
        title,
        message,
        priority,
        attachments: attachments || [],
        readBy: [],
        createdAt: new Date(),
      };

      group.announcements.push(announcement);
      await group.save();

      // TODO: Send push notifications to all group members

      return {
        success: true,
        message: "Announcement created successfully",
        announcement,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error creating announcement",
        error: error.message,
      };
    }
  }

  /**
   * Mark announcement as read
   */
  static async markAnnouncementAsRead(groupId, announcementId, userID) {
    try {
      const group = await Group.findById(groupId);

      if (!group) {
        return { success: false, message: "Group not found" };
      }

      // Check if user is participant
      if (!group.participants.includes(userID)) {
        return {
          success: false,
          message: "Only group participants can mark announcements as read",
        };
      }

      const announcement = group.announcements.find(
        (ann) => ann.announcementID === announcementId
      );

      if (!announcement) {
        return { success: false, message: "Announcement not found" };
      }

      // Check if already read
      const alreadyRead = announcement.readBy.find(
        (read) => read.userID === userID
      );

      if (!alreadyRead) {
        announcement.readBy.push({
          userID,
          readAt: new Date(),
        });
        await group.save();
      }

      return {
        success: true,
        message: "Announcement marked as read",
      };
    } catch (error) {
      return {
        success: false,
        message: "Error marking announcement as read",
        error: error.message,
      };
    }
  }

  /**
   * Get all group announcements
   */
  static async getGroupAnnouncements(groupId, userID) {
    try {
      const group = await Group.findById(groupId);

      if (!group) {
        return { success: false, message: "Group not found" };
      }

      // Check if user is participant
      if (!group.participants.includes(userID)) {
        return {
          success: false,
          message: "Only group participants can view announcements",
        };
      }

      const announcements = group.announcements.map((ann) => ({
        ...ann.toObject(),
        isRead: ann.readBy.some((read) => read.userID === userID),
      }));

      return {
        success: true,
        announcements,
        unreadCount: announcements.filter((ann) => !ann.isRead).length,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error getting announcements",
        error: error.message,
      };
    }
  }

  // 6. UTILITY FUNCTIONS

  /**
   * Get comprehensive group dashboard data
   */
  static async getGroupDashboard(groupId, userID) {
    try {
      const group = await Group.findById(groupId);

      if (!group) {
        return { success: false, message: "Group not found" };
      }

      // Check if user is participant
      if (!group.participants.includes(userID)) {
        return {
          success: false,
          message: "Only group participants can view dashboard",
        };
      }

      const isOrganizer = group.organizers.includes(userID);
      const activeSOS = group.sosAlerts.filter(
        (alert) => alert.status === "active"
      ).length;
      const activeAttendance = group.attendanceChecks.filter(
        (check) => check.isActive && new Date() <= check.expiresAt
      ).length;
      const unreadAnnouncements = group.announcements.filter(
        (ann) => !ann.readBy.some((read) => read.userID === userID)
      ).length;
      const pendingExpenses = group.groupExpenses.filter(
        (exp) => exp.status === "pending"
      ).length;

      return {
        success: true,
        dashboard: {
          groupInfo: {
            id: group._id,
            name: group.groupName,
            title: group.title,
            place: group.place,
            startDate: group.startDate,
            endDate: group.endDate,
            participantCount: group.participants.length,
            organizerCount: group.organizers.length,
            isOrganizer,
          },
          alerts: {
            activeSOS,
            activeAttendance,
            unreadAnnouncements,
            pendingExpenses: isOrganizer ? pendingExpenses : 0,
          },
          recentActivity: {
            lastAnnouncement:
              group.announcements[group.announcements.length - 1],
            lastExpense: group.groupExpenses[group.groupExpenses.length - 1],
            lastAttendance:
              group.attendanceChecks[group.attendanceChecks.length - 1],
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Error getting dashboard data",
        error: error.message,
      };
    }
  }

  /**
   * Get group statistics for organizers
   */
  static async getGroupStatistics(groupId, userID) {
    try {
      const group = await Group.findById(groupId);

      if (!group) {
        return { success: false, message: "Group not found" };
      }

      // Check if user is organizer
      if (!group.organizers.includes(userID)) {
        return {
          success: false,
          message: "Only organizers can view statistics",
        };
      }

      const totalExpenses = group.groupExpenses.reduce(
        (sum, exp) => sum + exp.amount,
        0
      );
      const approvedExpenses = group.groupExpenses.filter(
        (exp) => exp.status === "approved"
      );
      const totalApproved = approvedExpenses.reduce(
        (sum, exp) => sum + exp.amount,
        0
      );

      const attendanceStats = group.attendanceChecks.map((check) => ({
        id: check.attendanceID,
        title: check.title,
        total: check.responses.length,
        present: check.responses.filter((r) => r.status === "present").length,
        responseRate:
          (check.responses.filter((r) => r.status !== "no-response").length /
            check.responses.length) *
          100,
      }));

      return {
        success: true,
        statistics: {
          participants: {
            total: group.participants.length,
            organizers: group.organizers.length,
            active: group.participants.length, // TODO: Add last activity tracking
          },
          expenses: {
            total: totalExpenses,
            approved: totalApproved,
            pending: group.groupExpenses.filter(
              (exp) => exp.status === "pending"
            ).length,
            perPerson:
              group.participants.length > 0
                ? totalApproved / group.participants.length
                : 0,
          },
          safety: {
            totalSOS: group.sosAlerts.length,
            activeSOS: group.sosAlerts.filter(
              (alert) => alert.status === "active"
            ).length,
            resolvedSOS: group.sosAlerts.filter(
              (alert) => alert.status === "resolved"
            ).length,
            averageResponseTime: 0, // TODO: Calculate average response time
          },
          attendance: {
            totalChecks: group.attendanceChecks.length,
            activeChecks: group.attendanceChecks.filter(
              (check) => check.isActive
            ).length,
            averageAttendance:
              attendanceStats.length > 0
                ? attendanceStats.reduce(
                    (sum, stat) => sum + stat.responseRate,
                    0
                  ) / attendanceStats.length
                : 0,
          },
          announcements: {
            total: group.announcements.length,
            byPriority: {
              urgent: group.announcements.filter(
                (ann) => ann.priority === "urgent"
              ).length,
              high: group.announcements.filter((ann) => ann.priority === "high")
                .length,
              medium: group.announcements.filter(
                (ann) => ann.priority === "medium"
              ).length,
              low: group.announcements.filter((ann) => ann.priority === "low")
                .length,
            },
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Error getting statistics",
        error: error.message,
      };
    }
  }
}

module.exports = GroupTravelService;
