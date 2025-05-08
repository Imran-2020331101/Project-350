import React from 'react';
import { Blogs } from '../DemoInfo/BlogsData';
import { useParams } from 'react-router-dom';

const Blog = () => {
  const { id } = useParams();
  const blog = Blogs.find((b) => b.id === id);

  if (!blog) {
    return <div className="text-center text-red-500 pt-20">Blog not found</div>;
  }

  return (
    <div className="w-screen min-h-screen pt-14 flex flex-col items-center gap-4 pb-6 px-4">
      <h1 className="text-3xl font-semibold text-center">{blog.title}</h1>
      <p className="text-gray-400 text-center">By {blog.author} | {new Date(blog.publishDate).toLocaleDateString()}</p>
      <p className="text-blue-400 text-sm text-center">Destination: {blog.destination}</p>

      {/* Tags */}
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {blog.tags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-blue-800 text-white px-3 py-1 rounded-full text-sm"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Story */}
      <div className="w-full md:w-[60%] bg-gray-900 text-white p-6 rounded-lg mt-4 shadow-lg">
        <p className="text-lg leading-relaxed">{blog.story}</p>
      </div>

      {/* Images */}
      {blog.images.map((img, index) => (
        <div
          key={index}
          className="w-full md:w-[60%] h-[400px] mt-4 rounded-lg overflow-hidden shadow-md"
        >
          <img
            src={img.url}
            alt={`blog-img-${index}`}
            className="w-full h-full object-cover"
          />
          {img.description && (
            <p className="text-center text-gray-400 mt-2 text-sm italic">{img.description} hello</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Blog;
