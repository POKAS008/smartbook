import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import api from '../api/axios';

const CATEGORY_THEMES = {
  'Music':       { grad: 'linear-gradient(90deg,#f87171,#fb923c)', light: '#fef2f2', color: '#ef4444', emoji: '🎵' },
  'Sports':      { grad: 'linear-gradient(90deg,#fb923c,#facc15)', light: '#fff7ed', color: '#f97316', emoji: '⚽' },
  'Food':        { grad: 'linear-gradient(90deg,#facc15,#4ade80)', light: '#fefce8', color: '#ca8a04', emoji: '🍕' },
  'Art':         { grad: 'linear-gradient(90deg,#4ade80,#60a5fa)', light: '#f0fdf4', color: '#16a34a', emoji: '🎨' },
  'Tech':        { grad: 'linear-gradient(90deg,#60a5fa,#a78bfa)', light: '#eff6ff', color: '#3b82f6', emoji: '💻' },
  'Theater':     { grad: 'linear-gradient(90deg,#a78bfa,#f87171)', light: '#faf5ff', color: '#8b5cf6', emoji: '🎭' },
  'Fashion':     { grad: 'linear-gradient(90deg,#f87171,#fb923c)', light: '#fef2f2', color: '#ef4444', emoji: '👗' },
  'Concert':     { grad: 'linear-gradient(90deg,#60a5fa,#4ade80)', light: '#eff6ff', color: '#3b82f6', emoji: '🎤' },
  'Education':   { grad: 'linear-gradient(90deg,#818cf8,#c084fc)', light: '#eef2ff', color: '#4f46e5', emoji: '🎓' },
  'Nature':      { grad: 'linear-gradient(90deg,#34d399,#059669)', light: '#ecfdf5', color: '#059669', emoji: '🌿' },
  'Dance':       { grad: 'linear-gradient(90deg,#f472b6,#ec4899)', light: '#fdf2f8', color: '#db2777', emoji: '💃' },
  'Awards':      { grad: 'linear-gradient(90deg,#fbbf24,#f59e0b)', light: '#fffbeb', color: '#d97706', emoji: '🏆' },
  'Swimming':    { grad: 'linear-gradient(90deg,#38bdf8,#0284c7)', light: '#f0f9ff', color: '#0284c7', emoji: '🏊' },
  'Charity':     { grad: 'linear-gradient(90deg,#fb7185,#e11d48)', light: '#fff1f2', color: '#e11d48', emoji: '❤️' },
  'Tennis':      { grad: 'linear-gradient(90deg,#a3e635,#65a30d)', light: '#f7fee7', color: '#65a30d', emoji: '🎾' },
  'Networking':  { grad: 'linear-gradient(90deg,#c084fc,#7c3aed)', light: '#faf5ff', color: '#7c3aed', emoji: '🔮' },
  'Festival':    { grad: 'linear-gradient(90deg,#fdba74,#ea580c)', light: '#fff7ed', color: '#ea580c', emoji: '🎪' },
  'Beach':       { grad: 'linear-gradient(90deg,#67e8f9,#0891b2)', light: '#ecfeff', color: '#0891b2', emoji: '🌊' },
  'Golf':        { grad: 'linear-gradient(90deg,#86efac,#15803d)', light: '#f0fdf4', color: '#15803d', emoji: '⛳' },
  'Boxing':      { grad: 'linear-gradient(90deg,#fca5a5,#b91c1c)', light: '#fef2f2', color: '#b91c1c', emoji: '🥊' },

  // default — fallback if category doesn't match
  'default':     { grad: 'linear-gradient(90deg,#a78bfa,#60a5fa)', light: '#eff6ff', color: '#6366f1', emoji: '🎉' },
};

// helper function — call this instead of THEMES[i % THEMES.length]
const getTheme = (category) => {
  return CATEGORY_THEMES[category] || CATEGORY_THEMES['default'];
};

export default function EventsPage() {
  const [events,   setEvents]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const navigate    = useNavigate();
  const { user }    = useAuth();

  useEffect(() => {
    api.get('/events').then(res => {
      setEvents(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleBook = (eventId) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    navigate(`/book/${eventId}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f8' }}>

      {/* Hero */}
      <div style={{
        background: '#fff',
        padding: '0rem 0rem 1.0rem',
        textAlign: 'center',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <h1 style={{
          fontSize: '2.0rem',
          fontWeight: '900',
          color: '#111',
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          marginBottom: '0.75rem',
        }}>
          Book Your Next<br />
          <span style={{
            background: 'linear-gradient(90deg,#f87171,#fb923c,#facc15,#4ade80,#60a5fa,#a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Unforgettable Experience
          </span>
        </h1>

        <p style={{ color: '#888', fontSize: '1rem', maxWidth: '420px', margin: '0 auto' }}>
          Discover and book the best events happening near you
        </p>
      </div>

      {/* Grid */}
      <div style={{ padding: '2.5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#111' }}>Upcoming Events</h2>
          <span style={{
            background: '#f3f4f6', color: '#555',
            padding: '0.15rem 0.6rem', borderRadius: '999px',
            fontSize: '0.78rem', fontWeight: '700',
          }}>
            {events.length}
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#aaa', padding: '4rem' }}>Loading events...</div>
        ) : events.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '5rem',
            background: '#fff', borderRadius: '20px', border: '1px solid #f0f0f0',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎭</div>
            <div style={{ fontWeight: '700', color: '#111', marginBottom: '0.3rem' }}>No events yet</div>
            <div style={{ fontSize: '0.85rem', color: '#aaa' }}>Add some from the Admin panel</div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.25rem',
          }}>
            {events.map((event, i) => {
              const t = getTheme(event.category);
              return (
                <div
                  key={event.id}
                  style={{
                    background: '#fff',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                  }}
                >
                  {/* Rainbow top bar */}
                  <div style={{ height: '7px', background: t.grad }} />

                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ fontSize: '2.2rem', marginBottom: '0.85rem' }}>{t.emoji}</div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <span style={{
                        background: t.light, color: t.color,
                        padding: '0.18rem 0.6rem', borderRadius: '999px',
                        fontSize: '0.72rem', fontWeight: '700',
                      }}>
                        {event.category || 'Event'}
                      </span>
                      <span style={{ fontWeight: '800', color: '#111', fontSize: '1.05rem' }}>
                        ${event.price}
                      </span>
                    </div>

                    <h3 style={{
                      fontSize: '1rem', fontWeight: '800', color: '#111',
                      marginBottom: '0.75rem', lineHeight: 1.3,
                    }}>
                      {event.title}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1.1rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#888' }}>📍 {event.venue}</span>
                      <span style={{ fontSize: '0.8rem', color: '#888' }}>🪑 {event.availableSeats} seats</span>
                      <span style={{ fontSize: '0.8rem', color: '#888' }}>
                        📅 {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <div style={{ height: '2px', borderRadius: '999px', background: t.grad, marginBottom: '1rem' }} />

                    {/* Book Now button — shows lock if not logged in */}
                    <button
                      onClick={() => handleBook(event.id)}
                      style={{
                        width: '100%', padding: '0.68rem',
                        background: t.light, color: t.color,
                        border: 'none', borderRadius: '10px',
                        fontWeight: '700', fontSize: '0.88rem',
                        cursor: 'pointer', transition: 'opacity 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      {user ? 'Book Now →' : '🔒 Sign In to Book'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Auth Modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}