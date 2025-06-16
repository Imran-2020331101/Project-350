import { useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { Edit } from 'lucide-react';
import Loader from '../Shared/Loader';
import defaultUser from '../../assets/defaultUser.png'
import { updateProfilePicture } from '../../redux/photoSlice';

const UpdateProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [userData, setUserData] = useState(user || {});
  const [updatedData, setUpdatedData] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProfilePic, setSelectedProfilePic] = useState(null);
  const [selectedCoverPhoto, setSelectedCoverPhoto] = useState(null);


  useEffect(() => {
    setUserData(user);
    setUpdatedData(user);
  }, [user]);

  if (!userData) {
  return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Loader/>
      </div>
    );
  }

  const handleProfilePicChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setSelectedProfilePic(URL.createObjectURL(file));
    const formData = new FormData();
formData.append("userID", user._id);
formData.append("caption", "Profile picture");
formData.append("images", selectedProfilePic); 
    dispatch(updateProfilePicture(formData));
  }
};

const handleCoverPhotoChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setSelectedCoverPhoto(URL.createObjectURL(file));
    // Add logic here to upload to server if needed
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('preferences.')) {
      const key = name.split('.')[1];
      setUpdatedData({
        ...updatedData,
        preferences: {
          ...updatedData.preferences,
          [key]: value,
        },
      });
    } else {
      setUpdatedData({ ...updatedData, [name]: value });
    }
  };

  const handleSave = () => {
    console.log('Updated Data:', updatedData);
    setUserData(updatedData);
    setIsEditing(false);
    alert('Profile updated successfully! (See console)');
  };

  const handleCancel = () => {
    setUpdatedData(userData);
    setIsEditing(false);
  };

  return (
  <div className="min-h-screen bg-gray-900 text-white">
  {/* Cover Photo */}
  <div className="relative w-full h-48 sm:h-56 md:h-64 bg-gray-800 cursor-pointer group">
    <label htmlFor="coverPhotoInput" className="block w-full h-full">
      <img
        src={selectedCoverPhoto || userData?.coverPhoto || defaultUser}
        alt="Cover"
        className="w-full h-full object-cover block group-hover:opacity-70 transition duration-300"
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white font-semibold text-sm bg-black bg-opacity-40 transition">
        Click to change cover photo
      </div>
    </label>
    <input
      type="file"
      accept="image/*"
      id="coverPhotoInput"
      className="hidden"
      onChange={handleCoverPhotoChange}
    />

    {/* Profile Image Overlay */}
    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-48px] w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-gray-900 shadow-md group cursor-pointer">
      <label htmlFor="profilePicInput" className="block w-full h-full group">
        <img
          src={selectedProfilePic || userData?.profilePicture || defaultUser}
          alt="Profile"
          className="w-full h-full object-cover group-hover:opacity-70 transition duration-300"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white text-xs font-medium bg-black bg-opacity-40">
          Click to change profile picture
        </div>
      </label>
      <input
        type="file"
        accept="image/*"
        id="profilePicInput"
        className="hidden"
        onChange={handleProfilePicChange}
      />
    </div>
  </div>

  {/* User Info */}
  <div className="pt-20 sm:pt-24 text-center px-4 sm:px-6 lg:px-8">
    <h2 className="text-2xl font-bold">{userData?.name}</h2>
    <p className="text-sm text-gray-400">{userData?.bio}</p>

    {!isEditing ? (
      <button
        onClick={() => setIsEditing(true)}
        className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded inline-flex items-center"
      >
        <Edit className="mr-1" size={16} /> Edit Profile
      </button>
    ) : (
      <div className="flex flex-col sm:flex-row justify-center gap-2 mt-4">
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          onClick={handleCancel}
          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    )}
  </div>

  {/* Editable Fields */}
  <div className="max-w-2xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 space-y-6">
    {/* General Fields */}
    {[
      { label: 'Username', name: 'username', type: 'text' },
      { label: 'Email', name: 'email', type: 'email' },
      { label: 'Location', name: 'location', type: 'text' },
    ].map(({ label, name, type }) => (
      <div key={name}>
        <label className="text-sm text-gray-400">{label}</label>
        {isEditing ? (
          <input
            type={type}
            name={name}
            value={updatedData[name]}
            onChange={handleChange}
            className="w-full p-2 mt-1 bg-gray-800 border border-gray-600 rounded"
          />
        ) : (
          <p className="mt-1">{userData[name]}</p>
        )}
      </div>
    ))}

    {/* Preferences */}
    <div>
      <h3 className="text-md font-semibold text-gray-300 mb-2">Preferences</h3>
      {['travelStyle', 'preferredClimate', 'language'].map((key) => (
        <div key={key} className="mt-2">
          <label className="text-sm text-gray-400 capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          {isEditing ? (
            <input
              type="text"
              name={`preferences.${key}`}
              value={updatedData.preferences?.[key] || ''}
              onChange={handleChange}
              className="w-full p-2 mt-1 bg-gray-800 border border-gray-600 rounded"
            />
          ) : (
            <p className="mt-1">{userData.preferences?.[key]}</p>
          )}
        </div>
      ))}
    </div>

    {/* Logout Button */}
    <div className="pt-6">
      <button
        onClick={() => navigate('/logout')}
        className="w-full bg-red-600 hover:bg-red-700 py-2 rounded"
      >
        Logout
      </button>
    </div>
  </div>
</div>

  );
};

export default UpdateProfilePage;
