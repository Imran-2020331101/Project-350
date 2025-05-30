import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Trips } from '../../DemoInfo/Trips';
import { Edit } from 'lucide-react';

const UpdateProfilePage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const myTrips = Trips.filter((trip) => trip.owner === user.id);

  const [userData, setUserData] = useState(user);
  const [updatedData, setUpdatedData] = useState(user);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setUserData(user);
    setUpdatedData(user);
  }, [user]);

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
    <div className="py-5 pl-5 min-h-screen bg-gray-900 text-white">
      {/* Cover Photo */}
      <div className="relative w-full h-52 bg-gray-800">
        <img
          src={userData.coverPhoto}
          alt="Cover"
          className="object-cover w-full h-full"
        />
        {/* Profile Image Overlay */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-48px] w-24 h-24 rounded-full overflow-hidden border-4 border-gray-900 shadow-md">
          <img
            src={userData.profilePicture}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="pt-16 text-center px-4">
        <h2 className="text-2xl font-bold">{userData.name}</h2>
        <p className="text-sm text-gray-400">{userData.bio}</p>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded inline-flex items-center"
          >
            <Edit className="mr-1" size={16} /> Edit Profile
          </button>
        ) : (
          <div className="flex justify-center gap-2 mt-4">
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
      <div className="max-w-2xl mx-auto mt-8 px-4 space-y-6">
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
              <label className="text-sm text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
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
