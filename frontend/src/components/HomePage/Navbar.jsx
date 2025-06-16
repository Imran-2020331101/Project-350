import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react"; // For responsive menu icons
import { useSelector } from "react-redux";
import img from '../../assets/logo.png'
import defaultUser from '../../assets/defaultUser.png'

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
  const location = useLocation();

  const { isSignedIn, user } = useSelector((state) => state.auth);
  const profilePhotoLink = user?.profilePhoto || defaultUser;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { 
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);  const NavButtons = [{title:'Blogs',to:'/blogs'},{title:'New Trip',to:'/newtrip'},{title:'Translator',to:'/translate'}]
  isSignedIn && NavButtons.push({title:'Dashboard',to:'/dashboard'})
  
  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname.startsWith('/dashboard');
    }
    return location.pathname === path;
  };

  return (
    <nav className="z-50 fixed top-0 left-0 right-0 h-16 backdrop-blur-md flex items-center justify-between px-5 md:px-10">
      {/* Brand Logo */}
      <div className="w-1/4">
        <Link to="/">
          <img src={img} alt="App logo" className="h-40"/>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-6">
      {
        NavButtons.map((button) => (
          <Link
            key={button.to}
            className={`text-lg font-semibold transition-colors duration-200 ${
              isActive(button.to) 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-200 hover:text-blue-600'
            }`}
            to={button.to}
          >
            {button.title}
          </Link>
        ))
      }
      </div>

      {/* Login & Signup or Profile (Desktop) */}
      <div className="hidden md:flex space-x-5">
        {!isSignedIn ? (
          <>
            <Link 
              className={`text-lg font-semibold transition-colors duration-200 ${
                isActive('/login') 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-200 hover:text-blue-600'
              }`} 
              to="/login"
            >
              Log in
            </Link>
            <Link 
              className={`text-lg font-semibold transition-colors duration-200 ${
                isActive('/register') 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-200 hover:text-blue-600'
              }`} 
              to="/register"
            >
              Sign up
            </Link>
          </>
        ) : (
          <Link to="/dashboard">
            <img 
              src={profilePhotoLink} 
              className={`h-10 w-10 rounded-full cursor-pointer transition-all duration-200 ${
                isActive('/dashboard') 
                  ? 'ring-2 ring-blue-600' 
                  : 'hover:ring-2 hover:ring-blue-500'
              }`}
              alt="Profile"
            />
          </Link>
        )}
      </div>
      
      {/* Mobile Menu Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div onClick={() => setIsOpen(!isOpen)} className="absolute top-16 left-0 w-full bg-gray-800 shadow-md flex flex-col items-center py-5 space-y-4">
          {NavButtons.map((button) => (
            <Link 
              key={button.to}
              className={`text-lg font-semibold transition-colors duration-200 ${
                isActive(button.to) 
                  ? 'text-blue-400' 
                  : 'text-white hover:text-gray-300'
              }`}
              to={button.to}
            >
              {button.title}
            </Link>
          ))}
          {!isSignedIn ? (
            <>
              <Link 
                className={`text-lg font-semibold transition-colors duration-200 ${
                  isActive('/login') 
                    ? 'text-blue-400' 
                    : 'text-white hover:text-gray-300'
                }`}
                to="/login"
              >
                Log in
              </Link>
              <Link 
                className={`text-lg font-semibold transition-colors duration-200 ${
                  isActive('/register') 
                    ? 'text-blue-400' 
                    : 'text-white hover:text-gray-300'
                }`}
                to="/register"
              >
                Sign up
              </Link>
            </>
          ) : (
            <Link 
              className={`text-lg font-semibold transition-colors duration-200 ${
                isActive('/dashboard') 
                  ? 'text-blue-400' 
                  : 'text-white hover:text-gray-300'
              }`}
              to="/dashboard"
            >
              <div className="flex items-center space-x-2">
                <img 
                  src={profilePhotoLink} 
                  className={`h-8 w-8 rounded-full ${
                    isActive('/dashboard') ? 'ring-2 ring-blue-400' : ''
                  }`}
                  alt="Profile"
                />
                <span>Dashboard</span>
              </div>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
