import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { postTrip } from "../redux/tripSlice";

const NewTrip = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [tripDetails, setTripDetails] = useState({
        destination: "",
        days: "",
        tripBudget: "Budget",
        selectedOption: "",
        journeyDate: null,
        returnDate: null,
    });

    const options = ["cheap", "moderate", "luxury"];
    const numOfPersons = ["Solo","Couple","Family","Friends"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTripDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = useCallback(() => {
        const { destination, tripBudget, journeyDate, returnDate } = tripDetails;
        const source = "User's Location"; // Define `source` (or fetch from user input)

        dispatch(postTrip({ journeyDate, returnDate, destination, startingPoint: source, tripBudget }));

        setTripDetails({
            destination: "",
            days: "",
            tripBudget: "Budget",
            selectedOption: "",
            journeyDate: null,
            returnDate: null,
        });
    }, [tripDetails, dispatch]);

    return (
        <section className="fixed top-0 left-0 backdrop-blur-[7px] h-screen w-full font-sans z-10">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xl xl:p-0">
                    <div className="flex justify-end">
                        <p
                            onClick={() => navigate("/")}
                            className="px-4 text-gray-600 text-[20px] cursor-pointer hover:text-gray-900 transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-110 duration-100"
                        >
                            ×
                        </p>
                    </div>
                    
                    {/* Apply text-gray-900 at the wrapper level */}
                    <div className="m-2 text-gray-900">
                        <h1 className="font-bold text-xl pb-5">Plan a new trip</h1>

                        {/* Destination Input */}
                        <div className="mb-4">
                            <label className="font-semibold text-lg mb-2">
                                Destination
                                <input
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm"
                                    name="destination"
                                    value={tripDetails.destination}
                                    onChange={handleChange}
                                    placeholder="Enter destination"
                                    required
                                />
                            </label>
                        </div>

                        {/* Days Input */}
                        <div className="mb-4">
                            <label className="font-semibold text-lg mb-2">
                                Duration (Days)
                                <input
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md mt-2 px-3 py-2 transition focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm"
                                    name="days"
                                    value={tripDetails.days}
                                    onChange={handleChange}
                                    placeholder="Ex. 5"
                                    required
                                />
                            </label>
                        </div>

                        {/* Budget Options (Radio Buttons) */}
                        <div className="mt-4">
                            <label className="font-semibold">Budget Preference:</label>
                            <div className="flex gap-4 mt-2">
                                {options.map((option, index) => (
                                    <label key={index} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="selectedOption"
                                            value={option}
                                            checked={tripDetails.selectedOption === option}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Number of Persons (Radio Buttons) */}
                        <div className="mt-4">
                            <label className="font-semibold">Who do you plan on traveling with on your next adventure?</label>
                            <div className="flex gap-4 mt-2">
                                {numOfPersons.map((person, index) => (
                                    <label key={index} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="selectedOption"
                                            value={person}
                                            checked={tripDetails.selectedOption === person}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        {person}
                                    </label>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        className="p-2 border text-white font-semibold hover:bg-slate-700 border-gray-200 m-2 rounded-lg bg-slate-500"
                    >
                        Create Trip Plan
                    </button>
                </div>
            </div>
        </section>
    );
};

export default NewTrip;
