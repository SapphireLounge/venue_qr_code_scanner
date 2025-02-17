import { QRCodeData } from '../types';

export interface BookingsContextType {
  bookings: QRCodeData[];
  addBooking: (booking: QRCodeData) => void;
  deleteBooking: (booking: QRCodeData) => void;
  getBookingsByDate: (date: string) => QRCodeData[];
  getBookingDetails: (customerName: string) => QRCodeData | undefined;
}
