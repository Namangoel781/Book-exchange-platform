import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../Components/ui/Card";
import { Input } from "../Components/ui/input";
import { Button } from "../Components/ui/button";
import { Label } from "../Components/ui/label";
import Navbar from "../Components/Headers/Navbar";

const Select = React.forwardRef(({ children, ...props }, ref) => (
  <select ref={ref} {...props}>
    {children}
  </select>
));
Select.displayName = "Select";

export default function CreateBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [genre, setGenre] = useState("");
  const [bookImg, setBookImg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //   const handleInputChange = (e) => {
  //     const { name, value } = e.target;
  //     setBookData((prevData) => ({
  //       ...prevData,
  //       [name]: value,
  //     }));
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "https://book-exchange-platform-5zk3.onrender.com/books",
        {
          title,
          author,
          publishedYear,
          genre,
          bookImg,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/");
    } catch (error) {
      console.error(
        "Error creating book:",
        error.response ? error.response.data : error.message
      );
      setError(
        "Failed to create book" +
          (error.response?.data?.message || "Please try again.")
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create New Book</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Book Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter book title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  name="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter author name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Select
                  id="genre"
                  name="genre"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  required
                  className="w-full h-10 rounded-md border border-input"
                >
                  <option value="">Select a genre</option>
                  <option value="fiction">Fiction</option>
                  <option value="non-fiction">Non-Fiction</option>
                  <option value="mystery">Mystery</option>
                  <option value="sci-fi">Science Fiction</option>
                  <option value="fantasy">Fantasy</option>
                  <option value="biography">Biography</option>
                  <option value="biography">Comedy</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Book Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={bookImg}
                  onChange={(e) => setBookImg(e.target.value)}
                  placeholder="Enter image URL"
                  type="url"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publishedYear">Published Year</Label>
                <Input
                  id="publishedYear"
                  name="publishedYear"
                  value={publishedYear}
                  onChange={(e) => setPublishedYear(e.target.value)}
                  placeholder="Enter published year"
                  type="number"
                  min="1000"
                  max={new Date().getFullYear()}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Create Book
              </Button>
            </form>
            {error && <p>{error}</p>}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
