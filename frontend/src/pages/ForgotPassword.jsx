import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // Step 1: email, Step 2: OTP + new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) return setError('Password must be at least 6 characters');
    if (newPassword !== confirmPassword) return setError('Passwords do not match');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
        email,
        otp,
        newPassword
      });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', margin: '-20px' }}>
      {/* Left Image */}
      <div style={{
        flex: 1,
        backgroundImage: 'url("https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        minHeight: '100vh',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom right, rgba(0,0,0,0.5), rgba(0,0,0,0.2))',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '3rem'
        }}>
          <h2 style={{ color: 'white', fontSize: '2.2rem', marginBottom: '0.5rem' }}>Lumière Salon</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>Your beauty, our passion.</p>
        </div>
      </div>

      {/* Right Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 3rem', backgroundColor: 'var(--bg-color)' }}>
        <div style={{ maxWidth: '420px', width: '100%' }}>

          {/* Step Indicator */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', alignItems: 'center' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: step >= 1 ? 'var(--secondary-color)' : 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>1</div>
            <div style={{ flex: 1, height: '2px', backgroundColor: step >= 2 ? 'var(--secondary-color)' : 'var(--border-color)', transition: 'background-color 0.3s' }}></div>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: step >= 2 ? 'var(--secondary-color)' : 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>2</div>
          </div>

          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>
            {step === 1 ? 'Forgot Password' : 'Enter Your Code'}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            {step === 1 ? 'Enter your email to receive a 6-digit OTP code.' : `A code was sent to ${email}. Enter it below.`}
          </p>

          {error && <div style={{ color: 'red', marginBottom: '1.5rem', padding: '10px 14px', border: '1px solid red', borderRadius: '6px', backgroundColor: '#fff5f5', fontSize: '0.9rem' }}>{error}</div>}
          {message && step === 1 && <div style={{ color: '#059669', marginBottom: '1.5rem', padding: '10px 14px', border: '1px solid #34d399', borderRadius: '6px', backgroundColor: '#ecfdf5', fontSize: '0.9rem' }}>{message}</div>}

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="flex flex-col">
              <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary mt-4">Send OTP Code</button>
            </form>
          )}

          {/* Step 2: OTP + New Password */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="flex flex-col">
              {message && <div style={{ color: '#059669', marginBottom: '1rem', padding: '10px 14px', border: '1px solid #34d399', borderRadius: '6px', backgroundColor: '#ecfdf5', fontSize: '0.9rem' }}>{message}</div>}
              
              <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>6-Digit OTP Code</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. 123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
                style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '8px' }}
              />

              <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '15px', top: '14px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button type="submit" className="btn-primary mt-4">Reset Password</button>
              <button
                type="button"
                onClick={() => { setStep(1); setError(''); setOtp(''); setNewPassword(''); setConfirmPassword(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginTop: '1rem', textDecoration: 'underline', fontSize: '0.85rem' }}
              >
                ← Go back, resend code
              </button>
            </form>
          )}

          <p className="text-center" style={{ color: 'var(--text-muted)', marginTop: '2rem', fontSize: '0.9rem' }}>
            Remembered your password? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
