import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 py-12">
      <section className="w-[90%] max-w-screen-lg text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
          One app for all your travel planning needs
        </h1>

        <p className="text-lg md:text-2xl text-gray-600">
          Create detailed itineraries, explore user-shared guides,<br className="hidden md:inline" />
          and manage your bookings seamlessly — all in one place.
        </p>

        <Link
          to="/newtrip"
          className="inline-block mt-8 px-6 py-3 text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow transition"
        >
          Start Planning
        </Link>
      </section>
    </div>
  );
};

export default Welcome;
