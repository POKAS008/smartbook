import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ background: '#1e40af', padding: '1rem 2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>📚 SmartBook</span>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Events</Link>
      <Link to="/my-bookings" style={{ color: 'white', textDecoration: 'none' }}>My Bookings</Link>
      <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Admin</Link>
    </nav>
  );
}