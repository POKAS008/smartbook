import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import api from '../api/axios';

const CATEGORY_THEMES = {
  music:      { grad: 'linear-gradient(90deg,#f87171,#fb923c)', light: '#fef2f2', color: '#ef4444', emoji: '🎵' },
  concert:    { grad: 'linear-gradient(90deg,#f87171,#fb923c)', light: '#fef2f2', color: '#ef4444', emoji: '🎤' },
  sports:     { grad: 'linear-gradient(90deg,#fb923c,#facc15)', light: '#fff7ed', color: '#f97316', emoji: '⚽' },
  football:   { grad: 'linear-gradient(90deg,#fb923c,#facc15)', light: '#fff7ed', color: '#f97316', emoji: '🏈' },
  cricket:    { grad: 'linear-gradient(90deg,#fb923c,#facc15)', light: '#fff7ed', color: '#f97316', emoji: '🏏' },
  food:       { grad: 'linear-gradient(90deg,#facc15,#4ade80)', light: '#fefce8', color: '#ca8a04', emoji: '🍕' },
  festival:   { grad: 'linear-gradient(90deg,#facc15,#4ade80)', light: '#fefce8', color: '#ca8a04', emoji: '🎪' },
  art:        { grad: 'linear-gradient(90deg,#4ade80,#60a5fa)', light: '#f0fdf4', color: '#16a34a', emoji: '🎨' },
  culture:    { grad: 'linear-gradient(90deg,#4ade80,#60a5fa)', light: '#f0fdf4', color: '#16a34a', emoji: '🏛️' },
  tech:       { grad: 'linear-gradient(90deg,#60a5fa,#a78bfa)', light: '#eff6ff', color: '#3b82f6', emoji: '💻' },
  gaming:     { grad: 'linear-gradient(90deg,#60a5fa,#a78bfa)', light: '#eff6ff', color: '#3b82f6', emoji: '🎮' },
  theater:    { grad: 'linear-gradient(90deg,#a78bfa,#f87171)', light: '#faf5ff', color: '#8b5cf6', emoji: '🎭' },
  comedy:     { grad: 'linear-gradient(90deg,#a78bfa,#f87171)', light: '#faf5ff', color: '#8b5cf6', emoji: '😂' },
  fashion:    { grad: 'linear-gradient(90deg,#f87171,#fb923c)', light: '#fef2f2', color: '#ef4444', emoji: '👗' },
  birthday:   { grad: 'linear-gradient(90deg,#facc15,#fb923c)', light: '#fff7ed', color: '#f97316', emoji: '🎂' },
  party:      { grad: 'linear-gradient(90deg,#facc15,#fb923c)', light: '#fff7ed', color: '#f97316', emoji: '🎉' },
  graduation: { grad: 'linear-gradient(90deg,#4ade80,#60a5fa)', light: '#f0fdf4', color: '#16a34a', emoji: '🎓' },
  newyear:    { grad: 'linear-gradient(90deg,#60a5fa,#a78bfa)', light: '#eff6ff', color: '#3b82f6', emoji: '🎆' },
  newyearevent: { grad: 'linear-gradient(90deg,#60a5fa,#a78bfa)', light: '#eff6ff', color: '#3b82f6', emoji: '🎆' },
  default:    { grad: 'linear-gradient(90deg,#a78bfa,#f87171)', light: '#faf5ff', color: '#8b5cf6', emoji: '🎉' },
};

const getTheme = (category) => {
  if (!category) return CATEGORY_THEMES.default;
  const key = category.toLowerCase().replace(/\s+/g, '');
  return CATEGORY_THEMES[key] || CATEGORY_THEMES.default;
};

export default function EventsPage() {
  const [events,   setEvents]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();
  const { user }  = useAuth();

  useEffect(() => {
    api.get('/events').then(res => {
      setEvents(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleBook = (eventId) => {
    if (!user) { setShowAuth(true); return; }
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
          fontSize: '2.0rem', fontWeight: '900', color: '#111',
          lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '0.75rem',
        }}>
          Book Your Next<br />
          <span style={{
            background: 'linear-gradient(90deg,#f87171,#fb923c,#facc15,#4ade80,#60a5fa,#a78bfa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
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
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎉</div>
            <div style={{ fontWeight: '700', color: '#111', marginBottom: '0.3rem' }}>No events yet</div>
            <div style={{ fontSize: '0.85rem', color: '#aaa' }}>Add some from the Admin panel</div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.25rem',
          }}>
            {events.map((event) => {
              const t = getTheme(event.category);
              return (
                <div
                  key={event.id}
                  style={{
                    background: '#fff', borderRadius: '18px', overflow: 'hidden',
                    border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer',
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

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}