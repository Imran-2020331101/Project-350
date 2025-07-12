const EmergencyContact = require("../models/emergencycontact");
const { v4: uuidv4 } = require("uuid");

// GET /api/emergency/:location - Get emergency contacts by location
const getEmergencyContacts = async (req, res) => {
  try {
    const { location } = req.params;
    const { type } = req.query; // Optional filter by contact type

    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Location is required",
      });
    }

    // Build query
    let query = {
      location: { $regex: new RegExp(location, "i") }, // Case-insensitive search
      isActive: true,
    };

    if (type) {
      query.contactType = type;
    }

    const contacts = await EmergencyContact.find(query)
      .sort({ priority: 1, contactType: 1 }) // Sort by priority, then type
      .limit(50); // Limit results

    // Group contacts by type for better organization
    const groupedContacts = contacts.reduce((acc, contact) => {
      if (!acc[contact.contactType]) {
        acc[contact.contactType] = [];
      }
      acc[contact.contactType].push(contact);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      location: location,
      totalContacts: contacts.length,
      contacts: groupedContacts,
      rawContacts: contacts, // For direct access if needed
    });
  } catch (error) {
    console.error("Error fetching emergency contacts:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// GET /api/emergency/types - Get all available contact types
const getContactTypes = async (req, res) => {
  try {
    const types = [
      { value: "police", label: "Police", icon: "🚔", priority: 1 },
      { value: "fire", label: "Fire Department", icon: "🚒", priority: 1 },
      { value: "medical", label: "Medical Emergency", icon: "🚑", priority: 1 },
      { value: "embassy", label: "Embassy/Consulate", icon: "🏛️", priority: 2 },
      {
        value: "tourist_helpline",
        label: "Tourist Helpline",
        icon: "📞",
        priority: 3,
      },
      { value: "coast_guard", label: "Coast Guard", icon: "⛵", priority: 2 },
      {
        value: "rescue",
        label: "Mountain/Rescue Services",
        icon: "🏔️",
        priority: 2,
      },
    ];

    res.status(200).json({
      success: true,
      types: types,
    });
  } catch (error) {
    console.error("Error fetching contact types:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// POST /api/emergency - Add emergency contact (Admin only)
const addEmergencyContact = async (req, res) => {
  try {
    const {
      location,
      contactType,
      name,
      phoneNumber,
      address,
      description,
      priority,
    } = req.body;

    // Validation
    if (!location || !contactType || !name || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Location, contact type, name, and phone number are required",
      });
    }

    const validTypes = [
      "police",
      "fire",
      "medical",
      "embassy",
      "tourist_helpline",
      "coast_guard",
      "rescue",
    ];
    if (!validTypes.includes(contactType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact type",
      });
    }

    const newContact = new EmergencyContact({
      contactID: uuidv4(),
      location: location.trim(),
      contactType,
      name: name.trim(),
      phoneNumber: phoneNumber.trim(),
      address: address?.trim(),
      description: description?.trim(),
      priority: priority || 1,
      isActive: true,
    });

    const savedContact = await newContact.save();

    res.status(201).json({
      success: true,
      message: "Emergency contact added successfully",
      contact: savedContact,
    });
  } catch (error) {
    console.error("Error adding emergency contact:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Contact with this ID already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// GET /api/emergency/search - Search contacts by multiple criteria
const searchEmergencyContacts = async (req, res) => {
  try {
    const { query, location, type } = req.query;

    if (!query && !location && !type) {
      return res.status(400).json({
        success: false,
        message: "At least one search parameter is required",
      });
    }

    let searchQuery = { isActive: true };

    // Build search criteria
    if (location) {
      searchQuery.location = { $regex: new RegExp(location, "i") };
    }

    if (type) {
      searchQuery.contactType = type;
    }

    if (query) {
      searchQuery.$or = [
        { name: { $regex: new RegExp(query, "i") } },
        { description: { $regex: new RegExp(query, "i") } },
        { address: { $regex: new RegExp(query, "i") } },
      ];
    }

    const contacts = await EmergencyContact.find(searchQuery)
      .sort({ priority: 1, contactType: 1 })
      .limit(30);

    res.status(200).json({
      success: true,
      totalResults: contacts.length,
      contacts: contacts,
    });
  } catch (error) {
    console.error("Error searching emergency contacts:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// PUT /api/emergency/:id - Update emergency contact (Admin only)
const updateEmergencyContact = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated
    delete updates.contactID;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    const updatedContact = await EmergencyContact.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedContact) {
      return res.status(404).json({
        success: false,
        message: "Emergency contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Emergency contact updated successfully",
      contact: updatedContact,
    });
  } catch (error) {
    console.error("Error updating emergency contact:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// DELETE /api/emergency/:id - Delete emergency contact (Admin only)
const deleteEmergencyContact = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedContact = await EmergencyContact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({
        success: false,
        message: "Emergency contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Emergency contact deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting emergency contact:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getEmergencyContacts,
  getContactTypes,
  addEmergencyContact,
  searchEmergencyContacts,
  updateEmergencyContact,
  deleteEmergencyContact,
};
