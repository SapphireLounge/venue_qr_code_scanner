import { useState } from 'react';
import { useBookings } from '../contexts/bookingsContextCore';
import { QRCodeData } from '../types';
import { format } from 'date-fns';

interface BookingDetailsModalProps {
  booking: QRCodeData;
  onClose: () => void;
}

function BookingDetailsModal({ booking, onClose }: BookingDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">Booking Details</h3>
        <div className="space-y-2">
          <p><strong>Customer:</strong> {booking.customerName}</p>
          <p><strong>Date:</strong> {booking.date}</p>
          <pre className="bg-gray-100 p-3 rounded mt-4 overflow-auto">
            {JSON.stringify(booking, null, 2)}
          </pre>
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}

interface DateBookingsProps {
  selectedDate: Date;
}

export function DateBookings({ selectedDate }: DateBookingsProps) {
  const { getBookingsByDate, getBookingDetails } = useBookings();
  const [selectedBooking, setSelectedBooking] = useState<QRCodeData | null>(null);

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  const bookings = getBookingsByDate(formattedDate);

  const handleCustomerClick = (customerName: string) => {
    const booking = getBookingDetails(customerName);
    if (booking) {
      setSelectedBooking(booking);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Bookings for {format(selectedDate, 'MMMM d, yyyy')}</h3>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings for this date</p>
      ) : (
        <ul className="space-y-2">
          {bookings.map((booking) => (
            <li
              key={booking.customerName}
              onClick={() => handleCustomerClick(booking.customerName)}
              className="p-3 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
            >
              {booking.customerName}
            </li>
          ))}
        </ul>
      )}

      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}
