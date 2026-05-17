const mongoose = require('mongoose');
const Service = require('./models/Service');
require('dotenv').config();

const services = [
  // Haircuts & Styling
  { name: 'Classic Haircut', description: 'A traditional haircut tailored to your style by our master barbers.', durationMinutes: 30, price: 35, imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=800' },
  { name: 'Signature Blowout', description: 'Voluminous, long-lasting blowout perfect for any event.', durationMinutes: 45, price: 50, imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800' },
  { name: 'Keratin Treatment', description: 'Smoothing treatment for frizz-free, silky hair lasting up to 3 months.', durationMinutes: 120, price: 180, imageUrl: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800' },
  { name: 'Bridal Updo', description: 'Elegant and intricate updo styling for your special day.', durationMinutes: 90, price: 120, imageUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80&w=800' },
  { name: 'Men\'s Fade & Style', description: 'Precision skin fade and styling with premium pomade.', durationMinutes: 40, price: 40, imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800' },
  
  // Coloring
  { name: 'Full Hair Coloring', description: 'Full hair coloring using premium, ammonia-free dyes for vibrant results.', durationMinutes: 120, price: 110, imageUrl: 'https://images.unsplash.com/photo-1605980776566-0486c3ac7617?auto=format&fit=crop&q=80&w=800' },
  { name: 'Balayage Highlights', description: 'Hand-painted natural looking highlights for a sun-kissed look.', durationMinutes: 150, price: 160, imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?auto=format&fit=crop&q=80&w=800' },
  { name: 'Root Touch Up', description: 'Targeted coloring to perfectly match and cover root growth.', durationMinutes: 60, price: 70, imageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=800' },
  { name: 'Color Correction', description: 'Expert correction of uneven or undesired hair tones.', durationMinutes: 180, price: 200, imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=800' },
  
  // Skincare & Spa
  { name: 'Premium Facial', description: 'Rejuvenating facial treatment using organic luxury products for glowing skin.', durationMinutes: 45, price: 65, imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800' },
  { name: 'Anti-Aging Therapy', description: 'Advanced facial therapy targeting fine lines and collagen production.', durationMinutes: 60, price: 95, imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800' },
  { name: 'Deep Tissue Massage', description: 'Therapeutic massage to relieve severe tension in the muscle and connective tissue.', durationMinutes: 60, price: 90, imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800' },
  { name: 'Hot Stone Massage', description: 'Relaxing massage using smooth, heated stones.', durationMinutes: 90, price: 110, imageUrl: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80&w=800' },
  
  // Grooming & Nails
  { name: 'Beard Trim & Shape', description: 'Expert beard trimming, shaping, and conditioning with hot towel service.', durationMinutes: 20, price: 25, imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800' },
  { name: 'Luxury Spa Manicure', description: 'Exfoliation, cuticle care, massage, and premium polish application.', durationMinutes: 45, price: 45, imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800' },
  { name: 'Luxury Spa Pedicure', description: 'Foot soak, scrub, callus removal, massage, and polish.', durationMinutes: 60, price: 60, imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?auto=format&fit=crop&q=80&w=800' },
  { name: 'Gel Polish Manicure', description: 'Long-lasting, chip-resistant gel polish applied to natural nails.', durationMinutes: 50, price: 55, imageUrl: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&q=80&w=800' },
  
  // Makeup
  { name: 'Event Makeup', description: 'Full face glamorous makeup for any special event.', durationMinutes: 60, price: 85, imageUrl: 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&q=80&w=800' },
  { name: 'Airbrush Makeup', description: 'Flawless, water-resistant airbrush foundation application.', durationMinutes: 75, price: 110, imageUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80&w=800' }
];

// Fallback to 127.0.0.1 or localhost
const URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/salon_db';

mongoose.connect(URI, {
  serverSelectionTimeoutMS: 5000 // Don't hang forever if DB is not running
})
  .then(async () => {
    console.log('MongoDB Connected successfully to', URI);
    await Service.deleteMany(); // Clear existing
    await Service.insertMany(services);
    console.log('Successfully seeded 19 services with images!');
    process.exit(0);
  })
  .catch(err => {
    console.error('ERROR: Could not connect to MongoDB.', err.message);
    console.error('Please make sure your local MongoDB Server is actually running.');
    process.exit(1);
  });
