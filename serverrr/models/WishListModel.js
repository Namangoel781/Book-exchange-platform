import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  },
});

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;
