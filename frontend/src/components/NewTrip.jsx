import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { postTrip } from "../redux/tripSlice";
import { SelectTravelList, SelectBudgetOptions } from "../DemoInfo/options";
import { toast } from "react-toastify";

const NewTrip = () => {
  const {isSignedIn, limit, user} = useSelector((state) => state.auth);
  const {status} = useSelector((state) => state.trips);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Debug: Log the current limit value
  console.log('Current user limit:', limit, 'Type:', typeof limit);
  const [tripDetails, setTripDetails] = useState({
    owner: user?._id || "",
    destination: "",
    days: "",
    budget: "",
    persons: "",
    travelDate: ""
  });

  const isLoading = status === 'loading';

  const handleChange = (name, value) => {
    setTripDetails((prev) => ({ ...prev, [name]: value }));
  };  const handleSubmit = useCallback(async () => {
    
    if(!isSignedIn || !user?._id){
      toast.error('You need to Sign In to create a Trip');
      return navigate('/login');
    }
    
    // More permissive limit logic - allow trip creation unless explicitly blocked
    if(limit !== undefined && limit !== null && Number(limit) <= 0){
      toast.error('Reached free limit. Upgrade plan to use more');
      return navigate('/upgrade');
    }

    const { destination, days, budget, persons, owner, travelDate } = tripDetails;
    
    // Validate required fields
    if (!destination || !days || !budget || !persons || !travelDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Ensure owner is set properly
    const actualOwner = owner || user._id;
    
    // Format data to match backend expectations
    const tripData = {
      destination,
      owner: actualOwner,
      travelDate,
      tags: {
        days: parseInt(days),
        budget,
        numberOfTravelers: parseInt(persons)
      }
    };

    try {
      console.log('Sending trip data to backend:', tripData);
      // Wait for the trip creation to complete before navigating
      const result = await dispatch(postTrip(tripData)).unwrap();
      console.log('Trip creation successful:', result);
      toast.success("Trip created successfully");
      navigate("/dashboard"); 
    } catch (error) {
      console.error('Trip creation failed:', error);
      toast.error(error.message || "Failed to create trip");
    }
  }, [tripDetails, dispatch, navigate, isSignedIn, limit, user]);

  return (
    <section className="w-full min-h-screen flex items-center justify-center py-12 px-4 bg-gray-900">
      <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-md p-8">        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-200">Plan a New Trip</h1>
          <div className="flex items-center gap-4">
            {/* Debug info - remove in production */}
            <span className="text-xs text-gray-400">
              Limit: {limit} | Signed: {isSignedIn ? 'Yes' : 'No'}
            </span>
            <p
              onClick={() => navigate(-1)}
              className="text-2xl font-semibold text-gray-600 cursor-pointer hover:text-gray-400"
            >
              ×
            </p>
          </div>
        </div>

        {/* Destination */}
        <div className="mb-6 text-black">
          <label className="block text-sm font-medium text-gray-200 mb-1">Destination</label>
          <input
            name="destination"
            value={tripDetails.destination}
            onChange={(e) => handleChange("destination", e.target.value)}
            placeholder="Enter destination"
            className="w-full border rounded-lg px-4 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Days */}
        <div className="mb-6 text-black">
          <label className="block text-sm font-medium text-gray-200 mb-1">Duration (Days)</label>
          <input
            name="days"
            type="number"
            value={tripDetails.days}
            onChange={(e) => handleChange("days", e.target.value)}
            placeholder="Ex. 5"
            className="w-full border rounded-lg px-4 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Travel Date */}
        <div className="mb-6 text-black">
          <label className="block text-sm font-medium text-gray-200 mb-1">Travel Date</label>
          <input
            name="travelDate"
            type="date"
            value={tripDetails.travelDate}
            onChange={(e) => handleChange("travelDate", e.target.value)}
            className="w-full border rounded-lg px-4 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Budget */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-200 mb-3">Budget Preference</label>
          <div className="grid grid-cols-3 gap-4">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleChange("budget", item.title)}
                className={`cursor-pointer p-4 border rounded-lg hover:shadow-md transition bg-gray-100 ${
                  tripDetails.budget === item.title ? "border-indigo-500 bg-green-400" : ""
                }`}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <h2 className="font-semibold text-black">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Persons */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-200 mb-3">Travel Group</label>
          <div className="grid grid-cols-3 gap-4">
            {SelectTravelList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleChange("persons", item.people)}
                className={`cursor-pointer p-4 border rounded-lg hover:shadow-md bg-gray-100 transition ${
                  tripDetails.persons === item.people ? "border-red-400 bg-green-400" : ""
                }`}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <h2 className="font-semibold text-black">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full font-semibold py-2.5 rounded-lg shadow transition ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed text-gray-700' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isLoading ? 'Creating Trip...' : 'Create Trip Plan'}
        </button>
      </div>
    </section>
  );
};

export default NewTrip;
