export type SouthIndiaState = 'Tamil Nadu' | 'Kerala' | 'Karnataka';

export interface LocationPoint {
  id: string;
  name: string;
  state: SouthIndiaState;
  lat: number;
  lng: number;
  popularHub?: boolean;
}

export interface Vehicle {
  id: number;
  name: string;
  type: 'Car' | 'Bus';
  category: string; // 'Sedan', 'Prime SUV', 'Tempo Traveler', 'Mini Coach', 'Luxury Bus'
  per_km_rate: number;
  base_fare: number;
  capacity: number;
  ac_type: string;
  luggage_capacity: number;
  image_url: string;
  description: string;
  created_at?: string;
}

export interface Package {
  id: number;
  title: string;
  destination: string;
  country: string;
  state: SouthIndiaState;
  category: string; // 'Hill Station', 'Heritage', 'Wildlife', 'Backwaters', 'Coastal'
  price: number;
  duration_days: number;
  rating: number;
  reviews_count: number;
  image_url: string;
  description: string;
  highlights: string;
  featured: number;
  created_at?: string;
}

export type BookingStatus = 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';

export interface Booking {
  id: number;
  package_id?: number;
  package_title?: string;
  vehicle_id?: number;
  vehicle_name?: string;
  booking_type: 'package' | 'route_rental';
  pickup_location?: string;
  dropoff_location?: string;
  distance_km?: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  travel_date: string;
  travelers_count: number;
  special_requests?: string;
  status: BookingStatus;
  total_price: number;
  created_at: string;
}

export interface BookingRequest {
  booking_type: 'package' | 'route_rental';
  package_id?: number;
  package_title?: string;
  vehicle_id?: number;
  vehicle_name?: string;
  pickup_location?: string;
  dropoff_location?: string;
  distance_km?: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  travel_date: string;
  travelers_count: number;
  special_requests?: string;
  total_price: number;
}

export interface InquiryRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  email: string;
  name: string;
  picture?: string;
  role: UserRole;
  created_at?: string;
}

