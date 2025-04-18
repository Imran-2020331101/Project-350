import React from 'react';
import { Link } from 'react-router-dom';
import ImageCard from './imageCard';
import BlogCard from './blogCard';

/**
 * Experiences Component
 * 
 * This component displays:
 * - A heading to encourage saving memories
 * - Two action buttons: "Create Blog" and "Upload Photos"
 * - A scrollable section of image cards
 * - A section to display user's travel blogs
 * 
 * Design Goals:
 * - Maintain fixed width panel that aligns with the rest of the dashboard
 * - Clean, modern spacing
 * - Maintain Tailwind CSS conventions
 * - Improve scroll UX and prevent content from overflowing
 */

const Experiences = () => {
  return (
    <div className="fixed w-[70%] right-0 h-full flex flex-col items-start px-10 py-6 overflow-y-auto gap-3">

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="w-32 h-9 bg-indigo-500 text-white font-semibold text-lg rounded-lg opacity-75 hover:opacity-100 transition">
          Create Blog
        </button>
        <Link
          to="/uploadimage"
          className="w-32 h-9 bg-indigo-500 text-white font-semibold text-lg rounded-lg flex justify-center items-center opacity-75 hover:opacity-100 transition"
        >
          Upload Photos
        </Link>
      </div>

      {/* Image Gallery */}
      <h1 className="text-3xl font-semibold text-gray-800">Images</h1>
      <section className="w-full h-[220px] overflow-y-auto flex flex-wrap gap-4 pr-2">
        {Array.from({ length: 9 }).map((_, i) => (
          <ImageCard key={i} />
        ))}
      </section>

      {/* Blog Section */}
      <section className="w-full flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Your Travel Blogs</h2>
        <BlogCard />
      </section>
    </div>
  );
};

export default Experiences;
