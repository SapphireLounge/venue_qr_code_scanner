import QRCode from 'qrcode';
import { ReservationData } from '../types';

export const generateReservationQRCode = async (reservation: ReservationData): Promise<string> => {
  try {
    // Generate a random reservation code (you can modify this as needed)
    const reservationCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create compressed QR data
    const qrData = {
      c: reservationCode,      // Reservation code
      d: reservation.date,     // Date
      t: reservation.time,     // Time
      n: reservation.name,     // Name
      g: reservation.guests,   // Number of guests
      p: reservation.phone,    // Phone number
      ts: new Date().toISOString().split('T')[0]  // Timestamp
    };

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'M',
      width: 256,
      margin: 2,
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

export const submitReservation = async (reservationData: ReservationData) => {
  try {
    const qrCode = await generateReservationQRCode(reservationData);
    return {
      success: true,
      message: 'Reservation created successfully',
      data: {
        ...reservationData,
        qrCode
      }
    };
  } catch (error) {
    console.error('Error submitting reservation:', error);
    return {
      success: false,
      message: 'Failed to create reservation',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
