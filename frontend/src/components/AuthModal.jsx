import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ForgotPasswordModal from './ForgotPasswordModal';

export default function AuthModal({ onClose }) {
  const [mode,        setMode]        = useState('login');
  const [name,        setName]        = useState('');
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [error,       setError]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const [showForgot,  setShowForgot]  = useState(false);
  const { login } = useAuth();

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please fill all fields'); return; }
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        await api.post('/auth/register', { name, email, password });
        setMode('login');
        setName('');
        setPassword('');
        setError('');
      } else {
        const res = await api.post('/auth/login', { email, password });
        login(res.data.user, res.data.token);
        onClose();
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1.5px solid #f0f0f0',
    borderRadius: '10px',
    fontSize: '0.9rem',
    color: '#111',
    background: '#fafafa',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border 0.15s',
  };

  // Show forgot password modal
  if (showForgot) {
    return (
      <ForgotPasswordModal
        onClose={onClose}
        onBackToLogin={() => setShowForgot(false)}
      />
    );
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '24px',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        {/* Top rainbow bar */}
        <div style={{ height: '5px', background: 'linear-gradient(90deg,#f87171,#fb923c,#facc15,#4ade80,#60a5fa,#a78bfa)' }} />

        <div style={{ padding: '2rem' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#111', marginBottom: '0.2rem' }}>
                {mode === 'login' ? 'Welcome back 👋' : 'Create account 🎉'}
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#aaa' }}>
                {mode === 'login' ? 'Sign in to your SmartBook account' : 'Join SmartBook today'}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{ background: '#f8f8f8', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '1rem', color: '#888' }}
            >
              ✕
            </button>
          </div>

          {/* Toggle */}
          <div style={{ display: 'flex', background: '#f8f8f8', borderRadius: '10px', padding: '4px', marginBottom: '1.5rem' }}>
            {['login', 'register'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                style={{
                  flex: 1, padding: '0.5rem', border: 'none', borderRadius: '8px',
                  cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem',
                  transition: 'all 0.15s', fontFamily: 'inherit',
                  background: mode === m ? '#fff' : 'transparent',
                  color: mode === m ? '#111' : '#aaa',
                  boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {mode === 'register' && (
              <input
                placeholder="Full name"
                value={name}
                onChange={e => setName(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#0ea5e9'}
                onBlur={e => e.target.style.borderColor = '#f0f0f0'}
              />
            )}
            <input
              placeholder="Email address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#0ea5e9'}
              onBlur={e => e.target.style.borderColor = '#f0f0f0'}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#0ea5e9'}
              onBlur={e => e.target.style.borderColor = '#f0f0f0'}
            />
          </div>

          {/* Forgot password link — only on login mode */}
          {mode === 'login' && (
            <div style={{ textAlign: 'right', marginBottom: '1rem', marginTop: '-0.5rem' }}>
              <button
                onClick={() => setShowForgot(true)}
                style={{
                  background: 'none', border: 'none',
                  color: '#0ea5e9', fontSize: '0.8rem',
                  fontWeight: '600', cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: '#fef2f2', color: '#ef4444',
              borderRadius: '8px', padding: '0.6rem 0.9rem',
              fontSize: '0.82rem', fontWeight: '600', marginBottom: '1rem',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', padding: '0.82rem', border: 'none',
              background: loading ? '#e5e7eb' : '#111',
              color: loading ? '#aaa' : '#fff',
              borderRadius: '12px', fontWeight: '800', fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>

        </div>
      </div>
    </div>
  );
}