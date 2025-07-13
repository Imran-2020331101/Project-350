const mongoose = require("mongoose");
const Expense = require("../models/expense");
const { v4: uuidv4 } = require("uuid");

// Sample expense data for demonstration
const sampleExpenses = [
  // Bangladesh domestic trip
  {
    expenseID: uuidv4(),
    userID: "sample-user-001", // This should be replaced with actual user IDs
    tripID: "trip-bangladesh-001",
    category: "accommodation",
    subcategory: "hotel",
    amount: 3500,
    currency: "BDT",
    date: new Date("2024-12-01"),
    description: "Hotel booking in Cox's Bazar",
    location: "Cox's Bazar, Bangladesh",
    paymentMethod: "card",
    tags: ["vacation", "beach", "weekend"],
    notes: "Sea view room for 2 nights",
  },
  {
    expenseID: uuidv4(),
    userID: "sample-user-001",
    tripID: "trip-bangladesh-001",
    category: "transportation",
    subcategory: "bus",
    amount: 800,
    currency: "BDT",
    date: new Date("2024-12-01"),
    description: "Bus ticket to Cox's Bazar",
    location: "Dhaka to Cox's Bazar",
    paymentMethod: "cash",
    tags: ["transport", "long-distance"],
    notes: "AC bus ticket, round trip",
  },
  {
    expenseID: uuidv4(),
    userID: "sample-user-001",
    tripID: "trip-bangladesh-001",
    category: "food",
    subcategory: "restaurant",
    amount: 1200,
    currency: "BDT",
    date: new Date("2024-12-02"),
    description: "Seafood dinner at beach restaurant",
    location: "Cox's Bazar Beach",
    paymentMethod: "cash",
    tags: ["dinner", "seafood", "local cuisine"],
    notes: "Fresh fish and prawns with family",
  },
  {
    expenseID: uuidv4(),
    userID: "sample-user-001",
    tripID: "trip-bangladesh-001",
    category: "entertainment",
    subcategory: "activities",
    amount: 500,
    currency: "BDT",
    date: new Date("2024-12-02"),
    description: "Beach activities and water sports",
    location: "Cox's Bazar Beach",
    paymentMethod: "cash",
    tags: ["beach", "activities", "fun"],
    notes: "Jet ski and parasailing",
  },

  // International trip - Thailand
  {
    expenseID: uuidv4(),
    userID: "sample-user-002",
    tripID: "trip-thailand-001",
    category: "transportation",
    subcategory: "flight",
    amount: 350,
    currency: "USD",
    date: new Date("2024-11-15"),
    description: "Flight ticket Dhaka to Bangkok",
    location: "Dhaka to Bangkok",
    paymentMethod: "card",
    tags: ["international", "flight", "vacation"],
    notes: "Round trip ticket with Bangkok Airways",
  },
  {
    expenseID: uuidv4(),
    userID: "sample-user-002",
    tripID: "trip-thailand-001",
    category: "accommodation",
    subcategory: "hotel",
    amount: 80,
    currency: "USD",
    date: new Date("2024-11-15"),
    description: "Hotel in Bangkok city center",
    location: "Bangkok, Thailand",
    paymentMethod: "card",
    tags: ["hotel", "city center", "comfort"],
    notes: "4-star hotel near BTS station",
  },
  {
    expenseID: uuidv4(),
    userID: "sample-user-002",
    tripID: "trip-thailand-001",
    category: "visa",
    subcategory: "visa fee",
    amount: 40,
    currency: "USD",
    date: new Date("2024-11-10"),
    description: "Thailand tourist visa",
    location: "Thai Embassy, Dhaka",
    paymentMethod: "cash",
    tags: ["visa", "documentation", "required"],
    notes: "30-day tourist visa application",
  },
  {
    expenseID: uuidv4(),
    userID: "sample-user-002",
    tripID: "trip-thailand-001",
    category: "food",
    subcategory: "street food",
    amount: 15,
    currency: "USD",
    date: new Date("2024-11-16"),
    description: "Thai street food tour",
    location: "Chatuchak Market, Bangkok",
    paymentMethod: "cash",
    tags: ["street food", "local cuisine", "authentic"],
    notes: "Pad Thai, Som Tam, Mango Sticky Rice",
  },
  {
    expenseID: uuidv4(),
    userID: "sample-user-002",
    tripID: "trip-thailand-001",
    category: "tours",
    subcategory: "temple tour",
    amount: 25,
    currency: "USD",
    date: new Date("2024-11-17"),
    description: "Grand Palace and Wat Pho tour",
    location: "Bangkok, Thailand",
    paymentMethod: "card",
    tags: ["temples", "culture", "guided tour"],
    notes: "Half-day tour with English-speaking guide",
  },

  // Business trip
  {
    expenseID: uuidv4(),
    userID: "sample-user-003",
    tripID: "trip-business-001",
    category: "accommodation",
    subcategory: "business hotel",
    amount: 120,
    currency: "USD",
    date: new Date("2024-12-10"),
    description: "Business hotel in Kuala Lumpur",
    location: "KLCC, Kuala Lumpur",
    paymentMethod: "card",
    tags: ["business", "conference", "reimbursable"],
    notes: "Conference hotel with meeting facilities",
  },
  {
    expenseID: uuidv4(),
    userID: "sample-user-003",
    tripID: "trip-business-001",
    category: "transportation",
    subcategory: "taxi",
    amount: 25,
    currency: "USD",
    date: new Date("2024-12-10"),
    description: "Airport transfer and city transport",
    location: "Kuala Lumpur, Malaysia",
    paymentMethod: "digital_wallet",
    tags: ["business", "transport", "reimbursable"],
    notes: "Grab rides for airport and meeting locations",
  },
  {
    expenseID: uuidv4(),
    userID: "sample-user-003",
    tripID: "trip-business-001",
    category: "food",
    subcategory: "business meal",
    amount: 45,
    currency: "USD",
    date: new Date("2024-12-11"),
    description: "Client dinner meeting",
    location: "Petronas Twin Towers, KL",
    paymentMethod: "card",
    tags: ["business", "client meeting", "reimbursable"],
    notes: "Dinner with Malaysian clients at upscale restaurant",
  },

  // Daily expenses
  {
    expenseID: uuidv4(),
    userID: "sample-user-001",
    category: "food",
    subcategory: "lunch",
    amount: 250,
    currency: "BDT",
    date: new Date("2024-12-15"),
    description: "Lunch at local restaurant",
    location: "Dhanmondi, Dhaka",
    paymentMethod: "cash",
    tags: ["daily", "lunch", "local"],
    notes: "Biriyani with friends",
  },
  {
    expenseID: uuidv4(),
    userID: "sample-user-001",
    category: "transportation",
    subcategory: "ride share",
    amount: 150,
    currency: "BDT",
    date: new Date("2024-12-15"),
    description: "Uber ride to office",
    location: "Dhaka, Bangladesh",
    paymentMethod: "digital_wallet",
    tags: ["daily", "commute", "uber"],
    notes: "Morning commute due to rain",
  },
  {
    expenseID: uuidv4(),
    userID: "sample-user-002",
    category: "shopping",
    subcategory: "souvenirs",
    amount: 30,
    currency: "USD",
    date: new Date("2024-11-18"),
    description: "Thai souvenirs and gifts",
    location: "Chatuchak Weekend Market",
    paymentMethod: "cash",
    tags: ["shopping", "souvenirs", "gifts"],
    notes: "Traditional Thai handicrafts for family",
  },
  {
    expenseID: uuidv4(),
    userID: "sample-user-003",
    category: "health",
    subcategory: "medicine",
    amount: 15,
    currency: "USD",
    date: new Date("2024-12-12"),
    description: "Travel medicine and first aid",
    location: "Pharmacy, Kuala Lumpur",
    paymentMethod: "cash",
    tags: ["health", "medicine", "travel"],
    notes: "Pain relievers and travel sickness medicine",
  },
  {
    expenseID: uuidv4(),
    userID: "sample-user-001",
    category: "entertainment",
    subcategory: "movies",
    amount: 400,
    currency: "BDT",
    date: new Date("2024-12-14"),
    description: "Movie tickets",
    location: "Star Cineplex, Dhaka",
    paymentMethod: "card",
    tags: ["entertainment", "movies", "weekend"],
    notes: "Latest Hollywood blockbuster with friends",
  },
  {
    expenseID: uuidv4(),
    userID: "sample-user-002",
    category: "insurance",
    subcategory: "travel insurance",
    amount: 50,
    currency: "USD",
    date: new Date("2024-11-08"),
    description: "International travel insurance",
    location: "Online purchase",
    paymentMethod: "card",
    tags: ["insurance", "travel", "protection"],
    notes: "Comprehensive coverage for Thailand trip",
  },
  {
    expenseID: uuidv4(),
    userID: "sample-user-003",
    category: "miscellaneous",
    subcategory: "tips",
    amount: 10,
    currency: "USD",
    date: new Date("2024-12-13"),
    description: "Tips and service charges",
    location: "Various locations, KL",
    paymentMethod: "cash",
    tags: ["tips", "service", "miscellaneous"],
    notes: "Tips for hotel staff and taxi drivers",
  },
];

// Function to seed sample expenses
const seedSampleExpenses = async () => {
  try {
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        process.env.MONGODB_URI || "mongodb://localhost:27017/project350",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
    }

    // Clear existing sample expenses (optional - remove in production)
    // await Expense.deleteMany({ userID: { $in: ['sample-user-001', 'sample-user-002', 'sample-user-003'] } });
    console.log("Cleared existing sample expenses");

    // Insert new sample expenses
    const insertedExpenses = await Expense.insertMany(sampleExpenses);
    console.log(
      `Successfully seeded ${insertedExpenses.length} sample expenses`
    );

    // Generate summary statistics
    const stats = {
      totalExpenses: insertedExpenses.length,
      totalAmount: insertedExpenses.reduce((sum, exp) => {
        // Convert all to USD for summary (simplified conversion)
        const rate = exp.currency === "BDT" ? 0.0092 : 1; // 1 BDT ≈ 0.0092 USD
        return sum + exp.amount * rate;
      }, 0),
      categories: [...new Set(insertedExpenses.map((exp) => exp.category))],
      currencies: [...new Set(insertedExpenses.map((exp) => exp.currency))],
      dateRange: {
        from: new Date(
          Math.min(...insertedExpenses.map((exp) => new Date(exp.date)))
        )
          .toISOString()
          .split("T")[0],
        to: new Date(
          Math.max(...insertedExpenses.map((exp) => new Date(exp.date)))
        )
          .toISOString()
          .split("T")[0],
      },
    };

    console.log("\n📊 Sample Expenses Summary:");
    console.log(`💰 Total Amount: ~$${stats.totalAmount.toFixed(2)} USD`);
    console.log(`📝 Total Entries: ${stats.totalExpenses}`);
    console.log(`🏷️ Categories: ${stats.categories.join(", ")}`);
    console.log(`💱 Currencies: ${stats.currencies.join(", ")}`);
    console.log(
      `📅 Date Range: ${stats.dateRange.from} to ${stats.dateRange.to}`
    );

    console.log("\n✅ Sample expenses seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding sample expenses:", error);
  }
};

// Instructions for updating user IDs
const printUserInstructions = () => {
  console.log("\n📋 Setup Instructions:");
  console.log("===================");
  console.log(
    "1. Replace sample user IDs with actual user IDs from your database"
  );
  console.log(
    "2. Update trip IDs with actual trip IDs if using trip association"
  );
  console.log("3. Adjust currencies and amounts based on your target markets");
  console.log(
    "4. Modify categories to match your application's expense categories"
  );
  console.log("\n🔧 Example user ID replacement:");
  console.log(
    '   Replace "sample-user-001" with actual MongoDB ObjectId or user identifier'
  );
  console.log("\n⚠️ Note: Current sample data uses placeholder user IDs");
};

// Run seeding if this file is executed directly
if (require.main === module) {
  require("dotenv").config();

  console.log("🚀 Expense Tracker - Sample Data Seeding\n");

  seedSampleExpenses()
    .then(() => {
      printUserInstructions();
      console.log("\n🎉 Seeding completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}

module.exports = { seedSampleExpenses, sampleExpenses };
