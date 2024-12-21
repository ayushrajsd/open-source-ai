import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import axiosInstance from "../api"; // For logout functionality

function Header() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/api/user"); // Fetch user data
        setUsername(response.data.username);
      } catch (error) {
        console.log("User not logged in");
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/logout");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header
      className="bg-blue-900 text-white shadow-md py-4 px-6"
      style={{
        backgroundColor: "#004080",
      }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Open Source Buddy
        </Link>
        <nav>
          {username ? (
            <div className="flex items-center space-x-4">
              <span>Welcome, {username}!</span>
              <Button type="default" danger onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/auth/github">
              <Button
                style={{
                  backgroundColor: "#007BFF",
                  borderColor: "#007BFF",
                  color: "#FFF",
                }}
                type="primary"
              >
                Login with GitHub
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
