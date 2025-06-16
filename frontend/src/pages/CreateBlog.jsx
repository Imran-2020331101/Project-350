import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { createBlog, fetchBlogs } from '../redux/blogSlice';
import { toast } from 'react-toastify';

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
  const uploadedImages = useSelector((state)=>state.photos.photos);
  const { status, error } = useSelector((state) => state.blogs);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
  };  const publishBlog = async () => {
    try {
      console.log('Publishing blog with data:', blogInfo);
      
      // Validate that all required fields are filled
      if (!blogInfo.selectedImageIds.length || !blogInfo.howWhy || !blogInfo.journey || 
          !blogInfo.experiences || !blogInfo.insights || !blogInfo.conclusion) {
        toast.error("Please fill in all required fields and select at least one image");
        return;
      }

      // Validate user is logged in
      if (!user || !user._id) {
        toast.error("You must be logged in to create a blog");
        return;
      }

      // Include user information in the request
      const requestData = {
        blogInfo,
        user: {
          id: user._id,
          name: user.name || user.username,
          email: user.email
        },
        selectedImages: uploadedImages.filter(img => 
          blogInfo.selectedImageIds.includes(img._id)
        )
      };

      console.log('Sending blog data to backend:', requestData);      // Use Redux action instead of direct axios call
      const result = await dispatch(createBlog(requestData)).unwrap();
      console.log('Blog creation successful:', result);
      
      // Refresh the blogs list to include the new blog
      await dispatch(fetchBlogs());
      
      toast.success("Blog created successfully!");
      navigate('/blogs'); // Navigate to blogs list page
      
    } catch (error) {
      console.error('Error creating blog:', error);
      toast.error(error.error || error.message || "Failed to create blog");
    }
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
                  key={img._id}
                  onClick={() => toggleImageSelection(img._id)}
                  className={`cursor-pointer border-2 rounded-xl p-1 transition ${
                    blogInfo.selectedImageIds.includes(img._id)
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
            <p><strong>Conclusion:</strong> {blogInfo.conclusion}</p>            <button
              onClick={() => publishBlog()}
              disabled={status === 'creating'}
              className={`font-semibold px-6 py-2 rounded-xl transition ${
                status === 'creating'
                  ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-black'
              }`}
            >
              {status === 'creating' ? 'Publishing...' : 'Publish Blog'}
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

      <div className="mb-6">{stepComponent()}</div>      <div className="flex justify-between mt-10">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="bg-gray-700 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Back
        </button>
        {currentStep < steps.length - 1 && (
          <button
            onClick={nextStep}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-xl transition"
          >
            {currentStep === steps.length - 2 ? 'Review' : 'Next'}
          </button>
        )}
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
