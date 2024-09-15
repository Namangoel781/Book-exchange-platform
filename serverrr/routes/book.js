import express from "express";
import { Book } from "../models/bookModel.js";
import { authenticateUser } from "../Middleware/authMiddleware.js";
import { User } from "../models/Users.js";
import mongoose from "mongoose";
// import Wishlist from "../models/WishListModel.js";

const router = express.Router();

// Get all Books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().populate("createdBy", "name email");

    return res.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Get by Id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id).populate("createdBy", "name email");

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({ book });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

//  Create Book
router.post("/", authenticateUser, async (req, res) => {
  console.log(res.user);
  const { title, author, publishedYear, genre, bookImg } = req.body;
  try {
    //console.log(req.user);
    // const createdBy = req.user._id;
    // console.log(createdBy);
    if (!title || !author || !publishedYear || !genre || !bookImg) {
      return res.status(400).json({
        message:
          "Send all required fields: title, author, publishedYear, genre, bookImg",
      });
    }

    const createdBy = req.user?._id; // Make sure authenticateUser sets this correctly

    if (!createdBy) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const newBook = {
      title,
      author,
      publishedYear,
      genre,
      bookImg,
      createdBy,
    };

    const book = await Book.create(newBook);

    // Now, add the created book to the user's `booksOwned`
    const user = await User.findById(createdBy);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the book to the `booksOwned` array
    user.booksOwned.push(book._id);
    await user.save();

    return res.status(201).json({
      message: "Book created and added to your owned list",
      book,
      booksOwned: user.booksOwned,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// update Book
router.put("/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { title, author, publishedYear, genre, bookImg } = req.body;

  try {
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Inauthorized action" });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.publishedYear = publishedYear || book.publishedYear;
    book.genre = genre || book.genre;
    book.bookImg = bookImg || book.bookImg;

    const updatedBook = await book.save();

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete Book
router.delete("/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add to Wishlist
// router.put("/wishlist", authenticateUser, async (req, res) => {
//   const { bookId } = req.params;
//   const userId = req.user._id;
//   console.log(userId);
//   console.log(bookId);

//   try {
//     // Validate bookId

//     // if (!bookId) {
//     //   return res.status(400).json({ message: "Book ID is required" });
//     // }
//     // // Find the book
//     // const book = await Book.findById(bookId);
//     // if (!book) {
//     //   return res.status(404).json({ message: "Book not found" });
//     // }
//     // // Find the user
//     // const user = await User.findById(userId);
//     // if (!user) {
//     //   return res.status(404).json({ message: "User not found" });
//     // }
//     // // Check if the book is already in the wishlist
//     // // if (user.likedBooks.includes(bookId)) {
//     // //   // Remove from wishlist
//     // //   user.likedBooks = user.likedBooks.filter(
//     // //     (id) => id.toString() !== bookId.toString()
//     // //   );
//     // // } else {
//     // //   // Add to wishlist
//     // //   user.likedBooks.push(bookId);
//     // // }
//     // // await user.save();
//     // const newWishlist = {
//     //   userId,
//     //   bookId,
//     // };
//     // const wishlist = await Wishlist.create(newWishlist);
//     // res.status(200).json({
//     //   message: "Wishlist updated successfully",
//     //   refId: wishlist._id,
//     // });
//     const user = User.findById(userId);
//     const alreadyadded = user.wishlist.find((id) => id.toString() === bookId);
//     if (alreadyadded) {
//       let user = User.findByIdAndUpdate(
//         _id,
//         {
//           $pull: { wishlist: bookId },
//         },
//         {
//           new: true,
//         }
//       );
//       res.json(user);
//     } else {
//       let user = await User.findByIdAndUpdate(
//         _id,
//         {
//           $push: { wishlist: bookId },
//         },
//         {
//           new: true,
//         }
//       );
//       res.json(user);
//     }
//   } catch (error) {
//     console.error("Error updating wishlist:", error.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

router.put("/wishlist/:bookId", authenticateUser, async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user._id;

  try {
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if wishlist is an array
    if (!Array.isArray(user.wishlist)) {
      console.log("Wishlist was not an array, resetting...");
      user.wishlist = [];
    }

    // Check if the book is already in the wishlist
    const alreadyAdded = user.wishlist.some((id) => id.toString() === bookId);

    if (alreadyAdded) {
      // Remove from wishlist
      user.wishlist = user.wishlist.filter((id) => id.toString() !== bookId);
    } else {
      // Add to wishlist
      // console.log("Adding book to wishlist:", bookId);
      user.wishlist.push(new mongoose.Types.ObjectId(bookId));
    }

    await user.save();

    res.status(200).json({
      message: alreadyAdded
        ? "Book removed from wishlist"
        : "Book added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Error updating wishlist:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET route to fetch user's wishlist
router.get("/:userId/wishlist", authenticateUser, async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user
    const user = await User.findById(userId).populate("wishlist");
    console.log("User Data:", user);

    // Select only the wishlist field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure wishlist is properly populated
    if (!user.wishlist || !Array.isArray(user.wishlist)) {
      return res
        .status(500)
        .json({ message: "Wishlist data format is incorrect" });
    }

    // Send the wishlist books
    res.status(200).json({
      message: "Wishlist fetched successfully",
      books: user.wishlist,
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
