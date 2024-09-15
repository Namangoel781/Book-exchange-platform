import React from "react";
import "./index.css";
import Login from "./Components/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./Components/Signup";
import Hero from "./Components/Hero";
import CreateBook from "./pages/CreateBook";
import BookDetails from "./pages/BookDetails";
import UpdateBook from "./pages/UpdateBook";
import DeleteBookPage from "./pages/DeleteBook";
import Wishlist from "./pages/Wishlist";
import MatchBook from "./pages/MatchBook";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/addbook" element={<CreateBook />} />
        <Route path="/:id" element={<BookDetails />} />
        <Route path="/edit/:id" element={<UpdateBook />} />
        <Route path="/delete/:id" element={<DeleteBookPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/matches" element={<MatchBook />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
