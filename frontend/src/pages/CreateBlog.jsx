import { useState } from 'react';

const uploadedImages = [
  { id: 1, url: '/images/bagan1.jpg', caption: 'Hot air balloon at sunrise' },
  { id: 2, url: '/images/bagan2.jpg', caption: 'Ancient temple visit' },
  { id: 3, url: '/images/bagan3.jpg', caption: 'Local food experience' },
  // Add more as needed
];

const CreateBlog = () => {
  const [blogInfo, setBlogInfo] = useState({
    selectedImageIds: [],
    howWhy: '',
    journey: '',
    experiences: '',
    insights: '',
    conclusion: '',
  });

  const toggleImageSelection = (id) => {
    setBlogInfo((prev) => ({
      ...prev,
      selectedImageIds: prev.selectedImageIds.includes(id)
        ? prev.selectedImageIds.filter((i) => i !== id)
        : [...prev.selectedImageIds, id],
    }));
  };

  const handleChange = (field, value) => {
    setBlogInfo((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Your Bagan Blog</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Select Images</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {uploadedImages.map((img) => (
            <div
              key={img.id}
              onClick={() => toggleImageSelection(img.id)}
              className={`cursor-pointer border-2 rounded-xl p-1 transition ${
                blogInfo.selectedImageIds.includes(img.id)
                  ? 'border-yellow-400'
                  : 'border-gray-700'
              }`}
            >
              <img
                src={img.url}
                alt={img.caption}
                className="rounded-lg w-full h-32 object-cover"
              />
              <p className="text-sm text-center mt-2">{img.caption}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <TextArea
          label="How and why the trip to Bagan happened?"
          value={blogInfo.howWhy}
          onChange={(e) => handleChange('howWhy', e.target.value)}
        />
        <TextArea
          label="Describe the journey and first impressions."
          value={blogInfo.journey}
          onChange={(e) => handleChange('journey', e.target.value)}
        />
        <TextArea
          label="Highlight key experiences (temples, locals, food, hot air balloon ride)"
          value={blogInfo.experiences}
          onChange={(e) => handleChange('experiences', e.target.value)}
        />
        <TextArea
          label="Add cultural insights, personal thoughts, challenges, and meaningful moments."
          value={blogInfo.insights}
          onChange={(e) => handleChange('insights', e.target.value)}
        />
        <TextArea
          label="Wrap up with reflections, what the trip meant, and advice for others."
          value={blogInfo.conclusion}
          onChange={(e) => handleChange('conclusion', e.target.value)}
        />
      </section>

      <div className="mt-10 text-center">
        <button
          onClick={() => console.log(blogInfo)} // Replace with actual submit logic
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-xl transition"
        >
          Publish Blog
        </button>
      </div>
    </div>
  );
};

const TextArea = ({ label, value, onChange }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
    <label className="block font-semibold mb-2">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      rows={5}
      className="w-full bg-gray-900 text-white p-3 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
    />
  </div>
);

export default CreateBlog;
