import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { AuthContext } from "../Components/context/AuthContext";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [likedBooks, setLikedBooks] = useState(new Set());
  const { user } = useContext(AuthContext);

  const fetchBooksAndLikedBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/books", {
        // withCredentials: true,
      });
      const { data } = response;
      setBooks(data.data);

      if (user) {
        const likedBookResponse = await axios.get(
          `http://localhost:8000/books/${user._id}/wishlist`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const { data: likedBookData } = likedBookResponse;
        if (Array.isArray(likedBookData)) {
          const likedBookIds = likedBookData.map((book) => book._id);
          setLikedBooks(new Set(likedBookIds));
        } else {
          console.warn(
            "Expected an array of liked books but got:",
            likedBookData
          );
          setLikedBooks(new Set());
        }
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooksAndLikedBooks();
  }, [user]);

  const handleLike = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8000/books/wishlist/${bookId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check the response data
      if (response.data.success) {
        setLikedBooks((prevLikedBooks) => [...prevLikedBooks, bookId]);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    console.error(error);
    setError("Failed to fetch books or like book. Please try again later.");
  };

  if (loading) {
    return <div className="text-center text-gray-800">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  if (!Array.isArray(books) || books.length === 0) {
    return <div className="text-center text-gray-600">No books available.</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Book List
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {books.map((book) => (
          <div
            className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 tansition-transform duration-200 w-7/1"
            key={book._id}
          >
            <Link to={`/${book._id}`}>
              <img
                src={book.bookImg}
                alt={book.title}
                className="w-full h-64 object-cover"
              />
            </Link>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {book.title}
              </h2>
              <p className="text-gray-600">Author: {book.author}</p>
              <p className="text-gray-600">Published: {book.publishedYear}</p>
              <p className="text-gray-600">Genre: {book.genre}</p>
              <p className="text-gray-600">Email: {book.createdBy.email}</p>
              <button
                onClick={() => handleLike(book._id)}
                className="group flex items-center justify-center w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                style={{
                  backgroundColor: likedBooks.has(book._id)
                    ? "#F87171"
                    : "#F3F4F6", // Red for liked, gray for not liked
                }}
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
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
