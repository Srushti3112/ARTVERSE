import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { logoutAction } from "../redux/slices/authSlice";
import {
  removeFromWishlist,
  setWishlistItems,
} from "../redux/slices/wishlistSlice";
import {
  faHome,
  faCompass,
  faSignOutAlt,
  faCloudUploadAlt,
  faHeart,
  faTimes,
  faTrash,
  faBars,
  faUserPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import UploadArtworkModal from "./UploadArtworkModal";

const NavigationLink = ({ to, children, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
        isActive
          ? "text-gray-900 bg-gray-100"
          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
      }`
    }
  >
    <FontAwesomeIcon icon={icon} className="text-lg" />
    <span>{children}</span>
  </NavLink>
);

const PrivateNavbar = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const isProfilePage = location.pathname === "/profile";
  const [profileData, setProfileData] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(logoutAction());
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `https://artverse-4.onrender.com/api/users/profile/current`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          setProfileData(response.data);
        } catch (error) {
          console.error("Failed to fetch profile data:", error);
        }
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        if (!user || !user.token) return;

        const response = await axios.get(
          "https://artverse-4.onrender.com/api/artwork/wishlist",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        dispatch(setWishlistItems(response.data));
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, [dispatch, user]);

  const handleUpload = async (formData) => {
    try {
      const response = await axios.post(
        "https://artverse-4.onrender.com/api/artwork/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Optionally refresh profile data or handle success
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleRemoveFromWishlist = async (item) => {
    try {
      await axios.post(
        "https://artverse-4.onrender.com/api/artwork/wishlist/remove",
        { artworkId: item._id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      dispatch(removeFromWishlist(item));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const UserAvatar = () => (
    <div
      className="relative"
      onMouseEnter={() => setShowProfileInfo(true)}
      onMouseLeave={() => setShowProfileInfo(false)}
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-rose-500 flex items-center justify-center text-lg text-white cursor-pointer">
        {user?.username
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()}
      </div>

      <AnimatePresence>
        {showProfileInfo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 top-14 w-96 bg-gradient-to-br from-[#1a1f35]/95 to-[#2a1f35]/95 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl z-50"
          >
            <div className="space-y-5">
              {/* Header with Avatar and Name */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-rose-500 flex items-center justify-center text-2xl text-white">
                  {user?.username
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {user?.username}
                  </h3>
                  <p className="text-purple-400 uppercase tracking-wide text-sm">
                    {profileData?.artCategory}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <div className="px-4 py-3 bg-white/5 rounded-lg">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {profileData?.bio || "No bio available"}
                </p>
              </div>

              {/* Contact & Social */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <span className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    📧
                  </span>
                  <span className="text-sm">{user?.email}</span>
                </div>

                {profileData?.socialMedia && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <span className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">
                      @
                    </span>
                    <span className="text-sm">{profileData.socialMedia}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 text-gray-300">
                  <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                    📍
                  </span>
                  <span className="text-sm">
                    {profileData?.location || "Location not set"}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10 pt-4 space-y-3">
                {user?.role === "artist" && (
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faCloudUploadAlt} />
                    <span>Upload Artwork</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-white/30 backdrop-blur-lg supports-[backdrop-filter]:backdrop-blur-lg border-b border-white/20">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16 sm:h-20">
              {/* Logo */}
              <div className="flex-shrink-0 ml-2">
                <Link to="/home" className="flex items-center">
                  <span className="font-extrabold tracking-wide text-2xl sm:text-3xl text-[#0b5d3b]">
                    ARTVERSE
                  </span>
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:flex flex-1 justify-center">
                {/* Left section: Navigation Links */}
                <div className="flex items-center gap-2">
                  <NavigationLink to="/">Home</NavigationLink>
                  <NavigationLink to="/explore">Gallery</NavigationLink>
                  <NavigationLink to="/artists">Artists</NavigationLink>
                  <NavigationLink to="/exhibitions">Exhibitions</NavigationLink>
                  <NavigationLink to="/about">About</NavigationLink>
                  {/* Add Upload Artwork button here */}
                  {user?.role === "artist" && (
                    <button
                      onClick={() => setIsUploadModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
                    >
                      <FontAwesomeIcon icon={faCloudUploadAlt} />
                      <span>Upload Artwork</span>
                    </button>
                  )}
                </div>

                {/* Right: Wishlist */}
                <button
                  onClick={() => setIsWishlistOpen(true)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <FontAwesomeIcon icon={faHeart} />
                  <span>Wishlist</span>
                </button>
              </div>

              {/* Profile Avatar and Logout - Right Corner */}
              <div className="hidden md:flex items-center gap-4 ml-8">
                <NavLink to="/profile">
                  <UserAvatar />
                </NavLink>
                <button
                  onClick={logoutHandler}
                  className="px-4 py-2 rounded-full bg-red-600/10 text-red-700 hover:bg-red-600/20 transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Logout</span>
                </button>
              </div>

              {/* Mobile: Hamburger Menu */}
              <div className="md:hidden ml-auto flex items-center">
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

                <NavLink
                  to="/artists"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#1c2a3a] hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 hover:shadow-md hover:transform hover:scale-102 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faUserPlus} className="text-lg" />
                  <span className="font-medium">Artists</span>
                </NavLink>

                <NavLink
                  to="/exhibitions"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#1c2a3a] hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 hover:shadow-md hover:transform hover:scale-102 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faSearch} className="text-lg" />
                  <span className="font-medium">Exhibitions</span>
                </NavLink>

                <NavLink
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#1c2a3a] hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 hover:shadow-md hover:transform hover:scale-102 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faSearch} className="text-lg" />
                  <span className="font-medium">About</span>
                </NavLink>

                {user?.role === "artist" && (
                  <button
                    onClick={() => {
                      setIsUploadModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#0b5d3b] to-emerald-600 text-white hover:from-emerald-700 hover:to-teal-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <FontAwesomeIcon
                      icon={faCloudUploadAlt}
                      className="text-lg"
                    />
                    <span className="font-medium">Upload Artwork</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsWishlistOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#1c2a3a] hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 hover:shadow-md hover:transform hover:scale-102 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faHeart} className="text-lg" />
                  <span className="font-medium">Wishlist</span>
                </button>

                <div className="border-t border-emerald-200 pt-4 mt-4">
                  <NavLink
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#1c2a3a] hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 hover:shadow-md hover:transform hover:scale-102 transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0b5d3b] to-emerald-600 flex items-center justify-center text-sm text-white shadow-md">
                      {user?.username
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <span className="font-medium">Profile</span>
                  </NavLink>

                  <button
                    onClick={() => {
                      logoutHandler();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#8b1e5a] hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-100 hover:shadow-md hover:transform hover:scale-102 transition-all duration-300 w-full"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="text-lg" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </nav>
      <UploadArtworkModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />
      <AnimatePresence>
        {isWishlistOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-gray-200 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  My Wishlist
                </h2>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              {wishlistItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Your wishlist is empty
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-gray-50 rounded-lg overflow-hidden flex gap-4 border border-gray-200"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-24 h-24 object-cover"
                      />
                      <div className="flex-1 p-3">
                        <h3 className="text-gray-900 font-medium">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromWishlist(item)}
                        className="p-3 text-gray-500 hover:text-red-600"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PrivateNavbar;
