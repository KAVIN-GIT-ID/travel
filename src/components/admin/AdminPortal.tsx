import React, { useState, useEffect } from 'react';
import type { Booking, Package, Vehicle, SouthIndiaState, BookingStatus, User } from '../../types';
import { formatINR } from '../../utils/distance';
import { packageService, vehicleService, bookingService, authService } from '../../services/api';
import { BusLogo } from '../common/BusLogo';

interface AdminPortalProps {
  currentUser: User | null;
  onOpenLogin: () => void;
  bookings: Booking[];
  packages: Package[];
  vehicles: Vehicle[];
  onRefreshData: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  onOpenLogin,
  bookings,
  packages,
  vehicles,
  onRefreshData,
}) => {
  const [currentTab, setCurrentTab] = useState<'bookings' | 'add-package' | 'add-vehicle' | 'users'>('bookings');
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userRoleMessage, setUserRoleMessage] = useState('');

  // Load registered users for admin management
  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const list = await authService.getAllUsers();
      setUsersList(list);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      loadUsers();
    }
  }, [currentUser]);

  const handleRoleToggle = async (userId: number, currentRole: 'user' | 'admin') => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      setUserRoleMessage('');
      await authService.updateUserRole(userId, nextRole);
      setUserRoleMessage(`Role updated successfully in database!`);
      loadUsers();
      setTimeout(() => setUserRoleMessage(''), 4000);
    } catch (err: any) {
      alert('Error updating user role: ' + err.message);
    }
  };

  // New Package State
  const [pkgForm, setPkgForm] = useState({
    title: '',
    destination: '',
    state: 'Tamil Nadu' as SouthIndiaState,
    category: 'Hill Station',
    price: 12500,
    duration_days: 3,
    image_url: '',
    description: '',
    highlights: '',
    featured: 0,
  });
  const [pkgSaving, setPkgSaving] = useState(false);
  const [pkgMessage, setPkgMessage] = useState('');

  // New Vehicle State
  const [vehForm, setVehForm] = useState({
    name: '',
    type: 'Car' as 'Car' | 'Bus',
    category: 'Prime SUV',
    per_km_rate: 20,
    base_fare: 800,
    capacity: 7,
    ac_type: 'Full Dual AC',
    luggage_capacity: 5,
    image_url: '',
    description: '',
  });
  const [vehSaving, setVehSaving] = useState(false);
  const [vehMessage, setVehMessage] = useState('');

  const handleUpdateStatus = async (id: number, status: BookingStatus) => {
    try {
      await bookingService.updateStatus(id, status);
      onRefreshData();
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setPkgSaving(true);
    setPkgMessage('');
    try {
      await packageService.create(pkgForm);
      setPkgMessage('Tour package published successfully to Cloudflare D1!');
      setPkgForm({
        title: '',
        destination: '',
        state: 'Tamil Nadu',
        category: 'Hill Station',
        price: 12500,
        duration_days: 3,
        image_url: '',
        description: '',
        highlights: '',
        featured: 0,
      });
      onRefreshData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setPkgSaving(false);
    }
  };

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setVehSaving(true);
    setVehMessage('');
    try {
      await vehicleService.create(vehForm);
      setVehMessage('Vehicle added to fleet successfully in Cloudflare D1!');
      setVehForm({
        name: '',
        type: 'Car',
        category: 'Prime SUV',
        per_km_rate: 20,
        base_fare: 800,
        capacity: 7,
        ac_type: 'Full Dual AC',
        luggage_capacity: 5,
        image_url: '',
        description: '',
      });
      onRefreshData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setVehSaving(false);
    }
  };

  const handleDeletePackage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    try {
      await packageService.delete(id);
      onRefreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteVehicle = async (id: number) => {
    if (!confirm('Are you sure you want to remove this vehicle?')) return;
    try {
      await vehicleService.delete(id);
      onRefreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 1. Not Logged In Screen (Clean Human Design)
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-8 sm:my-14 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 text-center shadow-xs">
        <div className="flex justify-center mb-4">
          <BusLogo size="md" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Sign In to Your Account
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed max-w-sm mx-auto">
          Sign in with Google to view your tour reservations, track driver contact details, or manage holiday bookings.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={onOpenLogin}
            className="w-full bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-800 font-semibold py-3 px-4 rounded-xl border border-gray-300 shadow-xs transition flex items-center justify-center gap-3 text-sm cursor-pointer"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
        <div className="mt-5 pt-4 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Single sign-on protected by Google Identity Services</span>
        </div>
      </div>
    );
  }

  // 2. Normal User Account Screen (Customer Bookings Dashboard)
  if (currentUser.role !== 'admin') {
    const myBookings = bookings.filter(
      (b) => b.customer_email?.toLowerCase() === currentUser.email?.toLowerCase()
    );

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* User Account Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg shrink-0">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Welcome, {currentUser.name}
              </h2>
              <p className="text-xs text-gray-500">
                {currentUser.email} • Account Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <a
              href="tel:+919840123456"
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>24x7 Customer Helpline</span>
            </a>
          </div>
        </div>

        {/* User Bookings Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <h3 className="font-bold text-base text-gray-900">My Holiday Bookings</h3>
            <span className="text-xs text-gray-500">{myBookings.length} Active Reservations</span>
          </div>

          {myBookings.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-800">No active bookings found</p>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Ready to plan your next holiday? Explore our curated South India packages or calculate custom trip fares.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myBookings.map((b) => (
                <div key={b.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-900">Booking #{b.id}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded capitalize ${
                      b.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-800 font-medium">
                    {b.pickup_location} ➔ {b.dropoff_location}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Travel Date: {b.travel_date} • Fare: <strong className="text-gray-900 price">{formatINR(b.total_price)}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. Authenticated Admin View
  return (
    <div className="space-y-6">
      {/* Admin Subnav */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              Operations &amp; Fleet Management
            </span>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded border border-emerald-200">
              Admin: {currentUser.name}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-0.5">
            South India Travels Admin
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-md shadow-2xs border border-gray-300 bg-white overflow-hidden divide-x divide-gray-200">
            <button
              type="button"
              onClick={() => setCurrentTab('bookings')}
              className={`px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                currentTab === 'bookings' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Bookings ({bookings.length})
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('add-package')}
              className={`px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                currentTab === 'add-package' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              + Add Tour
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('add-vehicle')}
              className={`px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                currentTab === 'add-vehicle' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              + Add Vehicle
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentTab('users');
                loadUsers();
              }}
              className={`px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                currentTab === 'users' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Users &amp; DB Roles ({usersList.length})
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: Bookings Management */}
      {currentTab === 'bookings' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-base">Customer Reservations</h3>
            <button
              onClick={onRefreshData}
              className="text-xs bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md font-medium transition shadow-2xs cursor-pointer"
            >
              Refresh Data
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider text-[11px] font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Ref</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Vehicle / Package</th>
                  <th className="py-3 px-4">Route</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Fare</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      No reservations found in database.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-gray-700">#{b.id}</td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-gray-100 text-gray-800">
                          {b.booking_type === 'route_rental' ? 'Route Rental' : 'Tour Package'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900">{b.customer_name}</div>
                        <div className="text-xs text-gray-500">{b.customer_phone || b.customer_email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-800">
                          {b.vehicle_name || b.package_title || 'Custom Travel'}
                        </div>
                        <div className="text-xs text-gray-400">{b.travelers_count} passenger(s)</div>
                      </td>
                      <td className="py-3 px-4">
                        {b.booking_type === 'route_rental' ? (
                          <div>
                            <div className="text-xs font-medium text-gray-900">{b.pickup_location} ➔ {b.dropoff_location}</div>
                            <div className="text-[11px] text-blue-600 font-bold">{b.distance_km} km</div>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-xs">Standard Itinerary</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-700">{b.travel_date}</td>
                      <td className="py-3 px-4 font-extrabold text-gray-900">
                        {formatINR(b.total_price)}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={b.status || 'Confirmed'}
                          onChange={(e) => handleUpdateStatus(b.id, e.target.value as BookingStatus)}
                          className="text-xs bg-white border border-gray-300 rounded px-2 py-1 font-medium text-gray-800 outline-none cursor-pointer"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Add New Tour Package */}
      {currentTab === 'add-package' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-5 sm:p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 text-base mb-4">
              Create New South India Tour Package
            </h3>

            {pkgMessage && (
              <div className="bg-emerald-50 text-emerald-700 text-xs p-3 rounded-md border border-emerald-200 mb-4">
                {pkgMessage}
              </div>
            )}

            <form onSubmit={handleCreatePackage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                    Trip Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rameshwaram &amp; Dhanushkodi Island"
                    value={pkgForm.title}
                    onChange={(e) => setPkgForm({ ...pkgForm, title: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                    Destination Spot *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rameshwaram &amp; Madurai"
                    value={pkgForm.destination}
                    onChange={(e) => setPkgForm({ ...pkgForm, destination: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                    State *
                  </label>
                  <select
                    value={pkgForm.state}
                    onChange={(e) => setPkgForm({ ...pkgForm, state: e.target.value as SouthIndiaState })}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Karnataka">Karnataka</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                    Category
                  </label>
                  <select
                    value={pkgForm.category}
                    onChange={(e) => setPkgForm({ ...pkgForm, category: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Hill Station">Hill Station</option>
                    <option value="Backwaters">Backwaters</option>
                    <option value="Heritage">Heritage</option>
                    <option value="Coastal">Coastal</option>
                    <option value="Wildlife">Wildlife</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                    Price Per Person (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={pkgForm.price}
                    onChange={(e) => setPkgForm({ ...pkgForm, price: Number(e.target.value) })}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                    Duration (Days) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={pkgForm.duration_days}
                    onChange={(e) => setPkgForm({ ...pkgForm, duration_days: Number(e.target.value) })}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={pkgForm.image_url}
                  onChange={(e) => setPkgForm({ ...pkgForm, image_url: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                  Highlights (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Pamban Sea Bridge, Ramanathaswamy Temple, Sunset Point"
                  value={pkgForm.highlights}
                  onChange={(e) => setPkgForm({ ...pkgForm, highlights: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                  Overview Description
                </label>
                <textarea
                  rows={3}
                  value={pkgForm.description}
                  onChange={(e) => setPkgForm({ ...pkgForm, description: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={pkgSaving}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-5 py-2 rounded-md transition shadow-sm text-sm cursor-pointer"
              >
                {pkgSaving ? 'Saving...' : 'Publish Tour to D1'}
              </button>
            </form>
          </div>

          {/* Existing Packages List */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <h4 className="font-bold text-gray-900 text-sm mb-3">
              Existing Trips ({packages.length})
            </h4>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {packages.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200 text-xs">
                  <div>
                    <div className="font-bold text-gray-900">{p.title}</div>
                    <div className="text-gray-500">{p.state} • {formatINR(p.price)}</div>
                  </div>
                  <button
                    onClick={() => handleDeletePackage(p.id)}
                    className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Add Vehicle */}
      {currentTab === 'add-vehicle' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-5 sm:p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 text-base mb-4">
              Add Vehicle to Fleet (Bus / Car)
            </h3>

            {vehMessage && (
              <div className="bg-emerald-50 text-emerald-700 text-xs p-3 rounded-md border border-emerald-200 mb-4">
                {vehMessage}
              </div>
            )}

            <form onSubmit={handleCreateVehicle} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                    Vehicle Model Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Toyota Innova Hycross / Volvo B11R"
                    value={vehForm.name}
                    onChange={(e) => setVehForm({ ...vehForm, name: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                    Vehicle Type *
                  </label>
                  <select
                    value={vehForm.type}
                    onChange={(e) => setVehForm({ ...vehForm, type: e.target.value as 'Car' | 'Bus' })}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Car">Car</option>
                    <option value="Bus">Bus</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                    Per KM Billing Rate (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={vehForm.per_km_rate}
                    onChange={(e) => setVehForm({ ...vehForm, per_km_rate: Number(e.target.value) })}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                    Base Fare (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={vehForm.base_fare}
                    onChange={(e) => setVehForm({ ...vehForm, base_fare: Number(e.target.value) })}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                    Passenger Capacity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={vehForm.capacity}
                    onChange={(e) => setVehForm({ ...vehForm, capacity: Number(e.target.value) })}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                    AC Specification
                  </label>
                  <input
                    type="text"
                    value={vehForm.ac_type}
                    onChange={(e) => setVehForm({ ...vehForm, ac_type: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={vehForm.image_url}
                  onChange={(e) => setVehForm({ ...vehForm, image_url: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                  Vehicle Description
                </label>
                <textarea
                  rows={2}
                  value={vehForm.description}
                  onChange={(e) => setVehForm({ ...vehForm, description: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={vehSaving}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-5 py-2 rounded-md transition shadow-sm text-sm cursor-pointer"
              >
                {vehSaving ? 'Saving...' : 'Add Vehicle to D1 Fleet'}
              </button>
            </form>
          </div>

          {/* Active Fleet List */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <h4 className="font-bold text-gray-900 text-sm mb-3">
              Active Fleet ({vehicles.length})
            </h4>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {vehicles.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200 text-xs">
                  <div>
                    <div className="font-bold text-gray-900">{v.name}</div>
                    <div className="text-gray-500">{v.type} • ₹{v.per_km_rate}/km • {v.capacity} seats</div>
                  </div>
                  <button
                    onClick={() => handleDeleteVehicle(v.id)}
                    className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Users & Database Roles */}
      {currentTab === 'users' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Registered Google Users &amp; Database Roles
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Roles are stored dynamically in Cloudflare D1 (<code className="text-blue-600 font-bold">users.role</code>). No hardcoded passwords or roles.
              </p>
            </div>
            <button
              type="button"
              onClick={loadUsers}
              className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-md transition shadow-2xs cursor-pointer flex items-center gap-1 self-start sm:self-auto"
            >
              <span>🔄</span>
              <span>Refresh Users</span>
            </button>
          </div>

          {userRoleMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-lg flex items-center gap-2">
              <span>✓</span>
              <span>{userRoleMessage}</span>
            </div>
          )}

          {loadingUsers ? (
            <div className="p-8 text-center text-xs text-gray-500">
              Loading users from Cloudflare D1 database...
            </div>
          ) : usersList.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">
              No users registered yet. When visitors sign in with Google OAuth, their profile is automatically recorded here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 border-y border-gray-200 text-gray-600 uppercase font-semibold text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Database Role</th>
                    <th className="py-3 px-4">Registered On</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {u.picture ? (
                            <img
                              src={u.picture}
                              alt={u.name}
                              className="w-8 h-8 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                              {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                          )}
                          <span className="font-bold text-gray-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-600">{u.email}</td>
                      <td className="py-3.5 px-4">
                        {u.role === 'admin' ? (
                          <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded border border-emerald-200">
                            Admin
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-200">
                            Customer
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleRoleToggle(u.id, u.role)}
                          className={`text-xs font-bold px-3 py-1 rounded transition cursor-pointer ${
                            u.role === 'admin'
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800">
              💡 Direct D1 Terminal Management (Optional):
            </div>
            <p className="text-[11px] leading-relaxed">
              You can also promote any user directly via Wrangler CLI:
              <br />
              <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono text-[10px]">
                npx wrangler d1 execute travel-agencie-db --remote --command &quot;UPDATE users SET role = &apos;admin&apos; WHERE email = &apos;user@gmail.com&apos;;&quot;
              </code>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

