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
    console.error("Translation error:", err);
    throw err;
  }
}

module.exports = { translateText };
