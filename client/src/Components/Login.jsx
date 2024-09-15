import React, { useState, useContext, useEffect } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";

// Custom components (same as in SignupPage)
const Button = ({ children, ...props }) => (
  <button
    {...props}
    className="w-full px-4 py-2 bg-black text-white rounded hover:bg-stone-900"
  >
    {children}
  </button>
);

const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    ref={ref}
    {...props}
  />
));

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  />
));

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Starting login request...");
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Login response received:", response);

      if (response.status === 200) {
        // Store the token in localStorage
        console.log(response.data.token);
        login(response.data.token);

        console.log("Login successful, redirecting to home...");
        navigate("/");
      } else {
        console.log("Unexpected response status:", response.status);
        setError("Unexpected error occurred. Please try again.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      } else {
        console.error("Server error:", error);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/");
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 to-background dark:from-primary/10 dark:to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-card dark:bg-gray-800 text-card-foreground dark:text-gray-100 rounded-lg shadow-xl p-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold">Welcome back</h2>
          <p className="mt-2 text-sm text-muted-foreground dark:text-gray-400">
            Please sign in to your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Label htmlFor="email-address">Email address</Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full mt-1"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="w-full mt-1 pr-10"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6"
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

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* <Checkbox
                id="remember-me"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
              /> */}
              <Label htmlFor="remember-me" className="ml-2 block text-sm">
                Remember me
              </Label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-primary hover:text-primary/80 dark:text-primary-foreground dark:hover:text-primary-foreground/90"
              >
                Forgot your password?
              </a>
            </div>
          </div>
          {error && <div className="text-rose-500 text-lg">{error}</div>}
          <div>
            <Button type="submit">Sign in</Button>
          </div>
        </form>

        <p className="mt-2 text-center text-sm text-muted-foreground dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-primary hover:text-primary/80 dark:text-primary-foreground dark:hover:text-primary-foreground/90"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
