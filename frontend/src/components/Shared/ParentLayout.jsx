import { Outlet } from 'react-router-dom';
import Navbar from '../HomePage/Navbar';
import Footer from '../HomePage/Footer'

const ParentLayout = () => {
  return (
    <div className='bg-gray-900 text-white w-screen min-h-screen flex justify-center items-center pt-14'>
      <Navbar />
      <Outlet />
      {/* <Footer/> */}
    </div>
  )
}

export default ParentLayout;
