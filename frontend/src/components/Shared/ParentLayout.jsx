import { Outlet } from 'react-router-dom';
import Navbar from '../HomePage/Navbar';
import Footer from '../HomePage/Footer';

const ParentLayout = () => {
  return (
    <div className="bg-gray-900 text-white w-full min-h-screen flex flex-col items-center pt-14 sm:pt-16 md:pt-20">
      <Navbar />
      <div className="w-full px-4 sm:px-6 md:px-8 ">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default ParentLayout;