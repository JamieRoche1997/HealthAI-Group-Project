import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./App"; // Import your main component here
import { createRoot } from "react-dom/client";


const root = document.getElementById("root");

// Create a root instance
const rootInstance = createRoot(root);

// Use the root instance to render your app
rootInstance.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
