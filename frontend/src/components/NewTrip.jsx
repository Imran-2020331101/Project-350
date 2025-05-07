import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { postTrip } from "../redux/tripSlice";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { SelectTravelList, SelectBudgetOptions } from "../DemoInfo/options";

const NewTrip = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [tripDetails, setTripDetails] = useState({
    destination: "",
    days: "",
    budget: "",
    persons:""
  });


  const handleChange = (name,value) => {
    setTripDetails((prev) => ({ ...prev, [name]: value }));
    console.log(tripDetails)
  };

  const handleSubmit = useCallback(() => {
    const { destination,days,tripBudget,persons} = tripDetails;

    dispatch(postTrip({ destination,days,tripBudget,persons}));

    // setTripDetails({
    //   destination: "",
    //   days: "",
    //   tripBudget: "Budget",
    //   persons:""
    // });
  }, [tripDetails, dispatch]);

  return (
    <section className="fixed top-0 left-0 backdrop-blur-[7px] h-screen w-full font-sans z-10 overflow-auto overflow-y-auto mt-20">
      <div className="flex flex-col items-center justify-center px-4 py-8 mx-auto md:h-screen">
        <div className="w-full bg-white rounded-xl shadow-md border sm:max-w-xl p-6 text-gray-900">
          <div className="flex justify-end">
            <p
              onClick={() => navigate(-1)}
              className="text-xl font-bold text-gray-500 cursor-pointer hover:text-gray-800 transition transform hover:scale-110"
            >
              ×
            </p>
          </div>

          <h1 className="text-2xl font-bold mb-6 text-center">Plan a New Trip</h1>

          {/* Destination */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-1">
              Destination
            </label>
            {/* <GooglePlacesAutocomplete
            apiKey={import.meta.env.GOOGLE_PLACES_API_KEY} 
            seletcProps={{
                place,
                onChange:handleChange}}
            /> */}
            <input
              name="destination"
              value={tripDetails.destination}
              onChange={(e)=>handleChange("destination",e.target.value)}
              placeholder="Enter destination"
              className="w-full border rounded-lg px-4 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Days */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-1">
              Duration (Days)
            </label>
            <input
              name="days"
              type="number"
              value={tripDetails.days}
              onChange={(e)=>handleChange('days',e.target.value)}
              placeholder="Ex. 5"
              className="w-full border rounded-lg px-4 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Budget */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-1">Budget Preference</label>
            <div className="grid grid-cols-3 gap-5 mt-5">

                {
                    SelectBudgetOptions.map((item,index)=>(
                        <div key={index} 
                            onClick={()=>handleChange('budget',item.title)}
                            className={`p-4 cursor-pointer border rounded-lg hover:shadow-lg
                                        ${ tripDetails?.budget == item.title && 'shadow-lg border-black'}
                                `}>
                            <h2>{item.icon}</h2>
                            <h2 className="font-bold text-lg">{item.title}</h2>
                            <h2 className="text-sm text-gray-500">{item.desc}</h2>
                        </div>
                    ))
                }

            </div>
          </div>

          {/* Persons */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Travel Group</label>
            <div className="grid grid-cols-3 gap-5 mt-5">

                {
                    SelectTravelList.map((item,index)=>(
                        <div key={index}
                            onClick={()=>handleChange('budget',item.people)}
                            className={`p-4 cursor-pointer border rounded-lg hover:shadow-lg
                                ${ tripDetails?.persons== item.people && 'shadow-lg border-red-100'}
                            `}>
                            <h2>{item.icon}</h2>
                            <h2 className="font-bold text-lg">{item.title}</h2>
                            <h2 className="text-sm text-gray-500">{item.desc}</h2>
                        </div>
                    ))
                }

            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition shadow-md"
          >
            Create Trip Plan
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewTrip;
