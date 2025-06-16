import { useParams, Link } from 'react-router-dom';
import { CalendarDays, Plane, TrainFront, Hotel, Sun } from 'lucide-react';
import { useSelector } from 'react-redux';

const Itinerary = () => {
  const { id } = useParams();
  const Trips = useSelector((state) => state.trips.trips);

  const myTrip = Trips?.find((t)=> t._id == id);
  // Debug: Log the trip data structure
  console.log('Weather forecast:', myTrip?.weatherForecast);
  console.log('Weather forecast type:', typeof myTrip?.weatherForecast);
 
  if (!myTrip) {
    return <div className="text-center text-white mt-10">Trip not found.</div>;
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 mt-6 flex flex-col items-center">
      <section className="w-full max-w-6xl bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden">
        <div className="min-h-screen w-full px-4 sm:px-6 py-10 flex flex-col items-center gap-10 bg-gray-800">

          {/* Header Image */}
          <div className="w-full rounded-xl overflow-hidden shadow-lg">
            <img
              src={`https://source.unsplash.com/featured/?${myTrip.destination}`}
              alt={myTrip.destination}
              className="w-full h-64 object-cover"
            />
          </div>

          {/* Destination */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-center">{myTrip.destination}</h2>          {/* Weather Forecast */}
          <section className="w-full max-w-3xl bg-white text-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sun className="text-yellow-500" /> Weather Forecast
            </h3>
            {typeof myTrip.weatherForecast === 'string' ? (
              <p>{myTrip.weatherForecast}</p>
            ) : myTrip.weatherForecast && typeof myTrip.weatherForecast === 'object' ? (
              <div className="space-y-2">
                {myTrip.weatherForecast.condition && (
                  <p><strong>Condition:</strong> {myTrip.weatherForecast.condition}</p>
                )}
                {myTrip.weatherForecast.temperature && (
                  <p><strong>Temperature:</strong> {myTrip.weatherForecast.temperature}</p>
                )}
                {myTrip.weatherForecast.alerts && (
                  <p><strong>Alerts:</strong> {myTrip.weatherForecast.alerts}</p>
                )}
                {myTrip.weatherForecast.suggestions && (
                  <p><strong>Suggestions:</strong> {myTrip.weatherForecast.suggestions}</p>
                )}
              </div>
            ) : (
              <p>Weather information not available</p>
            )}
          </section>          {/* Description */}
          <section className="w-full max-w-3xl bg-white text-gray-800 rounded-xl shadow-md p-6 max-h-60 overflow-y-auto">
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <p>{myTrip.description || 'No description available for this trip.'}</p>
          </section>

          {/* Transport Options */}
          <section className="w-full max-w-3xl bg-white text-gray-800 rounded-xl shadow-md p-6 space-y-4">
            <h3 className="text-xl font-semibold mb-4">Transport Options</h3>            {/* Flights */}
            <div>
              <h4 className="font-medium flex items-center gap-2">
                <Plane className="text-blue-500" size={18} /> Flights
              </h4>
              {myTrip.transportOptions?.flights?.length > 0 ? (
                myTrip.transportOptions.flights.map((flight, idx) => (
                  <div key={idx} className="text-sm mt-1">
                    {flight.airline} {flight.flightNumber} — {flight.from} to {flight.to}<br />
                    Departure: {new Date(flight.departure).toLocaleString()}<br />
                    Arrival: {new Date(flight.arrival).toLocaleString()}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 mt-1">No flight options available</p>
              )}
            </div>            {/* Trains */}
            <div>
              <h4 className="font-medium flex items-center gap-2 mt-3">
                <TrainFront className="text-green-500" size={18} /> Trains
              </h4>
              {myTrip.transportOptions?.trains?.length > 0 ? (
                myTrip.transportOptions.trains.map((train, idx) => (
                  <div key={idx} className="text-sm mt-1">
                    {train.trainName} — {train.from} to {train.to}<br />
                    Departure: {new Date(train.departure).toLocaleString()}<br />
                    Arrival: {new Date(train.arrival).toLocaleString()}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 mt-1">No train options available</p>
              )}
            </div>
          </section>

          {/* Itinerary */}          {myTrip.placesToVisit && Object.keys(myTrip.placesToVisit).length > 0 ? (
            <section className="w-full max-w-4xl flex flex-col items-center gap-5">
              <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
                <CalendarDays /> Trip Plan
              </h3>
              {Object.entries(myTrip.placesToVisit).map(([timeSlot, place], idx) => {
                // Handle both old array format and new object format
                if (Array.isArray(place)) {
                  // Old format: place is an array
                  return (
                    <div key={idx} className="w-full bg-white rounded-xl p-4 shadow-md text-gray-800">
                      <h4 className="font-semibold mb-2">{timeSlot}</h4>
                      <ul className="list-disc pl-6">
                        {place.map((p, index) => (
                          <li key={index}>{p.time || ''} - {p.place || p.name || 'Unknown Place'}</li>
                        ))}
                      </ul>
                    </div>
                  );
                } else {
                  // New format: place is an object
                  return (
                    <div key={idx} className="w-full bg-white rounded-xl p-4 shadow-md text-gray-800">
                      <h4 className="font-semibold mb-2">{timeSlot}</h4>
                      <div className="pl-4">
                        <h5 className="font-medium text-lg">{place?.name || 'Unknown Place'}</h5>
                        <p className="text-sm text-gray-600 mt-1">{place?.details || 'No details available'}</p>
                      </div>
                    </div>
                  );
                }
              })}
            </section>
          ) : (
            <section className="w-full max-w-4xl flex flex-col items-center gap-5">
              <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
                <CalendarDays /> Trip Plan
              </h3>
              <div className="w-full bg-white rounded-xl p-4 shadow-md text-gray-800 text-center">
                <p className="text-gray-600">No itinerary available for this trip.</p>
              </div>
            </section>
          )}          {/* Hotels */}
          <section className="w-full max-w-4xl bg-white text-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Hotel className="text-purple-500" /> Recommended Hotels
            </h3>
            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {myTrip.hotelsToStay?.length > 0 ? (
                myTrip.hotelsToStay.map((hotel, index) => (
                  <li key={index} className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                    <p className="font-medium">{hotel.name || 'Unknown Hotel'}</p>
                    <p className="text-sm">Location: {hotel.location || 'Location not specified'}</p>
                    <p className="text-sm">Price per night: ${hotel.pricePerNight || 'Price not available'}</p>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No hotel recommendations available</p>
              )}
            </ul>
          </section>
        </div>
      </section>

      {/* Join Group Button */}
      <div className="my-10 pt-10 flex flex-wrap gap-6 justify-center items-center">

        <Link
          to="/blogs/new"
          state={{ trip: myTrip }}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition"
          >
          Create A Blog
        </Link>
        <Link
          to="/group/new"
          state={{ trip: myTrip }}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition"
          >
          Create Travel Group
        </Link>
      </div>
    </div>
  );
};

export default Itinerary;
