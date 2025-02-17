import { useState, useEffect, useContext } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { toast } from 'react-hot-toast';
import { Camera, X } from 'lucide-react';
import { QRCodeData } from '../types';
import { BookingsContext } from '../contexts/bookingsContextCore';
import { format } from 'date-fns';

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
            width: 400,
            height: 400,
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
            console.log('Raw QR Code data:', decodedText);
            let compressedData;
            
            try {
              compressedData = JSON.parse(decodedText);
            } catch {
              // If JSON.parse fails, try to parse URL-encoded format
              const params = new URLSearchParams(decodedText);
              compressedData = {
                n: params.get('n') || '',
                e: params.get('e') || '',
                p: params.get('p') || '',
                d: params.get('d') || '',
                t: params.get('t') || '',
                g: params.get('g') || '1',
                c: params.get('c') || '',
                o: params.get('o') || '',
                s: params.get('s') || ''
              };
            }
            
            console.log('Parsed compressed data:', compressedData);
            
            // Validate required fields
            if (!compressedData.n || !compressedData.d || !compressedData.t) {
              throw new Error('Missing required booking information');
            }

            // Validate date format (YYYY-MM-DD)
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(compressedData.d)) {
              throw new Error('Invalid date format');
            }

            // Validate time format (HH:mm)
            const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(compressedData.t)) {
              throw new Error('Invalid time format');
            }

            // Map compressed format to our QRCodeData format with improved defaults
            const data: QRCodeData = {
              customerName: compressedData.n.trim(),
              email: compressedData.e?.trim() || '',
              phone: compressedData.p?.trim() || '',
              date: compressedData.d,
              time: compressedData.t,
              guests: parseInt(compressedData.g) || 1,
              table: compressedData.c?.trim() || 'Not assigned',
              occasion: compressedData.o?.trim() || 'Regular visit',
              specialRequests: compressedData.s?.trim() || ''
            };
            
            // Validate guests number
            if (data.guests < 1 || data.guests > 20) {
              throw new Error('Invalid number of guests');
            }

            console.log('Mapped QR Code data:', data);
            
            // Provide success feedback
            navigator.vibrate(200);
            const audio = new Audio('/assets/audio/Checkout Scanner Beep.mp3');
            audio.play().catch(console.error);
            
            // Show success toast with booking details
            toast.success(
              `Booking scanned for ${data.customerName}\n${data.date} at ${data.time}`,
              { duration: 3000 }
            );

            setScannedData(data);
            scanner?.clear();
            setIsScanning(false);
          } catch (error) {
            console.error('QR Code scanning error:', error);
            
            // Provide specific error messages based on the error type
            const errorMessage = error instanceof Error 
              ? error.message
              : 'Invalid QR Code format';
            
            toast.error(errorMessage, {
              duration: 4000,
              icon: '❌'
            });
            
            // Reset scanner state
            scanner?.clear();
            setIsScanning(false);
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
      <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">QR Code Scanner</h2>
          <div className="flex flex-col items-center justify-center space-y-4">
            {scannedData ? (
              <div className="w-full bg-gray-700 rounded-lg p-4 space-y-3">
                <h3 className="text-lg font-semibold text-green-400 mb-2">Successfully Scanned!</h3>
                <div className="space-y-3 text-gray-200">
                  {scannedData.customerName && (
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400">👤</span>
                      <div>
                        <p className="font-semibold">{scannedData.customerName}</p>
                        {scannedData.email && <p className="text-sm text-gray-400">{scannedData.email}</p>}
                        {scannedData.phone && <p className="text-sm text-gray-400">{scannedData.phone}</p>}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">📅</span>
                    <div>
                      <p className="font-semibold">{format(new Date(scannedData.date), 'MMMM d, yyyy')}</p>
                      <p className="text-sm text-gray-400">{scannedData.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-purple-400">🎯</span>
                    <div>
                      <p><span className="font-semibold">Table: </span>{scannedData.table || 'Not assigned'}</p>
                      <p><span className="font-semibold">Guests: </span>{scannedData.guests}</p>
                      {scannedData.occasion && (
                        <p><span className="font-semibold">Occasion: </span>{scannedData.occasion}</p>
                      )}
                    </div>
                  </div>

                  {scannedData.specialRequests && (
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">📝</span>
                      <div>
                        <p className="font-semibold">Special Requests:</p>
                        <p className="text-sm text-gray-400">{scannedData.specialRequests}</p>
                      </div>
                    </div>
                  )}
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