import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Add this import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faPalette,
  faMagicWandSparkles,
  faLightbulb,
  faHeart,
  faEye,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import GetStarted from "./GetStarted";
import { ChatProvider } from "../context/ChatContext";
import ChatBot from "./ChatBot";
import axios from "axios";

const Homepage = () => {
  // Add this style tag at the beginning of your component
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes shine {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
      .animate-shine {
        animation: shine 3s infinite;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Assuming you have the user data stored in localStorage or context
    const userData = JSON.parse(localStorage.getItem("user")); // or use your auth context

    if (userData && userData.userType === "artist") {
      navigate("/ArtistProfileForm");
    }
  }, [navigate]);

  // Add this new useEffect for fetching featured artworks
  useEffect(() => {
    const fetchFeaturedArtworks = async () => {
      try {
        const response = await axios.get(
          "https://artverse-4.onrender.com/api/artwork/featured"
        );
        setFeaturedArtworks(response.data);
      } catch (error) {
        console.error("Error fetching featured artworks:", error);
      }
    };

    fetchFeaturedArtworks();
    // Refresh featured artworks every 5 minutes
    const interval = setInterval(fetchFeaturedArtworks, 300000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ChatProvider>
      <div className="w-full min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50/40 px-4 md:px-8 lg:px-16">
        {/* Hero Section */}
        <GetStarted />
        <section className="relative w-full min-h-screen overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl floating-animation"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl floating-animation animation-delay-2000"></div>
            <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl floating-animation animation-delay-4000"></div>
            <div className="absolute top-20 right-20 w-3 h-3 bg-emerald-800 rounded-full animate-bounce"></div>
            <div className="absolute bottom-32 left-20 w-2 h-2 bg-cyan-800 rounded-full animate-pulse"></div>
          </div>

          <div className="container-custom relative z-10">
            {/* Welcome Text */}
            <div className="text-center space-y-6 mb-24 mt-32">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
                Discover Digital Art
                <br />
                <span className="text-[#5b2a6e]">Reimagined</span>
              </h1>
              <p className="text-xl md:text-xl text-gray-700 font-light mb-4">
                Explore a revolutionary platform where creativity meets<br></br>
                technology, connecting artists and collectors in an immersive
                digital experience.
              </p>
              {/* <div className="max-w-3xl mx-auto px-4">
                <div className="mt-6 flex items-center justify-center gap-4">
                  <Link
                    to="/explore"
                    className="px-6 py-3 rounded-full bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
                  >
                    Explore Gallery
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-3 rounded-full bg-[#6b2149] text-white hover:brightness-110 transition-colors"
                  >
                    Join Community
                  </Link>
                </div>
              </div> */}
            </div>

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-3 pb-24">
              {[
                {
                  title: "Resin Art",
                  description: "Glossy Creations, endless Inspiration!",
                  color: "from-indigo-500 to-fuchsia-600",
                  image:
                    "https://i.pinimg.com/736x/98/e5/50/98e550454c6ff4aaeeef3156ce0cdc77.jpg",
                },
                {
                  title: "Painting",
                  description: "Bring ideas to life",
                  color: "from-blue-500 to-indigo-600",
                  image:
                    "https://i.pinimg.com/474x/b9/00/31/b900315305da79cbbc2308b6f7dd9bd5.jpg",
                },
                {
                  title: "Hand Made Candles",
                  description: "Light up your world with handmade elegance",
                  color: "from-amber-500 to-orange-600",
                  image:
                    "https://i.pinimg.com/736x/25/08/75/250875b63df82b1d5eca2ac9c6bb24c0.jpg",
                },
                {
                  title: "Gift Hampers",
                  description: "Bundles of Joy, Wrapped with Love!",
                  color: "from-green-500 to-emerald-600",
                  image:
                    "https://i.pinimg.com/736x/83/86/62/83866207d796ecc1d0cd67ec23a25c24.jpg",
                },
                {
                  title: "Clay Art",
                  description: "Discover three-dimensional wonders",
                  color: "from-purple-500 to-pink-600",
                  image:
                    "https://i.pinimg.com/736x/78/c5/1f/78c51fcbcdb5622c32eb9d21dd650cde.jpg",
                },
                {
                  title: "Hand Made Jewellery",
                  description: "Art You can wear!",
                  color: "from-pink-500 to-red-600",
                  image:
                    "https://i.pinimg.com/736x/6b/8b/11/6b8b11b65c0739c81a2a5dc32fcfb46a.jpg",
                },
              ].map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative h-[300px] overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-500"
                >
                  {/* Hover border glow */}
                  <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-4 ring-emerald-600/30 transition-all" />

                  {/* Image and overlay */}
                  <motion.img
                    src={category.image}
                    alt={category.title}
                    className="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-700 scale-100 group-hover:scale-105 rounded-2xl"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.7 }}
                  />

                  {/* Content overlay with lift */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="absolute inset-0 flex flex-col justify-end p-5">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="bg-white/80 backdrop-blur-md rounded-lg p-4 transform transition-all duration-500 translate-y-full group-hover:translate-y-0"
                      >
                        <div
                          className={`h-1 w-12 rounded-full mb-4 bg-gradient-to-r ${category.color}`}
                        />
                        <h3 className="text-xl font-bold text-gray-900 mb-2 transform transition-all duration-300 opacity-0 group-hover:opacity-100">
                          {category.title}
                        </h3>
                        <p className="text-gray-700 text-xs transform transition-all duration-300 delay-100 opacity-0 group-hover:opacity-100">
                          {category.description}
                        </p>
                      </motion.div>
                    </div>
                  </div>

                  {/* Outer glow subtle */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-60 rounded-2xl blur-xl transition-all duration-500" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section - Why Choose Artverse */}
        <section className="py-24 bg-gradient-to-b from-white to-emerald-50/40">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#1c2a3a]">
                Why Choose <span className="text-[#8b1e5a]">Artverse</span>
              </h2>
              <p className="text-gray-700 max-w-2xl mx-auto text-lg">
                Experience the future of digital art collection and creation
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: faPalette,
                  title: "Curated Collections",
                  description:
                    "Discover handpicked digital artworks from emerging and established artists around the globe.",
                  color: "#0f766e",
                },
                {
                  icon: faMagicWandSparkles,
                  title: "Exclusive Exhibitions",
                  description:
                    "Experience limited-time virtual exhibitions with immersive, interactive gallery spaces.",
                  color: "#8b1e5a",
                },
                {
                  icon: faLightbulb,
                  title: "Artist Community",
                  description:
                    "Connect with a vibrant community of creators, collectors, and art enthusiasts.",
                  color: "#1f2937",
                },
              ].map((feature, index) => (
                <div key={index} className="card-container">
                  <div className="p-8 rounded-2xl bg-white shadow-md border border-gray-200 relative">
                    <div
                      className="absolute -left-px top-6 bottom-6 w-1 rounded-full"
                      style={{ backgroundColor: feature.color }}
                    />
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                      style={{
                        color: feature.color,
                        backgroundColor: "rgba(15, 118, 110, 0.08)",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={feature.icon}
                        className="text-2xl"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-[#1c2a3a]">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Artworks - Compact Grid */}
        <section className="py-12 px-2 bg-gradient-to-b from-white to-emerald-50/40 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-indigo-200/30 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-pink-200/30 rounded-full blur-2xl animate-pulse delay-150"></div>
          </div>

          <div className="container-custom relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row justify-between items-center mb-8 px-2 gap-4"
            >
              <h2 className="text-2xl md:text-[45px] font-extrabold text-[#1c2a3a] bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">
                Featured <span className="text-[#8b1e5a]">Artworks</span>
              </h2>
              <Link
                to="/explore"
                className="group flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-700 text-white hover:bg-emerald-800 shadow transition-all duration-300"
              >
                <span className="group-hover:text-gray-100 transition-colors">
                  View All
                </span>

                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="group-hover:translate-x-1 transition-all"
                />
              </Link>
            </motion.div>
            <br></br>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {featuredArtworks.slice(0, 6).map((artwork, index) => (
                <motion.div
                  key={artwork._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -2, scale: 1.03 }}
                  className="group relative w-full"
                >
                  <div className="relative rounded-lg overflow-hidden shadow bg-white transition-transform duration-300 hover:scale-105 w-full aspect-[4/3]">
                    <img
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      className="w-full h-full object-cover object-center rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <h3 className="text-white font-semibold text-sm mb-1 drop-shadow">
                          {artwork.title}
                        </h3>
                        <p className="text-indigo-200 text-xs">
                          by {artwork.artistName}
                        </p>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/80 backdrop-blur border border-gray-200 shadow">
                      <span className="text-xs font-medium text-gray-800">
                        {artwork.category}
                      </span>
                    </div>
                    <button className="absolute top-2 right-2 p-1 rounded-full bg-white/20 backdrop-blur hover:bg-white/30 transition-colors group">
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="text-white text-xs group-hover:text-fuchsia-500 transition-colors"
                      />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-gradient-to-b from-emerald-50/40 to-white">
          <div className="container-custom">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-50 to-teal-50/40 shadow-lg p-12 md:p-20">
              <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#8b1e5a] bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">
                  Join the ARTVERSE Community
                </h2>
                <p className="text-gray-700 text-lg mb-8">
                  Connect with fellow artists , collectors , and art enthusiasts
                  , Get early <br></br>
                  access to exclusive exhibitions, special events , and
                  personalized<br></br>recommendations
                </p>
                <br></br>

                <Link
                  to="/register"
                  className="w-full py-3 px-4 rounded-[30px] bg-gradient-to-r bg-[#0b5d3b] text-white  font-semibold hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sign up Now
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <ChatBot />
      </div>
    </ChatProvider>
  );
};

export default Homepage;
