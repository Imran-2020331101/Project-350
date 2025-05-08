import Footer from '../components/Footer'
import Welcome from '../components/HeroSection'
import Slider from '../components/Slider'
import BlogCard from '../components/blogCard'
import { Packages } from '../DemoInfo/Packages'
import { Blogs } from '../DemoInfo/BlogsData'
import { Link } from 'react-router-dom'


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
            <Link key={blog.id} to={`/blog/${blog.id}`}>
              <BlogCard blogData={blog}/>
            </Link>
            )}
          </div>
      }
      <Link to={'allBlogs'}>See all Stories</Link>
      <Footer/>
    </div>
  )
}

export default Home
