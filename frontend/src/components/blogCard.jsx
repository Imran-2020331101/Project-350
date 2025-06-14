import React from 'react';

const BlogCard = ({ blogData }) => {
  const {
    id,
    title,
    owner,
    author,
    destination,
    tags,
    story,
    images,
    publishDate,
  } = blogData;

  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-md overflow-hidden">
      {images && images.length > 0 && (
        <div className="w-full h-32">
          <img
            className="w-full h-full object-cover"
            src={images[0].url}
            alt='trip Image'
          />
        </div>
      )}
      <div className="p-4">
        <h5 className="text-lg font-semibold mb-1">{title}</h5>
        <h5 className="text-lg font-semibold mb-1">{destination}</h5>
        <p className="text-gray-300 text-xs mb-1">By {author}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {tags &&
            tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-blue-700 rounded-full px-2 py-0.5 text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
        </div>
        <p className="text-gray-400 text-sm mb-3">{story.substring(0, 100)}...</p>
        <div className="flex items-center justify-between text-gray-500 text-[10px]">
          <span>ID: {id}</span>
          <span>{new Date(publishDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
