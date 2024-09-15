import { useState, useEffect, useContext } from "react";
import { NavButton } from "../ui/NavButton";
import { Button } from "../ui/button";
import { Heart, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Component() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, logout, setIsAuthenticated } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage

        if (token) {
          const response = await axios.get(
            "http://localhost:8000/api/auth/validate-session",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true, // Important to include cookies with the request
            }
          );
          if (response.status === 200 && response.data.user) {
            setUserName(response.data.user.firstName); // Assuming the user's name is stored under `user.firstName`
          } else {
            setUserName("");
          }
        } else {
          if (isAuthenticated) {
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserName("");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    } else {
      if (!loading) {
        navigate("/login");
      }
    }
  }, [isAuthenticated, navigate]);

  return (
    <nav className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="">
              <img
                className="h-44"
                src="https://i.pinimg.com/originals/95/f8/58/95f8588d6469a16271ea2d2fad419d00.png"
                alt=""
              />
            </Link>
          </div>
          <div className="hidden md:block w-4/5">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavButton variant="ghost" asChild>
                <Link to="/">Home</Link>
              </NavButton>
              <NavButton variant="ghost" asChild>
                <Link to="/addbook">Add Books</Link>
              </NavButton>
              <NavButton variant="ghost" asChild>
                <Link to="/matches">Matchmaking</Link>
              </NavButton>
              <NavButton variant="ghost" asChild>
                <Link to="/wishlist">Wishlist</Link>
              </NavButton>
              <div className="text-gray-800 font-semibold">
                {loading ? (
                  <Button variant="default">
                    <Link to="/login">Login</Link>
                  </Button>
                ) : userName ? (
                  `${userName}`
                ) : (
                  "Welcome!"
                )}
              </div>
              {isAuthenticated && (
                <Button variant="default" onClick={logout}>
                  Logout
                </Button>
              )}
            </div>
          </div>
          <div className="md:hidden flex">
            <NavButton variant="ghost" className="w-full justify-start" asChild>
              <Link href="/wishlist">
                <Heart className="h-5 w-5 mr-2" />
              </Link>
            </NavButton>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavButton variant="ghost" className="w-full justify-start" asChild>
              <Link href="/">Home</Link>
            </NavButton>
            <NavButton variant="ghost" className="w-full justify-start" asChild>
              <Link href="/books">Discover Books</Link>
            </NavButton>
            <NavButton variant="ghost" className="w-full justify-start" asChild>
              <Link href="/exchange">Matchmaking</Link>
            </NavButton>
            <NavButton variant="ghost" className="w-full justify-start" asChild>
              <Link href="/wishlist">Wishlist</Link>
            </NavButton>

            {isAuthenticated && (
              <Button variant="default" onClick={logout}>
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
