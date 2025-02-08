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