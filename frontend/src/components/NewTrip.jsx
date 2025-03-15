import React from "react";
import { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { budget } from "../constants";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import selectAllTrips from "../redux/tripSlice";
import { postTrip } from "../redux/tripSlice";

// import { addTrip } from "../redux/slices/tripsSlice";




const NewTrip = () => {
    const navigate = useNavigate();
    const [value, setValue] = useState({
        startDate: null,
        endDate: null,
    });
    console.log(value);
    const [destination, setDestination] = useState("");
    const [source, setSource] = useState("");
    const [tripBudget, setTripBudget] = useState("Budget");

    const dispatch = useDispatch();
    // const trips = useSelector(selectAllTrips);

    const handleSubmit = () => {
        dispatch(postTrip({journeyDate:value.startDate,returnDate:value.endDate,destination,startingPoint:source, tripBudget}));
        setDestination("");
        setSource("");
        setTripBudget("Budget");
        setValue({ startDate: null, endDate: null });
        console.log(destination, source, tripBudget, value.endDate , value.startDate);
    }

    
    return (
        <section className="fixed top-0 left-0 backdrop-blur-[7px] h-screen w-full  font-sans z-10">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                    <div className="flex justify-end">
                        <p
                            onClick={() => navigate("/")}
                            className="px-4  text-gray-600 text-[20px] cursor-pointer hover:text-gray-900 transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-110 duration-100"
                        >
                            x
                        </p>
                    </div>
                    <div className="m-2">
                        <h1 className="text-gray-800 font-bold text-xl pb-5">
                            Plan a new trip
                        </h1>
                        <div class="w-62">
                            <div class="w-full max-w-sm min-w-[200px] mb-4">
                                <input
                                    class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    value={source}
                                    onChange={(e) =>
                                        setSource(e.target.value)
                                    }
                                    placeholder="Source"
                                    required={true}
                                />
                            </div>
                            <div class="w-full max-w-sm min-w-[200px] ">
                                <input
                                    class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    value={destination}
                                    onChange={(e) =>
                                        setDestination(e.target.value)
                                    }
                                    placeholder="Destination"
                                    required={true}
                                />
                            </div>
                            <p class="mb-2">Travel Date:</p>
                            <Datepicker
                                classNames="w-3/5"
                                value={value}
                                onChange={(newValue) => setValue(newValue)}
                            />
                            <div>
                                <label className="mb-2 font-semibold text-gray-900">
                                    Your Budget:
                                </label>
                                <select
                                    value={tripBudget}
                                    onChange={(e) =>
                                        setTripBudget(e.target.value)
                                    }
                                    class="flex w-28 p-1 mt-2 font-medium text-gray-700 bg-white border border-gray-200 rounded-md cursor-pointer"
                                >
                                    {budget.map((item) => {
                                        return (
                                            <option value={item}>{item}</option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                    <button onClick={handleSubmit} className="p-2 border text-[#fff] font-semibold hover:bg-slate-700 border-gray-200 m-2 rounded-lg bg-slate-500">
                        Create Trip Plan
                    </button>
                </div>
            </div>
        </section>
    );
};

export default NewTrip;
