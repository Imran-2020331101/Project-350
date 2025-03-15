import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className=' z-50 fixed top-0 left-0 right-0 h-16  backdrop-blur-md flex flex-row justify-between items-center px-[20px]'>
      {/* <section className='flex  w-screen h-full flex-row justify-center items-center'> */}
        <h1 className=' text-3xl font-bold'>OnTheGo</h1>
        <div className=' ml-4 flex flex-row justify-between items-center w-[200px] '>
          <Link className='text-lg font-semibold ' to='/'>Home</Link>
          <Link className='text-lg font-semibold' to='/'>Blogs</Link>
          <Link className='text-lg font-semibold' to='/'>Hotels</Link>
        </div>
        <input type="text" className="w-[400px] h-8 border-2 border-gray-600  rounded-md ml-10" />
        <div className='ml-6 flex flex-row w-[130px] justify-between'>
          <Link className='text-lg font-semibold' to='login'>Log in</Link>
          <Link className='text-lg font-semibold' to='/register'>Sign up</Link>
        </div>
      {/* </section> */}
    </div>
  )
}

export default Navbar
