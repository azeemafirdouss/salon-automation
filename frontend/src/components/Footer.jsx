import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--secondary-color)', color: 'white', padding: '4rem 0 2rem 0', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '3rem', marginBottom: '2rem' }}>
          
          <div style={{ flex: '1 1 300px' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>LUMIÈRE</h3>
            <p style={{ color: '#ccc', lineHeight: '1.6', maxWidth: '300px' }}>
              Elevating the standard of grooming and beauty. Experience premium services tailored exactly to your unique style.
            </p>
          </div>
          
          <div style={{ flex: '1 1 200px' }}>
            <h4 style={{ color: 'white', marginBottom: '1.2rem', fontSize: '1.1rem' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <Link to="/" style={{ color: '#ccc', transition: 'color 0.3s' }}>Home</Link>
              <Link to="/services" style={{ color: '#ccc', transition: 'color 0.3s' }}>Services</Link>
              <Link to="/book" style={{ color: '#ccc', transition: 'color 0.3s' }}>Book Appointment</Link>
            </div>
          </div>
          
          <div style={{ flex: '1 1 200px' }}>
            <h4 style={{ color: 'white', marginBottom: '1.2rem', fontSize: '1.1rem' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', color: '#ccc' }}>
              <p>123 Luxury Avenue</p>
              <p>Beverly Hills, CA 90210</p>
              <p>+1 (310) 555-0198</p>
              <p>hello@lumieresalon.com</p>
            </div>
          </div>
          
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', color: '#888', fontSize: '0.9rem' }}>
          <p>&copy; {new Date().getFullYear()} Lumière Salon. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
