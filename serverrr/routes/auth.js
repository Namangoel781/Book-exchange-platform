import express from "express";
import { User } from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticateUser } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the Home Page!");
});

router.post("/", async (req, res) => {
  try {
    // Validate the request body
    const { email, password } = req.body;
    const validationError = validate({ email, password });
    if (validationError) {
      console.log("Validation error:", validationError);
      return res.status(400).send({ message: validationError });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found with email:", email);
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    // Compare the password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log("Invalid password for user with email:", email);
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    // Generate the authentication token
    const token = jwt.sign({ _id: user._id }, process.env.JWTPRIVATEKEY, {
      expiresIn: "1d",
    });

    // Set the token in an httpOnly cookie
    console.log("Setting cookie:", token);
    res.cookie("uid", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    console.log("User logged in successfully:", user.email);
    res.status(200).send({ message: "Logged in Successfully", token: token });
  } catch (error) {
    // Log the error for further investigation
    console.error("Server error:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

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

// router.get("/me/liked-books", authenticateUser, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).populate("likedBooks");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({ likedBooks: user.likedBooks });
//   } catch (error) {
//     console.error("Error fetching liked books:", error.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

const validate = ({ email, password }) => {
  if (!email || !password) {
    return "Email and Password are required.";
  }
  if (typeof email !== "string" || typeof password !== "string") {
    return "Invalid input type.";
  }
  return null; // No validation errors
};

export default router;
