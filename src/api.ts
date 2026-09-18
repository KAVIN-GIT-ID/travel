export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://travel-agencie.apkavin483.workers.dev';

export interface Vehicle {
  id: number;
  name: string;
  type: 'Car' | 'Bus';
  category: string;
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
  state: string; // 'Tamil Nadu', 'Kerala', 'Karnataka'
  category: string;
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
  status: string;
  total_price: number;
  created_at: string;
}

export interface BookingRequest {
  booking_type?: 'package' | 'route_rental';
  package_id?: number;
  package_title?: string;
  vehicle_id?: number;
  vehicle_name?: string;
  pickup_location?: string;
  dropoff_location?: string;
  distance_km?: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  travel_date: string;
  travelers_count: number;
  special_requests?: string;
  total_price?: number;
}

export interface InquiryRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

// Packages
export async function fetchPackages(state?: string, category?: string, search?: string): Promise<Package[]> {
  const params = new URLSearchParams();
  if (state && state !== 'All') params.append('state', state);
  if (category && category !== 'All') params.append('category', category);
  if (search && search.trim()) params.append('search', search.trim());

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_BASE_URL}/api/packages${query}`);
  if (!res.ok) throw new Error('Failed to fetch packages');
  const data = await res.json();
  return data.packages || [];
}

export async function createPackage(payload: Partial<Package>) {
  const res = await fetch(`${API_BASE_URL}/api/packages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create trip plan');
  }
  return await res.json();
}

export async function deletePackage(id: number) {
  const res = await fetch(`${API_BASE_URL}/api/packages/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete package');
  return await res.json();
}

// Vehicles
export async function fetchVehicles(type?: string): Promise<Vehicle[]> {
  const params = new URLSearchParams();
  if (type && type !== 'All') params.append('type', type);
  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_BASE_URL}/api/vehicles${query}`);
  if (!res.ok) throw new Error('Failed to fetch vehicles');
  const data = await res.json();
  return data.vehicles || [];
}

export async function createVehicle(payload: Partial<Vehicle>) {
  const res = await fetch(`${API_BASE_URL}/api/vehicles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to add vehicle');
  }
  return await res.json();
}

export async function deleteVehicle(id: number) {
  const res = await fetch(`${API_BASE_URL}/api/vehicles/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete vehicle');
  return await res.json();
}

// Bookings
export async function fetchBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_BASE_URL}/api/bookings`);
  if (!res.ok) throw new Error('Failed to fetch bookings');
  const data = await res.json();
  return data.bookings || [];
}

export async function createBooking(payload: BookingRequest) {
  const res = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to submit booking');
  }
  return await res.json();
}

export async function updateBookingStatus(id: number, status: string) {
  const res = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return await res.json();
}

// Inquiries
export async function createInquiry(payload: InquiryRequest) {
  const res = await fetch(`${API_BASE_URL}/api/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to submit inquiry');
  }
  return await res.json();
}

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (!res.ok) return { status: 'offline' };
    return await res.json();
  } catch {
    return { status: 'unreachable' };
  }
}
