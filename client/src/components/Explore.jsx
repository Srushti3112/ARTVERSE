import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../redux/slices/wishlistSlice";

const Explore = () => {
  const [artworks, setArtworks] = useState([]);
  const [shuffledArtworks, setShuffledArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedArtworks, setLikedArtworks] = useState(new Set());
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.get("http://localhost:5000/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const likedIds = new Set(response.data.map((item) => item.artworkId));
      setLikedArtworks(likedIds);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const shuffleArtworks = () => {
    const shuffled = [...artworks].sort(() => Math.random() - 0.5);
    setShuffledArtworks(shuffled);
  };

  useEffect(() => {
    const rotationInterval = setInterval(() => {
      shuffleArtworks();
    }, 30000);
    return () => clearInterval(rotationInterval);
  }, [artworks]);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/artwork/explore"
        );
        const processedArtworks = response.data.map((artwork) => ({
          ...artwork,
          artistId: artwork.userId || artwork.artistId,
          artistName:
            artwork.userId?.name ||
            artwork.userId?.username ||
            artwork.artistName ||
            "Unknown Artist",
        }));
        setArtworks(processedArtworks);
        setShuffledArtworks(processedArtworks.sort(() => Math.random() - 0.5));
      } catch (error) {
        setError("Failed to fetch artworks");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      try {
        await Promise.all([fetchArtworks(), fetchWishlist()]);
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLike = async (artwork) => {
    try {
      if (!user || !user.token) {
        navigate("/login");
        return;
      }
      const isLiked = wishlistItems.some((item) => item._id === artwork._id);
      const endpoint = isLiked ? "remove" : "add";
      const response = await axios.post(
        `http://localhost:5000/api/artwork/wishlist/${endpoint}`,
        { artworkId: artwork._id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setArtworks((prevArtworks) =>
        prevArtworks.map((art) =>
          art._id === artwork._id
            ? { ...art, likes: response.data.artwork.likes }
            : art
        )
      );
      if (endpoint === "add") {
        dispatch(addToWishlist(response.data.artwork));
      } else {
        dispatch(removeFromWishlist(artwork));
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const searchParam = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("search")?.toLowerCase() || "";
  }, [location.search]);

  const filteredArtworks = useMemo(() => {
    if (!searchParam) return shuffledArtworks;
    return shuffledArtworks.filter((a) => {
      const title = a.title?.toLowerCase() || "";
      const desc = a.description?.toLowerCase() || "";
      const cat = a.category?.toLowerCase() || "";
      const artist = a.artistName?.toLowerCase() || "";
      return (
        title.includes(searchParam) ||
        desc.includes(searchParam) ||
        cat.includes(searchParam) ||
        artist.includes(searchParam)
      );
    });
  }, [searchParam, shuffledArtworks]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-purple-100 flex items-center justify-center">
        <div className="text-2xl font-semibold text-indigo-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-purple-100 flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-purple-100 py-20 relative overflow-hidden">
      {/* Decorative shapes similar to homepage */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-indigo-200/40 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-200/40 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-200/40 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-600 text-center mb-6"
        >
          Discover Artverse
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-700 text-center mb-12 text-lg md:text-xl"
        >
          Dive into a world of creativity and inspiration. Browse, like, and
          connect with artists!
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredArtworks.map((artwork, index) => (
              <motion.div
                key={artwork._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                className="relative group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                whileHover={{
                  scale: 1.03,
                  zIndex: 10,
                  boxShadow: "0 8px 32px rgba(99,102,241,0.15)",
                }}
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-indigo-700 truncate">
                    {artwork.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    by{" "}
                    <Link
                      to={`/profile/${artwork.artist}`}
                      className="hover:text-indigo-600 font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {artwork.artistName}
                    </Link>
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <motion.button
                      onClick={(e) => {
                        e.preventDefault();
                        handleLike(artwork);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center gap-1"
                    >
                      <FontAwesomeIcon
                        icon={faHeart}
                        className={`text-xl ${
                          wishlistItems.some((item) => item._id === artwork._id)
                            ? "text-fuchsia-500 drop-shadow-[0_0_12px_rgba(236,72,153,0.7)]"
                            : "text-gray-400 hover:text-fuchsia-400"
                        }`}
                      />
                    </motion.button>
                    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
                      {artwork.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Explore;
