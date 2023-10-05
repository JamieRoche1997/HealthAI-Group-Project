import React from "react";
import "./styles.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/home";
import About from "./pages/About/about";
import Contact from "./pages/Contact/contact";
import Patients from "./pages/Patients/patients";
import Profile from "./pages/Profile/profile";
import Reports from "./pages/Reports/reports";
import Dashboard from "./pages/Dashboard/dashboard";
import Predict from "./pages/Predict/predict";
import LLM from "./pages/LLM/llm";
import Header from "./Components/Header/header.jsx";
import AuthHeader from "./Components/Header/authHeader"
import { Login } from "./pages/Login/login.jsx";
import { SignUp } from "./pages/Login/signup.jsx";
import AuthObserver from "./Components/authObserver";

function App() {
  const location = useLocation();

  // Define paths where you want to show the header
  const showHeaderPaths = ["/", "/about", "/contact", "/login", "signup"];
  const showAuthHeaderPaths = ["/profile", "/reports", "/patients", "/dashboard", "/predict", "/llm"]

  // Check if the current location should show the header
  const shouldShowHeader = showHeaderPaths.includes(location.pathname);
  const shouldShowAuthHeader = showAuthHeaderPaths.includes(location.pathname)

  return (
    <div className="App">
      {shouldShowHeader && <Header />}
      {shouldShowAuthHeader && <AuthHeader />}
      <div className="Content">
        <AuthObserver>
          {(user) => (
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/predict" element={<Predict />} />
              <Route path="/llm" element={<LLM />} />
              <Route path="/Dashboard" element={<Dashboard />} />
            </Routes>
          )}
        </AuthObserver>
      </div>
    </div>
  );
}

export default App;
