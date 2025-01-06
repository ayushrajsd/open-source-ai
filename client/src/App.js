import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import Preferences from "./components/Preferences";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import IssueDetail from "./components/IssueDetail";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      {/* <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> */}
      <main>
        <Routes>
          {/* <Route path="/" element={<Login />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/issues/:issueNumber" element={<IssueDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
