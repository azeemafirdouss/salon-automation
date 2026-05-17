import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const categories = ['All', 'Hair', 'Coloring', 'Skincare & Spa', 'Nails & Grooming', 'Makeup'];

const categorizeService = (name) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('color') || lowerName.includes('balayage') || lowerName.includes('touch up')) return 'Coloring';
  if (lowerName.includes('facial') || lowerName.includes('massage') || lowerName.includes('anti-aging')) return 'Skincare & Spa';
  if (lowerName.includes('manicure') || lowerName.includes('pedicure') || lowerName.includes('beard')) return 'Nails & Grooming';
  if (lowerName.includes('makeup')) return 'Makeup';
  return 'Hair'; // Default fallback
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/services');
        setServices(res.data);
      } catch (err) {
        console.error('Failed to fetch services', err);
        setError('Unable to load services. Please check your database connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = activeCategory === 'All' 
    ? services 
    : services.filter(s => categorizeService(s.name) === activeCategory);

  return (
    <div className="animate-fade-in" style={{ padding: '4rem 0' }}>
      <div className="text-center mb-4">
        <h2 style={{ fontSize: '3rem' }}>Our Menu</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Curated treatments designed to elevate your natural beauty.
        </p>
      </div>

      {/* Category Filter Menu */}
      {!loading && !error && (
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '2rem', marginBottom: '3rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? 'var(--secondary-color)' : 'transparent',
                color: activeCategory === cat ? 'white' : 'var(--secondary-color)',
                border: '1px solid var(--secondary-color)',
                padding: '8px 20px',
                borderRadius: '30px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: activeCategory === cat ? '600' : '400',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center" style={{ marginTop: '4rem', color: 'var(--primary-color)' }}>Loading our luxurious menu...</div>
      ) : error ? (
        <div className="text-center" style={{ marginTop: '4rem', color: 'red' }}>{error}</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {filteredServices.map(service => (
            <div key={service._id} className="premium-card flex flex-col" style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
              {service.imageUrl ? (
                <div style={{ 
                  height: '200px', 
                  backgroundImage: `url(${service.imageUrl})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center',
                  borderTopLeftRadius: '4px',
                  borderTopRightRadius: '4px'
                }}></div>
              ) : (
                <div style={{ height: '200px', backgroundColor: '#f3f4f6' }}></div>
              )}
              
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div className="flex justify-between items-start mb-2">
                  <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{service.name}</h3>
                  <span style={{ fontSize: '0.75rem', padding: '4px 8px', backgroundColor: '#f3f4f6', borderRadius: '4px', color: 'var(--text-muted)' }}>
                    {categorizeService(service.name)}
                  </span>
                </div>
                
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', flexGrow: 1, fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {service.description || 'No description available.'}
                </p>
                <div className="flex justify-between items-center mb-4" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ fontWeight: '600', fontSize: '1.2rem', color: 'var(--secondary-color)' }}>${service.price}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {service.durationMinutes} min
                  </span>
                </div>
                <Link to="/book" className="btn-outline text-center">Book Now</Link>
              </div>
            </div>
          ))}
          {filteredServices.length === 0 && (
            <p className="text-center" style={{ width: '100%', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
              No services found in this category.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Services;
