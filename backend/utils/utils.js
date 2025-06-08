/**
 * Helper function to convert a file buffer and MIME type into a Google Generative AI compatible part.
 * @param {Buffer} data - The file buffer.
 * @param {string} mimeType - The MIME type of the file.
 * @returns {object} - An object representing the file data in the required format.
 */
function fileToGenerativePart(data, mimeType) {
    return {
        inlineData: {
            data: data.toString('base64'),
            mimeType,
        },
    };
}

const {GoogleGenAI} =require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateResponse(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });
  return response.text;
}

module.exports =  {fileToGenerativePart, generateResponse}