import { QRCodeData } from '../types';
import { useNavigate } from 'react-router-dom';
import { useBookings } from '../contexts/bookingsContextCore';

interface ScanResultToastProps {
  data: QRCodeData;
  onClose: () => void;
}

export function ScanResultToast({ data, onClose }: ScanResultToastProps) {
  const navigate = useNavigate();
  const { addBooking } = useBookings();

  const handleConfirm = () => {
    addBooking(data);
    navigate('/bookings');
    onClose();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm">
        <strong>Customer:</strong> {data.customerName}
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleConfirm}
          className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
        >
          Confirm
        </button>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}
