import { useState } from 'react';
import api from '../api/axios';

export default function ForgotPasswordModal({ onClose, onBackToLogin }) {
  const [step,         setStep]         = useState('email'); // 'email' | 'reset' | 'done'
  const [email,        setEmail]        = useState('');
  const [token,        setToken]        = useState('');
  const [newPassword,  setNewPassword]  = useState('');
  const [confirm,      setConfirm]      = useState('');
  const [error,        setError]        = useState('');
  const [loading,      setLoading]      = useState(false);
  const [resetToken,   setResetToken]   = useState('');

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

  const handleSendReset = async () => {
    if (!email) { setError('Please enter your email'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setResetToken(res.data.resetToken || '');
      setStep('reset');
    } catch (e) {
      setError(e.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!newPassword) { setError('Please enter a new password'); return; }
    if (newPassword !== confirm) { setError('Passwords do not match'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email,
        token: token || resetToken,
        newPassword,
      });
      setStep('done');
    } catch (e) {
      setError(e.response?.data?.message || 'Invalid or expired token');
    }
    setLoading(false);
  };

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
        {/* Rainbow bar */}
        <div style={{ height: '5px', background: 'linear-gradient(90deg,#f87171,#fb923c,#facc15,#4ade80,#60a5fa,#a78bfa)' }} />

        <div style={{ padding: '2rem' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#111', marginBottom: '0.2rem' }}>
                {step === 'email' && '🔑 Forgot Password'}
                {step === 'reset' && '🔒 Reset Password'}
                {step === 'done'  && '✅ Password Reset!'}
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#aaa' }}>
                {step === 'email' && 'Enter your email to reset your password'}
                {step === 'reset' && 'Enter your reset token and new password'}
                {step === 'done'  && 'Your password has been reset successfully'}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{ background: '#f8f8f8', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '1rem', color: '#888' }}
            >
              ✕
            </button>
          </div>

          {/* STEP 1 — Email */}
          {step === 'email' && (
            <>
              <div style={{ marginBottom: '1.25rem' }}>
                <input
                  placeholder="Email address"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendReset()}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#0ea5e9'}
                  onBlur={e => e.target.style.borderColor = '#f0f0f0'}
                />
              </div>

              {error && (
                <div style={{ background: '#fef2f2', color: '#ef4444', borderRadius: '8px', padding: '0.6rem 0.9rem', fontSize: '0.82rem', fontWeight: '600', marginBottom: '1rem' }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                onClick={handleSendReset}
                disabled={loading}
                style={{
                  width: '100%', padding: '0.82rem', border: 'none',
                  background: loading ? '#e5e7eb' : '#111',
                  color: loading ? '#aaa' : '#fff',
                  borderRadius: '12px', fontWeight: '800', fontSize: '0.95rem',
                  cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                }}
              >
                {loading ? 'Sending...' : 'Send Reset Token →'}
              </button>
            </>
          )}

          {/* STEP 2 — Reset */}
          {step === 'reset' && (
            <>
              {resetToken && (
                <div style={{ background: '#f0fdf4', border: '1px solid #d1fae5', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#16a34a', fontWeight: '600' }}>
                  🎟 Your reset token: <strong style={{ letterSpacing: '0.05em' }}>{resetToken}</strong>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <input
                  placeholder="Reset token"
                  value={token || resetToken}
                  onChange={e => setToken(e.target.value)}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#0ea5e9'}
                  onBlur={e => e.target.style.borderColor = '#f0f0f0'}
                />
                <input
                  placeholder="New password"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#0ea5e9'}
                  onBlur={e => e.target.style.borderColor = '#f0f0f0'}
                />
                <input
                  placeholder="Confirm new password"
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleResetPassword()}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#0ea5e9'}
                  onBlur={e => e.target.style.borderColor = '#f0f0f0'}
                />
              </div>

              {error && (
                <div style={{ background: '#fef2f2', color: '#ef4444', borderRadius: '8px', padding: '0.6rem 0.9rem', fontSize: '0.82rem', fontWeight: '600', marginBottom: '1rem' }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                onClick={handleResetPassword}
                disabled={loading}
                style={{
                  width: '100%', padding: '0.82rem', border: 'none',
                  background: loading ? '#e5e7eb' : '#111',
                  color: loading ? '#aaa' : '#fff',
                  borderRadius: '12px', fontWeight: '800', fontSize: '0.95rem',
                  cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                }}
              >
                {loading ? 'Resetting...' : 'Reset Password →'}
              </button>
            </>
          )}

          {/* STEP 3 — Done */}
          {step === 'done' && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                Your password has been reset. You can now sign in with your new password.
              </p>
              <button
                onClick={onBackToLogin}
                style={{
                  width: '100%', padding: '0.82rem', border: 'none',
                  background: '#111', color: '#fff',
                  borderRadius: '12px', fontWeight: '800', fontSize: '0.95rem',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Back to Sign In →
              </button>
            </div>
          )}

          {/* Back to login */}
          {step !== 'done' && (
            <button
              onClick={onBackToLogin}
              style={{
                width: '100%', padding: '0.65rem', background: 'transparent',
                color: '#aaa', border: 'none', fontSize: '0.82rem',
                cursor: 'pointer', marginTop: '0.6rem', fontFamily: 'inherit',
              }}
            >
              ← Back to Sign In
            </button>
          )}

        </div>
      </div>
    </div>
  );
}