import axios from "axios";

const BASE_URL = "https://artverse-4.onrender.com/api/users";

//! Login
export const loginAPI = async ({ email, password }) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/login`,
      { email, password },
      {
        withCredentials: true, // 🔑 Important for cookies / session
      }
    );
    console.log("Login API Response:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error("Login API Error:", error.response?.data || error); // Debug log
    throw error instanceof Error ? error : new Error("Failed to login");
  }
};

//! Register
export const registerAPI = async ({ email, password, username }) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/register`,
      { email, password, username },
      {
        withCredentials: true, // 🔑 Add here too
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to connect to server" };
  }
};

//! Profile
export const profileAPI = async (token) => {
  if (!token) {
    throw new Error("Authentication token is required");
  }

  try {
    console.log("Profile API Token:", token); // Debug log
    const response = await axios.get(`${BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true, // 🔑 Also add here
    });
    console.log("Profile API Response:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error("Profile API Error:", error.response?.data || error); // Debug log
    if (error.response?.status === 401) {
      throw { message: "Session expired. Please login again." };
    }
    throw error.response?.data || { message: "Failed to fetch profile" };
  }
};
