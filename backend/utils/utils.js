const OpenAI = require('openai');

const openaiApiKey = process.env.OPENAI_API_KEY;
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

// Generate AI response using OpenAI
async function generateResponse(prompt) {
  try {
    if (!openai) {
      console.log("No OpenAI API key found, using fallback response");
      return "AI response generation unavailable. Using fallback information.";
    }    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500, // Increased for longer blog content
      temperature: 0.7
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating OpenAI response:", error.message);
    return "AI response generation failed. Using fallback information.";
  }
}

// Mock function to get places (since external API might not be available)
async function getPlaces(destination, type, budget, count) {
  try {
    // This is a mock implementation - in real scenario, you'd use Google Places API or similar
    const mockPlaces = [
      `${destination} Museum`,
      `${destination} Historic Center`,
      `${destination} Central Park`,
      `${destination} Cultural District`,
      `${destination} Waterfront Area`
    ];
    
    return mockPlaces.slice(0, count);
  } catch (error) {
    console.error("Error fetching places:", error);
    return [`${destination} City Center`];
  }
}

// Mock function to get transport options
async function getTransport(type, destination, date, days) {
  try {
    // Mock transport data
    const mockTransports = {
      train: [
        {
          trainName: `Express to ${destination}`,
          departure: new Date(date),
          arrival: new Date(new Date(date).getTime() + 4 * 60 * 60 * 1000), // 4 hours later
          from: "Dhaka",
          to: destination
        }
      ],
      bus: [
        {
          busName: `Comfort Bus to ${destination}`,
          departure: new Date(date),
          arrival: new Date(new Date(date).getTime() + 6 * 60 * 60 * 1000), // 6 hours later
          from: "Dhaka",
          to: destination
        }
      ]
    };
    
    return mockTransports[type] || [];
  } catch (error) {
    console.error("Error fetching transport:", error);
    return [];
  }
}

module.exports = { generateResponse, getPlaces, getTransport };