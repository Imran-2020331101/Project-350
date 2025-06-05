import { useState } from 'react';
import { useSelector } from 'react-redux';

const steps = [
  'images',
  'howWhy',
  'journey',
  'experiences',
  'insights',
  'conclusion',
  'review',
];

const CreateBlog = () => {
  const user = useSelector((state) => state.auth.user);
  const uploadedImages = user.images;

  const [currentStep, setCurrentStep] = useState(0);
  const [blogInfo, setBlogInfo] = useState({
    selectedImageIds: [],
    howWhy: '',
    journey: '',
    experiences: '',
    insights: '',
    conclusion: '',
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

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

  const stepComponent = () => {
    switch (steps[currentStep]) {
      case 'images':
        return (
          <>
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
                    src={img.source}
                    alt={img.caption}
                    className="rounded-lg w-full h-32 object-cover"
                  />
                  <p className="text-sm text-center mt-2">{img.caption}</p>
                </div>
              ))}
            </div>
          </>
        );
      case 'howWhy':
        return (
          <TextArea
            label="How and why the trip to Bagan happened?"
            value={blogInfo.howWhy}
            onChange={(e) => handleChange('howWhy', e.target.value)}
          />
        );
      case 'journey':
        return (
          <TextArea
            label="Describe the journey and first impressions."
            value={blogInfo.journey}
            onChange={(e) => handleChange('journey', e.target.value)}
          />
        );
      case 'experiences':
        return (
          <TextArea
            label="Highlight key experiences (temples, locals, food, hot air balloon ride)"
            value={blogInfo.experiences}
            onChange={(e) => handleChange('experiences', e.target.value)}
          />
        );
      case 'insights':
        return (
          <TextArea
            label="Add cultural insights, personal thoughts, challenges, and meaningful moments."
            value={blogInfo.insights}
            onChange={(e) => handleChange('insights', e.target.value)}
          />
        );
      case 'conclusion':
        return (
          <TextArea
            label="Wrap up with reflections, what the trip meant, and advice for others."
            value={blogInfo.conclusion}
            onChange={(e) => handleChange('conclusion', e.target.value)}
          />
        );
      case 'review':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Review Your Blog</h2>
            <p><strong>Selected Images:</strong> {blogInfo.selectedImageIds.length} images selected</p>
            <p><strong>How & Why:</strong> {blogInfo.howWhy}</p>
            <p><strong>Journey:</strong> {blogInfo.journey}</p>
            <p><strong>Experiences:</strong> {blogInfo.experiences}</p>
            <p><strong>Insights:</strong> {blogInfo.insights}</p>
            <p><strong>Conclusion:</strong> {blogInfo.conclusion}</p>
            <button
              onClick={() => console.log(blogInfo)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-xl transition"
            >
              Publish Blog
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Your Bagan Blog</h1>

      <div className="mb-6">{stepComponent()}</div>

      <div className="flex justify-between mt-10">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="bg-gray-700 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-xl transition"
        >
          {currentStep === steps.length - 2 ? 'Review' : 'Next'}
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
