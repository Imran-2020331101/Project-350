import React from "react";

const TripCard = ({ trip }) => {
  return (
    <div className="bg-gray-800 m-4 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
      <img
        src={trip.image}
        alt={trip.destination}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold">{trip.destination}</h2>
          <span className="text-sm bg-gray-700 px-2 py-1 rounded-full">
            {trip.tags?.days} days
          </span>
        </div>

        <div className="text-sm text-gray-500">
          📍 {trip.destination}
        </div>

        <p className="text-sm text-gray-600">{trip.description}</p>

        
        <div className="text-sm">
          <span className="font-medium">Activities:</span>{" "}
          {trip.tripTypes?.join(", ")}
        </div>

        <div className="flex justify-between text-sm text-gray-700 mt-2">
          <div>👥 {trip.tags?.numberOfTravelers} spots left</div>
          <div>💵 ${trip.tags?.budget}</div>
        </div>

      </div>
    </div>
  );
};

export default TripCard;
