import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCompass,
  faSignInAlt,
  faUserPlus,
  faSearch,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const NavigationLink = ({ to, children, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
        isActive
          ? "bg-rose-100 text-[#8b1e5a]"
          : "text-[#8b1e5a] hover:bg-rose-50"
      }`
    }
  >
    <FontAwesomeIcon icon={icon} className="text-lg" />
    <span>{children}</span>
  </NavLink>
);

const PublicNavbar = () => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    window.location.href = `/explore?search=${encodeURIComponent(q)}`;
    setIsMobileSearchOpen(false);
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-white/30 backdrop-blur-lg supports-[backdrop-filter]:backdrop-blur-lg border-b border-white/20">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Logo */}
            <div className="flex-shrink-0 ml-2">
              <Link to="/home" className="flex items-center">
                <span className="font-extrabold tracking-wide text-2xl sm:text-3xl text-[#0b5d3b]">
                  ARTVERSE
                </span>
              </Link>
            </div>

            {/* Center: Nav links */}
            <div className="hidden  md:flex flex-1 justify-center">
              <div className="flex tracking-wide  items-center gap-2">
                <NavigationLink to="/">Home</NavigationLink>
                <NavigationLink to="/explore">Gallery</NavigationLink>
                <NavigationLink to="/artists">Artists</NavigationLink>
                <NavigationLink to="/exhibitions">Exhibitions</NavigationLink>
                <NavigationLink to="/about">About</NavigationLink>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-[#8b1e5a] hover:bg-rose-50 rounded-full transition-colors"
              >
                <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                Login
              </Link>
              <Link
                to="/Register"
                className="px-5 py-2 rounded-full bg-[#0b5d3b] text-white hover:brightness-110 transition-colors shadow"
              >
                <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                Connect
              </Link>
            </div>

            {/* Mobile: Hamburger Menu */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-[#8b1e5a] hover:bg-rose-50 transition-colors"
              >
                <FontAwesomeIcon 
                  icon={isMobileMenuOpen ? faTimes : faBars} 
                  className="text-xl" 
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-white/20 shadow-lg">
          <div className="container-custom px-4 py-4">
            <div className="flex flex-col space-y-2">
              <NavLink
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-[#8b1e5a] transition-colors ${
                    isActive
                      ? "bg-rose-100 text-[#8b1e5a]"
                      : "hover:bg-rose-50"
                  }`
                }
              >
                <FontAwesomeIcon icon={faHome} className="text-lg" />
                <span>Home</span>
              </NavLink>
              
              <NavLink
                to="/explore"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-[#8b1e5a] transition-colors ${
                    isActive
                      ? "bg-rose-100 text-[#8b1e5a]"
                      : "hover:bg-rose-50"
                  }`
                }
              >
                <FontAwesomeIcon icon={faCompass} className="text-lg" />
                <span>Gallery</span>
              </NavLink>
              
              <NavLink
                to="/artists"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#8b1e5a] hover:bg-rose-50 transition-colors"
              >
                <FontAwesomeIcon icon={faUserPlus} className="text-lg" />
                <span>Artists</span>
              </NavLink>
              
              <NavLink
                to="/exhibitions"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#8b1e5a] hover:bg-rose-50 transition-colors"
              >
                <FontAwesomeIcon icon={faSearch} className="text-lg" />
                <span>Exhibitions</span>
              </NavLink>
              
              <NavLink
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#8b1e5a] hover:bg-rose-50 transition-colors"
              >
                <FontAwesomeIcon icon={faSearch} className="text-lg" />
                <span>About</span>
              </NavLink>
              
              <div className="border-t border-gray-200 pt-2 mt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#8b1e5a] hover:bg-rose-50 transition-colors"
                >
                  <FontAwesomeIcon icon={faSignInAlt} className="text-lg" />
                  <span>Login</span>
                </Link>
                
                <Link
                  to="/Register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#0b5d3b] text-white hover:brightness-110 transition-colors"
                >
                  <FontAwesomeIcon icon={faUserPlus} className="text-lg" />
                  <span>Connect</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;
