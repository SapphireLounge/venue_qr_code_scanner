export interface Booking {
  id: string;
  customerName: string;
  date: string;
  time: string;
  email?: string;
  phone?: string;
  details: string;
  notificationSent: boolean;
}

export interface QRCodeData {
  customerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  table: string;
  occasion: string;
  specialRequests?: string;
}

export interface ReservationData {
  date: string | null;
  time: string;
  name: string;
  phone: string;
  email: string;
  guests: number;
  tablePreference: string;
  occasion: string;
  specialRequests?: string;
  notes?: string;
  qrCode?: string;
  timestamp?: string;
}