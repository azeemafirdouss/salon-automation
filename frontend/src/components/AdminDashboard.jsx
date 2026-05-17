import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = ({ user, token }) => {
  const [appointments, setAppointments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Add Staff Form State
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState('');

  const formatPhone = (value) => {
    let digits = value.replace(/\D/g, '');
    if (!digits.startsWith('91')) digits = '91' + digits.replace(/^91/, '');
    digits = digits.slice(0, 12);
    if (digits.length <= 2) return '+' + digits;
    if (digits.length <= 7) return '+' + digits.slice(0, 2) + ' ' + digits.slice(2);
    return '+' + digits.slice(0, 2) + ' ' + digits.slice(2, 7) + ' ' + digits.slice(7);
  };

  const validateStaffForm = (data) => {
    const errs = {};
    if (!data.name.trim() || data.name.trim().length < 3) errs.name = 'Name must be at least 3 characters.';
    if (!/^[a-zA-Z\s]+$/.test(data.name)) errs.name = 'Name can only contain letters and spaces.';
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'Enter a valid email address.';
    const digits = data.phone.replace(/\D/g, '');
    if (digits.length !== 12 || !digits.startsWith('91')) errs.phone = 'Enter a valid Indian number (e.g. +91 98765 43210).';
    if (!data.password || data.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(data.password)) errs.password = (errs.password || '') + ' Must include uppercase letter.';
    if (!/[0-9]/.test(data.password)) errs.password = (errs.password || '') + ' Must include a number.';
    return errs;
  };

  useEffect(() => {
    fetchAppointments();
    if (user.role === 'admin') fetchStaff();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/staff', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaff(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${appointmentId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(appointments.map(app => 
        app._id === appointmentId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setFormSuccess('');
    const errs = validateStaffForm(formData);
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;
    try {
      await axios.post('http://localhost:5000/api/auth/add-staff', {
        ...formData,
        phone: formData.phone.replace(/\D/g, '')
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormSuccess('Staff member added successfully!');
      setFormData({ name: '', email: '', password: '', phone: '' });
      setFormErrors({});
      fetchStaff();
      setTimeout(() => setFormSuccess(''), 3000);
    } catch (err) {
      setFormErrors({ server: err.response?.data?.message || 'Error adding staff' });
    }
  };

  const handleRemoveStaff = async (id) => {
    if (window.confirm("Are you sure you want to remove this staff member?")) {
      try {
        await axios.delete(`http://localhost:5000/api/auth/staff/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStaff(staff.filter(member => member._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Error removing staff');
      }
    }
  };

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab('bookings')}
          className={activeTab === 'bookings' ? "btn-primary" : "btn-outline"}
        >
          Booking Overview
        </button>
        {user.role === 'admin' && (
          <button 
            onClick={() => setActiveTab('staff')}
            className={activeTab === 'staff' ? "btn-primary" : "btn-outline"}
          >
            Staff Management
          </button>
        )}
      </div>

      {activeTab === 'bookings' && (
        <div className="premium-card">
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>All Appointments</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {appointments.map(app => (
              <div key={app._id} style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', borderLeft: '4px solid var(--primary-color)' }}>
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--secondary-color)' }}>
                      {app.service?.name || 'Service'}
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      <strong>Date:</strong> {new Date(app.date).toLocaleDateString()} at {app.timeSlot}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      <strong>Client:</strong> {app.customer?.name} ({app.customer?.email}) - {app.customer?.phone}
                    </p>
                  </div>
                  <div>
                    <select 
                      value={app.status} 
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      className="input-field"
                      style={{ padding: '8px 12px', marginBottom: 0, width: 'auto', fontSize: '0.85rem' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'staff' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="premium-card">
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Staff Directory</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {staff.map(member => (
                <div key={member._id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ marginBottom: '0.2rem' }}>{member.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{member.email} | {member.phone}</p>
                  </div>
                  <button 
                    onClick={() => handleRemoveStaff(member._id)}
                    style={{ color: 'red', background: 'transparent', border: '1px solid red', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="premium-card">
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Add New Staff</h3>
            {formSuccess && <div style={{ color: '#059669', marginBottom: '1rem', padding: '10px', backgroundColor: '#ecfdf5', borderRadius: '4px' }}>{formSuccess}</div>}
            {formErrors.server && <div style={{ color: 'red', marginBottom: '1rem', padding: '10px', backgroundColor: '#fff5f5', borderRadius: '4px' }}>{formErrors.server}</div>}
            <form onSubmit={handleAddStaff} className="flex flex-col" noValidate>
              <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Full Name</label>
              <input type="text" className="input-field" style={{ border: formErrors.name ? '1.5px solid red' : '' }} placeholder="e.g. Azeema Firdous" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              {formErrors.name && <p style={{ color: 'red', fontSize: '0.78rem', marginTop: '-10px', marginBottom: '8px' }}>{formErrors.name}</p>}
              
              <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Email</label>
              <input type="email" className="input-field" style={{ border: formErrors.email ? '1.5px solid red' : '' }} placeholder="staff@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              {formErrors.email && <p style={{ color: 'red', fontSize: '0.78rem', marginTop: '-10px', marginBottom: '8px' }}>{formErrors.email}</p>}
              
              <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Phone Number</label>
              <input type="tel" className="input-field" style={{ border: formErrors.phone ? '1.5px solid red' : '' }} placeholder="+91 98765 43210" value={formData.phone} onChange={(e) => setFormData({...formData, phone: formatPhone(e.target.value)})} />
              {formErrors.phone && <p style={{ color: 'red', fontSize: '0.78rem', marginTop: '-10px', marginBottom: '8px' }}>{formErrors.phone}</p>}
              
              <label style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Password</label>
              <input type="password" className="input-field" style={{ border: formErrors.password ? '1.5px solid red' : '' }} placeholder="Min 8 chars, 1 uppercase, 1 number" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
              {formErrors.password && <p style={{ color: 'red', fontSize: '0.78rem', marginTop: '-10px', marginBottom: '8px' }}>{formErrors.password}</p>}
              
              <button type="submit" className="btn-primary mt-2">Create Staff Account</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
