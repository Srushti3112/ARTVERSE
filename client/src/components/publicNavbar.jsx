import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCompass,
  faSignInAlt,
  faUserPlus,
  faSearch,
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

            {/* Mobile: Simple Navbar Links */}
            <div className="md:hidden flex items-center gap-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-full text-sm ${
                    isActive
                      ? "bg-rose-100 text-[#8b1e5a]"
                      : "text-[#8b1e5a] hover:bg-rose-50"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/explore"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-full text-sm text-[#8b1e5a] ${
                    isActive
                      ? "bg-rose-100 text-[#8b1e5a]"
                      : "text-[#8b1e5a] hover:bg-rose-50"
                  }`
                }
              >
                Explore
              </NavLink>
              <Link
                to="/login"
                className="px-3 py-2 rounded-full text-sm text-[#8b1e5a] hover:bg-rose-50"
              >
                <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                Login
              </Link>
              <Link
                to="/Register"
                className="px-3 py-2 rounded-full text-sm bg-[#0b5d3b] text-white hover:brightness-110"
              >
                <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                Connect
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
