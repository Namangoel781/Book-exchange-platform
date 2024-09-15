import express from "express";
import { authenticateUser } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/logout", authenticateUser, async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("uid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    console.log("User logged out successfully:", req.user.email);
    return res.status(200).send({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

export default router;
