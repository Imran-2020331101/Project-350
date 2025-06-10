const express = require("express");
const router = express.Router();
const { translateText } = require("../Service/translateService");

router.post("/translate", async (req, res) => {
  const { text, targetLang } = req.body;
  try {
    const translated = await translateText(text, targetLang);
    res.json({ translated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
CDATASectionc;
