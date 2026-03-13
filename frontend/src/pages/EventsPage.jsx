import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/events').then(res => setEvents(res.data));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Upcoming Events</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {events.map(event => (
          <div key={event.id} style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '1.5rem', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{event.title}</h2>
            <p style={{ color: '#666' }}>{event.venue}</p>
            <p style={{ color: '#1e40af', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '0.5rem' }}>${event.price}</p>
            <p style={{ color: '#999', fontSize: '0.875rem' }}>{event.availableSeats} seats left</p>
            <button
              onClick={() => navigate(`/book/${event.id}`)}
              style={{ marginTop: '1rem', background: '#1e40af', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%' }}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}