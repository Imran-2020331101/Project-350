import { useState } from "react";
import axios from "axios";
import { Languages, ArrowRight, Copy, Globe, Sparkles } from "lucide-react";

const Translator = () => {  const [input, setInput] = useState("");
  const [targetLang, setTargetLang] = useState("es");
  const [translated, setTranslated] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [service, setService] = useState("");
  const languages = [
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇪" },
    { code: "it", name: "Italian", flag: "��" },
    { code: "pt", name: "Portuguese", flag: "��" },
    { code: "ru", name: "Russian", flag: "��" },
    { code: "zh", name: "Chinese", flag: "��" },
    { code: "ja", name: "Japanese", flag: "��" },
    { code: "ko", name: "Korean", flag: "��" },
    { code: "ar", name: "Arabic", flag: "��" },
    { code: "hi", name: "Hindi", flag: "��" },
    { code: "tr", name: "Turkish", flag: "��" }
  ];  const handleTranslate = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setError("");
    setService("");
    
    try {
      const res = await axios.post("http://localhost:3000/api/translate", {
        text: input,
        targetLang,
      });
      
      console.log("Translation response:", res.data);
      
      // Handle the response based on the backend structure
      if (res.data.status === "success") {
        setTranslated(res.data.translated || res.data.data);
        setService(res.data.service || "Unknown");
      } else {
        setError("Translation failed. Please try again.");
        setTranslated("");
      }
    } catch (error) {
      console.error("Translation error:", error);
      if (error.response?.data?.message) {
        setError(`Error: ${error.response.data.message}`);
      } else if (error.code === 'ERR_NETWORK') {
        setError("Cannot connect to translation service. Please check if the backend server is running.");
      } else {
        setError("Translation service unavailable. Please try again later.");
      }
      setTranslated("");
    }
    setIsLoading(false);
  };

  const handleCopy = async () => {
    if (translated) {
      await navigator.clipboard.writeText(translated);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleTranslate();
    }
  };  const clearAll = () => {
    setInput("");
    setTranslated("");
    setError("");
    setService("");
  };
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Languages className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Translator
            </h1>
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Break language barriers instantly with our powerful AI translator. 
            Translate text between multiple languages with just one click.
          </p>
        </div>

        {/* Main Translator Card */}
        <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Language Selection Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5" />
                <span className="font-semibold">English</span>
              </div>
              <ArrowRight className="w-6 h-6 animate-pulse" />
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {languages.find(lang => lang.code === targetLang)?.flag}
                </span>
                <select
                  className="bg-white/20 backdrop-blur-sm text-white font-semibold px-4 py-2 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code} className="text-gray-800">
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Translation Interface */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-200">Original Text</h3>
                  <span className="text-sm text-gray-400">{input.length}/1000</span>
                </div>
                <div className="relative">
                  <textarea
                    className="w-full h-48 p-4 border-2 border-gray-600 rounded-xl focus:border-blue-500 focus:outline-none resize-none transition-colors duration-200 text-gray-200 placeholder-gray-400 bg-gray-700"
                    placeholder="Enter text to translate... (Ctrl+Enter to translate)"
                    maxLength={1000}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                  {input && (
                    <button
                      onClick={clearAll}
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Output Section */}
              <div className="space-y-4">                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-200">Translation</h3>
                  {translated && !error && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  )}
                </div><div className="relative">
                  <div className="w-full h-48 p-4 border-2 border-gray-600 rounded-xl bg-gray-700 overflow-y-auto">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="flex items-center gap-3 text-blue-400">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                          <span>Translating...</span>
                        </div>
                      </div>
                    ) : error ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-red-400 text-center">{error}</p>
                      </div>                    ) : translated ? (
                      <div>
                        <p className="text-gray-200 leading-relaxed">{translated}</p>
                        {service && (
                          <p className="text-xs text-gray-500 mt-2 italic">
                            Translated using: {service}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">Translation will appear here...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-600">
              <button
                onClick={handleTranslate}
                disabled={!input.trim() || isLoading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Translating...
                  </>
                ) : (
                  <>
                    <Languages className="w-5 h-5" />
                    Translate Text
                  </>
                )}
              </button>
              <button
                onClick={clearAll}
                className="px-8 py-4 border-2 border-gray-600 text-gray-300 font-semibold rounded-xl hover:bg-gray-700 transition-colors duration-200"
              >
                Clear All
              </button>
            </div>

            {/* Quick Tips */}
            <div className="mt-6 p-4 bg-gray-700 rounded-xl border border-gray-600">
              <h4 className="font-semibold text-blue-400 mb-2">💡 Quick Tips:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Press Ctrl+Enter to translate quickly</li>
                <li>• Click the copy button to save translations</li>
                <li>• Support for 12+ popular languages</li>
                <li>• Maximum 1000 characters per translation</li>
              </ul>
            </div>
          </div>
        </div>        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 text-center">
            <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Languages className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-200 mb-2">12+ Languages</h3>
            <p className="text-gray-400 text-sm">Support for major world languages including Spanish, French, Chinese, and more.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 text-center">
            <div className="w-12 h-12 bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-200 mb-2">AI Powered</h3>
            <p className="text-gray-400 text-sm">Advanced AI technology ensures accurate and contextual translations every time.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 text-center">
            <div className="w-12 h-12 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-200 mb-2">Instant Results</h3>
            <p className="text-gray-400 text-sm">Get translations in seconds with our fast and reliable translation engine.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Translator;
