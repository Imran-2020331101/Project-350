// backend/Service/translateService.js
const axios = require("axios");

async function translateText(text, targetLang = "es") {
  try {
    const response = await axios.post("https://libretranslate.de/translate", {
      q: text,
      source: "auto",
      target: targetLang,
      format: "text",
    });
    return response.data.translatedText;
  } catch (err) {
    throw new Error("Translation failed: " + err.message);
  }
}

module.exports = { translateText };
