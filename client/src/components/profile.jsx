import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faTrash,
  faEnvelope,
  faPalette,
  faLocationDot,
  faMessage,
  faCloudUploadAlt,
} from "@fortawesome/free-solid-svg-icons";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import UploadArtworkModal from "./UploadArtworkModal";
import {
  addToWishlist,
  removeFromWishlist,
} from "../redux/slices/wishlistSlice";
import DirectMessage from "./DirectMessage";

const ArtistProfileHover = ({ profile, user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="absolute left-0 top-24 w-96 bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-xl rounded-2xl p-10 border border-white/20 shadow-[0_0_30px_rgba(124,58,237,0.2)] z-50"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-rose-500 flex items-center justify-center text-2xl text-white">
              {user.username
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium text-white mb-1">
                {user.username}
              </span>
              <span className="text-sm text-gray-400">Artist</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-white/10">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
            {profile?.fullName}
          </h2>
          <p className="text-gray-400">{profile?.artCategory}</p>
        </div>

        <p className="text-gray-300 text-sm leading-relaxed">{profile?.bio}</p>

        <div className="space-y-3 pt-4 border-t border-white/10">
          <p className="text-gray-300 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            {profile?.email}
          </p>
          <p className="text-gray-300 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">
              <FontAwesomeIcon icon={faPalette} />
            </span>
            {profile?.artCategory}
          </p>
          <p className="text-gray-300 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
              <FontAwesomeIcon icon={faLocationDot} />
            </span>
            {profile?.location}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Profile = () => {
  const { artistId } = useParams();
  const user = useSelector((state) => state.auth.user);

  const [profile, setProfile] = useState(null);
  const [artwork, setArtwork] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    artworkId: null,
  });
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const handleWishlist = (artwork) => {
    const isInWishlist = wishlistItems.some((item) => item._id === artwork._id);
    if (isInWishlist) {
      dispatch(removeFromWishlist(artwork));
    } else {
      dispatch(addToWishlist(artwork));
    }
  };

  useEffect(() => {
    const fetchProfileAndArtworks = async () => {
      try {
        if (!user?.token) {
          console.log("No user token found");
          return;
        }

        console.log("Current user:", user); // Debug user object
        console.log("Artist ID from params:", artistId); // Debug artistId

        // Use artist ID from params or current user's ID
        const targetUserId = artistId || user?.id || user?._id;

        console.log("Target user ID:", targetUserId); // Debug target ID

        if (!targetUserId) {
          setError("User ID not available");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `https://artverse-4.onrender.com/api/users/profile/${targetUserId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        console.log("Profile response:", response.data);
        setProfile(response.data);
        setArtwork(response.data.artworks || []);
        setIsOwnProfile(targetUserId === (user.id || user._id));
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch profile data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndArtworks();
  }, [user, artistId]);

  const handleDelete = async (artworkId) => {
    try {
      await axios.delete(
        `https://artverse-4.onrender.com/api/artwork/${artworkId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      // Remove from state
      setArtwork((prev) => prev.filter((art) => art._id !== artworkId));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting artwork");
    }
  };

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
      // Refresh the artwork list after successful upload
      window.location.reload();
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  // If the user is not logged in, redirect to the login page
  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const NoArtworkView = () => {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-12 px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-[80px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-500/20 rounded-full blur-[80px] animate-pulse delay-300"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-2xl w-full mx-auto"
        >
          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-[0_0_30px_rgba(124,58,237,0.1)]">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Avatar */}
              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-3xl text-white">
                  {user.username
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
              </motion.div>

              {/* Profile Header with Message Button */}
              <div className="w-full flex justify-between items-start">
                {/* Avatar Section */}
                <motion.div whileHover={{ scale: 1.05 }} className="relative">
                  {/* ...existing avatar code... */}
                </motion.div>

                {/* Message Button - Only show for other users' profiles */}
                {isOwnProfile && profile?.artCategory === "artist" && (
                  <motion.button
                    onClick={() => setIsUploadModalOpen(true)}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 15px 25px -10px rgba(124, 58, 237, 0.5)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-500 text-white font-medium px-6 py-3 rounded-xl shadow-lg"
                  >
                    <FontAwesomeIcon icon={faCloudUploadAlt} className="mr-2" />
                    Upload Artwork
                  </motion.button>
                )}
              </div>

              {/* Profile details */}
              <div className="space-y-4 w-full max-w-xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent">
                    {profile?.fullName || user.username}
                  </h2>
                </div>

                {/* Role Badge */}
                <div className="flex justify-center">
                  <span className="px-4 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium">
                    {user.role === "artCategory" ? "Artist" : "Art Enthusiast"}
                  </span>
                </div>

                {/* Artist Info Grid */}
                <div className="grid grid-cols-2 gap-4 text-left text-sm mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="text-purple-400"
                      />
                      <p className="text-gray-300">
                        {profile?.email || "Not provided"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faPalette}
                        className="text-pink-400"
                      />
                      <p className="text-gray-300">
                        {profile?.artCategory || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="text-indigo-400"
                      />
                      <p className="text-gray-300">
                        {profile?.location || "Not specified"}
                      </p>
                    </div>
                    {profile?.experience && (
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faPalette}
                          className="text-blue-400"
                        />
                        <p className="text-gray-300">{profile.experience}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio Section */}
                {profile?.bio && (
                  <div className="text-left border-t border-white/10 pt-4">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chat Modal */}
        {showChat && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative w-full max-w-2xl mx-4">
              <button
                onClick={() => setShowChat(false)}
                className="absolute -top-12 right-0 text-white hover:text-pink-500 transition-colors"
              >
                Close
              </button>
              <DirectMessage artistId={profile?._id} />
            </div>
          </div>
        )}

        <UploadArtworkModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleUpload}
        />
      </div>
    );
  };

  const ArtworkView = () => {
    return (
      <div className="min-h-screen py-16 px-6 md:px-8 lg:px-12 relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-96 bg-gradient-to-tl from-indigo-500/10 via-blue-500/10 to-transparent"></div>
        </div>

        {/* Grid layout */}
        <div className="relative z-10 max-w-[2000px] mx-auto">
          <div className="mb-12 px-4 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {isOwnProfile
                    ? "Your Artworks"
                    : `${profile?.fullName}'s Artworks`}
                </h2>
                <p className="text-gray-300">
                  {isOwnProfile && user.artCategory === "artist" && (
                    <motion.button
                      onClick={() => setIsUploadModalOpen(true)}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 15px 25px -10px rgba(124, 58, 237, 0.5)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="relative group overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-500 text-white font-medium px-6 py-3 rounded-xl shadow-lg"
                    >
                      <FontAwesomeIcon
                        icon={faCloudUploadAlt}
                        className="mr-2"
                      />
                      Upload Artwork
                    </motion.button>
                  )}
                </p>
              </div>
            </div>

            {/* Enhanced Upload Button */}
            <motion.button
              onClick={() => setIsUploadModalOpen(true)}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 15px 25px -10px rgba(124, 58, 237, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              className="relative group overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-500 text-white font-medium px-6 py-3 rounded-xl shadow-[0_8px_16px_-4px_rgba(124,58,237,0.3)] backdrop-blur-xl border border-white/10 transform perspective-1000 hover:rotate-[-0.5deg] transition-all duration-300 flex items-center gap-3"
            >
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-lg group-hover:animate-pulse"></div>

              {/* Icon with glow */}
              <FontAwesomeIcon
                icon={faCloudUploadAlt}
                className="text-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
              />

              {/* Text with gradient */}
              <span className="relative font-medium text-base bg-gradient-to-r from-white to-purple-100 bg-clip-text">
                Upload Artwork
              </span>

              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
            </motion.button>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {artwork.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden transform perspective-1000 hover:shadow-2xl transition-shadow duration-300"
              >
                {/* Card content */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay content */}
                <div className="absolute inset-0 flex flex-col justify-between p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* Top section */}
                  <div className="flex justify-between items-start space-x-4">
                    <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-xs font-medium text-white shadow-lg">
                      {item.category}
                    </span>
                  </div>

                  {/* Bottom section with enhanced gradient overlay */}
                  <div className="space-y-6 relative z-10">
                    {/* Add a stronger gradient background */}
                    <div className="absolute inset-0 -m-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                    <div className="relative">
                      <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                        {item.title}
                      </h3>
                      <p className="text-gray-100 text-sm line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex justify-end gap-3 relative mt-4">
                      {/* Action buttons with enhanced visibility */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWishlist(item);
                        }}
                        className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-colors shadow-lg ${
                          wishlistItems.some((wi) => wi._id === item._id)
                            ? "bg-pink-500 text-white"
                            : "bg-white/30 text-white hover:bg-white hover:text-pink-500"
                        }`}
                      >
                        <FontAwesomeIcon icon={faHeart} />
                      </button>
                      {isOwnProfile && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteModal({
                              isOpen: true,
                              artworkId: item._id,
                            });
                          }}
                          className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 transition-colors shadow-lg"
                          title="Delete artwork"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Chat Modal */}
        {showChat && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative w-full max-w-2xl mx-4">
              <button
                onClick={() => setShowChat(false)}
                className="absolute -top-12 right-0 text-white hover:text-pink-500 transition-colors"
              >
                Close
              </button>
              <DirectMessage artistId={profile?._id} />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-[#1a1f35] to-[#2a1f35] min-h-screen">
      {artwork.length === 0 ? <NoArtworkView /> : <ArtworkView />}

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, artworkId: null })}
        onConfirm={() => {
          if (deleteModal.artworkId) {
            handleDelete(deleteModal.artworkId);
          }
        }}
      />
      {user && profile && user._id !== profile._id && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Message Artist</h2>
          <DirectMessage artistId={profile._id} />
        </div>
      )}

      {/* Add UploadArtworkModal */}
      <UploadArtworkModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default Profile;
