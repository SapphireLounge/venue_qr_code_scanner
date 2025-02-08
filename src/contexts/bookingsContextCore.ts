import { createContext, useContext } from 'react';
import { BookingsContextType } from './bookingsTypes';

export const BookingsContext = createContext<BookingsContextType | undefined>(undefined);

export function useBookings() {
  const context = useContext(BookingsContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingsProvider');
  }
  return context;
}
