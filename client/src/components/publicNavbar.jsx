import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, AnimatePresence } from "framer-motion";
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
      `flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-[#0b5d3b] to-emerald-600 text-white shadow-lg transform scale-105"
          : "text-[#1c2a3a] hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 hover:shadow-md hover:transform hover:scale-102"
      }`
    }
  >
    <FontAwesomeIcon icon={icon} className="text-lg" />
    <span className="font-medium">{children}</span>
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
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-[#1c2a3a] hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 rounded-xl transition-all duration-300 font-medium hover:shadow-md hover:transform hover:scale-102"
              >
                <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                Login
              </Link>
              <Link
                to="/Register"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0b5d3b] to-emerald-600 text-white hover:from-emerald-700 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
              >
                <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                Connect
              </Link>
            </div>

            {/* Mobile: Hamburger Menu */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "bg-gradient-to-r from-[#0b5d3b] to-emerald-600 text-white shadow-lg transform rotate-90"
                    : "text-[#1c2a3a] hover:bg-emerald-100 hover:shadow-md"
                }`}
              >
                <FontAwesomeIcon
                  icon={isMobileMenuOpen ? faTimes : faBars}
                  className={`text-xl transition-transform duration-300 ${
                    isMobileMenuOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="md:hidden bg-gradient-to-br from-emerald-50/95 to-teal-50/95 backdrop-blur-lg border-b border-emerald-200/30 shadow-2xl"
        >
          <div className="container-custom px-4 py-6">
            <div className="flex flex-col space-y-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <NavLink
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-[#1c2a3a] transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-[#0b5d3b] to-emerald-600 text-white shadow-lg transform scale-105"
                        : "hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 hover:shadow-md hover:transform hover:scale-102"
                    }`
                  }
                >
                  <FontAwesomeIcon icon={faHome} className="text-lg" />
                  <span className="font-medium">Home</span>
                </NavLink>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <NavLink
                  to="/explore"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-[#1c2a3a] transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-[#0b5d3b] to-emerald-600 text-white shadow-lg transform scale-105"
                        : "hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 hover:shadow-md hover:transform hover:scale-102"
                    }`
                  }
                >
                  <FontAwesomeIcon icon={faCompass} className="text-lg" />
                  <span className="font-medium">Gallery</span>
                </NavLink>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <NavLink
                  to="/artists"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#1c2a3a] hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 hover:shadow-md hover:transform hover:scale-102 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faUserPlus} className="text-lg" />
                  <span className="font-medium">Artists</span>
                </NavLink>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <NavLink
                  to="/exhibitions"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#1c2a3a] hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 hover:shadow-md hover:transform hover:scale-102 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faSearch} className="text-lg" />
                  <span className="font-medium">Exhibitions</span>
                </NavLink>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <NavLink
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#1c2a3a] hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 hover:shadow-md hover:transform hover:scale-102 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faSearch} className="text-lg" />
                  <span className="font-medium">About</span>
                </NavLink>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="border-t border-emerald-200 pt-4 mt-4"
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#1c2a3a] hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 hover:shadow-md hover:transform hover:scale-102 transition-all duration-300"
                  >
                    <FontAwesomeIcon icon={faSignInAlt} className="text-lg" />
                    <span className="font-medium">Login</span>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                  <Link
                    to="/Register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#0b5d3b] to-emerald-600 text-white hover:from-emerald-700 hover:to-teal-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <FontAwesomeIcon icon={faUserPlus} className="text-lg" />
                    <span className="font-medium">Connect</span>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default PublicNavbar;
