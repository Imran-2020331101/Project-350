import React, { useEffect, useState } from 'react';
import BlogCard from '../components/blogCard'; // Adjust path as needed

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock fetch for demonstration – replace with real API call
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Simulated API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Replace with your API call (e.g., axios.get)
        const mockData = [
          {
            id: 1,
            owner: 'user1',
            author: 'Imran Hasan',
            destination: 'Cox\'s Bazar',
            tags: ['beach', 'sunset', 'bangladesh'],
            story: 'We had a great time on the longest sea beach in the world...',
            images: [{ url: 'https://via.placeholder.com/300x200' }],
            publishDate: new Date().toISOString(),
          },
          {
            id: 2,
            owner: 'user2',
            author: 'Tanvir Rahman',
            destination: 'Sajek Valley',
            tags: ['hills', 'adventure', 'nature'],
            story: 'Sajek was filled with mist and magic. I highly recommend visiting...',
            images: [{ url: 'https://via.placeholder.com/300x200' }],
            publishDate: new Date().toISOString(),
          },
        ];

        setBlogs(mockData); // replace with actual fetched data
        setLoading(false);
      } catch (error) {
        console.error('Failed to load blogs:', error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-12">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">All Travel Blogs</h1>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="text-gray-500 animate-pulse">Loading blogs...</div>
        </div>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blogData={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBlogs;
