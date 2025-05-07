import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // For responsive menu icons
import { useSelector } from "react-redux";
import img from '../assets/logo.png'

/**
 * Navbar Component
 * ----------------
 * A responsive navigation bar that displays:
 *   - Brand logo on the left
 *   - Navigation links (Home, Blogs, Hotels)
 *   - Auth section (Login/Register or Profile Picture)
 *   - Mobile menu toggle with dropdown and search input
 *
 * Features:
 *   - Responsive: adapts to mobile/desktop views
 *   - Redux state integration for authentication
 *   - React Router for navigation
 *   - Accessible mobile toggle button with aria attributes
 */

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Extract auth state from Redux
  const { isSignedIn, user } = useSelector((state) => state.auth);
  const profilePhotoLink = user?.profilePhoto || "/defaultUser.jpg";

  
  return (
    <nav className="z-50 fixed top-0 left-0 right-0 h-16 backdrop-blur-md flex items-center justify-between px-5 md:px-10">
      {/* Brand Logo */}
      <div className="w-1/4">
        <Link to="/">
          <img src={img} alt="App logo" className="h-40"/>
        </Link>
        <Link to="/">
          <img src={img} alt="App logo" className="h-40"/>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-6">
        <Link className="text-lg font-semibold" to="/">Home</Link>
        <Link className="text-lg font-semibold" to="/blog">Blogs</Link>
        <Link className="text-lg font-semibold" to="/newtrip">Create trip</Link>
      </div>

      {/* Login & Signup (Desktop) */}
      <div className="hidden md:flex space-x-5">
      {isSignedIn==false ? (
        <>
          <Link className="text-lg font-semibold" to="/login">Log in</Link>
          <Link className="text-lg font-semibold" to="/register">Sign up</Link>
        </>
      ):(<img src={profilePhotoLink} className="h-10 w-10 rounded-full"/>)}
      </div>
      

      {/* Mobile Menu Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Navigation Menu */}
      {isOpen && (
      <div onClick={() => setIsOpen(!isOpen)} className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center py-5 space-y-4">
        <Link className="text-lg font-semibold text-gray-800" to="/">Home</Link>
        <Link className="text-lg font-semibold text-gray-800" to="/blog">Blogs</Link>
        <Link className="text-lg font-semibold text-gray-800" to="/newTrip">Create trip</Link>
        {isSignedIn==false ? (
            <>
              <Link className="text-lg font-semibold text-gray-900" to="/login">Log in</Link>
              <Link className="text-lg font-semibold text-gray-900" to="/register">Sign up</Link>
            </>
          ):<Link className="text-lg font-semibold text-gray-900" to="/profile">Profile</Link>}
      </div>
)}

    </nav>
  );
};

export default Navbar;
