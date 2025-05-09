import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ImageUpload = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showUploadArea, setShowUploadArea] = useState(true);
  const [image, setImage] = useState(null);
  const [imgData, setImgData] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImgData(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setShowUploadArea(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!imgData) return alert("Please select an image first!");

    setUploading(true);
    const formData = new FormData();
    formData.append("image", imgData);
    formData.append("description", description);

    try {
      const response = await axios.post(
        // Replace with your actual backend URL
        // `http://${url}/public/image/upload`,
        "", // <-- TEMP placeholder
        formData
      );

      if (response.status === 200) {
        alert("Upload successful!");
        navigate(-1);
      } else {
        alert("Upload failed. Try again.");
      }
    } catch (error) {
      alert("Network error. Try again.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="fixed w-full h-screen z-50 backdrop-blur-md bg-black/30 font-sans flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <div className="flex justify-end">
          <button
            className="text-gray-600 text-xl hover:text-gray-900 transition-transform transform hover:scale-110"
            onClick={() => navigate(-1)}
          >
            ×
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="text-blue-700">Save</span> your experiences
          </h1>
          <p className="text-gray-600 font-medium">
            Upload images you took during your trip
          </p>
        </div>

        {/* Upload area */}
        {showUploadArea ? (
          <div className="flex justify-center mb-6">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full max-w-md h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition"
            >
              <div className="flex flex-col items-center justify-center p-4">
                <svg
                  className="w-10 h-10 text-gray-400 mb-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16l-4-4m0 0l4-4m-4 4h18m-5 4v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1"
                  />
                </svg>
                <p className="text-gray-500 font-semibold">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400">PNG, JPG, JPEG</p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        ) : (
          <div className="flex flex-col items-center mb-4">
            <img
              src={image}
              alt="Uploaded Preview"
              className="w-64 h-64 object-cover rounded-lg border shadow-md"
            />
            <button
              className="text-sm text-blue-600 mt-2 underline"
              onClick={() => setShowUploadArea(true)}
            >
              Change image
            </button>
          </div>
        )}

        {/* Description Input */}
        <textarea
          className="w-full border rounded-md p-3 text-sm text-gray-800 h-24 resize-none mb-4"
          placeholder="Write about your experience..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Upload Button */}
        <div className="flex justify-center">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`w-32 h-10 rounded-lg font-semibold ${
              uploading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            }`}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ImageUpload;
