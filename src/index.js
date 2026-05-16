// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Global error handler to suppress Chrome extension errors
// This prevents "message port closed" errors from browser extensions
const originalError = console.error;
console.error = function (...args) {
  // Check if the error is a Chrome extension related error
  const errorMessage = args[0];
  if (
    typeof errorMessage === "string" &&
    (errorMessage.includes("message port closed") ||
      errorMessage.includes("content.js") ||
      errorMessage.includes("chrome.runtime"))
  ) {
    // Suppress extension-related errors
    return;
  }
  // Log all other errors normally
  originalError.apply(console, args);
};

// Handle uncaught promise rejections
window.addEventListener("unhandledrejection", function (event) {
  // Suppress extension-related promise rejections
  if (
    event.reason &&
    typeof event.reason === "string" &&
    (event.reason.includes("message port closed") ||
      event.reason.includes("content.js"))
  ) {
    event.preventDefault();
    return;
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
