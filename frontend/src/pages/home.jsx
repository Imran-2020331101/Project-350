import Footer from '../components/HomePage/Footer'
import Welcome from '../components/HomePage/HeroSection'
import Slider from '../components/HomePage/Slider'
import BlogCard from '../components/blogCard'
import { Packages } from '../DemoInfo/Packages'
import { Blogs } from '../DemoInfo/BlogsData'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'


const Home = () => {

  const getRandomBlogs = (Blogs, count = 5) => {
    const shuffled = [...Blogs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  return (
    <div className='w-screen h-auto flex flex-col items-center justify-start'>
      <Welcome/>
      <Slider Packages={Packages} />
      <h2 className='text-3xl font-bold justify-center align-middle py-20'>Tales from the Road</h2>
      {
          <div className='grid mb-10 grid-cols-2 gap-8'>
            {
            getRandomBlogs(Blogs,4).map((blog)=>
            <Link key={blog.id} to={`/blogs/${blog.id}`}>
              <BlogCard blogData={blog}/>
            </Link>
            )}
          </div>
      }
      <Link to={'Blogs'}>See all Stories</Link>
      <Footer/>
    </div>
  )
}

export default Home
