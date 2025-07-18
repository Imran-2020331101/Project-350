/**
 * app.js - Main application file for the Express.js backend.
 *
 * This file sets up the Express server, imports necessary middleware and controllers,
 * defines the API routes, and starts the server.
 */
const mongoose = require("mongoose");
const express = require("express");
const multer = require("multer");
// const helmet = require('helmet');
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./config/swagger-output.json");
const verifyJwt = require("./middleware/verifyJwt");

// const { GoogleGenerativeAI } = require("@google/generative-ai"); // Uncomment and configure if using Gemini API
const {
  getAllBlogs,
  createBlog,
  deleteBlog,
  updateBlog,
  addCommentToBlog,
  addReplyToComment,
  addLikeToBlog,
} = require("./Service/BlogService");
const {
  handleLogin,
  handleRegister,
  handleLogout,
  handleProfileUpdate,
  refreshToken,
  sendVerificationOTP,
  verifyEmailOTP,
  resendVerificationOTP,
  checkOTPStatus,
} = require("./Service/AuthService");
const {
  createTrip,
  getAllTrips,
  deleteTrip,
} = require("./Service/TripService");

const {
  createGroup,
  getAllGroups,
  joinGroup,
  // New group travel management functions
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
} = require("./Service/GroupService");
const {
  uploadImage,
  getPhotos,
  uploadProfilePicture,
} = require("./Service/ImageService");
const { translateText } = require("./Service/TranslateService");
const {
  getEmergencyContacts,
  getContactTypes,
  addEmergencyContact,
  searchEmergencyContacts,
  updateEmergencyContact,
  deleteEmergencyContact,
} = require("./Service/EmergencyService");

const ExpenseService = require("./Service/ExpenseService");

const app = express();
const port = process.env.PORT || 3000;
const upload = multer();

const connectDB = require("./config/MongoConfig");
require("dotenv").config();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Middleware
// app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("Registered Mongoose models:", mongoose.modelNames());

app.route("/api/trips").post(createTrip);

app.route("/api/trips/:id").delete(deleteTrip).get(getAllTrips);

app.route("/api/blogs").get(getAllBlogs).post(createBlog).put(updateBlog);

app.delete("/api/blogs/:id", deleteBlog); // Assumes blog ID is passed as URL param
app.post("/api/blogs/:id/comments", addCommentToBlog);
app.post("/api/blogs/:blogId/comments/:commentId/replies", addReplyToComment);
app.post("/api/blogs/:id/like", addLikeToBlog);

app.post("/api/auth/login", handleLogin);
app.post("/api/auth/register", handleRegister);
app.post("/api/auth/logout", handleLogout);
app.post("/api/auth/profile/update", handleProfileUpdate);
app.post("/api/auth/refresh", refreshToken);

// OTP verification routes
app.post("/api/auth/send-verification-otp", sendVerificationOTP);
app.post("/api/auth/verify-email", verifyEmailOTP);
app.post("/api/auth/resend-verification-otp", resendVerificationOTP);
app.get("/api/auth/otp-status", checkOTPStatus);

app.route("/api/groups").post(createGroup).get(getAllGroups);
app.route("/api/groups/:id/join").post(joinGroup);
app.route("/api/groups/:id/cancel").post(joinGroup); // Reusing joinGroup for cancellation

// Group Travel Management Routes
app.post("/api/groups/:id/organizers", verifyJwt, addOrganizer);
app.delete(
  "/api/groups/:id/organizers/:organizerId",
  verifyJwt,
  removeOrganizer
);
app.get("/api/groups/:id/dashboard", verifyJwt, getGroupDashboard);
app.get("/api/groups/:id/statistics", verifyJwt, getGroupStatistics);

// Group Expense Management Routes
app.post("/api/groups/:id/expenses", verifyJwt, addGroupExpense);
app.get("/api/groups/:id/expenses", verifyJwt, getGroupExpenses);
app.post(
  "/api/groups/:id/expenses/:expenseId/approve",
  verifyJwt,
  approveExpense
);

// Group Attendance Management Routes
app.post("/api/groups/:id/attendance", verifyJwt, createAttendanceCheck);
app.post(
  "/api/groups/:id/attendance/:attendanceId/mark",
  verifyJwt,
  markAttendance
);
app.get("/api/groups/:id/attendance/report", verifyJwt, getAttendanceReport);

// Group SOS & Emergency Routes
app.post("/api/groups/:id/sos", verifyJwt, createSOS);
app.get("/api/groups/:id/sos", verifyJwt, getActiveSOS);
app.post("/api/groups/:id/sos/:sosId/respond", verifyJwt, respondToSOS);

// Group Announcements Routes
app.post("/api/groups/:id/announcements", verifyJwt, createAnnouncement);
app.get("/api/groups/:id/announcements", verifyJwt, getGroupAnnouncements);
app.post(
  "/api/groups/:id/announcements/:announcementId/read",
  verifyJwt,
  markAnnouncementAsRead
);

app.post("/api/upload-image", upload.array("images"), uploadImage);
app.post(
  "/api/upload-image/profile",
  upload.array("images"),
  uploadProfilePicture
);
app.get("/api/photos/:id", getPhotos);

app.post("/api/translate", translateText);

// Emergency assistance routes
app.get("/api/emergency/types", getContactTypes);
app.get("/api/emergency/search", searchEmergencyContacts);
app.get("/api/emergency/:location", getEmergencyContacts);
app.post("/api/emergency", addEmergencyContact);
app.put("/api/emergency/:id", updateEmergencyContact);
app.delete("/api/emergency/:id", deleteEmergencyContact);

// Expense tracking routes
app.get("/api/expenses/categories", async (req, res) => {
  const result = await ExpenseService.getExpenseCategories();
  res.status(200).json(result);
});

app.get("/api/expenses/summary", verifyJwt, async (req, res) => {
  const { userID } = req.user;
  const { startDate, endDate, tripID } = req.query;

  const result = await ExpenseService.getExpenseSummary(userID, {
    startDate,
    endDate,
    tripID,
  });

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

app.get("/api/expenses/search", verifyJwt, async (req, res) => {
  const { userID } = req.user;
  const { q: searchTerm, page, limit } = req.query;

  if (!searchTerm) {
    return res.status(400).json({
      success: false,
      message: "Search term is required",
    });
  }

  const result = await ExpenseService.searchExpenses(userID, searchTerm, {
    page,
    limit,
  });

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

app.get("/api/expenses", verifyJwt, async (req, res) => {
  const { userID } = req.user;
  const filters = req.query;

  const result = await ExpenseService.getUserExpenses(userID, filters);

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

app.get("/api/expenses/:expenseID", verifyJwt, async (req, res) => {
  const { userID } = req.user;
  const { expenseID } = req.params;

  const result = await ExpenseService.getExpenseById(expenseID, userID);

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(404).json(result);
  }
});

app.post("/api/expenses", verifyJwt, async (req, res) => {
  const { userID } = req.user;
  const expenseData = req.body;

  const result = await ExpenseService.addExpense(userID, expenseData);

  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(400).json(result);
  }
});

app.put("/api/expenses/:expenseID", verifyJwt, async (req, res) => {
  const { userID } = req.user;
  const { expenseID } = req.params;
  const updateData = req.body;

  const result = await ExpenseService.updateExpense(
    expenseID,
    userID,
    updateData
  );

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

app.delete("/api/expenses/:expenseID", verifyJwt, async (req, res) => {
  const { userID } = req.user;
  const { expenseID } = req.params;

  const result = await ExpenseService.deleteExpense(expenseID, userID);

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

connectDB();

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
