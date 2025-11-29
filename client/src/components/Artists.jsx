import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPalette,
  faLocationDot,
  faUser,
  faImage,
} from "@fortawesome/free-solid-svg-icons";

const Artists = () => {
  const user = useSelector((state) => state.auth.user);
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        const url = searchQuery
          ? `https://artverse-4.onrender.com/api/users/profile/artists/all?search=${encodeURIComponent(
              searchQuery
            )}`
          : `https://artverse-4.onrender.com/api/users/profile/artists/all`;

        const response = await axios.get(url);
        setArtists(response.data);
        setFilteredArtists(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching artists:", err);
        const errorMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch artists. Please try again later.";
        setError(errorMessage);
        console.error("Full error details:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n && n[0])
      .filter(Boolean)
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarUrl = (avatarUrl) => {
    if (!avatarUrl) return null;
    // If it's already a full URL, return as is
    if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
      return avatarUrl;
    }
    // If it's a relative path, prepend the server URL
    if (avatarUrl.startsWith("/")) {
      return `https://artverse-4.onrender.com${avatarUrl}`;
    }
    return avatarUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-rose-50 to-teal-50/40 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading artists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-rose-50 to-teal-50/40 pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[#102029] mb-2">
            Discover Artists
          </h1>
          <p className="text-gray-600">
            Explore talented artists and their amazing creations
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FontAwesomeIcon
                icon={faSearch}
                className="text-gray-400 text-lg"
              />
            </div>
            <input
              type="text"
              placeholder="Search artists by name, category, or location..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Artists Grid */}
        {filteredArtists.length === 0 ? (
          <div className="text-center py-16">
            <FontAwesomeIcon
              icon={faUser}
              className="text-6xl text-gray-300 mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchQuery ? "No artists found" : "No artists available"}
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Check back later for new artists"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtists.map((artist, index) => (
              <motion.div
                key={artist._id || artist.userId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <Link
                  to={`/profile/${artist._id || artist.userId}`}
                  className="block"
                >
                  {/* Avatar Section */}
                  <div className="relative bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-6 flex items-center justify-center">
                    {getAvatarUrl(artist.avatarUrl) ? (
                      <img
                        src={getAvatarUrl(artist.avatarUrl)}
                        alt={artist.fullName || artist.username}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        onError={(e) => {
                          // If image fails to load, show initials instead
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-extrabold border-4 border-white shadow-lg ${
                        getAvatarUrl(artist.avatarUrl) ? "hidden" : ""
                      }`}
                    >
                      {getInitials(artist.fullName || artist.username)}
                    </div>
                  </div>

                  {/* Artist Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#102029] mb-2 truncate">
                      {artist.fullName || artist.username}
                    </h3>

                    {artist.bio && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {artist.bio}
                      </p>
                    )}

                    <div className="space-y-2 mb-4">
                      {artist.artCategory && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FontAwesomeIcon
                            icon={faPalette}
                            className="text-indigo-500"
                          />
                          <span className="truncate">{artist.artCategory}</span>
                        </div>
                      )}

                      {artist.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FontAwesomeIcon
                            icon={faLocationDot}
                            className="text-emerald-500"
                          />
                          <span className="truncate">{artist.location}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <FontAwesomeIcon
                          icon={faImage}
                          className="text-rose-500"
                        />
                        <span>{artist.artworkCount || 0} artworks</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <span className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                        View Profile →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredArtists.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            Showing {filteredArtists.length} artist
            {filteredArtists.length !== 1 ? "s" : ""}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        )}
      </div>
    </div>
  );
};

export default Artists;
