import React from 'react';
import { CalendarDays, MapPin, DollarSign, Users, PlaneTakeoff, Info, Camera, Compass, Mountain, Sun } from 'lucide-react';
import { Packages } from '../DemoInfo/Packages';
import { useParams } from 'react-router-dom';
import Footer from '../components/HomePage/Footer';

const PackageDetail = () => {
  const { id } = useParams();
  const [trip] = Packages.filter((p) => p.id == id);

  if (!trip) return <div className="text-center py-10">Trip data not available.</div>;

  const {
    title,
    days,
    place,
    about,
    startDate,
    endDate,
    activities,
    availableSpots,
    expectedCost,
    startingPointOfGroup,
    image,
    highlights,
    itinerary,
    goodToKnow,
  } = trip;

  return (
    <div className="bg-[#111827] min-h-screen pt-12 w-full">
      {/* Hero Section */}
      <div className="relative mx-[12%] h-96 overflow-hidden rounded-xl shadow-lg mb-8">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 transform scale-100 hover:scale-105" />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          <p className="text-sm md:text-md"><MapPin className="inline-block mr-1" size={16} /> {place}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {/* Left Column */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
          {/* Overview */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><Info className="mr-2 text-blue-500" size={20} /> Overview</h2>
            <p className="text-gray-700 leading-relaxed">{about}</p>
          </section>

          {/* Activities */}
          {activities && activities.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><Compass className="mr-2 text-indigo-500" size={20} /> Activities Included</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {activities.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Itinerary */}
          {itinerary && itinerary.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><CalendarDays className="mr-2 text-teal-500" size={20} /> Itinerary</h2>
              <ul className="space-y-4">
                {itinerary.map((day, index) => (
                  <li key={index} className="bg-gray-50 rounded-md p-4 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-1">Day {index + 1}</h3>
                    <p className="text-gray-700 leading-relaxed">{day}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Column */}
        <aside className="bg-white rounded-xl shadow-md p-6 sticky top-20">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Trip Details</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-2 text-gray-700">
                <CalendarDays className="text-blue-500" size={16} />
                <span><strong>Duration:</strong> {days} days</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="text-red-500" size={16} />
                <span><strong>Location:</strong> {place}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <CalendarDays className="text-green-500" size={16} />
                <span><strong>Dates:</strong> {startDate} → {endDate}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Users className="text-purple-500" size={16} />
                <span><strong>Availability:</strong> {availableSpots} spot(s) left</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <DollarSign className="text-yellow-500" size={16} />
                <span><strong>Price:</strong> ${expectedCost} per person</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <PlaneTakeoff className="text-indigo-500" size={16} />
                <span><strong>Starts From:</strong> {startingPointOfGroup}</span>
              </div>
            </div>
          </div>

          {/* Highlights */}
          {highlights && highlights.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center"><Sun className="mr-2 text-orange-500" size={18} /> Highlights</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Good to Know */}
          {goodToKnow && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center"><Info className="mr-2 text-gray-500" size={18} /> Good to Know</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{goodToKnow}</p>
            </div>
          )}

          <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-md shadow-md w-full mt-4 transition duration-300 ease-in-out">
            Book Your Trip Now
          </button>
        </aside>
      </div>

      {/* Additional Information Section */}
      <section className="max-w-6xl mx-auto p-6 mt-12 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center"><Camera className="mr-2 text-pink-500" size={24} /> Photo Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Add more relevant image URLs here */}
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="overflow-hidden rounded-md shadow-sm">
              <img
                src={`https://source.unsplash.com/random/400x300?nature,travel&sig=${i}`}
                alt={`Trip Photo ${i + 1}`}
                className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Related Trips Section (Example - you'd likely fetch this data) */}
      <section className="max-w-6xl mx-auto p-6 mt-12 bg-gray-50 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center"><Mountain className="mr-2 text-gray-700" size={24} /> You Might Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example related trips - replace with actual data */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={`https://source.unsplash.com/random/400x250?landscape&sig=${i + 10}`}
                alt={`Related Trip ${i}`}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-lg mb-2">Adventure in the Alps</h3>
                <p className="text-gray-600 text-sm">5 Days | Switzerland</p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mt-2 text-sm">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer/>
    </div>
  );
};

export default PackageDetail;