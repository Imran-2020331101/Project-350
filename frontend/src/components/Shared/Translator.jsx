import { useState } from "react";
import axios from "axios";

const Translator = () => {
  const [input, setInput] = useState("");
  const [targetLang, setTargetLang] = useState("es");
  const [translated, setTranslated] = useState("");

  const handleTranslate = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/translate", {
        text: input,
        targetLang,
      });
      setTranslated(res.data.translated);
    } catch (error) {
      setTranslated("Translation failed.");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Live Translator</h2>
      <textarea
        className="w-full p-2 border border-gray-300 rounded mb-4"
        placeholder="Enter text to translate"
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="mb-4">
        <label className="mr-2">Translate to:</label>
        <select
          className="p-2 border border-gray-300 rounded"
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
        >
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="bn">Bengali</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
        </select>
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleTranslate}
      >
        Translate
      </button>
      {translated && (
        <div className="mt-4 bg-gray-100 p-3 rounded">
          <strong>Translated:</strong> {translated}
        </div>
      )}
    </div>
  );
};

export default Translator;
