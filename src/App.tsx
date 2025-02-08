import { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Menu, QrCode, Calendar, Settings as SettingsIcon } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Scanner from './components/Scanner';
import BookingCalendar from './components/BookingCalendar';
import Settings from './components/Settings';
import { QRCodeData } from './types';
import { BookingsProvider } from './contexts/BookingsContext';
import { BookingsContext } from './contexts/bookingsContextCore';

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const bookingsContext = useContext(BookingsContext);

  if (!bookingsContext) {
    throw new Error('AppContent must be used within a BookingsProvider');
  }

  const { bookings, addBooking } = bookingsContext;

  const handleScanSuccess = (data: QRCodeData) => {
    const newBooking = {
      id: crypto.randomUUID(),
      ...data,
      notificationSent: false,
      details: `Table ${data.table} - ${data.guests} guests${data.occasion ? ` - ${data.occasion}` : ''}${data.specialRequests ? `\nSpecial Requests: ${data.specialRequests}` : ''}`
    };
    addBooking(newBooking);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white">
        <nav className="bg-black p-4 relative">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold flex items-center gap-3">
              <img src="/assets/images/Venue Scanner Logo.png" alt="Venue Scanner" className="w-12 h-12" />
              Venue Scanner
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-900 rounded-lg"
            >
              <Menu size={24} />
            </button>
          </div>
          
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-black z-50 py-2 space-y-2">
              <Link
                to="/"
                className="flex items-center gap-2 p-2 hover:bg-gray-900 rounded-lg mx-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <QrCode size={20} />
                Scanner
              </Link>
              <Link
                to="/bookings"
                className="flex items-center gap-2 p-2 hover:bg-gray-900 rounded-lg mx-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Calendar size={20} />
                Bookings
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-2 p-2 hover:bg-gray-900 rounded-lg mx-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <SettingsIcon size={20} />
                Settings
              </Link>
            </div>
          )}
        </nav>

        <main className="container mx-auto py-6">
          <Routes>
            <Route path="/" element={<Scanner onScanSuccess={handleScanSuccess} />} />
            <Route
              path="/bookings"
              element={
                <div className="p-4">
                  <h2 className="text-2xl font-bold mb-4">Bookings Calendar</h2>
                  <BookingCalendar bookings={bookings} />
                </div>
              }
            />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <BookingsProvider>
      <AppContent />
      <Toaster position="bottom-right" />
    </BookingsProvider>
  );
}

export default App;