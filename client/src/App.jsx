import React from "react";
import "./index.css";
import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useScroll, motion } from "framer-motion";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Profile from "./components/profile.jsx";
import PublicNavbar from "./components/publicNavbar.jsx";
import PrivateNavbar from "./components/PrivateNavbar.jsx";
import HomePage from "./components/HomePage.jsx";
import GetStarted from "./components/GetStarted.jsx";
import ArtistProfileForm from "./components/ArtistProfileForm.jsx";
import Explore from "./components/Explore.jsx";

const AppContent = () => {
  const userData = useSelector((state) => state?.auth?.user);
  console.log(userData);

  const location = useLocation();

  // Render navbar only on homepage
  const renderNavbar = () => {
    if (location.pathname === "/") {
      if (userData) {
        return <PrivateNavbar />; // Show PrivateNavbar when user is logged in
      }
      return <PublicNavbar />; // Show PublicNavbar when user is not logged in
    }
    return null; // No navbar on other pages
  };

  return (
    <div className="App min-h-screen">
      {renderNavbar()}

      <main className={location.pathname === "/" ? "pt-16 sm:pt-20" : "pt-0"}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:artistId" element={<Profile />} />
          <Route path="/Explore" element={<Explore />} />
          <Route path="/ArtistProfileForm" element={<ArtistProfileForm />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
