import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import "./index.css";
import { SavedIssuesProvider } from "./context/SavedIssuesContext";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <SavedIssuesProvider>
        <App />
      </SavedIssuesProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
