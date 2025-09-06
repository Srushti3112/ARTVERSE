import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faCloudUploadAlt,
  faCheckCircle,
  faRupeeSign,
} from "@fortawesome/free-solid-svg-icons";

const UploadArtworkModal = ({ isOpen, onClose, onUpload }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        alert("Please upload a valid image file (JPEG, PNG, or GIF)");
        return;
      }

      if (file.size > maxSize) {
        alert("File size should be less than 5MB");
        return;
      }

      setFormData({ ...formData, image: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data - removed description from required fields
      if (!formData.title || !formData.category || !formData.image) {
        throw new Error("Please fill all required fields");
      }

      // Create FormData object - description is now optional
      const submitData = new FormData();
      submitData.append("title", formData.title.trim());
      submitData.append("category", formData.category);
      submitData.append("image", formData.image);

      // Only append description if it's not empty
      if (formData.description.trim()) {
        submitData.append("description", formData.description.trim());
      }

      console.log("Submitting artwork:", {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        imageType: formData.image.type,
        imageSize: formData.image.size,
      });

      await onUpload(submitData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        image: null,
        price: "",
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.message || "Error uploading artwork");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          {showSuccess ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-8 flex flex-col items-center"
            >
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-400 text-5xl mb-4"
              />
              <p className="text-white text-xl">
                Artwork uploaded successfully!
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1a1f35] rounded-2xl p-6 w-full max-w-4xl shadow-2xl border border-white/10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Upload Artwork
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-gray-200">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-200">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-[#1f2137] border border-white/10 rounded-lg text-white appearance-none cursor-pointer"
                    style={{ backgroundColor: "#1f2137" }}
                    required
                  >
                    <option value="" className="bg-[#1f2137]">
                      Select category
                    </option>
                    {[
                      "painting",
                      "sculpture",
                      "digital-art",
                      "photography",
                      "resin",
                      "crafts",
                      "sketching",
                      "others",
                    ].map((cat) => (
                      <option
                        key={cat}
                        value={cat}
                        className="bg-[#1f2137] capitalize"
                      >
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-200">
                    Price (optional)
                    <span className="text-gray-400 text-sm ml-2">(in ₹)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FontAwesomeIcon icon={faRupeeSign} />
                    </span>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="Enter price in rupees"
                      className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-200">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50/10 file:text-violet-100 hover:file:bg-violet-50/20"
                    required
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-gray-200">
                    Description (optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    rows="3"
                    placeholder="Enter artwork description..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="col-span-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
                >
                  {loading ? "Uploading..." : "Upload Artwork"}
                </button>
              </form>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadArtworkModal;
