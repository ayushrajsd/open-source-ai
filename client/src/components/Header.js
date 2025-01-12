import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";
import { logoutUser } from "../api/user";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="app-header">
      <div className="app-header__logo">
        <h1>OpenSourceBuddy</h1>
      </div>
      <button className="app-header__menu-toggle" aria-label="Toggle menu">
        ☰
      </button>
      <nav className="app-header__nav">
        <NavLink to="/dashboard" className="nav-link" activeClassName="active">
          Dashboard
        </NavLink>
        <NavLink to="/explore" className="nav-link" activeClassName="active">
          Explore
        </NavLink>
        <NavLink
          to="/how-to-contribute"
          className="nav-link"
          activeClassName="active"
        >
          How to Contribute
        </NavLink>
      </nav>
      <button className="app-header__logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
};

export default Header;
