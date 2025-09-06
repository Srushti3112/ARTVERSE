// src/components/GetStarted.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";

const GetStarted = () => {
  // No auto-redirect; this page acts as a hero landing

  // Parallax motion values
  const mvx = useMotionValue(0);
  const mvy = useMotionValue(0);
  const px = useSpring(mvx, { stiffness: 60, damping: 12 });
  const py = useSpring(mvy, { stiffness: 60, damping: 12 });
  const onMouseMove = (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    mvx.set(((e.clientX - cx) / cx) * 12);
    mvy.set(((e.clientY - cy) / cy) * 12);
  };

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-emerald-50 to-teal-50/40"
      onMouseMove={onMouseMove}
    >
      {/* Background overlay reserved */}

      <div className="absolute inset-0"></div>

      {/* Main content */}
      <div className="absolute top-20 left-20 w-32 h-32 border border-emerald-800/30 rotate-45 animate-spin-slow"></div>
      <div className="absolute bottom-32 right-32 w-24 h-24 border border-cyan-800/30 rotate-12 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-purple-800/30 rotate-45 animate-bounce"></div>
      <div className="relative z-10 container mx-auto px-4 pt-16 sm:pt-20 pb-16 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left copy */}
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-[#1c2a3a]">
              Discover
              <br />
              Digital Art in a
              <br />
              New
              <br />
              <span className="text-[#1c2a3a]">Dimension</span>
            </h1>
            <p className="mt-6 text-gray-700 text-lg max-w-xl">
              ARTVERSE is a revolutionary platform where artists and collectors
              come together to explore, create, and own unique digital
              masterpieces in an immersive virtual gallery experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/explore"
                className="px-6 py-3 rounded-full bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
              >
                Explore Gallery
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 rounded-full bg-slate-700 text-white hover:bg-slate-800 transition-colors"
              >
                Join as Artist
              </Link>
            </div>
          </div>

          {/* Right: Logo card */}
          <div className="relative">
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
              className="mx-auto w-full max-w-lg"
            >
              <motion.img
                src="/artverse.png"
                alt="ARTVERSE"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full aspect-square object-cover rounded-2xl shadow-2xl ring-1 ring-black/5 bg-white"
              />
            </motion.div>
          </div>
        </div>

        {/* Parallax decorative circle */}
        <motion.div
          style={{ x: px, y: py }}
          className="pointer-events-none absolute -z-0 w-64 h-64 rounded-full bg-fuchsia-300/20 blur-3xl top-24 left-12"
        />
        <motion.div
          style={{ x: px, y: py }}
          className="pointer-events-none absolute -z-0 w-72 h-72 rounded-full bg-indigo-300/20 blur-3xl bottom-24 right-12"
        />
      </div>
    </div>
  );
};

export default GetStarted;
