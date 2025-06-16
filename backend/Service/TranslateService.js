const axios = require("axios");

//POST /api/translate
const translateText = async (req, res) => {
  const { text, targetLang } = req.body;
  try {
    const response = await axios.post("https://libretranslate.de/translate", {
      q: text,
      source: "auto",
      target: targetLang,
      format: "text",
    });
    const data = response.data.translatedText;
    res.status(200).json({
      status: success,
      data: data,
    });
  } catch (err) {
    console.error("Translation error:", err);
    res.status(400).json({
      status: failed,
      message:"Internal Server Error"
    })
  }
}

module.exports = { translateText };
