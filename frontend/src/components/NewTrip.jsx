import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { postTrip } from "../redux/tripSlice";
import { SelectTravelList, SelectBudgetOptions } from "../DemoInfo/options";

const NewTrip = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [tripDetails, setTripDetails] = useState({
    destination: "",
    days: "",
    budget: "",
    persons: ""
  });

  const handleChange = (name, value) => {
    setTripDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(() => {
    const { destination, days, budget, persons } = tripDetails;
    dispatch(postTrip({ destination, days, budget, persons }));
    navigate("/dashboard"); // or wherever you want to go after submission
  }, [tripDetails, dispatch, navigate]);

  return (
    <section className="w-full min-h-screen flex items-center justify-center py-12 px-4 bg-gray-800">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Plan a New Trip</h1>
          <p
            onClick={() => navigate(-1)}
            className="text-2xl font-semibold text-gray-400 cursor-pointer hover:text-gray-600"
          >
            ×
          </p>
        </div>

        {/* Destination */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
          <input
            name="destination"
            value={tripDetails.destination}
            onChange={(e) => handleChange("destination", e.target.value)}
            placeholder="Enter destination"
            className="w-full border rounded-lg px-4 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Days */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
          <input
            name="days"
            type="number"
            value={tripDetails.days}
            onChange={(e) => handleChange("days", e.target.value)}
            placeholder="Ex. 5"
            className="w-full border rounded-lg px-4 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Budget */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Budget Preference</label>
          <div className="grid grid-cols-3 gap-4">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleChange("budget", item.title)}
                className={`cursor-pointer p-4 border rounded-lg hover:shadow-md transition ${
                  tripDetails.budget === item.title ? "border-indigo-500 bg-indigo-50" : ""
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
          <label className="block text-sm font-medium text-gray-700 mb-3">Travel Group</label>
          <div className="grid grid-cols-3 gap-4">
            {SelectTravelList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleChange("persons", item.people)}
                className={`cursor-pointer p-4 border rounded-lg hover:shadow-md transition ${
                  tripDetails.persons === item.people ? "border-red-400 bg-red-50" : ""
                }`}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <h2 className="font-semibold text-black">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow transition"
        >
          Create Trip Plan
        </button>
      </div>
    </section>
  );
};

export default NewTrip;
