import React from 'react'
import { Link } from 'react-router-dom'
import ImageCard from './imageCard'
import BlogCard from './blogCard'

const Experiences = () => {
  return (
    <div className='fixed  w-full h-full flex flex-col justify-start items-center'>
      <p className='text-3xl font-semibold mb-5 mr-[40%]'>Save your memories</p>
      <div className='mr-[40%] w-auto flex gap-4'>
      <button className=' w-[130px]  h-8 font-semibold text-lg bg-indigo-500 opacity-75 hover:opacity-100 rounded-lg'>Create Blog</button>
      <Link to='/uploadimage' className='   w-[130px]  h-8 font-semibold text-lg bg-indigo-500 opacity-75 hover:opacity-100 rounded-lg flex justify-center items-center'>Upload photos</Link>
      </div>

      <section className=' flex flex-wrap gap-5 mr-[40%] ml-[80px] overflow-y-scroll mt-5 h-[220px]'>
        <ImageCard/>
        <ImageCard/>
        <ImageCard/>
        <ImageCard/>
        <ImageCard/>
        <ImageCard/>
        <ImageCard/>
        <ImageCard/>
        <ImageCard/>
      </section>
      <section className=' w-full flex flex-col justify-center items-center gap-5 mr-[40%] ml-[80px]  mt-5 h-[220px]'>
        <p className='text-xl font-semibold mt-[-15px] mr-[43%]'>Your travel blog</p>
        <BlogCard/>
      
      </section>
    </div>
  )
}

export default Experiences
