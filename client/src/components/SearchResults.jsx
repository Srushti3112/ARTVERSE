import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SearchResults = ({ results, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-full left-0 right-0 mt-2 bg-[#1a1f35] rounded-lg border border-white/10 shadow-xl max-h-[400px] overflow-y-auto z-50"
      >
        {!results.artworks?.length && !results.artists?.length ? (
          <div className="p-4 text-gray-400 text-center">No results found</div>
        ) : (
          <div>
            {/* Artworks Section */}
            {results.artworks?.length > 0 && (
              <div className="p-2">
                <h3 className="text-gray-400 text-xs uppercase tracking-wider px-3 py-2">
                  Artworks
                </h3>
                <div className="divide-y divide-white/10">
                  {results.artworks.map((artwork) => (
                    <Link
                      key={artwork._id}
                      to={`/artwork/${artwork._id}`}
                      className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors"
                      onClick={onClose}
                    >
                      <img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <h4 className="text-white font-medium">
                          {artwork.title}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {artwork.category}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Artists Section */}
            {results.artists?.length > 0 && (
              <div className="p-2 border-t border-white/10">
                <h3 className="text-gray-400 text-xs uppercase tracking-wider px-3 py-2">
                  Artists
                </h3>
                <div className="divide-y divide-white/10">
                  {results.artists.map((artist) => (
                    <Link
                      key={artist._id}
                      to={`/profile/${artist._id}`}
                      className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors"
                      onClick={onClose}
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-rose-500 flex items-center justify-center text-white font-medium">
                        {artist.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">
                          {artist.username}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {artist.artCategory || "Artist"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchResults;
