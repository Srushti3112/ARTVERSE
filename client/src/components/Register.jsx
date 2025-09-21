import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { registerAPI } from "../services/userServices";
import {
  faUser,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faUserTie,
  faPaintBrush,
} from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "client",
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleRoleChange = (role) => {
    setFormData((prevData) => ({
      ...prevData,
      role,
    }));
  };

  const getRoleIcon = (role) => {
    return role === "artist" ? faPaintBrush : faUserTie;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.role
    ) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }

    try {
      const data = await registerAPI(formData);

      if (formData.role === "artist") {
        localStorage.setItem(
          "artistRegistration",
          JSON.stringify({
            email: formData.email,
            username: formData.username,
            role: formData.role,
          })
        );
        navigate("/ArtistProfileForm");
      } else {
        navigate("/login");
      }

      setSuccess("Registration successful!");
    } catch (err) {
      setError(err.message || "Failed to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-5">
      {/* Left panel */}
      <div className="relative hidden md:block bg-gradient-to-br from-white via-gray-100 to-gray-200 md:col-span-2 border-r border-gray-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-16 top-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
          <div className="absolute right-24 top-28 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl"></div>
          <div className="absolute left-40 bottom-24 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute right-16 bottom-32 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl"></div>
        </div>
        {/* Geometric patterns */}
        <div className="absolute top-20 left-20 w-32 h-32 border border-emerald-800/30 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 border border-cyan-800/30 rotate-12 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-purple-800/30 rotate-45 animate-bounce"></div>
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-16">
          <div className="group cursor-pointer mb-8">
            <h1 className="text-7xl font-extrabold tracking-wider text-gray-900 group-hover:scale-110 transition-all duration-500 ease-out">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 to-cyan-800 group-hover:from-emerald-700 group-hover:to-cyan-700 transition-all duration-500">
                ARTVERSE
              </span>
            </h1>
            <div className="mt-4 h-1 w-0 bg-gradient-to-r from-emerald-800 to-cyan-800 group-hover:w-full transition-all duration-700 ease-out mx-auto"></div>
          </div>
          <p className="mt-8 text-xl text-gray-800 font-medium max-w-md mb-12">
            Join the world's most creative community
          </p>
          <div className="grid grid-cols-3 gap-8 w-full max-w-lg">
            <div className="text-center group">
              <div className="w-16 h-16 bg-emerald-400/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-400/30 transition-colors duration-300">
                <span className="text-emerald-800 text-2xl">🎨</span>
              </div>
              <h3 className="text-gray-900 font-semibold text-sm">Share</h3>
              <p className="text-gray-700 text-xs">Showcase your art</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-cyan-400/30 transition-colors duration-300">
                <span className="text-cyan-800 text-2xl">✨</span>
              </div>
              <h3 className="text-gray-900 font-semibold text-sm">Connect</h3>
              <p className="text-gray-700 text-xs">Meet artists</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-400/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-400/30 transition-colors duration-300">
                <span className="text-purple-800 text-2xl">🚀</span>
              </div>
              <h3 className="text-gray-900 font-semibold text-sm">Grow</h3>
              <p className="text-gray-700 text-xs">Advance your career</p>
            </div>
          </div>
          <div className="absolute top-20 right-20 w-3 h-3 bg-emerald-800 rounded-full animate-bounce"></div>
          <div className="absolute bottom-32 left-20 w-2 h-2 bg-cyan-800 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 right-16 w-1.5 h-1.5 bg-purple-800 rounded-full animate-ping"></div>
        </div>
      </div>
      {/* Right panel: form */}
      <div className="flex items-center justify-center bg-white md:col-span-3">
        <div className="w-full max-w-xl mx-auto p-8">
          {/* Card container */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-[#1c2a3a]">
                Get Started
              </h2>
              <p className="mt-2 text-gray-600">
                Create your account in minutes
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-center">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-center">
                  {success}
                </div>
              )}
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faUser} className="text-[#0b5d3b]" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-400 transition-all duration-300"
                    placeholder="Enter your username"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-[#0b5d3b]"
                    />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-400 transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faLock} className="text-[#0b5d3b]" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-400 transition-all duration-300"
                    placeholder="Create password"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      className="text-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex gap-4">
                    {["client", "artist"].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleChange(role)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-lg border transition-all duration-300 capitalize font-semibold shadow-sm
                          ${
                            formData.role === role
                              ? "border-emerald-500 bg-emerald-50 text-[#0b5d3b]"
                              : "border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        <FontAwesomeIcon icon={getRoleIcon(role)} />
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#0b5d3b] to-emerald-500 text-white font-semibold hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
              <div className="text-center text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-[#6b21a8] hover:opacity-90 transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </div>
          {/* End card container */}
        </div>
      </div>
    </div>
  );
};

export default Register;
