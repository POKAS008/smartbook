import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get(`/events/${id}`).then(res => setEvent(res.data));
  }, [id]);

  const handleBooking = () => {
    api.post('/bookings', { eventId: id, userId: 1, seats })
      .then(() => {
        setMessage('✅ Booking confirmed!');
        setTimeout(() => navigate('/my-bookings'), 2000);
      })
      .catch(() => setMessage('❌ Booking failed. Try again.'));
  };

  if (!event) return <p style={{ padding: '2rem' }}>Loading...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{event.title}</h1>
      <p style={{ color: '#666' }}>{event.venue}</p>
      <p style={{ fontSize: '1.5rem', color: '#1e40af', fontWeight: 'bold' }}>${event.price}</p>
      <p>{event.availableSeats} seats available</p>

      <div style={{ marginTop: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Number of Seats:</label>
        <input
          type="number"
          min="1"
          max={event.availableSeats}
          value={seats}
          onChange={e => setSeats(e.target.value)}
          style={{ padding: '0.5rem', width: '100px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
        Total: ${(event.price * seats).toFixed(2)}
      </p>

      <button
        onClick={handleBooking}
        style={{ marginTop: '1rem', background: '#1e40af', color: 'white', padding: '0.75rem 2rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }}
      >
        Confirm Booking
      </button>

      {message && <p style={{ marginTop: '1rem', fontSize: '1.2rem' }}>{message}</p>}
    </div>
  );
}