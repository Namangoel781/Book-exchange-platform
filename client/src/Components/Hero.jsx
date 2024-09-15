import React, { useEffect } from "react";
import Navbar from "../Components/Headers/Navbar";
import BookList from "../pages/BookList";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      // if (!token) {
      //   navigate("/login");
      // }
    };
    checkSession();
  }, []);
  return (
    <>
      <Navbar />
      <BookList />
    </>
  );
};

export default Hero;
