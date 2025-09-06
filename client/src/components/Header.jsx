import React from "react";
import { useSelector } from "react-redux";
import PublicNavbar from "./publicNavbar";
import PrivateNavbar from "./PrivateNavbar";

const Header = () => {
  // Get auth status from Redux store
  const { user } = useSelector((state) => state.auth);

  // Check both Redux store and localStorage
  const isAuthenticated = React.useMemo(() => {
    if (user?.token) return true;
    const storedUser = localStorage.getItem("userInfo");
    return storedUser ? true : false;
  }, [user]);

  return (
    <header>{isAuthenticated ? <PrivateNavbar /> : <PublicNavbar />}</header>
  );
};

export default Header;
