import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { toast } from 'react-hot-toast';
import { Camera, X } from 'lucide-react';
import { QRCodeData } from '../types';

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
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(
        (decodedText) => {
          try {
            const data = JSON.parse(decodedText) as QRCodeData;
            navigator.vibrate(200);
            // Play a short beep sound using a base64 encoded MP3
            const audio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAADAAAGhgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr///////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAMAAAAAAAAABoYVzc0zAAAAAAAAAAAAAAAAAAAAAAD/+1DEAAAF3AEoFAAAIugIVKYwQhBkALy4vLy4vAPg+D59S4Ph8AB8Hz68uD4Pg+D4Pn1Lg+D4Pg+D59S4Pg+D4Pg+fUuD4Pg+D4Pn1Lg+D4Pg+D59S4Pg+D4Pg+fUuD4Pg+D4Pn1L');
            audio.play().catch(console.error);
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
      <div className="relative w-full aspect-[5/6] bg-gray-100 rounded-lg overflow-hidden">
        {isScanning ? (
          <>
            <div id="reader" className="w-full h-full"></div>
            <button
              onClick={() => setIsScanning(false)}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={20} />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <Camera size={48} className="mb-2" />
            <p className="text-sm">Scanner view will appear here</p>
          </div>
        )}
      </div>
      
      {!isScanning && (
        <button
          onClick={() => setIsScanning(true)}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Camera size={24} />
          Scan QR Code
        </button>
      )}
    </div>
  );
}