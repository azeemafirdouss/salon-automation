import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CustomerDashboard = ({ user, token }) => {
  const [appointments, setAppointments] = useState([]);
  const [review, setReview] = useState({ rating: 5, text: '' });
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/bookings/my-appointments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAppointments();
  }, [token]);

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await axios.delete(`http://localhost:5000/api/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(appointments.filter(app => app._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Error cancelling appointment');
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/reviews', review, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviewMsg('Thank you for your feedback!');
      setReview({ rating: 5, text: '' });
      setTimeout(() => setReviewMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting review');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Your Appointments</h3>
        <Link to="/book" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>+ New Booking</Link>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-8">
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>You have no upcoming appointments.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {appointments.map(app => (
            <div key={app._id} style={{ 
              padding: '1.5rem', 
              border: '1px solid var(--border-color)', 
              borderRadius: '4px',
              borderLeft: `4px solid ${app.status === 'confirmed' ? '#10b981' : app.status === 'pending' ? '#f59e0b' : 'var(--text-muted)'}`
            }}>
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--secondary-color)' }}>
                    {app.service?.name || 'Service Removed'}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    <strong>Date:</strong> {new Date(app.date).toLocaleDateString()} at {app.timeSlot}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <span style={{ 
                    padding: '6px 16px', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    background: app.status === 'confirmed' ? '#ecfdf5' : app.status === 'pending' ? '#fef3c7' : '#f3f4f6',
                    color: app.status === 'confirmed' ? '#059669' : app.status === 'pending' ? '#d97706' : '#4b5563',
                  }}>
                    {app.status}
                  </span>
                  
                  {app.status === 'pending' && (
                    <button 
                      onClick={() => handleCancel(app._id)}
                      style={{ color: 'red', border: '1px solid red', background: 'transparent', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leave a Review Section */}
      <div className="premium-card mt-8" style={{ marginTop: '3rem' }}>
        <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
          Leave a Review
        </h3>
        {reviewMsg && <div style={{ color: '#059669', marginBottom: '1rem', padding: '10px', backgroundColor: '#ecfdf5', borderRadius: '4px' }}>{reviewMsg}</div>}
        <form onSubmit={handleReviewSubmit} className="flex flex-col">
          <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Rating (1-5)</label>
          <select 
            className="input-field" 
            value={review.rating} 
            onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Very Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Terrible</option>
          </select>
          
          <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Your Experience</label>
          <textarea 
            className="input-field" 
            rows="4" 
            value={review.text} 
            onChange={(e) => setReview({ ...review, text: e.target.value })} 
            required
            placeholder="Tell us about your visit..."
          ></textarea>
          
          <button type="submit" className="btn-primary mt-2">Submit Review</button>
        </form>
      </div>
    </div>
  );
};

export default CustomerDashboard;
