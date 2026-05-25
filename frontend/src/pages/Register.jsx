import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { API_BASE } from '../api';

// ---- Validation Helpers ----
const validateName = (name) => {
  if (!name.trim()) return 'Full name is required.';
  if (name.trim().length < 3) return 'Name must be at least 3 characters.';
  if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces.';
  return '';
};

const validateEmail = (email) => {
  if (!email.trim()) return 'Email is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
  return '';
};

const validatePhone = (phone) => {
  const digits = phone.replace(/\D/g, '');
  if (!phone.trim()) return 'Phone number is required.';
  if (digits.length !== 12 || !digits.startsWith('91')) return 'Enter a valid Indian number (e.g. +91 98765 43210).';
  return '';
};

const validatePassword = (password) => {
  if (!password) return 'Password is required.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';
  return '';
};

// Formats the raw digits (12 digits starting with 91) as the user types
const formatIndianPhone = (value) => {
  // Keep only digits
  let digits = value.replace(/\D/g, '');
  // Auto-prefix with 91 if needed
  if (!digits.startsWith('91')) {
    digits = '91' + digits.replace(/^91/, '');
  }
  // Limit to 12 digits total (91 + 10 digit number)
  digits = digits.slice(0, 12);
  // Format: +91 XXXXX XXXXX
  if (digits.length <= 2) return '+' + digits;
  if (digits.length <= 7) return '+' + digits.slice(0, 2) + ' ' + digits.slice(2);
  return '+' + digits.slice(0, 2) + ' ' + digits.slice(2, 7) + ' ' + digits.slice(7);
};

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'phone') {
      newValue = formatIndianPhone(value);
    }

    setFormData({ ...formData, [name]: newValue });

    // Live validation
    let fieldError = '';
    if (name === 'name') fieldError = validateName(newValue);
    if (name === 'email') fieldError = validateEmail(newValue);
    if (name === 'phone') fieldError = validatePhone(newValue.replace(/\D/g, ''));
    if (name === 'password') fieldError = validatePassword(newValue);
    setErrors(prev => ({ ...prev, [name]: fieldError }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setServerError('');

    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone.replace(/\D/g, '')),
      password: validatePassword(formData.password),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(e => e)) return; // Stop if any errors

    try {
      // Send raw digits to backend
      await axios.post(`${API_BASE}/api/auth/register`, {
        ...formData,
        phone: formData.phone.replace(/\D/g, '') // send pure digits
      });
      navigate('/login');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Check your database connection.');
    }
  };

  const inputStyle = (field) => ({
    border: errors[field] ? '1.5px solid red' : '',
  });

  const errorStyle = { color: 'red', fontSize: '0.78rem', marginTop: '-10px', marginBottom: '8px' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', margin: '-20px' }}>
      {/* Left Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 3rem', backgroundColor: 'var(--bg-color)' }}>
        <div style={{ maxWidth: '420px', width: '100%' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Join Us</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Create an account to book your appointments.</p>
          
          {serverError && <div style={{ color: 'red', marginBottom: '1.5rem', padding: '10px', border: '1px solid red', borderRadius: '4px', backgroundColor: '#fff5f5' }}>{serverError}</div>}
          
          <form onSubmit={handleRegister} className="flex flex-col" noValidate>
            {/* Name */}
            <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
            <input type="text" name="name" className="input-field" value={formData.name} onChange={handleChange} style={inputStyle('name')} placeholder="e.g. Azeema Firdous" required />
            {errors.name && <p style={errorStyle}>{errors.name}</p>}

            {/* Email */}
            <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
            <input type="email" name="email" className="input-field" value={formData.email} onChange={handleChange} style={inputStyle('email')} placeholder="you@example.com" required />
            {errors.email && <p style={errorStyle}>{errors.email}</p>}

            {/* Phone */}
            <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number</label>
            <input type="tel" name="phone" className="input-field" value={formData.phone} onChange={handleChange} style={inputStyle('phone')} placeholder="+91 98765 43210" required />
            {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
            
            {/* Password */}
            <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="input-field"
                value={formData.password}
                onChange={handleChange}
                style={inputStyle('password')}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
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
            {errors.password && <p style={errorStyle}>{errors.password}</p>}

            {/* Password strength hint */}
            {formData.password && (
              <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem', marginTop: '-5px' }}>
                {['Length 8+', 'Uppercase', 'Number'].map((rule, i) => {
                  const passed = i === 0 ? formData.password.length >= 8 : i === 1 ? /[A-Z]/.test(formData.password) : /[0-9]/.test(formData.password);
                  return <span key={rule} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', backgroundColor: passed ? '#ecfdf5' : '#fef2f2', color: passed ? '#059669' : '#dc2626' }}>{rule} {passed ? '✓' : '✗'}</span>;
                })}
              </div>
            )}
            
            <button type="submit" className="btn-primary mt-2">Create Account</button>
          </form>
          
          <p className="text-center mt-4" style={{ color: 'var(--text-muted)', marginTop: '2rem' }}>
            Already a member? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </div>

      {/* Right Image */}
      <div style={{
        flex: 1,
        backgroundImage: 'url("https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        minHeight: '100vh',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom left, rgba(0,0,0,0.5), rgba(0,0,0,0.15))',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '3rem'
        }}>
          <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '0.5rem' }}>Your Luxury Experience Awaits</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>Premium grooming, tailored for you.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
