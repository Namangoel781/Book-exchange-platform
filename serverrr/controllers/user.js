import User from "../models/Users.js";
import setUser from "../routes/auth.js";
import bcrypt from "bcrypt";

export const handleUserSignup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return res.redirect("/"); // Redirect or render success page
  } catch (error) {
    console.log("Error during signup:", error);
    return res.status(500).render("signup", {
      error: "An error occured during signup. Please try again.",
    });
  }
};

export const handleUserLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).render("login", {
        error: "Invalid Username or Password",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).render("login", {
        error: "Invalid Username or Password",
      });
    }

    const token = setUser(user);

    res.cookie("uid", token, { httpOnly: true });

    return res.redirect("/");
  } catch (error) {
    console.log("Error during login", error);
    return res.status(500).render("login", {
      error: "An error occured during login. Please try again.",
    });
  }
};
