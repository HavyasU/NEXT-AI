import React from "react";
import { doSignOut } from "../firebase/auth";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import ChatBox from "../components/ChatBox/ChatBox";
import Navbar from "../components/navbar/Navbar";
const Home = () => {
  const { userLoggedIn } = useAuth();
  return (
    <div>
      <Navbar />
      {!userLoggedIn && <Navigate to={"/login"} />}
      <ChatBox />
    </div>
  );
};

export default Home;
