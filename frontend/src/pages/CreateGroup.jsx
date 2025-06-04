import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CalendarDays, Sun, MapPin, Tag, Info, ImagePlus, Users, DollarSign, Flag, Camera } from 'lucide-react';

const CreateGroup = () => {

  const location = useLocation();
  const tripFromState = location.state?.trip;

  const [isLoading, setIsLoading] = useState(true);

  
  const [groupData, setGroupData] = useState({
    title: '',
    place: '',
    days: '',
    about: '',
    startDate: '',
    endDate: '',
    activities: '',
    availableSpots: '',
    expectedCost: '',
    startingPointOfGroup: '',
    image: '',
  });

  useEffect(() => {
    if (tripFromState) {
      
      setGroupData((prev) => ({
        ...prev,
        title: `Trip to ${tripFromState.destination}`,
        place: tripFromState.destination,
        days: Object.keys(tripFromState.placesToVisit).length,
        about: tripFromState.description,
        image: `https://source.unsplash.com/featured/?${tripFromState.destination}`,
      }));
      setIsLoading(false);

    }
  }, [tripFromState]);
  
  
  if (isLoading) return <div>Loading...</div>; 
  
  const handleChange = (e) => {
    setGroupData({ ...groupData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Group Created:", groupData);
    // TODO: Send to backend here
  };

  return (
    <div className="bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto bg-gray-900 shadow-xl rounded-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-semibold text-center text-gray-200 mb-8">
          <Tag className="inline-block mr-2 text-blue-500" size={32} /> Create a Travel Group
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          <div>
            <label htmlFor="title" className="block text-gray-200 text-sm font-bold mb-2">
              <Info className="inline-block mr-1 text-gray-200" size={16} /> Group Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g., Discover Ancient Pyramids"
              value={groupData.title}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="place" className="block text-gray-200 text-sm font-bold mb-2">
              <MapPin className="inline-block mr-1 text-red-500" size={16} /> Destination
            </label>
            <input
              type="text"
              id="place"
              name="place"
              placeholder='{groupData.place}'
              value={groupData.place}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-gray-200 text-sm font-bold mb-2">
                <CalendarDays className="inline-block mr-1 text-green-500" size={16} /> Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={groupData.startDate}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-gray-200 text-sm font-bold mb-2">
                <CalendarDays className="inline-block mr-1 text-orange-500" size={16} /> End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={groupData.endDate}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="days" className="block text-gray-200 text-sm font-bold mb-2">
              <Sun className="inline-block mr-1 text-yellow-500" size={16} /> Duration (Days)
            </label>
            <input
              type="number"
              id="days"
              name="days"
              placeholder="e.g., 7"
              value={groupData.days}
              onChange={handleChange}
              min={1}
              required
              className="w-full p-3 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div>
            <label htmlFor="about" className="block text-gray-200 text-sm font-bold mb-2">
              <Info className="inline-block mr-1 text-gray-500" size={16} /> About the Trip
            </label>
            <textarea
              id="about"
              name="about"
              placeholder="Share the exciting details of your group trip..."
              value={groupData.about}
              onChange={handleChange}
              rows={4}
              required
              className="w-full p-3 border rounded-lg focus:ring-gray-500 focus:border-gray-500"
            />
          </div>
          <div>
            <label htmlFor="activities" className="block text-gray-200 text-sm font-bold mb-2">
              <Camera className="inline-block mr-1 text-purple-500" size={16} /> Activities (Separate by comma)
            </label>
            <input
              type="text"
              id="activities"
              name="activities"
              placeholder="e.g., Hiking, Sightseeing, Food Tasting"
              value={groupData.activities}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="availableSpots" className="block text-gray-200 text-sm font-bold mb-2">
                <Users className="inline-block mr-1 text-blue-500" size={16} /> Available Spots
              </label>
              <input
                type="number"
                id="availableSpots"
                name="availableSpots"
                placeholder="e.g., 10"
                value={groupData.availableSpots}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="expectedCost" className="block text-gray-200 text-sm font-bold mb-2">
                <DollarSign className="inline-block mr-1 text-green-500" size={16} /> Expected Cost ($)
              </label>
              <input
                type="number"
                id="expectedCost"
                name="expectedCost"
                placeholder="e.g., 500"
                value={groupData.expectedCost}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="startingPointOfGroup" className="block text-gray-200 text-sm font-bold mb-2">
              <Flag className="inline-block mr-1 text-orange-500" size={16} /> Starting Point
            </label>
            <input
              type="text"
              id="startingPointOfGroup"
              name="startingPointOfGroup"
              placeholder="e.g., Airport, Hotel Name"
              value={groupData.startingPointOfGroup}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-gray-200 text-sm font-bold mb-2">
              <ImagePlus className="inline-block mr-1 text-indigo-500" size={16} /> Cover Image URL
            </label>
            <input
              type="url"
              id="image"
              name="image"
              placeholder="Paste image URL here"
              value={groupData.image}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white text-lg py-3 rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;