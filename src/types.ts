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
  date: string;
  time: string;
  email?: string;
  phone?: string;
  details: string;
}