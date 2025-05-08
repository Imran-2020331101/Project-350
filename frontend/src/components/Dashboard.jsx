import React from 'react';
import { Link } from 'react-router-dom';
import ImageCard from './imageCard';
import BlogCard from './blogCard';
import { Blogs } from '../DemoInfo/BlogsData';

const Experiences = () => {
  return (
    <div className="fixed right-0 w-[70%] h-full px-10 py-8 overflow-y-auto flex flex-col gap-8 bg-inherit">

      {/* Header Action Row */}
      <div className="flex justify-between items-center w-full">
        <h1 className="text-3xl font-bold text-gray-800">Your Experiences</h1>
        <div className="flex gap-4">
          <button className="px-5 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-indigo-700 transition">
            Create Blog
          </button>
          <Link
            to="/uploadimage"
            className="px-5 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-indigo-700 transition flex items-center justify-center"
          >
            Upload Photos
          </Link>
        </div>
      </div>

      {/* Image Gallery Section */}
      <section className="w-full">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Image Gallery</h2>
        <div className="w-full max-h-[220px] overflow-y-auto flex flex-wrap gap-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {Array.from({ length: 9 }).map((_, i) => (
            <ImageCard key={i} />
          ))}
        </div>
      </section>

      {/* Blog Section */}
      <section className="w-full">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Travel Blogs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Blogs.map((blog) => (
            <Link key={blog.id} to={`/blogs/${blog.id}`}>
              <BlogCard blogData={blog} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Experiences;
