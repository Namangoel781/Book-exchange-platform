import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Assuming you have these components in your project
// If not, you'll need to create them or use alternatives
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Link } from "react-router-dom";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://book-exchange-platform-5zk3.onrender.com/api/users",
        {
          firstName,
          lastName,
          email,
          password,
        }
      );
      navigate("/login");
      console.log(res.message);
      alert("Registration Successfull");
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
    // console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 to-background dark:from-primary/10 dark:to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-card dark:bg-gray-800 text-card-foreground dark:text-gray-100 rounded-lg shadow-xl p-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold">Create your account</h2>
          <p className="mt-2 text-sm text-muted-foreground dark:text-gray-400">
            Join us today and start your journey
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first-name" className="sr-only">
                  First Name
                </Label>
                <Input
                  id="first-name"
                  name="firstName"
                  type="text"
                  required
                  className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="last-name" className="sr-only">
                  Last Name
                </Label>
                <Input
                  id="last-name"
                  name="lastName"
                  type="text"
                  required
                  className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email-address" className="sr-only">
                Email address
              </Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="w-full pr-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOffIcon
                    className="h-5 w-5 text-gray-400 dark:text-gray-300"
                    aria-hidden="true"
                  />
                ) : (
                  <EyeIcon
                    className="h-5 w-5 text-gray-400 dark:text-gray-300"
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>
          </div>
          {error && <div className="text-rose-500 text-lg">{error}</div>}
          <div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Sign up
            </Button>
          </div>
        </form>

        <p className="mt-2 text-center text-sm text-muted-foreground dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:text-primary/80 dark:text-primary-foreground dark:hover:text-primary-foreground/90"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
