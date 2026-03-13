import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../api/axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminPage() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', venue: '', totalSeats: '', availableSeats: '', price: '', category: '', eventDate: '' });
  const [message, setMessage] = useState('');

  useEffect(() => { loadEvents(); }, []);

  const loadEvents = () => {
    api.get('/events').then(res => setEvents(res.data));
  };

  const handleCreate = () => {
    api.post('/events', { ...form, totalSeats: Number(form.totalSeats), availableSeats: Number(form.availableSeats), price: Number(form.price) })
      .then(() => { setMessage('✅ Event created!'); loadEvents(); setForm({ title: '', venue: '', totalSeats: '', availableSeats: '', price: '', category: '', eventDate: '' }); })
      .catch(() => setMessage('❌ Failed to create event.'));
  };

  const handleDelete = (id) => {
    api.delete(`/events/${id}`).then(() => { setMessage('✅ Event deleted!'); loadEvents(); });
  };

  const chartData = {
    labels: events.map(e => e.title + ' #' + e.id),
    datasets: [{
      label: 'Available Seats',
      data: events.map(e => e.availableSeats),
      backgroundColor: '#1e40af',
    }]
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Admin Dashboard</h1>

      {/* Create Event Form */}
      <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', maxWidth: '600px' }}>
        <h2 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Create New Event</h2>
        {['title', 'venue', 'category', 'totalSeats', 'availableSeats', 'price'].map(field => (
          <input
            key={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={e => setForm({ ...form, [field]: e.target.value })}
            style={{ display: 'block', width: '100%', padding: '0.5rem', marginBottom: '0.75rem', border: '1px solid #ccc', borderRadius: '6px', boxSizing: 'border-box' }}
          />
        ))}
        <input
          type="datetime-local"
          value={form.eventDate}
          onChange={e => setForm({ ...form, eventDate: e.target.value })}
          style={{ display: 'block', width: '100%', padding: '0.5rem', marginBottom: '0.75rem', border: '1px solid #ccc', borderRadius: '6px', boxSizing: 'border-box' }}
        />
        <button
          onClick={handleCreate}
          style={{ background: '#1e40af', color: 'white', padding: '0.75rem 2rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }}
        >
          Create Event
        </button>
        {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
      </div>

      {/* Chart */}
      <div style={{ maxWidth: '700px', marginBottom: '2rem' }}>
        <h2 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Seats Overview</h2>
        <Bar data={chartData} />
      </div>

      {/* Events Table */}
      <h2 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>All Events</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', maxWidth: '800px' }}>
        <thead>
          <tr style={{ background: '#1e40af', color: 'white' }}>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Title</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Venue</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Price</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Seats</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '0.75rem' }}>{event.title}</td>
              <td style={{ padding: '0.75rem' }}>{event.venue}</td>
              <td style={{ padding: '0.75rem' }}>${event.price}</td>
              <td style={{ padding: '0.75rem' }}>{event.availableSeats}</td>
              <td style={{ padding: '0.75rem' }}>
                <button
                  onClick={() => handleDelete(event.id)}
                  style={{ background: '#dc2626', color: 'white', padding: '0.25rem 0.75rem', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}