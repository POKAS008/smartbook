import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get('/bookings/user/1').then(res => setBookings(res.data));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>My Bookings</h1>
      {bookings.length === 0 && <p>No bookings yet.</p>}
      {bookings.map(booking => (
        <div key={booking.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', maxWidth: '500px' }}>
          <h2 style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{booking.event.title}</h2>
          <p>{booking.event.venue}</p>
          <p>Seats: {booking.seatsBooked}</p>
          <p style={{ color: '#1e40af', fontWeight: 'bold' }}>Total: ${booking.totalPrice}</p>
          <span style={{ background: '#dcfce7', color: '#16a34a', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem' }}>
            {booking.status}
          </span>
        </div>
      ))}
    </div>
  );
}