import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPalette,
  faLocationDot,
  faBook,
  faPaintBrush,
} from "@fortawesome/free-solid-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

const validArtCategories = [
  "painting",
  "sculpture",
  "candle",
  "photography",
  "resin",
  "hand-made jewellery",
  "sketching",
  "digital art",
  "crafts",
  "others",
]; // Updated to match the new category list

const ArtistProfileForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      location: "",
      artCategory: "",
      socialMedia: "",
    },
    mode: "onBlur", // Validate on blur
  });

  useEffect(() => {
    const registrationData = JSON.parse(
      localStorage.getItem("artistRegistration")
    );
    if (!registrationData) {
      navigate("/register");
      return;
    }

    // Pre-fill form with registration data
    setValue("email", registrationData.email);
    setValue("username", registrationData.username);
  }, [setValue, navigate]);

  const onSubmit = async (formData) => {
    try {
      const registrationData = JSON.parse(
        localStorage.getItem("artistRegistration")
      );

      if (!registrationData) {
        throw new Error("Registration data not found");
      }

      // Debug log
      console.log("Submitting form data:", formData);

      const completeFormData = {
        username: formData.username.trim(),
        bio: formData.bio.trim(),
        location: formData.location.trim(),
        socialMedia: formData.socialMedia.trim(),
        email: formData.email.trim(),
        artCategory: formData.artCategory,
        role: registrationData.role,
      };

      console.log("Sending data to server:", completeFormData);

      const response = await axios.post(
        "https://artverse-4.onrender.com/api/users/ArtistProfileForm",
        completeFormData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Server response:", response.data);
      localStorage.removeItem("artistRegistration");
      navigate("/login");
    } catch (error) {
      console.error("Full error object:", error);
      const errorMessage = error.response?.data?.message
        ? `Error: ${error.response.data.message}`
        : "Server error. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#0A0F1C] flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[400px] h-[400px] bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 -top-48 -left-24 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute w-[400px] h-[400px] bg-gradient-to-r from-cyan-600/30 to-teal-600/30 -bottom-48 -right-24 rounded-full filter blur-3xl animate-pulse delay-300"></div>
      </div>

      <div className="container mx-auto px-2 py-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-12 gap-4 items-center">
            {/* Left side - Branding */}
            <div className="md:col-span-5 space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-600">
                    Design Your
                  </span>
                  <br />
                  <span className="text-white">Artist Space</span>
                </h1>
                <p className="text-gray-400 text-base">
                  Craft your unique artistic identity
                </p>
              </div>

              {/* Feature cards */}
              <div className="grid grid-cols-2 gap-2">
                <div className="group hover:-translate-y-1 transition-all duration-300">
                  <div className="bg-gradient-to-br from-violet-900/50 to-transparent p-3 rounded-xl border border-violet-700/20">
                    <div className="text-violet-400 mb-1 text-xl">🖼️</div>
                    <h3 className="text-white font-semibold text-sm">
                      Gallery
                    </h3>
                  </div>
                </div>
                <div className="group hover:-translate-y-1 transition-all duration-300">
                  <div className="bg-gradient-to-br from-fuchsia-900/50 to-transparent p-3 rounded-xl border border-fuchsia-700/20">
                    <div className="text-fuchsia-400 mb-1 text-xl">💫</div>
                    <h3 className="text-white font-semibold text-sm">
                      Inspire
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="md:col-span-7">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-white">
                    Profile Details
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Tell us about your artistic journey
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Username field with validation */}
                    <div>
                      <div className="relative group">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                        />
                        <input
                          {...register("username", {
                            required: "Username is required",
                            minLength: {
                              value: 3,
                              message: "Username must be at least 3 characters",
                            },
                          })}
                          className={`w-full pl-8 pr-3 py-2 bg-white/5 border ${
                            errors.username
                              ? "border-red-500"
                              : "border-white/10"
                          } rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500`}
                          placeholder="Username"
                        />
                      </div>
                      {errors.username && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.username.message}
                        </p>
                      )}
                    </div>

                    {/* Email field with validation */}
                    <div>
                      <div className="relative group">
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                        />
                        <input
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                          className={`w-full pl-8 pr-3 py-2 bg-white/5 border ${
                            errors.email ? "border-red-500" : "border-white/10"
                          } rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500`}
                          placeholder="Email"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Art Category and Location fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="relative group">
                        <FontAwesomeIcon
                          icon={faPalette}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                        />
                        <select
                          {...register("artCategory", {
                            required: "Art category is required",
                          })}
                          className={`w-full pl-8 pr-3 py-2 bg-white/5 border ${
                            errors.artCategory
                              ? "border-red-500"
                              : "border-white/10"
                          } rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500`}
                        >
                          <option value="" className="bg-[#0A0F1C]">
                            Category
                          </option>
                          {validArtCategories.map((category) => (
                            <option
                              key={category}
                              value={category}
                              className="bg-[#0A0F1C]"
                            >
                              {category.charAt(0).toUpperCase() +
                                category.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="relative group">
                        <FontAwesomeIcon
                          icon={faLocationDot}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                        />
                        <input
                          {...register("location")}
                          className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500"
                          placeholder="Location"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bio field */}
                  <div>
                    <div className="relative group">
                      <FontAwesomeIcon
                        icon={faBook}
                        className="absolute left-3 top-3 text-gray-400 text-sm"
                      />
                      <textarea
                        {...register("bio")}
                        className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 min-h-[80px]"
                        placeholder="Bio"
                      />
                    </div>
                  </div>

                  {/* Social Media field */}
                  <div>
                    <div className="relative group">
                      <FontAwesomeIcon
                        icon={faInstagram}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                      />
                      <input
                        {...register("socialMedia")}
                        className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500"
                        placeholder="Social media"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 px-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg text-sm font-medium 
                    ${
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:from-violet-700 hover:to-fuchsia-700"
                    } 
                    focus:ring-2 focus:ring-violet-500 transition-all duration-300`}
                  >
                    {isSubmitting ? "Creating Profile..." : "Complete Profile"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfileForm;
