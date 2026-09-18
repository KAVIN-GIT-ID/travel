export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://travel-agencie.apkavin483.workers.dev';

export interface Package {
  id: number;
  title: string;
  destination: string;
  country: string;
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
  package_title: string;
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
  package_id?: number;
  package_title: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  travel_date: string;
  travelers_count: number;
  special_requests?: string;
}

export interface InquiryRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function fetchPackages(category?: string, search?: string): Promise<Package[]> {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (search && search.trim()) params.append('search', search.trim());

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_BASE_URL}/api/packages${query}`);
  if (!res.ok) throw new Error('Failed to fetch packages');
  const data = await res.json();
  return data.packages || [];
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

export async function fetchBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_BASE_URL}/api/bookings`);
  if (!res.ok) throw new Error('Failed to fetch bookings');
  const data = await res.json();
  return data.bookings || [];
}

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
