import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/whitelogo.png';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const Navbar = () => {
  // State to handle mobile menu toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // State to handle scroll position
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 24) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;
  const avatarLabel = (user?.name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <nav className={`fixed z-50 top-0 left-0 right-0 antialiased font-sans border-b transition-all duration-300 ${
      isScrolled
        ? 'bg-black border-neutral-800 shadow-[0_8px_24px_rgba(0,0,0,0.38)]'
        : 'bg-black border-white/5'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Side: Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity duration-300">
              <img src={logo} alt="ManagerXP Logo" className="h-7 w-auto" />
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`relative text-[13px] font-medium tracking-[0.01em] transition-colors duration-200 ${
                  isActive(item.to)
                    ? 'text-white'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                {item.label}
                {isActive(item.to) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-red-500" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side: CTA Button */}
          <div className="hidden md:flex md:items-center md:gap-2.5">
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-4 py-2 text-[13px] font-medium text-neutral-300 hover:text-red-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-4 py-2 text-[13px] font-semibold text-black bg-white rounded-full border border-white/90 hover:bg-neutral-100 active:scale-[0.98] transition-all duration-200"
                >
                  Sign up
                </Link>
              </>
            )}

            {isAuthenticated && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="h-9 w-9 rounded-full bg-white text-black text-sm font-semibold flex items-center justify-center border border-white/90 hover:bg-neutral-100 transition"
                  aria-expanded={isProfileOpen}
                >
                  {avatarLabel}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-neutral-800 bg-neutral-950 shadow-2xl p-1.5">
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-3 py-2 text-sm text-neutral-200 hover:text-white hover:bg-neutral-800 rounded-lg"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={logout}
                      className="w-full text-left px-3 py-2 text-sm text-neutral-200 hover:text-white hover:bg-neutral-800 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-300 hover:text-red-400 hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500/60 transition duration-200"
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
        <div className="px-4 pt-2 pb-4 space-y-1 bg-black border-t border-white/10">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(item.to)
                  ? 'text-white bg-red-500/15 border border-red-500/30'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="pt-2 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                className="block w-full text-center px-4 py-2.5 text-sm font-medium text-white rounded-full border border-neutral-700 hover:bg-neutral-900 transition-all duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block w-full text-center px-4 py-2.5 text-sm font-semibold text-black bg-white rounded-full border border-white/90 hover:bg-neutral-100 transition-all duration-200"
              >
                Sign up
              </Link>
            </div>
          )}

          {isAuthenticated && (
            <div className="pt-2 space-y-2">
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="block w-full text-center px-4 py-2.5 text-sm font-medium text-white rounded-full border border-neutral-700 hover:bg-neutral-900 transition-all duration-200"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                type="button"
                onClick={logout}
                className="block w-full text-center px-4 py-2.5 text-sm font-semibold text-black bg-white rounded-full border border-white/90 hover:bg-neutral-100 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;