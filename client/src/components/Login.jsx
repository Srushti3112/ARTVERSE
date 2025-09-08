import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import * as Yup from "yup";
import { loginAPI } from "../services/userServices";
import { loginAction } from "../redux/slices/authSlice";

// Add custom CSS for slow spin animation
const style = document.createElement("style");
style.textContent = `
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 8s linear infinite;
  }
`;
document.head.appendChild(style);

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      setForgotPasswordMessage("Please enter your email address.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:10000/api/users/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          mode: "cors",
          body: JSON.stringify({ email: forgotPasswordEmail }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send reset email. Please try again.");
      }

      setForgotPasswordMessage("Password reset email sent successfully.");
    } catch (error) {
      setForgotPasswordMessage(
        error.message || "Failed to send reset email. Please try again."
      );
    }
  };

  const mutation = useMutation({
    mutationFn: loginAPI,
    onSuccess: (data) => {
      setSuccess("Login successful! Redirecting...");

      const userData = {
        token: data?.data?.token,
        id: data?.data?.id,
        email: data?.data?.email,
        username: data?.data?.username,
        role: data?.data?.role,
      };

      if (!userData.token) {
        setError("Invalid response from server. Please try again.");
        return;
      }

      dispatch(loginAction(userData));
      localStorage.setItem("userInfo", JSON.stringify(userData));

      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";

      setError(errorMessage);
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setError("");
      setSuccess("");
      mutation.mutate(values);
    },
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center ">
      <div className="absolute top-20 left-20 w-32 h-32 border border-emerald-800/30 rotate-45 animate-spin-slow"></div>
      <div className="absolute bottom-32 right-32 w-24 h-24 border border-cyan-800/30 rotate-12 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-purple-800/30 rotate-45 animate-bounce"></div>
      <div className="absolute top-20 right-20 w-3 h-3 bg-emerald-800 rounded-full animate-bounce"></div>
      <div className="absolute bottom-32 left-20 w-2 h-2 bg-cyan-800 rounded-full animate-pulse"></div>
      <div className="absolute top-1/2 right-16 w-1.5 h-1.5 bg-purple-800 rounded-full animate-ping"></div>
      <div className="w-full max-w-md mx-auto p-0">
        <div className="bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 ">
          {!isForgotPassword ? (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-extrabold text-[#1c2a3a] ">
                  Welcome Back
                </h2>
                <p className="mt-2 text-gray-600">
                  Sign in to continue your artistic journey
                </p>
              </div>

              <form onSubmit={formik.handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-lg bg-red-100 border border-red-300 text-red-700 text-center text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-4 rounded-lg bg-green-100 border border-green-300 text-green-700 text-center text-sm">
                    {success}
                  </div>
                )}
                {mutation.isPending && (
                  <div className="p-4 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-700 text-center text-sm">
                    Signing in...
                  </div>
                )}
                <div className="space-y-4">
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0b5d3b]"
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      {...formik.getFieldProps("email")}
                      disabled={mutation.isPending}
                      className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-400 transition-all duration-300"
                      placeholder="Enter your email"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faLock}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0b5d3b]"
                    />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      {...formik.getFieldProps("password")}
                      disabled={mutation.isPending}
                      className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-400 transition-all duration-300"
                      placeholder="Enter your password"
                    />
                    <div
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        className="text-gray-500"
                      />
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.password}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={mutation.isPending || !formik.isValid}
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#0b5d3b] to-emerald-500 text-white font-semibold hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? "Signing in..." : "Sign In"}
                </button>
                <div className="text-center text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-[#6b21a8] hover:underline"
                  >
                    Sign Up
                  </Link>
                </div>

                <div className="text-center text-gray-600 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="font-medium text-[#6b21a8] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-[#1c2a3a]">
                  Forgot Password
                </h2>
                <p className="mt-2 text-gray-600">
                  Enter your email to reset password
                </p>
              </div>
              <div className="space-y-6">
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0b5d3b]"
                  />
                  <input
                    type="email"
                    className="w-full pl-10 pr-3 py-3 bg-white/60 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-400 text-gray-900 placeholder-gray-400 shadow-sm transition-all"
                    placeholder="Enter your email address"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  />
                  {forgotPasswordMessage && (
                    <p className="mt-1 text-sm text-red-600">
                      {forgotPasswordMessage}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-500 text-white font-bold shadow-lg hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 transition-all duration-300"
                >
                  Send Reset Email
                </button>
                <div className="text-center text-gray-600 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(false)}
                    className="font-medium text-indigo-600 hover:underline"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
