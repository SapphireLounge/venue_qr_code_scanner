import { useContext } from 'react';
import { BookingsContext } from './bookingsContextCore.tsx';
import { BookingsContextType } from './bookingsTypes';

export function useBookings(): BookingsContextType {
  const context = useContext(BookingsContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingsProvider');
  }
  return context;
}
