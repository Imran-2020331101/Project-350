import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // For responsive menu icons
import { useSelector } from "react-redux";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);


  const isSignedIn = useSelector((state)=> state.auth.isSignedIn)

  const profilePhotoLink = useSelector(
    (state) => state.auth.user?.profilePhoto || "/defaultUser.jpg"
  );
  
  return (
    <nav className="z-50 fixed top-0 left-0 right-0 h-16 backdrop-blur-md flex items-center justify-between px-5 md:px-10">
      {/* Brand Name */}
      <h1 className="text-2xl md:text-3xl font-bold">OnTheGo</h1>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-6">
        <Link className="text-lg font-semibold" to="/">Home</Link>
        <Link className="text-lg font-semibold" to="/blogs">Blogs</Link>
        <Link className="text-lg font-semibold" to="/hotels">Hotels</Link>
      </div>

      {/* Search Bar */}
      <input 
        type="text"
        className="hidden md:block w-64 md:w-80 h-8 border-2 border-gray-600 text-gray-900 rounded-md px-2"
        placeholder="Search..."
      />

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
  <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center py-5 space-y-4">
    <Link className="text-lg font-semibold text-gray-800" to="/">Home</Link>
    <Link className="text-lg font-semibold text-gray-800" to="/blogs">Blogs</Link>
    <Link className="text-lg font-semibold text-gray-800" to="/hotels">Hotels</Link>
    <input 
      type="text"
      className="w-4/5 h-8 border-2 border-gray-600 text-gray-900 rounded-md px-2"
      placeholder="Search..."
    />
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
