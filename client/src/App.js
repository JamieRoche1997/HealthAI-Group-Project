// App.js
import React from "react";
import "./styles.css";
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/home';
import About from './pages/About/about';
import Contact from './pages/Contact/contact';
import Patients from "./pages/Patients/patients";
import Profile from "./pages/Profile/profile";
import Reports from "./pages/Reports/reports";
import Header from "./Components/Header/header.jsx";
// import Footer from "./Components/Footer/footer.jsx";
import { Login } from "./pages/Login/login.jsx";
import { Register } from "./pages/Login/registration.jsx";

function App() {
  return (
      <div className="App">
        <Header />
        <div className="Content">
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/patients' element={<Patients />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/reports' element={<Reports />} />
          </Routes>
        </div>
        {/* <Footer /> */}
      </div>
  );
}

export default App;
