const axios = require("axios");

// Fallback mock translation function for testing
const mockTranslate = (text, targetLang) => {
  const mockTranslations = {
    'es': `[ES] ${text}`,
    'fr': `[FR] ${text}`,
    'de': `[DE] ${text}`,
    'it': `[IT] ${text}`,
    'pt': `[PT] ${text}`,
    'ru': `[RU] ${text}`,
    'zh': `[中文] ${text}`,
    'ja': `[日本語] ${text}`,
    'ko': `[한국어] ${text}`,
    'ar': `[العربية] ${text}`,
    'hi': `[हिंदी] ${text}`,
    'tr': `[TR] ${text}`
  };
  
  return mockTranslations[targetLang] || `[${targetLang.toUpperCase()}] ${text}`;
};

// Alternative API function using a different translation service
const translateWithMyMemory = async (text, targetLang) => {
  try {
    const response = await axios.get(`https://api.mymemory.translated.net/get`, {
      params: {
        q: text,
        langpair: `en|${targetLang}`,
        de: 'your-email@domain.com' // Replace with your email for better rate limits
      },
      timeout: 10000
    });
    
    if (response.data && response.data.responseData && response.data.responseData.translatedText) {
      return response.data.responseData.translatedText;
    }
    throw new Error("No translation in response");
  } catch (error) {
    console.error("MyMemory API error:", error.message);
    throw error;
  }
};

//POST /api/translate
const translateText = async (req, res) => {
  const { text, targetLang } = req.body;
  
  console.log("Translation request received:", { text, targetLang });
  
  if (!text || !targetLang) {
    return res.status(400).json({
      status: "failed",
      message: "Text and target language are required"
    });
  }

  try {
    // Try MyMemory API first
    console.log("Trying MyMemory API...");
    const translatedText = await translateWithMyMemory(text, targetLang);
    
    res.status(200).json({
      status: "success",
      translated: translatedText,
      data: translatedText,
      service: "MyMemory"
    });
    
  } catch (err) {
    console.error("MyMemory API failed, using mock translation:", err.message);
    
    // Use mock translation as fallback
    const mockTranslation = mockTranslate(text, targetLang);
    
    res.status(200).json({
      status: "success",
      translated: mockTranslation,
      data: mockTranslation,
      service: "Mock (Demo only)"
    });
  }
}

module.exports = { translateText };
