import express from "express";
import { authenticateUser } from "../Middleware/authMiddleware.js";

import { User } from "../models/Users.js";

const router = express.Router();

// Route to get potential matches based on books owned and wanted
router.get("/", authenticateUser, async (req, res) => {
  const userId = req.user._id; // The logged-in user

  try {
    // Fetch the logged-in user's booksOwned and booksWanted
    const user = await User.findById(userId)
      .populate("booksOwned")
      .populate("wishlist");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract booksOwned and Wishlist
    const { booksOwned, wishlist } = user;

    if (!booksOwned || !wishlist) {
      return res.status(400).json({ message: "User has no books or wishlist" });
    }

    // Find users who own books that the current user wants
    const usersWithwishlist = await User.find({
      _id: { $ne: userId }, // Exclude the current user
      booksOwned: { $in: wishlist },
    })
      .populate("booksOwned")
      .populate("wishlist");

    // Find users who want books that the current user owns
    const usersWhoWantTYourBooks = await User.find({
      _id: { $ne: userId }, // Exclude the current user
      booksWanted: { $in: booksOwned },
    })
      .populate("booksOwned")
      .populate("wishlist");

    // Combine the two lists of users and remove duplicates
    const potentialMatches = [
      ...new Set([...usersWithwishlist, ...usersWhoWantTYourBooks]),
    ];

    // Respond with the list of matched users
    res.status(200).json({
      message: "Potential matches found",
      matches: potentialMatches,
    });
  } catch (error) {
    console.error("Error finding matches:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
