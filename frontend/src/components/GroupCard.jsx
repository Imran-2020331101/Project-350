import React from "react";

const GroupCard = ({ group }) => {
  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-800 m-4 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
      <img
        src={group?.image}
        alt={group?.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold">{group.title}</h2>
          <span className="text-sm bg-gray-700 px-2 py-1 rounded-full">
            {group.days} days
          </span>
        </div>

        <div className="text-sm text-gray-500">
          📍 {group.place}
        </div>

        <p className="text-sm text-gray-600">{group.about}</p>        <div className="text-sm text-gray-600">
          📅 {formatDate(group.startDate)} – {formatDate(group.endDate)}
        </div>

        <div className="text-sm">
          <span className="font-medium">Activities:</span>{" "}
          {group?.activities?.join(", ")}
        </div>

        <div className="flex justify-between text-sm text-gray-700 mt-2">
          <div>👥 {group?.availableSpots} spots left</div>
          <div>💵 ${group?.expectedCost}</div>
        </div>

        <div className="text-xs text-gray-400 mt-1">
          🚐 Starts from: {group?.startingPointOfGroup}
        </div>
      </div>
    </div>
  );
};

export default GroupCard;