import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../Components/ui/Card";
import { AuthContext } from "../Components/context/AuthContext";
import { Badge } from "../Components/ui/badge";
import Navbar from "../Components/Headers/Navbar";
import { Button } from "../Components/ui/button";

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchbook = async () => {
      try {
        const response = await axios.get(
          `https://book-exchange-platform-5zk3.onrender.com/books/${id}`
        );
        // console.log("Book details response", response.data);
        if (response.data.book && response.data) {
          setBook(response.data.book);
        } else {
          setBook(null);
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
        setError("Failed to fetch book");
        setBook(null);
      } finally {
        setLoading(false);
      }
    };
    fetchbook();
  }, [id]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://book-exchange-platform-5zk3.onrender.com/books/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      navigate("/"); // Redirect to the books list after successful deletion
    } catch (error) {
      setError("Error deleting the book");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!book) return <div>Book not found</div>;

  // Ensure user and book data are valid before accessing properties
  const isCreator = user && book && user._id === book.createdBy._id;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>{book.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img
                  src={book.bookImg}
                  alt={book.title}
                  width={300}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="flex flex-col ">
                <div className="space-y-4">
                  <p className="text-xl">
                    <span className="font-semibold">Author:</span> {book.author}
                  </p>
                  <div className="">
                    <p className="font-semibold text-lg">Genre:</p>
                    <Badge variant="secondary" className="ml-2">
                      {book.genre}
                    </Badge>
                  </div>
                  <p className="text-lg">
                    <span className="font-semibold">Published Year:</span>{" "}
                    {book.publishedYear}
                  </p>
                </div>
                {/* <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground"></p>
                </div> */}
                <div className="">
                  {isCreator && (
                    <Button
                      variant="default"
                      onClick={() => navigate(`/edit/${book._id}`)}
                    >
                      Edit
                    </Button>
                  )}
                  {isCreator && (
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded w-full mt-3"
                      variant="default"
                      onClick={() => navigate(`/delete/${book._id}`)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default BookDetails;
