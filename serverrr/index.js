import express from "express";
import cors from "cors";
import "dotenv/config";
import connection from "./db.js";
import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";
import bookRouter from "./routes/book.js";
import logoutRouter from "./routes/logout.js";
import matchRouter from "./routes/booksMatch.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 8000;
const app = express();

// Middleware

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

// Basic route
app.get("/", (req, res) => {
  console.log(req);
  return response.status(234).send("Welcome to MERNstack");
});

// Create a Book
// app.post("/books", async (req, res) => {
//   try {
//     const { title, author, publishedYear, genre, bookImg } = req.body;
//     if (!title || !author || !publishedYear || !genre || !bookImg) {
//       return res.status(400).send({
//         message:
//           "Send all required fields: title, author, publishedYear, genre, bookImg",
//       });
//     }
//     const newBook = {
//       title,
//       author,
//       publishedYear,
//       genre,
//       bookImg,
//     };

//     const book = await Book.create(newBook);

//     return res.status(201).send(book);
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send({ message: error.message });
//   }
// });

// Use Routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/books", bookRouter);
app.use("/api/auth", logoutRouter);
app.use("/matches", matchRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

// Connection
connection();

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
