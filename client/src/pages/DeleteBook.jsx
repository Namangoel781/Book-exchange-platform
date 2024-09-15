import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DeleteBookPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/books/${id}`);
        if (response.data.book) {
          setBook(response.data.book);
        } else {
          setError("Book not found");
        }
      } catch (error) {
        setError("Error fetching book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      navigate("/"); // Redirect to the books list after successful deletion
    } catch (error) {
      setError("Error deleting the book");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!book) return <p>Book not found</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Delete Book</h1>
        <p className="text-lg mb-4">
          Are you sure you want to delete the following book?
        </p>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Title:</h2>
          <p>{book.title}</p>
          <h2 className="text-xl font-semibold mt-2">Author:</h2>
          <p>{book.author}</p>
        </div>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Delete
        </button>
        <button
          onClick={() => navigate(-1)} // Go back to the previous page
          className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteBookPage;
