const mongoose = require("mongoose");

// Schema for group expenses
const groupExpenseSchema = new mongoose.Schema({
  expenseID: {
    type: String,
    required: true,
    unique: true,
  },
  paidBy: {
    type: String, // userID of who paid
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: "USD",
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "accommodation",
      "transportation",
      "food",
      "entertainment",
      "miscellaneous",
    ],
    required: true,
  },
  splitAmong: [
    {
      userID: String,
      amount: Number,
      isPaid: {
        type: Boolean,
        default: false,
      },
    },
  ],
  receiptImage: String,
  date: {
    type: Date,
    default: Date.now,
  },
  approvedBy: String, // organizerID who approved
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

// Schema for attendance tracking
const attendanceSchema = new mongoose.Schema({
  attendanceID: {
    type: String,
    required: true,
    unique: true,
  },
  createdBy: {
    type: String, // organizerID
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  location: {
    name: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  responses: [
    {
      userID: String,
      status: {
        type: String,
        enum: ["present", "absent", "no-response"],
        default: "no-response",
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  expiresAt: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Schema for SOS alerts
const sosSchema = new mongoose.Schema({
  sosID: {
    type: String,
    required: true,
    unique: true,
  },
  createdBy: {
    type: String, // userID
    required: true,
  },
  message: {
    type: String,
    default: "Emergency! Need immediate help!",
  },
  location: {
    name: String,
    coordinates: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "high",
  },
  status: {
    type: String,
    enum: ["active", "resolved", "false-alarm"],
    default: "active",
  },
  respondedBy: [
    {
      userID: String,
      response: {
        type: String,
        enum: ["acknowledged", "on-way", "reached", "resolved"],
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  resolvedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Schema for group announcements
const announcementSchema = new mongoose.Schema({
  announcementID: {
    type: String,
    required: true,
    unique: true,
  },
  createdBy: {
    type: String, // organizerID
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },
  readBy: [
    {
      userID: String,
      readAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  attachments: [
    {
      type: String, // URLs to images/files
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const groupSchema = new mongoose.Schema(
  {
    trip: {
      type: String, //tripID
      // required: true,
    },
    groupName: {
      type: String,
      default: "Group : " + Date.now,
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
    activities: [
      {
        type: String,
      },
    ],
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
      type: String, // user ID or email - main creator
      required: true,
    },
    organizers: [
      {
        type: String, // list of user IDs who can manage the group
      },
    ],
    participants: [
      {
        type: String, // list of user IDs or emails
      },
    ],
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
      enum: ["public", "private"],
      default: "public",
    },

    // New group travel features
    groupExpenses: [groupExpenseSchema],
    attendanceChecks: [attendanceSchema],
    sosAlerts: [sosSchema],
    announcements: [announcementSchema],

    // Group settings
    settings: {
      allowExpenseSubmission: {
        type: Boolean,
        default: true,
      },
      requireExpenseApproval: {
        type: Boolean,
        default: true,
      },
      emergencyContacts: [
        {
          name: String,
          phone: String,
          relation: String, // e.g., "Tour Guide", "Emergency Services"
        },
      ],
      sosSettings: {
        autoNotifyEmergencyServices: {
          type: Boolean,
          default: false,
        },
        emergencyServiceNumber: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("group", groupSchema);
