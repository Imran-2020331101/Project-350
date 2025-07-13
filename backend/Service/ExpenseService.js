const Expense = require("../models/expense");
const { v4: uuidv4 } = require("uuid");

class ExpenseService {
  /**
   * Get all expenses for a user with optional filters
   */
  static async getUserExpenses(userID, filters = {}) {
    try {
      const {
        category,
        startDate,
        endDate,
        tripID,
        minAmount,
        maxAmount,
        page = 1,
        limit = 50,
        sortBy = "date",
        sortOrder = "desc",
      } = filters;

      // Build query
      const query = { userID };

      if (category) query.category = category;
      if (tripID) query.tripID = tripID;

      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }

      if (minAmount !== undefined || maxAmount !== undefined) {
        query.amount = {};
        if (minAmount !== undefined) query.amount.$gte = parseFloat(minAmount);
        if (maxAmount !== undefined) query.amount.$lte = parseFloat(maxAmount);
      }

      // Sort configuration
      const sortConfig = {};
      sortConfig[sortBy] = sortOrder === "desc" ? -1 : 1;

      // Execute query with pagination
      const skip = (page - 1) * limit;
      const expenses = await Expense.find(query)
        .sort(sortConfig)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const totalExpenses = await Expense.countDocuments(query);
      const totalPages = Math.ceil(totalExpenses / limit);

      return {
        success: true,
        expenses,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalExpenses,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to retrieve expenses",
        error: error.message,
      };
    }
  }

  /**
   * Get expense by ID
   */
  static async getExpenseById(expenseID, userID) {
    try {
      const expense = await Expense.findOne({
        expenseID,
        userID,
      }).lean();

      if (!expense) {
        return {
          success: false,
          message: "Expense not found",
        };
      }

      return {
        success: true,
        expense,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to retrieve expense",
        error: error.message,
      };
    }
  }

  /**
   * Add a new expense
   */
  static async addExpense(userID, expenseData) {
    try {
      const {
        category,
        subcategory,
        amount,
        currency = "USD",
        date,
        description,
        location,
        paymentMethod = "cash",
        receiptURL,
        tags = [],
        notes,
        tripID,
        isRecurring = false,
      } = expenseData;

      // Validate required fields
      if (!category || !amount || !description) {
        return {
          success: false,
          message: "Category, amount, and description are required",
        };
      }

      if (amount <= 0) {
        return {
          success: false,
          message: "Amount must be greater than 0",
        };
      }

      const expense = new Expense({
        expenseID: uuidv4(),
        userID,
        category,
        subcategory,
        amount: parseFloat(amount),
        currency: currency.toUpperCase(),
        date: date ? new Date(date) : new Date(),
        description: description.trim(),
        location: location?.trim(),
        paymentMethod,
        receiptURL,
        tags: tags.filter((tag) => tag.trim() !== ""),
        notes: notes?.trim(),
        tripID,
        isRecurring,
      });

      await expense.save();

      return {
        success: true,
        message: "Expense added successfully",
        expense: expense.toObject(),
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to add expense",
        error: error.message,
      };
    }
  }

  /**
   * Update an expense
   */
  static async updateExpense(expenseID, userID, updateData) {
    try {
      const expense = await Expense.findOne({ expenseID, userID });

      if (!expense) {
        return {
          success: false,
          message: "Expense not found",
        };
      }

      // Validate amount if being updated
      if (updateData.amount !== undefined && updateData.amount <= 0) {
        return {
          success: false,
          message: "Amount must be greater than 0",
        };
      }

      // Update fields
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] !== undefined) {
          if (key === "amount") {
            expense[key] = parseFloat(updateData[key]);
          } else if (key === "currency") {
            expense[key] = updateData[key].toUpperCase();
          } else if (key === "date") {
            expense[key] = new Date(updateData[key]);
          } else if (key === "tags") {
            expense[key] = updateData[key].filter((tag) => tag.trim() !== "");
          } else if (typeof updateData[key] === "string") {
            expense[key] = updateData[key].trim();
          } else {
            expense[key] = updateData[key];
          }
        }
      });

      await expense.save();

      return {
        success: true,
        message: "Expense updated successfully",
        expense: expense.toObject(),
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to update expense",
        error: error.message,
      };
    }
  }

  /**
   * Delete an expense
   */
  static async deleteExpense(expenseID, userID) {
    try {
      const expense = await Expense.findOneAndDelete({
        expenseID,
        userID,
      });

      if (!expense) {
        return {
          success: false,
          message: "Expense not found",
        };
      }

      return {
        success: true,
        message: "Expense deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to delete expense",
        error: error.message,
      };
    }
  }

  /**
   * Get expense summary and analytics
   */
  static async getExpenseSummary(userID, filters = {}) {
    try {
      const {
        startDate = new Date(new Date().getFullYear(), 0, 1), // Start of current year
        endDate = new Date(),
        tripID,
      } = filters;

      // Build base query
      const baseQuery = {
        userID,
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };

      if (tripID) baseQuery.tripID = tripID;

      // Get total amount and count
      const totalStats = await Expense.aggregate([
        { $match: baseQuery },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
            totalExpenses: { $sum: 1 },
            avgExpense: { $avg: "$amount" },
            maxExpense: { $max: "$amount" },
            minExpense: { $min: "$amount" },
          },
        },
      ]);

      // Get category breakdown
      const categoryBreakdown = await Expense.aggregate([
        { $match: baseQuery },
        {
          $group: {
            _id: "$category",
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 },
            avgAmount: { $avg: "$amount" },
          },
        },
        { $sort: { totalAmount: -1 } },
      ]);

      // Get monthly breakdown
      const monthlyBreakdown = await Expense.aggregate([
        { $match: baseQuery },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
            },
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);

      // Get payment method breakdown
      const paymentMethodBreakdown = await Expense.aggregate([
        { $match: baseQuery },
        {
          $group: {
            _id: "$paymentMethod",
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { totalAmount: -1 } },
      ]);

      // Get recent expenses
      const recentExpenses = await Expense.find(baseQuery)
        .sort({ date: -1 })
        .limit(10)
        .lean();

      return {
        success: true,
        summary: {
          overview: totalStats[0] || {
            totalAmount: 0,
            totalExpenses: 0,
            avgExpense: 0,
            maxExpense: 0,
            minExpense: 0,
          },
          categoryBreakdown,
          monthlyBreakdown,
          paymentMethodBreakdown,
          recentExpenses,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to generate expense summary",
        error: error.message,
      };
    }
  }

  /**
   * Get available expense categories
   */
  static async getExpenseCategories() {
    return {
      success: true,
      categories: [
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
    };
  }

  /**
   * Search expenses by description or tags
   */
  static async searchExpenses(userID, searchTerm, filters = {}) {
    try {
      const { page = 1, limit = 20 } = filters;

      const query = {
        userID,
        $or: [
          { description: { $regex: searchTerm, $options: "i" } },
          { tags: { $in: [new RegExp(searchTerm, "i")] } },
          { location: { $regex: searchTerm, $options: "i" } },
        ],
      };

      const skip = (page - 1) * limit;
      const expenses = await Expense.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const totalResults = await Expense.countDocuments(query);

      return {
        success: true,
        expenses,
        totalResults,
        searchTerm,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to search expenses",
        error: error.message,
      };
    }
  }
}

module.exports = ExpenseService;
