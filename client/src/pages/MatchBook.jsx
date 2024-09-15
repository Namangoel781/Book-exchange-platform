import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../Components/ui/Card";
import { Badge } from "../Components/ui/badge";
import Navbar from "../Components/Headers/Navbar";
import { Button } from "../Components/ui/button";
import axios from "axios";

const MatchBook = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Function to fetch matched books
  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming you store JWT token in localStorage
      const response = await axios.get("http://localhost:8000/matches", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMatches(response.data.matches);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError("Failed to load matches.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  if (loading) {
    return <p>Loading matches...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Matched Books
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.length === 0 ? (
            <p>No matches found.</p>
          ) : (
            matches.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-200"
              >
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {user.firstName}
                  </h2>
                  <h3 className="text-lg font-semibold text-gray-700 mt-4">
                    Ownes these Books
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    {user.booksOwned.map((book) => (
                      <div
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                        key={book._id}
                      >
                        <img
                          src={book.bookImg}
                          alt={book.title}
                          className="w-full h-64 object-cover"
                        />
                        <div className="p-4">
                          <h4 className="text-lg font-semibold text-gray-800">
                            {book.title}
                          </h4>
                          <p className="text-gray-600">Author: {book.author}</p>
                          <p className="text-gray-600">
                            Published: {book.publishedYear}
                          </p>
                          <p className="text-gray-600">Genre: {book.genre}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-700 mt-4">
                    Wishlist
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    {user.wishlist.map((book) => (
                      <div
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                        key={book._id}
                      >
                        <img
                          src={book.bookImg}
                          alt={book.title}
                          className="w-full h-64 object-cover"
                        />
                        <div className="p-4">
                          <h4 className="text-lg font-semibold text-gray-800">
                            {book.title}
                          </h4>
                          <p className="text-gray-600">Author: {book.author}</p>
                          <p className="text-gray-600">
                            Published: {book.publishedYear}
                          </p>
                          <p className="text-gray-600">Genre: {book.genre}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default MatchBook;
