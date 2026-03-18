import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const CATEGORY_THEMES = {
  music:      { grad: 'linear-gradient(90deg,#f87171,#fb923c)', emoji: '🎵' },
  concert:    { grad: 'linear-gradient(90deg,#f87171,#fb923c)', emoji: '🎤' },
  sports:     { grad: 'linear-gradient(90deg,#fb923c,#facc15)', emoji: '⚽' },
  football:   { grad: 'linear-gradient(90deg,#fb923c,#facc15)', emoji: '🏈' },
  cricket:    { grad: 'linear-gradient(90deg,#fb923c,#facc15)', emoji: '🏏' },
  food:       { grad: 'linear-gradient(90deg,#facc15,#4ade80)', emoji: '🍕' },
  festival:   { grad: 'linear-gradient(90deg,#facc15,#4ade80)', emoji: '🎪' },
  art:        { grad: 'linear-gradient(90deg,#4ade80,#60a5fa)', emoji: '🎨' },
  tech:       { grad: 'linear-gradient(90deg,#60a5fa,#a78bfa)', emoji: '💻' },
  gaming:     { grad: 'linear-gradient(90deg,#60a5fa,#a78bfa)', emoji: '🎮' },
  theater:    { grad: 'linear-gradient(90deg,#a78bfa,#f87171)', emoji: '🎭' },
  comedy:     { grad: 'linear-gradient(90deg,#a78bfa,#f87171)', emoji: '😂' },
  fashion:    { grad: 'linear-gradient(90deg,#f87171,#fb923c)', emoji: '👗' },
  birthday:   { grad: 'linear-gradient(90deg,#facc15,#fb923c)', emoji: '🎂' },
  party:      { grad: 'linear-gradient(90deg,#facc15,#fb923c)', emoji: '🎉' },
  graduation: { grad: 'linear-gradient(90deg,#4ade80,#60a5fa)', emoji: '🎓' },
  newyear:    { grad: 'linear-gradient(90deg,#60a5fa,#a78bfa)', emoji: '🎆' },
  default:    { grad: 'linear-gradient(90deg,#a78bfa,#f87171)', emoji: '🎉' },
};

const getTheme = (category) => {
  if (!category) return CATEGORY_THEMES.default;
  const key = category.toLowerCase().replace(/\s+/g, '');
  return CATEGORY_THEMES[key] || CATEGORY_THEMES.default;
};

const STATUS = {
  CONFIRMED: { bg: '#f0fdf4', color: '#16a34a', label: '✓ Confirmed' },
  PENDING:   { bg: '#fefce8', color: '#ca8a04', label: '⏳ Pending'  },
  CANCELLED: { bg: '#fef2f2', color: '#ef4444', label: '✕ Cancelled' },
};

export default function MyBookingsPage() {
  const [bookings,    setBookings]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [cancelling,  setCancelling]  = useState(null);
  const { user }  = useAuth();
  const navigate  = useNavigate();

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchBookings();
  }, [user]);

  const fetchBookings = () => {
    api.get(`/bookings/user/${user.id}`)
      .then(res => { setBookings(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(bookingId);
    try {
      await api.put(`/bookings/${bookingId}/cancel`, { userId: user.id });
      fetchBookings(); // ✅ refresh list
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to cancel booking.');
    }
    setCancelling(null);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
      Loading...
    </div>
  );

  if (!user) return (
    <div style={{ minHeight: '100vh', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: '#fff', borderRadius: '24px', overflow: 'hidden', border: '1px solid #f0f0f0', maxWidth: '400px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ height: '5px', background: 'linear-gradient(90deg,#f87171,#fb923c,#facc15,#4ade80,#60a5fa,#a78bfa)', marginBottom: '2rem', borderRadius: '999px' }} />
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#111', marginBottom: '0.5rem' }}>Sign in to view bookings</h2>
        <p style={{ color: '#aaa', fontSize: '0.88rem', marginBottom: '1.5rem' }}>You need to be logged in to see your bookings</p>
        <button onClick={() => navigate('/')} style={{ width: '100%', padding: '0.82rem', border: 'none', background: '#111', color: '#fff', borderRadius: '12px', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer' }}>
          Go to Events →
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f8' }}>

      {/* Header */}
      <div style={{ background: '#fff', padding: '3rem 2rem 2.5rem', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ height: '4px', width: '64px', margin: '0 auto 1.5rem', borderRadius: '999px', background: 'linear-gradient(90deg,#f87171,#fb923c,#facc15,#4ade80,#60a5fa,#a78bfa)' }} />
        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#111', letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>
          My Bookings
        </h1>
        <p style={{ color: '#888', fontSize: '0.9rem' }}>
          All bookings for <strong style={{ color: '#111' }}>{user.name || user.email}</strong>
        </p>

        {bookings.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Total',     value: bookings.length,                                       color: '#111'    },
              { label: 'Confirmed', value: bookings.filter(b => b.status === 'CONFIRMED').length, color: '#16a34a' },
              { label: 'Cancelled', value: bookings.filter(b => b.status === 'CANCELLED').length, color: '#ef4444' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: '#f8f8f8', borderRadius: '12px', padding: '0.6rem 1.2rem', textAlign: 'center', border: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: '900', color }}>{value}</div>
                <div style={{ fontSize: '0.7rem', color: '#aaa', fontWeight: '600' }}>{label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* List */}
      <div style={{ padding: '2rem', maxWidth: '860px', margin: '0 auto' }}>
        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', background: '#fff', borderRadius: '20px', border: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎭</div>
            <div style={{ fontWeight: '700', color: '#111', marginBottom: '0.3rem' }}>No bookings yet</div>
            <div style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '1.5rem' }}>Head to Events and book your first experience!</div>
            <button onClick={() => navigate('/')} style={{ padding: '0.7rem 1.5rem', background: '#111', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer' }}>
              Browse Events →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {bookings.map((booking) => {
              const t      = getTheme(booking.event?.category);
              const status = STATUS[booking.status] || STATUS.PENDING;
              const isCancelled = booking.status === 'CANCELLED';
              const isCancelling = cancelling === booking.id;

              return (
                <div
                  key={booking.id}
                  style={{
                    background: '#fff', borderRadius: '16px', overflow: 'hidden',
                    border: isCancelled ? '1px solid #fecaca' : '1px solid #f0f0f0',
                    display: 'flex', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'transform 0.18s, box-shadow 0.18s',
                    opacity: isCancelled ? 0.7 : 1,
                  }}
                  onMouseEnter={e => { if (!isCancelled) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'; }}}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
                >
                  {/* Left color bar */}
                  <div style={{ width: '6px', background: isCancelled ? '#fca5a5' : t.grad, flexShrink: 0 }} />

                  {/* Content */}
                  <div style={{ flex: 1, padding: '1.1rem 1.3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ fontSize: '1.8rem' }}>{t.emoji}</div>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#111', marginBottom: '0.3rem' }}>
                          {booking.event?.title || 'Event'}
                        </h3>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.78rem', color: '#aaa' }}>
                            🪑 {booking.seatsBooked} seat{booking.seatsBooked > 1 ? 's' : ''}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: '#aaa' }}>
                            📍 {booking.event?.venue || '—'}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: '#aaa' }}>
                            📅 {booking.bookedAt ? new Date(booking.bookedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', color: '#aaa', fontWeight: '600' }}>TOTAL</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#111' }}>
                          ${booking.totalPrice?.toFixed(2) || '—'}
                        </div>
                      </div>

                      <span style={{ background: status.bg, color: status.color, padding: '0.28rem 0.8rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '700', whiteSpace: 'nowrap' }}>
                        {status.label}
                      </span>

                      {/* ✅ Cancel button — only for CONFIRMED */}
                      {!isCancelled && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={isCancelling}
                          style={{
                            padding: '0.35rem 0.8rem',
                            background: isCancelling ? '#f3f4f6' : '#fef2f2',
                            color: isCancelling ? '#aaa' : '#ef4444',
                            border: '1px solid #fecaca',
                            borderRadius: '8px',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            cursor: isCancelling ? 'not-allowed' : 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {isCancelling ? 'Cancelling...' : '✕ Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}