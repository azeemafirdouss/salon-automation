import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../api';

const Home = () => {
  const [reviews, setReviews] = useState([]);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsRes, staffRes] = await Promise.all([
          axios.get(`${API_BASE}/api/reviews`),
          axios.get(`${API_BASE}/api/auth/public/staff`)
        ]);
        setReviews(reviewsRes.data);
        setStaff(staffRes.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="animate-fade-in" style={{ marginTop: '-80px' }}>
      {/* Hero Section */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '80px',
        background: 'linear-gradient(to right, rgba(250, 249, 246, 0.9), rgba(250, 249, 246, 0.4)), url("https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container">
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '4.5rem', lineHeight: '1.1', marginBottom: '1.5rem' }}>
              Redefining <br/> <span style={{ color: 'var(--primary-color)', fontStyle: 'italic' }}>Elegance</span>
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
              Experience the pinnacle of grooming and beauty at Lumière. Our master stylists are dedicated to crafting your perfect look in an atmosphere of pure luxury.
            </p>
            <div className="flex gap-4">
              <Link to="/book" className="btn-primary" style={{ width: 'auto' }}>
                Book Appointment
              </Link>
              <Link to="/services" className="btn-outline" style={{ width: 'auto' }}>
                View Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Team Section */}
      <div style={{ padding: '6rem 0', backgroundColor: '#fff' }}>
        <div className="container">
          <div className="text-center mb-4">
            <h2 style={{ fontSize: '3rem', color: 'var(--secondary-color)' }}>Meet The Artists</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
              Our team of internationally trained professionals are here to bring your vision to life.
            </p>
          </div>
          {staff.length === 0 ? (
            <p className="text-center" style={{ color: 'var(--text-muted)' }}>No staff members assigned yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              {staff.map((member, index) => (
                <div key={member._id || index} style={{ textAlign: 'center' }}>
                  {/* Using placeholder images for dynamically added staff since we don't have an image upload yet */}
                  <img src={`https://ui-avatars.com/api/?name=${member.name}&background=111&color=fff&size=200`} alt={member.name} style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '4px', marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>{member.name}</h3>
                  <p style={{ color: 'var(--primary-color)', fontWeight: 500, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{member.role === 'staff' ? 'Professional' : member.role}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Testimonials Section */}
      <div style={{ padding: '6rem 0', backgroundColor: 'var(--bg-color)' }}>
        <div className="container">
          <div className="text-center mb-4">
            <h2 style={{ fontSize: '3rem', color: 'var(--secondary-color)' }}>Client Experiences</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
              Don't just take our word for it. Here is what our clients have to say about their time at Lumière.
            </p>
          </div>
          {reviews.length === 0 ? (
            <p className="text-center" style={{ color: 'var(--text-muted)' }}>Be the first to leave a review!</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {reviews.map(review => (
                <div key={review._id} className="premium-card">
                  <div style={{ color: 'var(--primary-color)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                  </div>
                  <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: '1.6', color: 'var(--secondary-color)' }}>
                    "{review.text}"
                  </p>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    — {review.customer?.name || 'Anonymous'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact & Hours Section */}
      <div style={{ padding: '6rem 0', backgroundColor: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--secondary-color)', marginBottom: '1.5rem' }}>Visit Us</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
                Located in the heart of the city, Lumière offers an oasis of calm. Walk-ins are welcome, but appointments are highly recommended to ensure our master stylists can accommodate you.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p><strong>Address:</strong> 123 Luxury Avenue, Beverly Hills, CA 90210</p>
                <p><strong>Phone:</strong> +1 (310) 555-0198</p>
                <p><strong>Email:</strong> hello@lumieresalon.com</p>
              </div>
            </div>
            <div>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--secondary-color)', marginBottom: '1.5rem' }}>Hours of Operation</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="flex justify-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <span>Monday - Friday</span>
                  <span style={{ fontWeight: '600' }}>9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <span>Saturday</span>
                  <span style={{ fontWeight: '600' }}>10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <span>Sunday</span>
                  <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Small banner below */}
      <div style={{ backgroundColor: 'var(--secondary-color)', color: 'white', padding: '4rem 0', textAlign: 'center' }}>
        <h2 style={{ color: 'white', marginBottom: '1rem' }}>Ready for your transformation?</h2>
        <Link to="/book" className="btn-primary" style={{ backgroundColor: 'white', color: 'var(--secondary-color)', border: 'none', width: 'auto', marginTop: '1rem' }}>
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default Home;
