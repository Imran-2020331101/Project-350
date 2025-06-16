import Welcome from '../components/HomePage/HeroSection';
import Slider from '../components/HomePage/Slider';
import BlogCard from '../components/blogCard';
import Contacts from '../components/HomePage/Contacts';
import { Link } from 'react-router-dom';
import Loader from '../components/Shared/Loader';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs } from '../redux/blogSlice';
import { fetchGroups } from '../redux/groupSlice';

const Home = () => {
  const dispatch = useDispatch();
  
  const { groups, status: groupStatus } = useSelector((state) => state.groups);
  const { blogs, status: blogStatus, error: blogError } = useSelector((state) => state.blogs);
  
  useEffect(() => {
    if(groupStatus === 'idle'){
      dispatch(fetchGroups());
    }
  }, [dispatch, groupStatus]);
  
  useEffect(() => {
    if (blogStatus === 'idle') {
      dispatch(fetchBlogs());
    }
  }, [dispatch, blogStatus]);

  if (groupStatus === "loading") return <Loader />;
  
  if (blogStatus === 'loading'){
    return (
      <div className="text-white text-center">
        <Loader/>
      </div>
    )
  } 
  if (blogStatus === 'failed') return <div className="text-red-500">{blogError}</div>;


  const getRandomBlogs = (blogs, count = 5) => {
    const shuffled = [...blogs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  return (
    <div className="w-full h-auto flex flex-col items-center justify-start px-4 sm:px-6 lg:px-10">
      <Welcome />
      
      <h2 className="text-3xl font-bold my-12 pt-12">Embark on a trail adventure</h2>
      {groups.length > 0 ? <Slider Packages={groups} />: <h1>No groups found</h1>}

      <h2 className="text-3xl font-bold text-center py-16">Tales from the Road</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10 w-full max-w-7xl">
        {getRandomBlogs(blogs, 4).map((blog) => (
          <Link key={blog._id} to={`/blogs/${blog._id}`}>
            <BlogCard blogData={blog} />
          </Link>
        ))}
      </div>      <Link
        to="/blogs"
        className="text-blue-500 hover:underline mb-16"
      >
        See all Stories
      </Link>

      <Contacts />
    </div>
  );
};

export default Home;
