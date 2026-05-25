import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../api';

const Booking = () => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({ serviceId: '', date: '', timeSlot: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/services`);
        setServices(res.data);
      } catch (err) {
        console.error('Failed to fetch services', err);
      }
    };
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await axios.post(`${API_BASE}/api/bookings`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Appointment booked successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="animate-fade-in split-layout" style={{ margin: '-20px' }}>
      <div className="split-form">
        <div style={{ maxWidth: '500px', width: '100%', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Book Your Visit</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Select a service and time for your premium experience.</p>
          
          {error && <div style={{ color: 'red', marginBottom: '1.5rem', padding: '10px', border: '1px solid red', borderRadius: '4px', backgroundColor: '#fff5f5' }}>{error}</div>}
          {success && <div style={{ color: '#10b981', marginBottom: '1.5rem', padding: '10px', border: '1px solid #10b981', borderRadius: '4px', backgroundColor: '#ecfdf5' }}>{success}</div>}
          
          <form onSubmit={handleSubmit} className="flex flex-col">
            <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Service</label>
            <select 
              className="input-field"
              value={formData.serviceId}
              onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
              required
            >
              <option value="">-- Choose a Service --</option>
              {services.map(s => (
                <option key={s._id} value={s._id}>{s.name} - ${s.price}</option>
              ))}
            </select>

            <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</label>
            <input 
              type="date" 
              className="input-field"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />

            <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Time Slot</label>
            <select 
              className="input-field"
              value={formData.timeSlot}
              onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
              required
            >
              <option value="">-- Choose a Time --</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="1:00 PM">1:00 PM</option>
              <option value="3:00 PM">3:00 PM</option>
              <option value="5:00 PM">5:00 PM</option>
            </select>

            <button type="submit" className="btn-primary mt-4">Confirm Appointment</button>
          </form>
        </div>
      </div>
      <div className="split-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80")' }}></div>
    </div>
  );
};

export default Booking;
