import express from "express";
import { User } from "../models/Users.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/validate-session", async (req, res) => {
  try {
    const token = req.cookies.uid; // Access the token from cookies
    if (!token) {
      return res.status(401).send({ message: "No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).send({ message: "Invalid token" });
    }

    // Return user info if the token is valid
    res.status(200).send({ message: "Session is valid", user });
  } catch (error) {
    console.error("Session validation failed", error);
    res.status(401).send({ message: "Session expired or invalid" });
  }
});

export default router;
