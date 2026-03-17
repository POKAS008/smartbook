import { useEffect, useState } from 'react';
import api from '../api/axios';

const FIELDS = [
  { key: 'title',         label: 'Event Title',  type: 'text'           },
  { key: 'venue',         label: 'Venue',         type: 'text'           },
  { key: 'eventDate',     label: 'Date',          type: 'datetime-local' },
  { key: 'price',         label: 'Price ($)',     type: 'number'         },
  { key: 'totalSeats',    label: 'Total Seats',   type: 'number'         },
  { key: 'category',      label: 'Category',      type: 'select'         }, // Changed to select
];

const CATEGORY_THEMES = {
  'music':       { grad: 'linear-gradient(90deg,#f87171,#fb923c)', emoji: '🎵' },
  'sports':      { grad: 'linear-gradient(90deg,#fb923c,#facc15)', emoji: '⚽' },
  'food':        { grad: 'linear-gradient(90deg,#facc15,#4ade80)', emoji: '🍕' },
  'art':         { grad: 'linear-gradient(90deg,#4ade80,#60a5fa)', emoji: '🎨' },
  'tech':        { grad: 'linear-gradient(90deg,#60a5fa,#a78bfa)', emoji: '💻' },
  'theater':     { grad: 'linear-gradient(90deg,#a78bfa,#f87171)', emoji: '🎭' },
  'fashion':     { grad: 'linear-gradient(90deg,#f87171,#fb923c)', emoji: '👗' },
  'concert':     { grad: 'linear-gradient(90deg,#60a5fa,#4ade80)', emoji: '🎤' },
  'graduation':  { grad: 'linear-gradient(90deg,#818cf8,#c084fc)', emoji: '🎓' },
  'nature':      { grad: 'linear-gradient(90deg,#34d399,#059669)', emoji: '🌿' },
  'dance':       { grad: 'linear-gradient(90deg,#f472b6,#ec4899)', emoji: '💃' },
  'awards':      { grad: 'linear-gradient(90deg,#fbbf24,#f59e0b)', emoji: '🏆' },
  'swimming':    { grad: 'linear-gradient(90deg,#38bdf8,#0284c7)', emoji: '🏊' },
  'charity':     { grad: 'linear-gradient(90deg,#fb7185,#e11d48)', emoji: '❤️' },
  'tennis':      { grad: 'linear-gradient(90deg,#a3e635,#65a30d)', emoji: '🎾' },
  'networking':  { grad: 'linear-gradient(90deg,#c084fc,#7c3aed)', emoji: '🔮' },
  'festival':    { grad: 'linear-gradient(90deg,#fdba74,#ea580c)', emoji: '🎪' },
  'beach':       { grad: 'linear-gradient(90deg,#67e8f9,#0891b2)', emoji: '🌊' },
  'golf':        { grad: 'linear-gradient(90deg,#86efac,#15803d)', emoji: '⛳' },
  'boxing':      { grad: 'linear-gradient(90deg,#fca5a5,#b91c1c)', emoji: '🥊' },
  'conference':  { grad: 'linear-gradient(90deg,#94a3b8,#475569)', emoji: '🤝' },
  'workshop':    { grad: 'linear-gradient(90deg,#fb923c,#ea580c)', emoji: '🛠️' },
  'movie':       { grad: 'linear-gradient(90deg,#4ade80,#059669)', emoji: '🎬' },
  'gaming':      { grad: 'linear-gradient(90deg,#f472b6,#a78bfa)', emoji: '🎮' },
  'fitness':     { grad: 'linear-gradient(90deg,#fb7185,#f43f5e)', emoji: '💪' },
  'coding':      { grad: 'linear-gradient(90deg,#38bdf8,#3b82f6)', emoji: '💻' },
  'travel':      { grad: 'linear-gradient(90deg,#2dd4bf,#0d9488)', emoji: '✈️' },
  'photography': { grad: 'linear-gradient(90deg,#9ca3af,#4b5563)', emoji: '📷' },
  'science':     { grad: 'linear-gradient(90deg,#818cf8,#4f46e5)', emoji: '🔬' },
  'holiday':     { grad: 'linear-gradient(90deg,#f87171,#dc2626)', emoji: '🎄' },
  'business':    { grad: 'linear-gradient(90deg,#64748b,#1e293b)', emoji: '💼' },
  'wedding':     { grad: 'linear-gradient(90deg,#fda4af,#fb7185)', emoji: '💍' },
  'party':       { grad: 'linear-gradient(90deg,#fde047,#eab308)', emoji: '🥳' },
  'health':      { grad: 'linear-gradient(90deg,#a7f3d0,#10b981)', emoji: '🏥' },
  'academic':    { grad: 'linear-gradient(90deg,#c4b5fd,#7c3aed)', emoji: '📚' },
  'yoga':        { grad: 'linear-gradient(90deg,#ddd6fe,#8b5cf6)', emoji: '🧘' },
  'default':     { grad: 'linear-gradient(90deg,#a78bfa,#60a5fa)', emoji: '🎉' },
};

const empty = { title: '', venue: '', eventDate: '', price: '', totalSeats: '', category: '' };

export default function AdminPage() {
  const [events,  setEvents]  = useState([]);
  const [form,    setForm]    = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [tab,     setTab]     = useState('events');

  const fetchEvents = () => {
    api.get('/events').then(res => {
      setEvents(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleAdd = async () => {
    setSaving(true);
    try {
      const total = parseInt(form.totalSeats);
      await api.post('/events', {
        ...form,
        price: parseFloat(form.price),
        totalSeats: total,
        availableSeats: total, // Properly initializing for your Java backend
      });
      setForm(empty);
      setSuccess(true);
      fetchEvents();
      setTimeout(() => { setSuccess(false); setTab('events'); }, 1500);
    } catch (err) {
      alert('Failed to add event.');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return;
    await api.delete(`/events/${id}`);
    fetchEvents();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f8' }}>
      {/* Header Section */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '2.5rem 2rem 0', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ height: '4px', width: '40px', borderRadius: '999px', background: 'linear-gradient(90deg,#0ea5e9,#7c3aed)', marginBottom: '0.75rem' }} />
            <h1 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#111', letterSpacing: '-0.02em' }}>Admin Panel</h1>
            <p style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '0.2rem' }}>Manage your events</p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[
              { label: 'Total Events', value: events.length, color: '#0ea5e9', bg: '#e0f2fe' },
              { label: 'Total Seats',  value: events.reduce((a, e) => a + (e.totalSeats || 0), 0), color: '#7c3aed', bg: '#ede9fe' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} style={{ background: bg, borderRadius: '14px', padding: '0.75rem 1.25rem', textAlign: 'center', minWidth: '100px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color }}>{value}</div>
                <div style={{ fontSize: '0.7rem', color: '#aaa', fontWeight: '600', marginTop: '1px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0' }}>
          {[{ key: 'events', label: '📋 Events' }, { key: 'add', label: '＋ Add Event' }].map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)} style={{ padding: '0.65rem 1.4rem', border: 'none', background: 'transparent', fontWeight: tab === key ? '800' : '500', fontSize: '0.88rem', color: tab === key ? '#111' : '#aaa', cursor: 'pointer', borderBottom: tab === key ? '2px solid #111' : '2px solid transparent', transition: 'all 0.15s' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
        {tab === 'events' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: '1.1rem' }}>
            {events.map((event) => {
              const theme = CATEGORY_THEMES[event.category?.toLowerCase()] || CATEGORY_THEMES['default'];
              // This is the CRITICAL fix for the seat display
              const available = (event.availableSeats === null || event.availableSeats === undefined) 
                                ? event.totalSeats 
                                : event.availableSeats;
              
              return (
                <div key={event.id} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ height: '6px', background: theme.grad }} />
                  <div style={{ padding: '1.2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '1.8rem' }}>{theme.emoji}</div>
                      <button onClick={() => handleDelete(event.id)} style={{ background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '8px', padding: '0.3rem 0.7rem', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>Delete</button>
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#111', marginBottom: '0.5rem' }}>{event.title}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.28rem', marginBottom: '0.9rem' }}>
                      <span style={{ fontSize: '0.78rem', color: '#888' }}>📍 {event.venue}</span>
                      <span style={{ fontSize: '0.78rem', color: '#888' }}>📅 {new Date(event.eventDate).toLocaleDateString()}</span>
                      <span style={{ fontSize: '0.78rem', color: '#888' }}>🪑 {available} / {event.totalSeats} seats</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #f5f5f5' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#111' }}>${event.price}</span>
                      <span style={{ background: '#f3f4f6', color: '#555', padding: '0.18rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '700' }}>{event.category || 'Event'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'add' && (
          <div style={{ maxWidth: '560px', margin: '0 auto' }}>
            <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ height: '5px', background: 'linear-gradient(90deg,#f87171,#fb923c,#facc15,#4ade80,#60a5fa,#a78bfa)' }} />
              <div style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#111', marginBottom: '1.5rem' }}>Add New Event</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {FIELDS.map(({ key, label, type }) => (
                    <div key={key}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#aaa', marginBottom: '0.4rem' }}>{label.toUpperCase()}</label>
                      
                      {key === 'category' ? (
                        <select
                          value={form[key]}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                          style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #f0f0f0', borderRadius: '10px', background: '#fafafa' }}
                        >
                          <option value="">Select Category</option>
                          {Object.keys(CATEGORY_THEMES).filter(k => k !== 'default').map(cat => (
                            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                          ))}
                        </select>
                      ) : (
                        <input 
                          type={type} 
                          value={form[key]} 
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} 
                          style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #f0f0f0', borderRadius: '10px', background: '#fafafa' }} 
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ height: '3px', background: '#f0f0f0', margin: '1.5rem 0' }} />
                {success ? (
                  <div style={{ textAlign: 'center', color: '#16a34a', fontWeight: '700' }}>✅ Event added successfully!</div>
                ) : (
                  <button onClick={handleAdd} disabled={saving} style={{ width: '100%', padding: '0.85rem', background: '#111', color: '#fff', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}>
                    {saving ? 'Adding...' : 'Add Event →'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}