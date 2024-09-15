// authMiddleware.js
import jwt from "jsonwebtoken";
import { User } from "../models/Users.js";

export const authenticateUser = async (req, res, next) => {
  try {
    console.log("Request Headers:", req.headers);
    const token =
      req.cookies.uid || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided, please authenticate" });
    }

    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);

    const user = await User.findById(decoded._id);

    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach the user object to the request object
    req.token = token;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Please authenticate" });
  }
};
