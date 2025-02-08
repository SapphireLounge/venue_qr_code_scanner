import { useState } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { QRCodeData } from '../types';
import { Mail, Phone, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import 'react-calendar/dist/Calendar.css';

interface BookingCalendarProps {
  bookings: QRCodeData[];
}

export default function BookingCalendar({ bookings }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<QRCodeData | null>(null);

  const dateBookings = bookings.filter(
    (booking) => booking.date === format(selectedDate, 'yyyy-MM-dd')
  );

  const handleNotification = async (booking: QRCodeData, type: 'email' | 'sms') => {
    // In a real app, this would connect to a notification service
    toast.success(`${type === 'email' ? 'Email' : 'SMS'} sent to ${booking.customerName}`);
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
            setSelectedDate(value);
            setSelectedBooking(null);
          }
        }}
        value={selectedDate}
        className="rounded-lg bg-gray-800 text-white p-4 w-full"
      />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Selected Date: {format(selectedDate, 'MMMM d, yyyy')}
        </h2>
        
        <div className="space-y-4">
          {dateBookings.length === 0 ? (
            <p className="text-gray-400">No bookings for this date</p>
          ) : (
            dateBookings.map((booking) => (
              <div
                key={booking.customerName}
                className="p-4 rounded-lg bg-gray-800 cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => setSelectedBooking(booking)}
              >
                <h3 className="font-semibold text-lg">{booking.customerName}</h3>
                <p className="text-gray-300">Time: {booking.time}</p>
              </div>
            ))
          )}
        </div>

        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
              <button
                onClick={() => setSelectedBooking(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
              <div className="space-y-3">
                {Object.entries(selectedBooking).map(([key, value]) => (
                  <p key={key} className="text-gray-200">
                    <span className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>{' '}
                    {value?.toString()}
                  </p>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleNotification(selectedBooking, 'email')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  <Mail size={20} />
                  Send Email
                </button>
                <button
                  onClick={() => handleNotification(selectedBooking, 'sms')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  <Phone size={20} />
                  Send SMS
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}