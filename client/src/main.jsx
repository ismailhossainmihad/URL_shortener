import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Entry point for the React application.  It renders the App component into
// the #root div defined in index.html.

createRoot(document.getElementById("root")).render(<App />);