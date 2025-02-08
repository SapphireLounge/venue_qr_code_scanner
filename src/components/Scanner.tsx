import { useState, useEffect, useContext } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { toast } from 'react-hot-toast';
import { Camera, X } from 'lucide-react';
import { QRCodeData } from '../types';
import { BookingsContext } from '../contexts/bookingsContextCore';

interface ScannerProps {
  onScanSuccess: (data: QRCodeData) => void;
}

export default function Scanner({ onScanSuccess }: ScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannedData, setScannedData] = useState<QRCodeData | null>(null);
  const bookingsContext = useContext(BookingsContext);

  if (!bookingsContext) {
    throw new Error('Scanner must be used within a BookingsProvider');
  }

  const { addBooking } = bookingsContext;

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.mediaDevices.getUserMedia({ video: true });
      result.getTracks().forEach(track => track.stop()); // Clean up the test stream
      setHasPermission(true);
      setIsScanning(true);
    } catch (error) {
      console.error('Camera permission denied:', error);
      setHasPermission(false);
      toast.error('Camera access is required to scan QR codes');
    }
  };

  const handleScanClick = async () => {
    if (hasPermission === null) {
      await checkCameraPermission();
    } else if (hasPermission) {
      setIsScanning(true);
      setScannedData(null);
    } else {
      toast.error('Camera access is required to scan QR codes');
    }
  };

  const handleClose = () => {
    setScannedData(null);
    setIsScanning(false);
  };

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (isScanning) {
      scanner = new Html5QrcodeScanner(
        'reader',
        {
          qrbox: {
            width: 250,
            height: 250,
          },
          fps: 5,
          rememberLastUsedCamera: true,
          aspectRatio: 1,
          videoConstraints: {
            facingMode: 'environment',
          },
        },
        false
      );

      scanner.render(
        (decodedText) => {
          try {
            const data = JSON.parse(decodedText) as QRCodeData;
            navigator.vibrate(200);
            const audio = new Audio('/assets/audio/Checkout Scanner Beep.mp3');
            audio.play().catch(console.error);
            setScannedData(data);
            scanner?.clear();
            setIsScanning(false);
          } catch {
            toast.error('Invalid QR Code format');
          }
        },
        () => {
          console.error('QR Code scanning error');
        }
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [isScanning]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">QR Code Scanner</h2>
          <div className="flex flex-col items-center justify-center space-y-4">
            {scannedData ? (
              <div className="w-full bg-gray-700 rounded-lg p-4 space-y-3">
                <h3 className="text-lg font-semibold text-green-400 mb-2">Successfully Scanned!</h3>
                <div className="space-y-2 text-gray-200">
                  {Object.entries(scannedData).map(([key, value]) => (
                    <p key={key}>
                      <span className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>{' '}
                      {value?.toString()}
                    </p>
                  ))}
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      addBooking(scannedData);
                      onScanSuccess(scannedData);
                      handleClose();
                      toast.success('Booking added to calendar successfully!');
                    }}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : isScanning ? (
              <div className="relative w-full">
                <div id="reader" className="w-full rounded-lg overflow-hidden"></div>
                <button
                  onClick={() => setIsScanning(false)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleScanClick}
                className="flex items-center gap-2 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Camera size={24} />
                <span>Scan QR Code</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}