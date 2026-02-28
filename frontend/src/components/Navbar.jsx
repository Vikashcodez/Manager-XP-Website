import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
  // State to handle mobile menu toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // State to handle scroll position
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 top-0 left-0 antialiased font-sans transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#030303]/95 backdrop-blur-lg border-b border-white/20 shadow-lg shadow-black/50' 
        : 'bg-transparent backdrop-blur-none border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left Side: Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity duration-300">
              <img src={logo} alt="ManagerXP Logo" className="h-12 w-auto" />
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <Link to="/" className="text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2 rounded-lg text-sm font-medium tracking-tight transition-all duration-300 relative group">
              Home
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
            </Link>
            <Link to="/products" className="text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2 rounded-lg text-sm font-medium tracking-tight transition-all duration-300 relative group">
              Our Products
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
            </Link>
            <Link to="/about" className="text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2 rounded-lg text-sm font-medium tracking-tight transition-all duration-300 relative group">
              About Us
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
            </Link>
            <Link to="/contact" className="text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2 rounded-lg text-sm font-medium tracking-tight transition-all duration-300 relative group">
              Contact Us
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
            </Link>
          </div>

          {/* Right Side: CTA Button */}
          <div className="hidden md:flex">
            <a href="#" className="group inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-black bg-white rounded-full shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)] hover:bg-gray-100 active:scale-95 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
              Book Demo
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-400 transition duration-300"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger Icon */}
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`} id="mobile-menu">
        <div className="px-4 pt-4 pb-6 space-y-2 bg-[#030303] shadow-2xl border-t border-white/10">
          <Link to="/" className="block px-4 py-3 rounded-xl text-base font-medium tracking-tight text-gray-400 hover:text-white hover:bg-white/5 hover:shadow-md transition-all duration-200" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link to="/products" className="block px-4 py-3 rounded-xl text-base font-medium tracking-tight text-gray-400 hover:text-white hover:bg-white/5 hover:shadow-md transition-all duration-200" onClick={() => setIsMenuOpen(false)}>
            Our Products
          </Link>
          <Link to="/about" className="block px-4 py-3 rounded-xl text-base font-medium tracking-tight text-gray-400 hover:text-white hover:bg-white/5 hover:shadow-md transition-all duration-200" onClick={() => setIsMenuOpen(false)}>
            About Us
          </Link>
          <Link to="/contact" className="block px-4 py-3 rounded-xl text-base font-medium tracking-tight text-gray-400 hover:text-white hover:bg-white/5 hover:shadow-md transition-all duration-200" onClick={() => setIsMenuOpen(false)}>
            Contact Us
          </Link>
          <div className="pt-3">
            <a href="#" className="block w-full text-center px-6 py-3 text-base font-bold text-black bg-white rounded-full shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)] hover:bg-gray-100 transition-all duration-300">
              Book Demo
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;