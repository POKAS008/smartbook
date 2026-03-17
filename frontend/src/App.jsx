import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import EventsPage from './pages/EventsPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminPage from './pages/AdminPage';

function Footer() {
  return (
    <footer style={{
      background: '#fff',
      borderTop: '1px solid #eaeaea',
      padding: '1.25rem 1rem',
      width: '100%',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.90rem',
        color: '#000',
        flexWrap: 'wrap',
        fontWeight: '500',
      }}>
        <span>
          © 2026 Saranya Pokala · SmartBook Event Booking · All rights reserved
        </span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
      }}>
        <Navbar />
        <main style={{ flex: 1, width: '100%' }}>
          <Routes>
            <Route path="/"            element={<EventsPage />}     />
            <Route path="/book/:id"    element={<BookingPage />}    />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/admin"       element={<AdminPage />}      />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}