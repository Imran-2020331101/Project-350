import BlogCard from '../components/blogCard'; 
import Loader from '../components/Shared/Loader';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AllBlogs = () => {
  const { blogs, status: blogStatus, error: blogError } = useSelector((state) => state.blogs);

  const isLoading = blogStatus === 'loading';

  return (
    <div className="min-h-screen bg-[#111827] py-8 px-4 md:px-12">
      <h1 className="text-3xl font-bold text-center mb-10 py-5 text-gray-200">All Travel Blogs</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader />
        </div>
      ) : blogError ? (
        <p className="text-center text-red-400">Error loading blogs: {blogError}</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
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
