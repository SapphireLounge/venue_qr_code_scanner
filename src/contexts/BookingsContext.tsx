import React, { useState, ReactNode } from 'react';
import { QRCodeData } from '../types';
import { BookingsContext } from './bookingsContextCore';

export const BookingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<QRCodeData[]>([]);

  const addBooking = (booking: QRCodeData) => {
    setBookings((prev) => [...prev, booking]);
  };

  const getBookingsByDate = (date: string) => {
    return bookings.filter((booking) => booking.date === date);
  };

  const getBookingDetails = (customerName: string) => {
    return bookings.find((booking) => booking.customerName === customerName);
  };

  return (
    <BookingsContext.Provider
      value={{ bookings, addBooking, getBookingsByDate, getBookingDetails }}
    >
      {children}
    </BookingsContext.Provider>
  );
}
