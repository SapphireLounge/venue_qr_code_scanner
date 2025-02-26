import { createContext, useState } from 'react';
import { QRCodeData } from '../types';
import { toast } from 'react-hot-toast';

export interface BookingsContextType {
  bookings: QRCodeData[];
  addBooking: (booking: QRCodeData) => void;
  deleteBooking: (booking: QRCodeData) => void;
  getBookingsByDate: (date: string) => QRCodeData[];
  getBookingDetails: (customerName: string) => QRCodeData | undefined;
}

export const BookingsContext = createContext<BookingsContextType | undefined>(undefined);

export function BookingsProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<QRCodeData[]>([]);

  const addBooking = (booking: QRCodeData) => {
    // Check for duplicate booking
    const isDuplicate = bookings.some(
      existingBooking =>
        existingBooking.customerName === booking.customerName &&
        existingBooking.date === booking.date &&
        existingBooking.time === booking.time
    );

    if (!isDuplicate) {
      setBookings(prevBookings => [...prevBookings, booking]);
    } else {
      toast.error('This booking already exists for this date and time.');
    }
  };

  const deleteBooking = (bookingToDelete: QRCodeData) => {
    setBookings(prevBookings => 
      prevBookings.filter(
        booking => 
          !(booking.customerName === bookingToDelete.customerName && 
            booking.date === bookingToDelete.date && 
            booking.time === bookingToDelete.time)
      )
    );
    toast.success('Booking deleted successfully');
  };

  const getBookingsByDate = (date: string) => {
    return bookings.filter(booking => booking.date === date);
  };

  const getBookingDetails = (customerName: string) => {
    return bookings.find(booking => booking.customerName === customerName);
  };

  return (
    <BookingsContext.Provider value={{ 
      bookings, 
      addBooking, 
      deleteBooking,
      getBookingsByDate, 
      getBookingDetails 
    }}>
      {children}
    </BookingsContext.Provider>
  );
}
