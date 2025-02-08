import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { toast } from 'react-hot-toast';
import { Camera, X } from 'lucide-react';
import { QRCodeData } from '../types';
import { ScanResultToast } from './ScanResultToast';

interface ScannerProps {
  onScanSuccess: (data: QRCodeData) => void;
}

export default function Scanner({ onScanSuccess }: ScannerProps) {
  const [isScanning, setIsScanning] = useState(false);

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
          rememberLastUsedCamera: false,
          aspectRatio: 1,
          videoConstraints: {
            facingMode: 'environment', // Use back camera
          },
        },
        false
      );

      scanner.render(
        (decodedText) => {
          try {
            const data = JSON.parse(decodedText) as QRCodeData;
            navigator.vibrate(200);
            // Play checkout scanner beep sound
            const audio = new Audio('/assets/audio/Checkout Scanner Beep.mp3');
            audio.play().catch(console.error);
            // Show custom toast with confirm and close buttons
            toast.custom(
              (t) => (
                <ScanResultToast
                  data={data}
                  onClose={() => toast.dismiss(t.id)}
                />
              ),
              {
                duration: 5000,
              }
            );
            onScanSuccess(data);
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
  }, [isScanning, onScanSuccess]);

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      <div className="flex flex-col items-center justify-center h-full">
        {isScanning ? (
          <div className="w-full max-w-lg p-4 bg-gray-800 rounded-lg">
            <div id="reader" className="w-full"></div>
            <button
              onClick={() => setIsScanning(false)}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsScanning(true)}
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Camera size={24} />
            <span>Scan QR Code</span>
          </button>
        )}
      </div>
    </div>
  );
}