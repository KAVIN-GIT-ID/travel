import type {
  Package,
  Vehicle,
  Booking,
  BookingRequest,
  InquiryRequest,
} from '../types';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://travel-agencie.apkavin483.workers.dev';

// Generic Fetch Wrapper with Error Handling
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}: Failed to execute request`);
    }
    return data as T;
  } catch (err: any) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

// Packages Service
export const packageService = {
  async getAll(state?: string, category?: string, search?: string): Promise<Package[]> {
    const params = new URLSearchParams();
    if (state && state !== 'All') params.append('state', state);
    if (category && category !== 'All') params.append('category', category);
    if (search && search.trim()) params.append('search', search.trim());

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await request<{ packages: Package[] }>(`/api/packages${query}`);
    return res.packages || [];
  },

  async create(payload: Partial<Package>): Promise<{ success: boolean; package_id: number }> {
    return await request('/api/packages', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async delete(id: number): Promise<{ success: boolean }> {
    return await request(`/api/packages/${id}`, {
      method: 'DELETE',
    });
  },
};

// Vehicles Service
export const vehicleService = {
  async getAll(type?: string): Promise<Vehicle[]> {
    const params = new URLSearchParams();
    if (type && type !== 'All') params.append('type', type);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await request<{ vehicles: Vehicle[] }>(`/api/vehicles${query}`);
    return res.vehicles || [];
  },

  async create(payload: Partial<Vehicle>): Promise<{ success: boolean; vehicle_id: number }> {
    return await request('/api/vehicles', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async delete(id: number): Promise<{ success: boolean }> {
    return await request(`/api/vehicles/${id}`, {
      method: 'DELETE',
    });
  },
};

// Bookings Service
export const bookingService = {
  async getAll(): Promise<Booking[]> {
    const res = await request<{ bookings: Booking[] }>('/api/bookings');
    return res.bookings || [];
  },

  async create(payload: BookingRequest): Promise<{ success: boolean; booking_id: number; total_price: number }> {
    return await request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateStatus(id: number, status: string): Promise<{ success: boolean }> {
    return await request(`/api/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// Inquiry Service
export const inquiryService = {
  async create(payload: InquiryRequest): Promise<{ success: boolean; inquiry_id: number }> {
    return await request('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

// Health Service
export const healthService = {
  async check(): Promise<{ status: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`);
      if (!res.ok) return { status: 'offline' };
      return await res.json();
    } catch {
      return { status: 'unreachable' };
    }
  },
};

// Auth & Users Service
export const authService = {
  async loginWithGoogle(data: {
    credential?: string;
    email?: string;
    name?: string;
    picture?: string;
  }): Promise<{ success: boolean; user: import('../types').User }> {
    return await request('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMe(email: string): Promise<{ user: import('../types').User }> {
    return await request(`/api/auth/me?email=${encodeURIComponent(email)}`);
  },

  async getAllUsers(): Promise<import('../types').User[]> {
    const res = await request<{ users: import('../types').User[] }>('/api/admin/users');
    return res.users || [];
  },

  async updateUserRole(
    userId: number,
    role: 'user' | 'admin'
  ): Promise<{ success: boolean; user: import('../types').User }> {
    return await request(`/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },
};

