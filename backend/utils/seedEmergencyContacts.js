const mongoose = require("mongoose");
const EmergencyContact = require("../models/emergencycontact");
const { v4: uuidv4 } = require("uuid");

// Sample emergency contacts for popular destinations
const emergencyContacts = [
  // Bangladesh
  {
    contactID: uuidv4(),
    location: "Bangladesh",
    contactType: "police",
    name: "Bangladesh Police Emergency",
    phoneNumber: "999",
    address: "National Emergency Line",
    description: "National police emergency hotline",
    priority: 1,
  },
  {
    contactID: uuidv4(),
    location: "Bangladesh",
    contactType: "fire",
    name: "Fire Service and Civil Defence",
    phoneNumber: "199",
    address: "National Fire Service",
    description: "Fire and civil defence emergency",
    priority: 1,
  },
  {
    contactID: uuidv4(),
    location: "Bangladesh",
    contactType: "medical",
    name: "Emergency Medical Service",
    phoneNumber: "999",
    address: "National Medical Emergency",
    description: "Medical emergency services",
    priority: 1,
  },
  {
    contactID: uuidv4(),
    location: "Bangladesh",
    contactType: "tourist_helpline",
    name: "Bangladesh Tourism Helpline",
    phoneNumber: "+880-2-9558868",
    address: "Bangladesh Tourism Board",
    description: "Tourist assistance and information",
    priority: 2,
  },

  // Dhaka specific
  {
    contactID: uuidv4(),
    location: "Dhaka",
    contactType: "police",
    name: "Dhaka Metropolitan Police",
    phoneNumber: "999",
    address: "DMP Headquarters, Ramna, Dhaka",
    description: "Dhaka city police emergency",
    priority: 1,
  },
  {
    contactID: uuidv4(),
    location: "Dhaka",
    contactType: "medical",
    name: "Dhaka Medical College Hospital",
    phoneNumber: "+880-2-9664043",
    address: "Bakshi Bazar, Dhaka-1000",
    description: "Major government hospital in Dhaka",
    priority: 1,
  },

  // Cox's Bazar
  {
    contactID: uuidv4(),
    location: "Cox's Bazar",
    contactType: "police",
    name: "Cox's Bazar Police Station",
    phoneNumber: "+880-341-62311",
    address: "Cox's Bazar Sadar",
    description: "Local police for tourist area",
    priority: 1,
  },
  {
    contactID: uuidv4(),
    location: "Cox's Bazar",
    contactType: "coast_guard",
    name: "Bangladesh Coast Guard",
    phoneNumber: "+880-341-62580",
    address: "Cox's Bazar Coast Guard Station",
    description: "Maritime emergency and rescue",
    priority: 1,
  },
  {
    contactID: uuidv4(),
    location: "Cox's Bazar",
    contactType: "tourist_helpline",
    name: "Cox's Bazar Tourist Police",
    phoneNumber: "+880-341-64444",
    address: "Beach Road, Cox's Bazar",
    description: "Tourist police for visitor assistance",
    priority: 2,
  },

  // International destinations
  // Thailand - Bangkok
  {
    contactID: uuidv4(),
    location: "Bangkok",
    contactType: "police",
    name: "Thailand Tourist Police",
    phoneNumber: "1155",
    address: "Tourist Police Bureau",
    description: "24-hour tourist police hotline",
    priority: 1,
  },
  {
    contactID: uuidv4(),
    location: "Bangkok",
    contactType: "medical",
    name: "Emergency Medical Services",
    phoneNumber: "1669",
    address: "National Emergency Medical Service",
    description: "Ambulance and medical emergency",
    priority: 1,
  },
  {
    contactID: uuidv4(),
    location: "Bangkok",
    contactType: "embassy",
    name: "Bangladesh Embassy Thailand",
    phoneNumber: "+66-2-663-0161",
    address: "47/5 Soi Nailert Park, Wireless Road, Bangkok",
    description: "Bangladesh embassy in Thailand",
    priority: 2,
  },

  // Malaysia - Kuala Lumpur
  {
    contactID: uuidv4(),
    location: "Kuala Lumpur",
    contactType: "police",
    name: "Royal Malaysia Police",
    phoneNumber: "999",
    address: "Emergency Services",
    description: "Police emergency hotline",
    priority: 1,
  },
  {
    contactID: uuidv4(),
    location: "Kuala Lumpur",
    contactType: "medical",
    name: "Malaysia Emergency Medical",
    phoneNumber: "999",
    address: "National Emergency Line",
    description: "Ambulance and medical services",
    priority: 1,
  },
  {
    contactID: uuidv4(),
    location: "Kuala Lumpur",
    contactType: "embassy",
    name: "Bangladesh High Commission Malaysia",
    phoneNumber: "+60-3-2161-2800",
    address: "Lot 4.01, Level 4, Wisma Goldhill, Kuala Lumpur",
    description: "Bangladesh diplomatic mission",
    priority: 2,
  },

  // India - Delhi
  {
    contactID: uuidv4(),
    location: "Delhi",
    contactType: "police",
    name: "Delhi Police Emergency",
    phoneNumber: "100",
    address: "Delhi Police Headquarters",
    description: "Delhi police emergency line",
    priority: 1,
  },
  {
    contactID: uuidv4(),
    location: "Delhi",
    contactType: "medical",
    name: "Emergency Ambulance Service",
    phoneNumber: "102",
    address: "National Ambulance Service",
    description: "Free ambulance service",
    priority: 1,
  },
  {
    contactID: uuidv4(),
    location: "Delhi",
    contactType: "tourist_helpline",
    name: "India Tourism Helpline",
    phoneNumber: "1363",
    address: "Ministry of Tourism",
    description: "24x7 multilingual tourist helpline",
    priority: 2,
  },

  // UAE - Dubai
  {
    contactID: uuidv4(),
    location: "Dubai",
    contactType: "police",
    name: "Dubai Police Emergency",
    phoneNumber: "999",
    address: "Dubai Police Headquarters",
    description: "Dubai police emergency services",
    priority: 1,
  },
  {
    contactID: uuidv4(),
    location: "Dubai",
    contactType: "medical",
    name: "Dubai Ambulance",
    phoneNumber: "998",
    address: "Dubai Health Authority",
    description: "Dubai ambulance services",
    priority: 1,
  },
  {
    contactID: uuidv4(),
    location: "Dubai",
    contactType: "embassy",
    name: "Bangladesh Consulate Dubai",
    phoneNumber: "+971-4-397-7491",
    address: "Trade Centre Area, Dubai",
    description: "Bangladesh consulate in Dubai",
    priority: 2,
  },

  // USA - New York
  {
    contactID: uuidv4(),
    location: "New York",
    contactType: "police",
    name: "NYPD Emergency",
    phoneNumber: "911",
    address: "New York Police Department",
    description: "New York police emergency",
    priority: 1,
  },
  {
    contactID: uuidv4(),
    location: "New York",
    contactType: "medical",
    name: "Emergency Medical Services",
    phoneNumber: "911",
    address: "NYC Emergency Services",
    description: "Ambulance and medical emergency",
    priority: 1,
  },
  {
    contactID: uuidv4(),
    location: "New York",
    contactType: "embassy",
    name: "Bangladesh Permanent Mission to UN",
    phoneNumber: "+1-212-867-3434",
    address: "227 East 45th Street, New York",
    description: "Bangladesh mission to United Nations",
    priority: 2,
  },

  // UK - London
  {
    contactID: uuidv4(),
    location: "London",
    contactType: "police",
    name: "Metropolitan Police",
    phoneNumber: "999",
    address: "Emergency Services",
    description: "UK police emergency line",
    priority: 1,
  },
  {
    contactID: uuidv4(),
    location: "London",
    contactType: "medical",
    name: "NHS Emergency Services",
    phoneNumber: "999",
    address: "National Health Service",
    description: "UK medical emergency services",
    priority: 1,
  },
  {
    contactID: uuidv4(),
    location: "London",
    contactType: "embassy",
    name: "Bangladesh High Commission UK",
    phoneNumber: "+44-20-7584-0081",
    address: "28 Queens Gate, London SW7 5JA",
    description: "Bangladesh High Commission in London",
    priority: 2,
  },
];

// Function to seed emergency contacts
const seedEmergencyContacts = async () => {
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

    // Clear existing emergency contacts
    await EmergencyContact.deleteMany({});
    console.log("Cleared existing emergency contacts");

    // Insert new emergency contacts
    const insertedContacts = await EmergencyContact.insertMany(
      emergencyContacts
    );
    console.log(
      `Successfully seeded ${insertedContacts.length} emergency contacts`
    );

    console.log("Emergency contacts seeded successfully!");

    // Group by location for summary
    const byLocation = insertedContacts.reduce((acc, contact) => {
      if (!acc[contact.location]) acc[contact.location] = 0;
      acc[contact.location]++;
      return acc;
    }, {});

    console.log("Contacts added by location:", byLocation);
  } catch (error) {
    console.error("Error seeding emergency contacts:", error);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  require("dotenv").config();
  seedEmergencyContacts()
    .then(() => {
      console.log("Seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}

module.exports = { seedEmergencyContacts, emergencyContacts };
