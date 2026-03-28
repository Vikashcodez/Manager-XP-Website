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

const AuthButtons = ({ isProfileOpen, setIsProfileOpen, avatarLabel, user, isAuthenticated, logout }) => {
  if (!isAuthenticated) {
    return (
      <>
        <Link to="/login" className="px-4 py-2 text-sm font-semibold text-black bg-red-500 rounded-lg border border-red-500 hover:bg-red-600 hover:text-black active:scale-[0.98] transition-all duration-200">
          Login
        </Link>
        <Link to="/signup" className="px-4 py-2 text-sm font-semibold text-black bg-white rounded-lg border border-white/90 hover:bg-red-500 hover:text-black active:scale-[0.98] transition-all duration-200">
          Sign up
        </Link>
      </>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsProfileOpen((prev) => !prev)}
        className="h-9 w-9 rounded-full bg-white text-black text-sm font-semibold flex items-center justify-center border border-white/90 hover:bg-neutral-100 transition"
      >
        {avatarLabel}
      </button>
      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-neutral-800 bg-neutral-950 shadow-2xl p-1.5">
          {user?.role === 'admin' && (
            <Link to="/admin" className="block px-3 py-2 text-sm text-neutral-200 hover:text-white hover:bg-neutral-800 rounded-lg">
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
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const avatarLabel = (user?.name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <>
      {/* Desktop Top Bar with Centered Logo */}
      <div className="hidden lg:flex fixed top-0 left-0 right-0 h-20 bg-black border-b border-neutral-800 z-50 items-center justify-center">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity duration-300">
          <img src={logo} alt="ManagerXP Logo" className="h-10 w-auto" />
        </Link>
      </div>

      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 bg-black border-r border-neutral-800 flex-col z-50">
        {/* Navigation Box */}
        <div className="flex-1 flex items-start justify-center px-4 pt-4">
          <div className="w-full bg-neutral-900/50 rounded-xl border border-neutral-800 p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 text-center ${
                  isActive(item.to)
                    ? 'bg-red-500 text-black'
                    : 'text-white hover:bg-red-500 hover:text-black'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Desktop Auth Buttons - Top Right */}
      <div className="hidden lg:flex fixed top-4 right-4 z-50 items-center gap-2">
        <AuthButtons
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
          avatarLabel={avatarLabel}
          user={user}
          isAuthenticated={isAuthenticated}
          logout={logout}
        />
      </div>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black border-b border-neutral-800 z-50 flex items-center justify-between px-4">
        {/* Hamburger - Left Side */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-white hover:bg-red-500 hover:text-black rounded-lg transition-all duration-300"
        >
          {!isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>

        {/* Logo - Center */}
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity duration-300">
          <img src={logo} alt="ManagerXP Logo" className="h-8 w-auto" />
        </Link>

        {/* Auth Buttons - Right Side */}
        <div className="flex items-center gap-2">
          <AuthButtons
            isProfileOpen={isProfileOpen}
            setIsProfileOpen={setIsProfileOpen}
            avatarLabel={avatarLabel}
            user={user}
            isAuthenticated={isAuthenticated}
            logout={logout}
          />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}>
          {/* Semi-transparent backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          
          {/* Menu Panel */}
          <div 
            className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-black/80 backdrop-blur-md border-r border-neutral-800 flex flex-col z-50 transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Navigation Box */}
            <div className="flex-1 flex items-start justify-center px-4 pt-6">
              <div className="w-full bg-neutral-900/60 backdrop-blur-sm rounded-xl border border-neutral-800/50 p-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 text-center ${
                      isActive(item.to)
                        ? 'bg-red-500 text-black'
                        : 'text-white hover:bg-red-500 hover:text-black'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
