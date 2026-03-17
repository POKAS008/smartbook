import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const NAV_LINKS = [
  { to: '/',            label: 'Events'      },
  { to: '/my-bookings', label: 'My Bookings' },
  { to: '/admin',       label: 'Admin'       },
];

const ACTIVE_COLORS = {
  '/':            { bg: '#7b76b9', color: '#f9f7f7' },
  '/my-bookings': { bg: '#7b76b9', color: '#f9f7f9' },
  '/admin':       { bg: '#7b76b9', color: '#f9f7f9' },
};

export default function Navbar() {
  const location          = useLocation();
  const { user, logout }  = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <nav style={{
        background: '#ffffff',
        borderBottom: '1px solid #f0f0f0',
        padding: '0 2rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        boxShadow: '0 1px 12px rgba(0,0,0,0.05)',
      }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #e0f2fe, #ede9fe)',
            borderRadius: '10px',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
          }}>
            ✨
          </div>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: '900',
            background: 'linear-gradient(90deg, #0ea5e9, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
          }}>
            SmartBook
          </span>
        </Link>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>

          {/* Nav links */}
          {NAV_LINKS.map(({ to, label }) => {
            const active = location.pathname === to;
            const style  = ACTIVE_COLORS[to];
            return (
              <Link
                key={to}
                to={to}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: active ? '700' : '500',
                  textDecoration: 'none',
                  background: active ? style.bg : 'transparent',
                  color: active ? style.color : '#999',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = style.bg;
                    e.currentTarget.style.color = style.color;
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#999';
                  }
                }}
              >
                {label}
              </Link>
            );
          })}

          {/* Divider */}
          <div style={{
            width: '1px',
            height: '20px',
            background: '#f0f0f0',
            margin: '0 0.5rem',
          }} />

          {/* Auth section */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #e0f2fe, #ede9fe)',
                borderRadius: '999px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: '700',
                color: '#0ea5e9',
              }}>
                👤 {user.name || user.email}
              </div>
              <button
                onClick={logout}
                style={{
                  padding: '0.4rem 0.9rem',
                  borderRadius: '8px',
                  border: '1px solid #f0f0f0',
                  background: '#fff',
                  color: '#888',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.color = '#555'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.color = '#888'; }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              style={{
                padding: '0.45rem 1.1rem',
                borderRadius: '8px',
                border: 'none',
                background: '#111',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Sign In
            </button>
          )}
        </div>

      </nav>

      {/* Auth Modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}