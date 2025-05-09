import React from 'react';
import { Link } from 'react-router-dom';
import travel_bg from '/travel_bg2.mp4'

const Welcome = () => {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center py-12 overflow-hidden">
      
      {/* Background Video */}
<video
  src={travel_bg}
  autoPlay
  loop
  muted
  playsInline
  className="absolute top-0 left-0 w-full h-full object-cover z-9"
>
  Your browser does not support the video tag.
</video>


      {/* Overlay content */}
      <section className="w-[90%] bg-transparent max-w-screen-lg text-center space-y-6 z-10 text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          One app for all your travel planning needs
        </h1>

        <p className="text-lg md:text-2xl">
          Create detailed itineraries, explore user-shared guides,<br className="hidden md:inline" />
          and manage your bookings seamlessly — all in one place.
        </p>

        <Link
          to="/newtrip"
          className="inline-block mt-8 px-6 py-3 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 rounded-full shadow transition"
        >
          Start Planning
        </Link>
      </section>
    </div>
  );
};

export default Welcome;
