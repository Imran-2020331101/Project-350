#!/usr/bin/env node

/**
 * Project-350 API Automated Test Suite
 * Tests all implemented API endpoints for functionality and data integrity
 */

const axios = require("axios");
const colors = require("colors");

class APITester {
  constructor(baseURL = "http://localhost:3000") {
    this.baseURL = baseURL;
    this.authToken = null;
    this.adminToken = null;
    this.testResults = {
      passed: 0,
      failed: 0,
      errors: [],
    };
  }

  log(message, type = "info") {
    const timestamp = new Date().toISOString();
    switch (type) {
      case "success":
        console.log(`[${timestamp}] ✅ ${message}`.green);
        break;
      case "error":
        console.log(`[${timestamp}] ❌ ${message}`.red);
        break;
      case "warning":
        console.log(`[${timestamp}] ⚠️  ${message}`.yellow);
        break;
      default:
        console.log(`[${timestamp}] ℹ️  ${message}`.blue);
    }
  }

  async test(name, testFn) {
    try {
      this.log(`Testing: ${name}`);
      await testFn();
      this.testResults.passed++;
      this.log(`PASSED: ${name}`, "success");
    } catch (error) {
      this.testResults.failed++;
      this.testResults.errors.push({ name, error: error.message });
      this.log(`FAILED: ${name} - ${error.message}`, "error");
    }
  }

  async setupAuth() {
    // Register test user
    try {
      await axios.post(`${this.baseURL}/api/auth/register`, {
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
      });
    } catch (error) {
      // User might already exist
    }

    // Login to get token
    const loginResponse = await axios.post(`${this.baseURL}/api/auth/login`, {
      email: "testuser@example.com",
      password: "password123",
    });

    this.authToken = loginResponse.data.token;
    this.log("Authentication setup completed", "success");
  }

  async runAuthTests() {
    this.log("Starting Authentication Tests...", "info");

    await this.test("User Registration", async () => {
      const response = await axios.post(`${this.baseURL}/api/auth/register`, {
        name: "New Test User",
        email: `test${Date.now()}@example.com`,
        password: "password123",
      });
      if (response.status !== 201) throw new Error("Registration failed");
    });

    await this.test("User Login", async () => {
      const response = await axios.post(`${this.baseURL}/api/auth/login`, {
        email: "testuser@example.com",
        password: "password123",
      });
      if (!response.data.token) throw new Error("No token received");
    });

    await this.test("Profile Update", async () => {
      const response = await axios.post(
        `${this.baseURL}/api/auth/profile/update`,
        {
          name: "Updated Test User",
          bio: "Test bio",
        },
        {
          headers: { Authorization: `Bearer ${this.authToken}` },
        }
      );
      if (response.status !== 200) throw new Error("Profile update failed");
    });
  }

  async runEmergencyTests() {
    this.log("Starting Emergency Assistance Tests...", "info");

    await this.test("Get Emergency Types", async () => {
      const response = await axios.get(`${this.baseURL}/api/emergency/types`);
      if (!response.data.types || !Array.isArray(response.data.types)) {
        throw new Error("Emergency types not returned properly");
      }
    });

    await this.test("Search Emergency Contacts", async () => {
      const response = await axios.get(
        `${this.baseURL}/api/emergency/search?location=Dhaka`
      );
      if (!response.data.contacts)
        throw new Error("Search results not returned");
    });

    await this.test("Get Contacts by Location", async () => {
      const response = await axios.get(`${this.baseURL}/api/emergency/Dhaka`);
      if (!response.data.contacts)
        throw new Error("Location contacts not returned");
    });
  }

  async runExpenseTests() {
    this.log("Starting Expense Tracker Tests...", "info");

    await this.test("Get Expense Categories", async () => {
      const response = await axios.get(
        `${this.baseURL}/api/expenses/categories`
      );
      if (
        !response.data.categories ||
        !Array.isArray(response.data.categories)
      ) {
        throw new Error("Expense categories not returned properly");
      }
    });

    let expenseId;
    await this.test("Add Expense", async () => {
      const response = await axios.post(
        `${this.baseURL}/api/expenses`,
        {
          category: "food",
          amount: 25.5,
          description: "Test expense",
          date: "2024-01-15",
        },
        {
          headers: { Authorization: `Bearer ${this.authToken}` },
        }
      );
      if (response.status !== 201) throw new Error("Expense creation failed");
      expenseId = response.data.expense?.expenseID;
    });

    await this.test("Get User Expenses", async () => {
      const response = await axios.get(`${this.baseURL}/api/expenses`, {
        headers: { Authorization: `Bearer ${this.authToken}` },
      });
      if (!response.data.expenses)
        throw new Error("User expenses not returned");
    });

    await this.test("Get Expense Summary", async () => {
      const response = await axios.get(`${this.baseURL}/api/expenses/summary`, {
        headers: { Authorization: `Bearer ${this.authToken}` },
      });
      if (!response.data.summary)
        throw new Error("Expense summary not returned");
    });

    await this.test("Search Expenses", async () => {
      const response = await axios.get(
        `${this.baseURL}/api/expenses/search?q=test`,
        {
          headers: { Authorization: `Bearer ${this.authToken}` },
        }
      );
      if (!response.data.expenses)
        throw new Error("Search results not returned");
    });

    if (expenseId) {
      await this.test("Get Specific Expense", async () => {
        const response = await axios.get(
          `${this.baseURL}/api/expenses/${expenseId}`,
          {
            headers: { Authorization: `Bearer ${this.authToken}` },
          }
        );
        if (!response.data.expense)
          throw new Error("Specific expense not returned");
      });

      await this.test("Update Expense", async () => {
        const response = await axios.put(
          `${this.baseURL}/api/expenses/${expenseId}`,
          {
            description: "Updated test expense",
          },
          {
            headers: { Authorization: `Bearer ${this.authToken}` },
          }
        );
        if (response.status !== 200) throw new Error("Expense update failed");
      });

      await this.test("Delete Expense", async () => {
        const response = await axios.delete(
          `${this.baseURL}/api/expenses/${expenseId}`,
          {
            headers: { Authorization: `Bearer ${this.authToken}` },
          }
        );
        if (response.status !== 200) throw new Error("Expense deletion failed");
      });
    }
  }

  async runTripTests() {
    this.log("Starting Trip Management Tests...", "info");

    let tripId;
    await this.test("Create Trip", async () => {
      const response = await axios.post(
        `${this.baseURL}/api/trips`,
        {
          destination: "Cox's Bazar, Bangladesh",
          duration: 3,
          budget: 500,
          preferences: ["beach", "adventure"],
        },
        {
          headers: { Authorization: `Bearer ${this.authToken}` },
        }
      );
      if (response.status !== 201) throw new Error("Trip creation failed");
      tripId = response.data.trip?.tripID;
    });

    if (tripId) {
      await this.test("Get Trip by ID", async () => {
        const response = await axios.get(
          `${this.baseURL}/api/trips/${tripId}`,
          {
            headers: { Authorization: `Bearer ${this.authToken}` },
          }
        );
        if (!response.data) throw new Error("Trip not returned");
      });
    }
  }

  async runBlogTests() {
    this.log("Starting Blog Management Tests...", "info");

    await this.test("Get All Blogs", async () => {
      const response = await axios.get(`${this.baseURL}/api/blogs`);
      if (!response.data.blogs) throw new Error("Blogs not returned");
    });

    // Note: Blog creation requires a valid trip ID, which we'd get from trip creation
  }

  async runGroupTests() {
    this.log("Starting Group Management Tests...", "info");

    await this.test("Get All Groups", async () => {
      const response = await axios.get(`${this.baseURL}/api/groups`);
      if (!Array.isArray(response.data))
        throw new Error("Groups not returned as array");
    });
  }

  async runTranslationTests() {
    this.log("Starting Translation Tests...", "info");

    await this.test("Translate Text", async () => {
      const response = await axios.post(`${this.baseURL}/api/translate`, {
        text: "Hello, how are you?",
        sourceLang: "en",
        targetLang: "bn",
      });
      if (!response.data.translatedText)
        throw new Error("Translation not returned");
    });
  }

  async runErrorTests() {
    this.log("Starting Error Handling Tests...", "info");

    await this.test("Unauthorized Access", async () => {
      try {
        await axios.get(`${this.baseURL}/api/expenses`, {
          headers: { Authorization: "Bearer invalid_token" },
        });
        throw new Error("Should have failed with unauthorized");
      } catch (error) {
        if (error.response?.status !== 401) {
          throw new Error("Expected 401 status code");
        }
      }
    });

    await this.test("Invalid Data Validation", async () => {
      try {
        await axios.post(
          `${this.baseURL}/api/expenses`,
          {
            // Missing required fields
            amount: "invalid",
          },
          {
            headers: { Authorization: `Bearer ${this.authToken}` },
          }
        );
        throw new Error("Should have failed with validation error");
      } catch (error) {
        if (error.response?.status !== 400) {
          throw new Error("Expected 400 status code");
        }
      }
    });

    await this.test("Not Found Handling", async () => {
      try {
        await axios.get(`${this.baseURL}/api/expenses/nonexistent_id`, {
          headers: { Authorization: `Bearer ${this.authToken}` },
        });
        throw new Error("Should have failed with not found");
      } catch (error) {
        if (error.response?.status !== 404) {
          throw new Error("Expected 404 status code");
        }
      }
    });
  }

  async runAllTests() {
    console.log("🚀 Starting Project-350 API Test Suite...".bold.cyan);
    console.log("============================================".cyan);

    try {
      // Setup authentication first
      await this.setupAuth();

      // Run all test suites
      await this.runAuthTests();
      await this.runEmergencyTests();
      await this.runExpenseTests();
      await this.runTripTests();
      await this.runBlogTests();
      await this.runGroupTests();
      await this.runTranslationTests();
      await this.runErrorTests();

      // Print results
      this.printResults();
    } catch (error) {
      this.log(`Test suite failed to run: ${error.message}`, "error");
    }
  }

  printResults() {
    console.log("\n📊 Test Results Summary".bold.cyan);
    console.log("========================".cyan);
    console.log(`✅ Passed: ${this.testResults.passed}`.green);
    console.log(`❌ Failed: ${this.testResults.failed}`.red);
    console.log(
      `📈 Success Rate: ${(
        (this.testResults.passed /
          (this.testResults.passed + this.testResults.failed)) *
        100
      ).toFixed(2)}%`
    );

    if (this.testResults.errors.length > 0) {
      console.log("\n🐛 Failed Tests Details:".bold.red);
      this.testResults.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.name}: ${error.error}`.red);
      });
    }

    console.log("\n🎉 API Test Suite Completed!".bold.green);
  }
}

// Run the test suite
if (require.main === module) {
  const tester = new APITester();
  tester.runAllTests().catch(console.error);
}

module.exports = APITester;
