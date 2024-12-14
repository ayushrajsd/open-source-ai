import React from "react";
import { Link } from "react-router-dom"; // For navigation links
import { BulbOutlined, BulbFilled } from "@ant-design/icons"; // Import icons

function Header({ darkMode, toggleDarkMode }) {
  return (
    <header className="w-full bg-gray-800 text-gray-100 p-4 flex justify-between items-center sticky top-0 shadow-md z-50">
      <div className="flex items-center space-x-3">
        {/* Logo */}
        <img
          src="https://via.placeholder.com/40"
          alt="Logo"
          className="w-10 h-10 rounded-full"
        />
        {/* App Name */}
        <h1 className="text-2xl font-bold text-blue-400">Open Source Helper</h1>
      </div>

      <nav className="flex items-center space-x-6">
        {/* Navigation Links */}
        <Link to="/" className="hover:text-blue-400">
          Dashboard
        </Link>
        <Link to="/explore" className="hover:text-blue-400">
          Explore
        </Link>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition"
        >
          {darkMode ? (
            <BulbFilled className="text-yellow-400 text-xl" />
          ) : (
            <BulbOutlined className="text-blue-300 text-xl" />
          )}
        </button>
      </nav>
    </header>
  );
}

export default Header;
