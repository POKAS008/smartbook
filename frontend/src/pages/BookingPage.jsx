import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import api from '../api/axios';

export default function BookingPage() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { user }     = useAuth();
  const [event,      setEvent]      = useState(null);
  const [seats,      setSeats]      = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [showAuth,   setShowAuth]   = useState(false);

  useEffect(() => {
    api.get(`/events/${id}`).then(res => {
      setEvent(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!user) { setShowAuth(true); return; }
    setConfirming(true);
    try {
      await api.post('/bookings', {
        eventId:       parseInt(id),
        userId:        user.id,
        numberOfSeats: seats,
      });
      setSuccess(true);
    } catch (e) {
      alert(e.response?.data?.message || 'Booking failed. Please try again.');
    }
    setConfirming(false);
  };

  // Not logged in screen
  if (!loading && !user) return (
    <div style={{
      minHeight: '100vh', background: '#f8f8f8',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
    }}>
      <div style={{
        background: '#fff', borderRadius: '24px', overflow: 'hidden',
        border: '1px solid #f0f0f0', maxWidth: '400px', width: '100%',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)', textAlign: 'center', padding: '3rem 2rem',
      }}>
        <div style={{ height: '5px', background: 'linear-gradient(90deg,#f87171,#fb923c,#facc15,#4ade80,#60a5fa,#a78bfa)', marginBottom: '2rem', borderRadius: '999px' }} />
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#111', marginBottom: '0.5rem' }}>Sign in to Book</h2>
        <p style={{ color: '#aaa', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          You need to be logged in to book events
        </p>
        <button
          onClick={() => setShowAuth(true)}
          style={{ width: '100%', padding: '0.82rem', border: 'none', background: '#111', color: '#fff', borderRadius: '12px', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Sign In to Continue →
        </button>
        <button
          onClick={() => navigate('/')}
          style={{ width: '100%', padding: '0.65rem', background: 'transparent', color: '#aaa', border: 'none', fontSize: '0.82rem', cursor: 'pointer', marginTop: '0.5rem', fontFamily: 'inherit' }}
        >
          ← Back to Events
        </button>
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
      Loading...
    </div>
  );

  if (success) return (
    <div style={{ minHeight: '100vh', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: '#fff', borderRadius: '24px', padding: '3rem 2.5rem', textAlign: 'center', border: '1px solid #f0f0f0', maxWidth: '400px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <div style={{ height: '5px', borderRadius: '999px', background: 'linear-gradient(90deg,#f87171,#fb923c,#facc15,#4ade80,#60a5fa,#a78bfa)', marginBottom: '2rem' }} />
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#111', marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
        <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          {seats} seat{seats > 1 ? 's' : ''} booked for <strong style={{ color: '#111' }}>{event.title}</strong>
        </p>
        <div style={{ background: '#f8f8f8', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: '900', color: '#111' }}>
          ${(event.price * seats).toFixed(2)}
        </div>
        <button
          onClick={() => navigate('/my-bookings')}
          style={{ width: '100%', padding: '0.75rem', background: '#111', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', marginBottom: '0.6rem' }}
        >
          View My Bookings →
        </button>
        <button
          onClick={() => navigate('/')}
          style={{ width: '100%', padding: '0.65rem', background: 'transparent', color: '#aaa', border: 'none', fontSize: '0.82rem', cursor: 'pointer' }}
        >
          Browse More Events
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: '#fff', borderRadius: '24px', overflow: 'hidden', border: '1px solid #f0f0f0', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', width: '100%', maxWidth: '440px' }}>

        {/* Rainbow top */}
        <div style={{ height: '7px', background: 'linear-gradient(90deg,#f87171,#fb923c,#facc15,#4ade80,#60a5fa,#a78bfa)' }} />

        {/* Header */}
        <div style={{ padding: '2rem 2rem 1.5rem', textAlign: 'center', borderBottom: '1px solid #f5f5f5' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎵</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#111', marginBottom: '0.4rem' }}>{event.title}</h1>
          <div style={{ fontSize: '0.85rem', color: '#888' }}>📍 {event.venue}</div>
          <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.25rem' }}>
            📅 {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          {/* Logged in as */}
          <div style={{ marginTop: '0.75rem', background: '#f8f8f8', borderRadius: '8px', padding: '0.4rem 0.8rem', display: 'inline-block', fontSize: '0.75rem', color: '#888' }}>
            👤 Booking as <strong style={{ color: '#111' }}>{user.name || user.email}</strong>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: '1.75rem 2rem' }}>

          {/* Price / Seats row */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, background: '#f8f8f8', borderRadius: '12px', padding: '0.9rem 1rem' }}>
              <div style={{ fontSize: '0.7rem', color: '#aaa', fontWeight: '700', marginBottom: '0.25rem' }}>PRICE / SEAT</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#111' }}>${event.price}</div>
            </div>
            <div style={{ flex: 1, background: '#f8f8f8', borderRadius: '12px', padding: '0.9rem 1rem' }}>
              <div style={{ fontSize: '0.7rem', color: '#aaa', fontWeight: '700', marginBottom: '0.25rem' }}>AVAILABLE</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#111' }}>{event.availableSeats}</div>
            </div>
          </div>

          {/* Seat selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#aaa', marginBottom: '0.6rem', letterSpacing: '0.05em' }}>NUMBER OF SEATS</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => setSeats(s => Math.max(1, s - 1))}
                style={{ width: '42px', height: '42px', borderRadius: '10px', border: '1px solid #e5e7eb', background: '#f8f8f8', color: '#111', fontSize: '1.2rem', fontWeight: '700', cursor: 'pointer' }}
              >−</button>
              <div style={{ flex: 1, textAlign: 'center', fontSize: '1.5rem', fontWeight: '900', color: '#111' }}>{seats}</div>
              <button
                onClick={() => setSeats(s => Math.min(event.availableSeats, s + 1))}
                style={{ width: '42px', height: '42px', borderRadius: '10px', border: '1px solid #e5e7eb', background: '#f8f8f8', color: '#111', fontSize: '1.2rem', fontWeight: '700', cursor: 'pointer' }}
              >+</button>
            </div>
          </div>

          {/* Total */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f8f8', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#aaa' }}>TOTAL</span>
            <span style={{ fontSize: '1.6rem', fontWeight: '900', color: '#111' }}>${(event.price * seats).toFixed(2)}</span>
          </div>

          {/* Rainbow divider */}
          <div style={{ height: '3px', borderRadius: '999px', background: 'linear-gradient(90deg,#f87171,#fb923c,#facc15,#4ade80,#60a5fa,#a78bfa)', marginBottom: '1.25rem' }} />

          {/* Confirm */}
          <button
            onClick={handleBook}
            disabled={confirming}
            style={{ width: '100%', padding: '0.85rem', background: confirming ? '#e5e7eb' : '#111', color: confirming ? '#aaa' : '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '0.95rem', cursor: confirming ? 'not-allowed' : 'pointer', transition: 'opacity 0.15s' }}
          >
            {confirming ? 'Confirming...' : 'Confirm Booking →'}
          </button>

          <button
            onClick={() => navigate('/')}
            style={{ width: '100%', padding: '0.65rem', background: 'transparent', color: '#aaa', border: 'none', fontSize: '0.82rem', cursor: 'pointer', marginTop: '0.6rem' }}
          >
            ← Back to Events
          </button>

        </div>
      </div>
    </div>
  );
}