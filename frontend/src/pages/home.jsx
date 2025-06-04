import Footer from '../components/HomePage/Footer';
import Welcome from '../components/HomePage/HeroSection';
import Slider from '../components/HomePage/Slider';
import BlogCard from '../components/blogCard';
import Contacts from '../components/HomePage/Contacts';
import { Blogs } from '../DemoInfo/BlogsData';
import { Link } from 'react-router-dom';
import Loader from '../components/Shared/Loader';
import { Groups } from '../DemoInfo/Groups';

const Home = () => {
  const getRandomBlogs = (Blogs, count = 5) => {
    const shuffled = [...Blogs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  return (
    <div className="w-full h-auto flex flex-col items-center justify-start px-4 sm:px-6 lg:px-10">
      <Welcome />
      
      <h2 className="text-3xl font-bold my-12">Embark on a trail adventure</h2>
      <Slider Packages={Groups} />

      <h2 className="text-3xl font-bold text-center py-16">Tales from the Road</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10 w-full max-w-7xl">
        {getRandomBlogs(Blogs, 4).map((blog) => (
          <Link key={blog.id} to={`/blogs/${blog.id}`}>
            <BlogCard blogData={blog} />
          </Link>
        ))}
      </div>

      <Link
        to="/Blogs"
        className="text-blue-500 hover:underline mb-16"
      >
        See all Stories
      </Link>

      <Contacts />
    </div>
  );
};

export default Home;
