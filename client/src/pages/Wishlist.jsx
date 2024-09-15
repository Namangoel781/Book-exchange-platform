import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Components/context/AuthContext";
import Navbar from "../Components/Headers/Navbar";

const Wishlist = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const fetchWishlist = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:8000/books/${user._id}/wishlist`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setBooks(response.data.books);
        } catch (err) {
          console.error("Error fetching wishlist:", err);
          setError("Failed to fetch wishlist.");
        } finally {
          setLoading(false);
        }
      };

      fetchWishlist();
    }
  }, [user]);

  if (loading) {
    return <div className="text-center text-gray-800">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  if (!books.length) {
    return (
      <div className="text-center text-gray-600">No liked books found.</div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Wishlist List
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {books.map((book) => (
            <div
              className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 tansition-transform duration-200 w-7/1"
              key={book._id}
            >
              <img
                src={book.bookImg}
                alt={book.title}
                className="w-full h-64 object-cover"
              />

              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {book.title}
                </h2>
                <p className="text-gray-600">Author: {book.author}</p>
                <p className="text-gray-600">Published: {book.publishedYear}</p>
                <p className="text-gray-600">Genre: {book.genre}</p>
                {/* <button
            onClick={() => handleLike(book._id)}
            className="group flex items-center justify-center w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            aria-pressed={likedBooks.has(book._id)}
            aria-label={
              likedBooks.has(book._id) ? "Unlike book" : "Like book"
            }
          >
            <Heart
              className={`mr-2 transition-all duration-300 ease-in-out transform ${
                likedBooks.has(book._id)
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-gray-500 group-hover:scale-110"
              }`}
              size={20}
            />
            <span
              className={`transition-colors duration-300 ${
                likedBooks.has(book._id) ? "text-red-500" : "text-gray-700"
              }`}
            >
              {likedBooks.has(book._id) ? "Liked" : "Like"}
            </span>
          </button> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
