import BlogCard from '../components/blogCard'; 
import Loader from '../components/Shared/Loader';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useMemo } from 'react';

const AllBlogs = () => {
  const { blogs, status: blogStatus, error: blogError } = useSelector((state) => state.blogs);
  const [selectedTags, setSelectedTags] = useState([]);

  const isLoading = blogStatus === 'loading';

  // Get unique tags from all blogs
  const allTags = useMemo(() => {
    const tags = new Set();
    blogs.forEach(blog => {
      blog.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [blogs]);

  // Filter blogs based on selected tags
  const filteredBlogs = useMemo(() => {
    if (selectedTags.length === 0) return blogs;
    return blogs.filter(blog => 
      selectedTags.every(tag => blog.tags?.includes(tag))
    );
  }, [blogs, selectedTags]);

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-[#111827] py-8 px-4 md:px-12">
      <h1 className="text-3xl font-bold text-center mb-10 py-5 text-gray-200">All Travel Blogs</h1>

      {/* Tag Filter Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">Filter by Tags</h2>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedTags.includes(tag)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader />
        </div>
      ) : blogError ? (
        <p className="text-center text-red-400">Error loading blogs: {blogError}</p>
      ) : filteredBlogs.length === 0 ? (
        <p className="text-center text-gray-500">
          {selectedTags.length > 0 
            ? "No blogs found with the selected tags."
            : "No blogs found."}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <Link to={`/blogs/${blog._id}`} key={blog._id}>
              <BlogCard blogData={blog} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBlogs;
