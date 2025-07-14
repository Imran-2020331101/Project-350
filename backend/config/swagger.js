// swagger.js
const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Project-350 Travel Assistant API",
    description:
      "Comprehensive API documentation for the AI-powered travel assistant platform with Emergency Assistance, Expense Tracking, Trip Planning, Blog Management, and Group Travel features.",
    version: "1.0.0",
    contact: {
      name: "Project-350 Team",
      email: "support@project350.com",
    },
  },
  host: "localhost:3000",
  basePath: "/",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "JWT Bearer token. Format: Bearer {token}",
    },
  },
  definitions: {
    User: {
      type: "object",
      properties: {
        userID: { type: "string" },
        name: { type: "string" },
        email: { type: "string" },
        username: { type: "string" },
        bio: { type: "string" },
        profilePhoto: { type: "string" },
        createdAt: { type: "string", format: "date-time" },
      },
    },
    Trip: {
      type: "object",
      properties: {
        tripID: { type: "string" },
        userID: { type: "string" },
        destination: { type: "string" },
        duration: { type: "integer" },
        budget: { type: "number" },
        itinerary: { type: "object" },
        preferences: { type: "array", items: { type: "string" } },
        createdAt: { type: "string", format: "date-time" },
      },
    },
    EmergencyContact: {
      type: "object",
      properties: {
        contactID: { type: "string" },
        location: { type: "string" },
        contactType: { type: "string" },
        name: { type: "string" },
        phoneNumber: { type: "string" },
        address: { type: "string" },
        description: { type: "string" },
        priority: { type: "integer" },
        isActive: { type: "boolean" },
      },
    },
    Expense: {
      type: "object",
      properties: {
        expenseID: { type: "string" },
        userID: { type: "string" },
        tripID: { type: "string" },
        category: { type: "string" },
        subcategory: { type: "string" },
        amount: { type: "number" },
        currency: { type: "string" },
        date: { type: "string", format: "date" },
        description: { type: "string" },
        location: { type: "string" },
        paymentMethod: { type: "string" },
        tags: { type: "array", items: { type: "string" } },
        notes: { type: "string" },
        createdAt: { type: "string", format: "date-time" },
      },
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"]; // point to files with routes

swaggerAutogen(outputFile, endpointsFiles, doc);
