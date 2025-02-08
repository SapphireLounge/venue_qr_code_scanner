import { createContext } from 'react';
import { QRCodeData } from '../types';

export interface BookingsContextType {
  bookings: QRCodeData[];
  addBooking: (booking: QRCodeData) => void;
  getBookingsByDate: (date: string) => QRCodeData[];
  getBookingDetails: (customerName: string) => QRCodeData | undefined;
}

export const BookingsContext = createContext<BookingsContextType | undefined>(undefined);
