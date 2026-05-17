import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerDashboard from '../components/CustomerDashboard';
import AdminDashboard from '../components/AdminDashboard';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  if (!token) {
    navigate('/login');
    return null;
  }

  return (
    <div className="animate-fade-in" style={{ padding: '4rem 0' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.2rem' }}>Welcome, {user.name}</h2>
          <p style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
            Account Type: {user.role}
          </p>
        </div>
      </div>

      {user.role === 'customer' ? (
        <CustomerDashboard user={user} token={token} />
      ) : (
        <AdminDashboard user={user} token={token} />
      )}
    </div>
  );
};

export default Dashboard;
