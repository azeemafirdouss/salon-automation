import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { API_BASE } from '../api';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      const res = await axios.post(`${API_BASE}/api/auth/reset-password/${token}`, { password });
      setSuccess(res.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="animate-fade-in split-layout" style={{ margin: '-20px' }}>
      <div className="split-form">
        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>New Password</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Create a secure new password for your account.</p>
          
          {error && <div style={{ color: 'red', marginBottom: '1.5rem', padding: '10px', border: '1px solid red', borderRadius: '4px', backgroundColor: '#fff5f5' }}>{error}</div>}
          {success && <div style={{ color: '#059669', marginBottom: '1.5rem', padding: '10px', border: '1px solid #34d399', borderRadius: '4px', backgroundColor: '#ecfdf5' }}>{success}</div>}
          
          <form onSubmit={handleSubmit} className="flex flex-col">
            <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>New Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '15px', top: '15px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confirm Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              className="input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            
            <button type="submit" className="btn-primary mt-4">Save Password</button>
          </form>
        </div>
      </div>
      <div className="split-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?auto=format&fit=crop&q=80")' }}></div>
    </div>
  );
};

export default ResetPassword;
