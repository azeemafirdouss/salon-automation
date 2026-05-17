import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import Services from './pages/Services';

// Full-screen pages that should NOT be wrapped in the container
const FULLSCREEN_ROUTES = ['/login', '/register', '/forgot-password', '/book'];

const AppContent = () => {
  const location = useLocation();
  const isFullscreen = FULLSCREEN_ROUTES.includes(location.pathname);

  return (
    <>
      <Navbar />
      {isFullscreen ? (
        // Full-screen pages: no container, no padding
        <div style={{ paddingTop: '80px' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/book" element={<Booking />} />
          </Routes>
        </div>
      ) : (
        // Normal pages: inside container with padding
        <div className="container" style={{ paddingTop: '80px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      )}
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
