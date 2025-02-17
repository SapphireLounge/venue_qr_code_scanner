import { useState } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { QRCodeData } from '../types';
import { X } from 'lucide-react';
import { useBookings } from '../contexts/useBookings';
import 'react-calendar/dist/Calendar.css';

export default function BookingCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { bookings, deleteBooking } = useBookings();

  const dateBookings = bookings.filter(
    (booking) => booking.date === format(selectedDate, 'yyyy-MM-dd')
  );

  const getTileContent = ({ date }: { date: Date }) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const dayBookings = bookings.filter(booking => booking.date === formattedDate);
    
    if (dayBookings.length > 0) {
      return (
        <div className="relative w-full h-full">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white"></div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderBookingDetails = (booking: QRCodeData) => (
    <div key={`${booking.customerName}-${booking.time}`} className="bg-gray-800 rounded-lg p-4 mb-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-white">{booking.customerName}</h3>
          <p className="text-gray-400">Time: {booking.time}</p>
          <p className="text-gray-400">Guests: {booking.guests}</p>
          {booking.table && <p className="text-gray-400">Table: {booking.table}</p>}
        </div>
        <button
          onClick={() => deleteBooking(booking)}
          className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-500/10 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );

  const handleDateChange = (value: Date) => {
    setSelectedDate(value);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <style>
        {`
          .react-calendar {
            border: none;
            background-color: rgb(31 41 55);
            color: white;
            border-radius: 0.5rem;
            padding: 1rem;
            width: 100%;
          }
          .react-calendar__navigation button {
            color: white;
            font-size: 1rem;
            min-width: 44px;
          }
          .react-calendar__navigation button:enabled:hover,
          .react-calendar__navigation button:enabled:focus {
            background-color: rgb(55 65 81);
          }
          .react-calendar__tile {
            color: white;
            padding: 0.75rem;
            font-size: 0.875rem;
            border-radius: 0.375rem;
          }
          .react-calendar__tile:enabled:hover,
          .react-calendar__tile:enabled:focus {
            background-color: rgb(55 65 81);
          }
          .react-calendar__tile--now {
            background-color: rgb(37 99 235) !important;
            color: white !important;
          }
          .react-calendar__tile--active {
            background-color: white !important;
            color: rgb(31 41 55) !important;
          }
          .react-calendar__month-view__weekdays {
            color: rgb(156 163 175);
            font-weight: bold;
            text-transform: uppercase;
            font-size: 0.75rem;
          }
          .react-calendar__month-view__days__day--weekend {
            color: rgb(239 68 68);
          }
          .react-calendar__month-view__days__day--neighboringMonth {
            color: rgb(107 114 128);
          }
          .react-calendar__navigation button:disabled {
            background-color: transparent;
          }
          .react-calendar__tile:disabled {
            background-color: transparent;
            color: rgb(107 114 128);
          }
        `}
      </style>
      
      <Calendar
        onChange={(value) => {
          if (value instanceof Date) {
            handleDateChange(value);
          }
        }}
        value={selectedDate}
        className="mb-4"
        tileContent={getTileContent}
        locale="en-GB"
        formatDay={(_, date) => format(date, 'd')}
        formatShortWeekday={(_, date) => 
          ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][date.getDay()]
        }
        calendarType="gregory"
      />
      
      {dateBookings.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Bookings for {format(selectedDate, 'MMMM d, yyyy')}
          </h2>
          {dateBookings.map(renderBookingDetails)}
        </div>
      )}
    </div>
  );
}