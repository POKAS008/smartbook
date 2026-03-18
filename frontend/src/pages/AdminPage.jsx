import { useEffect, useState } from 'react';
import api from '../api/axios';

const FIELDS = [
  { key: 'title',         label: 'Event Title',  type: 'text'          },
  { key: 'venue',         label: 'Venue',         type: 'text'          },
  { key: 'eventDate',     label: 'Date',          type: 'datetime-local' },
  { key: 'price',         label: 'Price ($)',     type: 'number'        },
  { key: 'totalSeats',    label: 'Total Seats',   type: 'number'        },
  { key: 'category',      label: 'Category',      type: 'text'          },
];

const GRADS = [
  'linear-gradient(90deg,#f87171,#fb923c)',
  'linear-gradient(90deg,#fb923c,#facc15)',
  'linear-gradient(90deg,#facc15,#4ade80)',
  'linear-gradient(90deg,#4ade80,#60a5fa)',
  'linear-gradient(90deg,#60a5fa,#a78bfa)',
  'linear-gradient(90deg,#a78bfa,#f87171)',
];

const EMOJIS = ['🎵','⚽','🍕','🎨','💻','🎭','👗','🎤'];

const empty = { title: '', venue: '', eventDate: '', price: '', totalSeats: '', category: '' };

export default function AdminPage() {
  const [events,  setEvents]  = useState([]);
  const [form,    setForm]    = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [tab,     setTab]     = useState('events'); // 'events' | 'add'

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
      await api.post('/events', {
        ...form,
        price:      parseFloat(form.price),
        totalSeats: parseInt(form.totalSeats),
      });
      setForm(empty);
      setSuccess(true);
      fetchEvents();
      setTimeout(() => { setSuccess(false); setTab('events'); }, 1500);
    } catch {
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

      {/* Header */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: '2.5rem 2rem 0',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ height: '4px', width: '40px', borderRadius: '999px', background: 'linear-gradient(90deg,#0ea5e9,#7c3aed)', marginBottom: '0.75rem' }} />
            <h1 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#111', letterSpacing: '-0.02em' }}>Admin Panel</h1>
            <p style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '0.2rem' }}>Manage your events</p>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[
              { label: 'Total Events', value: events.length,                                        color: '#0ea5e9', bg: '#e0f2fe' },
              { label: 'Total Seats',  value: events.reduce((a, e) => a + (e.totalSeats || 0), 0),  color: '#7c3aed', bg: '#ede9fe' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} style={{ background: bg, borderRadius: '14px', padding: '0.75rem 1.25rem', textAlign: 'center', minWidth: '100px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color }}>{value}</div>
                <div style={{ fontSize: '0.7rem', color: '#aaa', fontWeight: '600', marginTop: '1px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0' }}>
          {[
            { key: 'events', label: '📋 Events' },
            { key: 'add',    label: '＋ Add Event' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                padding: '0.65rem 1.4rem',
                border: 'none',
                background: 'transparent',
                fontWeight: tab === key ? '800' : '500',
                fontSize: '0.88rem',
                color: tab === key ? '#111' : '#aaa',
                cursor: 'pointer',
                borderBottom: tab === key ? '2px solid #111' : '2px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>

        {/* EVENTS TAB */}
        {tab === 'events' && (
          <>
            {loading ? (
              <div style={{ textAlign: 'center', color: '#aaa', padding: '4rem' }}>Loading events...</div>
            ) : events.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem', background: '#fff', borderRadius: '20px', border: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎭</div>
                <div style={{ fontWeight: '700', color: '#111', marginBottom: '0.3rem' }}>No events yet</div>
                <button onClick={() => setTab('add')} style={{ marginTop: '1rem', padding: '0.6rem 1.4rem', background: '#111', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '0.88rem' }}>
                  Add First Event →
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: '1.1rem' }}>
                {events.map((event, i) => (
                  <div
                    key={event.id}
                    style={{
                      background: '#fff',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid #f0f0f0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      transition: 'transform 0.18s, box-shadow 0.18s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
                  >
                    {/* Rainbow bar */}
                    <div style={{ height: '6px', background: GRADS[i % GRADS.length] }} />

                    <div style={{ padding: '1.2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div style={{ fontSize: '1.8rem' }}>{EMOJIS[i % EMOJIS.length]}</div>
                        <button
                          onClick={() => handleDelete(event.id)}
                          style={{ background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '8px', padding: '0.3rem 0.7rem', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                      </div>

                      <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#111', marginBottom: '0.5rem' }}>{event.title}</h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.28rem', marginBottom: '0.9rem' }}>
                        <span style={{ fontSize: '0.78rem', color: '#888' }}>📍 {event.venue}</span>
                        <span style={{ fontSize: '0.78rem', color: '#888' }}>📅 {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span style={{ fontSize: '0.78rem', color: '#888' }}>🪑 {event.availableSeats} / {event.totalSeats} seats</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #f5f5f5' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#111' }}>${event.price}</span>
                        <span style={{ background: '#f3f4f6', color: '#555', padding: '0.18rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '700' }}>
                          {event.category || 'Event'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ADD EVENT TAB */}
        {tab === 'add' && (
          <div style={{ maxWidth: '560px', margin: '0 auto' }}>
            <div style={{
              background: '#fff',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid #f0f0f0',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>
              <div style={{ height: '5px', background: 'linear-gradient(90deg,#f87171,#fb923c,#facc15,#4ade80,#60a5fa,#a78bfa)' }} />

              <div style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#111', marginBottom: '1.5rem' }}>Add New Event</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {FIELDS.map(({ key, label, type }) => (
                    <div key={key}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#aaa', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                        {label.toUpperCase()}
                      </label>
                      <input
                        type={type}
                        value={form[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.7rem 0.9rem',
                          border: '1.5px solid #f0f0f0',
                          borderRadius: '10px',
                          fontSize: '0.9rem',
                          color: '#111',
                          background: '#fafafa',
                          outline: 'none',
                          transition: 'border 0.15s',
                          boxSizing: 'border-box',
                        }}
                        onFocus={e => e.target.style.borderColor = '#0ea5e9'}
                        onBlur={e => e.target.style.borderColor = '#f0f0f0'}
                      />
                    </div>
                  ))}
                </div>

                {/* Rainbow divider */}
                <div style={{ height: '3px', borderRadius: '999px', background: 'linear-gradient(90deg,#f87171,#fb923c,#facc15,#4ade80,#60a5fa,#a78bfa)', margin: '1.5rem 0' }} />

                {success ? (
                  <div style={{ textAlign: 'center', padding: '1rem', background: '#f0fdf4', borderRadius: '12px', color: '#16a34a', fontWeight: '700', fontSize: '0.95rem' }}>
                    ✅ Event added successfully!
                  </div>
                ) : (
                  <button
                    onClick={handleAdd}
                    disabled={saving}
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      background: saving ? '#e5e7eb' : '#111',
                      color: saving ? '#aaa' : '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '800',
                      fontSize: '0.95rem',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => { if (!saving) e.currentTarget.style.opacity = '0.85'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                  >
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