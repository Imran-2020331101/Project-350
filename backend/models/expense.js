const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    expenseID: {
      type: String,
      required: true,
      unique: true,
    },
    userID: {
      type: String,
      required: true,
      ref: "User",
      index: true,
    },
    tripID: {
      type: String,
      ref: "Trip",
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "accommodation",
        "transportation",
        "food",
        "entertainment",
        "shopping",
        "tours",
        "insurance",
        "visa",
        "health",
        "miscellaneous",
      ],
    },
    subcategory: {
      type: String,
      default: "",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "USD",
      uppercase: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    location: {
      type: String,
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "digital_wallet", "bank_transfer", "other"],
      default: "cash",
    },
    receiptURL: {
      type: String,
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isRecurring: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
expenseSchema.index({ userID: 1, date: -1 });
expenseSchema.index({ userID: 1, category: 1 });
expenseSchema.index({ userID: 1, tripID: 1 });
expenseSchema.index({ date: -1 });

// Virtual for formatted amount
expenseSchema.virtual("formattedAmount").get(function () {
  return `${this.currency} ${this.amount.toFixed(2)}`;
});

// Method to get expense summary by category
expenseSchema.statics.getCategorySummary = async function (
  userID,
  startDate,
  endDate
) {
  return this.aggregate([
    {
      $match: {
        userID: userID,
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: "$category",
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 },
        avgAmount: { $avg: "$amount" },
      },
    },
    {
      $sort: { totalAmount: -1 },
    },
  ]);
};

module.exports = mongoose.model("Expense", expenseSchema);
