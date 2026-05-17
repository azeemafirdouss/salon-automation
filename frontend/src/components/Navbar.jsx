import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div className="container flex justify-between items-center" style={{ height: '100%' }}>
        <Link to="/" style={styles.logo}>
          LUMIÈRE
        </Link>
        <div className="flex gap-8 items-center" style={{ fontSize: '0.9rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/book">Book Now</Link>
          {token ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={handleLogout} className="btn-outline" style={{ padding: '8px 20px', width: 'auto', fontSize: '0.8rem' }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '8px 20px', width: 'auto', fontSize: '0.8rem' }}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '80px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid var(--border-color)',
    zIndex: 1000,
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.8rem',
    fontWeight: 700,
    color: 'var(--primary-color)',
    letterSpacing: '2px',
  }
};

export default Navbar;
