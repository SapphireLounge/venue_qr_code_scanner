import React, { useState, ReactNode, useEffect } from 'react';
import { QRCodeData } from '../types';
import { BookingsContext } from './bookingsContextCore';

const STORAGE_KEY = 'venue_scanner_bookings';

export const BookingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<QRCodeData[]>(() => {
    // Initialize bookings from localStorage
    const savedBookings = localStorage.getItem(STORAGE_KEY);
    return savedBookings ? JSON.parse(savedBookings) : [];
  });

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

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
