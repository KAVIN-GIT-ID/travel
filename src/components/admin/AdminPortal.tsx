import React, { useState } from 'react';
import type { Booking, Package, Vehicle, SouthIndiaState, BookingStatus } from '../../types';
import { formatINR } from '../../utils/distance';
import { packageService, vehicleService, bookingService } from '../../services/api';

interface AdminPortalProps {
  bookings: Booking[];
  packages: Package[];
  vehicles: Vehicle[];
  onRefreshData: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  bookings,
  packages,
  vehicles,
  onRefreshData,
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [currentTab, setCurrentTab] = useState<'bookings' | 'add-package' | 'add-vehicle'>('bookings');

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

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === 'admin123' || pin === '1234') {
      setIsUnlocked(true);
      setPinError('');
    } else {
      setPinError('Invalid passcode. Default PIN: admin123');
    }
  };

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

  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto text-xl font-bold mb-3">
          🔒
        </div>
        <h3 className="text-xl font-bold text-slate-900">Staff Admin Login</h3>
        <p className="text-xs text-slate-500 mt-1">
          Enter staff passcode to access bookings and fleet inventory management.
        </p>

        <form onSubmit={handlePinSubmit} className="mt-6 space-y-4 text-left">
          {pinError && (
            <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-lg border border-rose-200">
              {pinError}
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Admin Passcode
            </label>
            <input
              type="password"
              placeholder="Enter passcode (admin123)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition shadow-sm text-sm"
          >
            Unlock Portal
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Subnav */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Operations &amp; Fleet Management
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            South India Travels Admin
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setCurrentTab('bookings')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentTab === 'bookings' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              Bookings ({bookings.length})
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('add-package')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentTab === 'add-package' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              + Add Trip
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('add-vehicle')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentTab === 'add-vehicle' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              + Add Vehicle
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsUnlocked(false)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition"
          >
            Lock
          </button>
        </div>
      </div>

      {/* TAB 1: Bookings Management */}
      {currentTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Customer Reservations</h3>
            <button
              onClick={onRefreshData}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-semibold transition"
            >
              Refresh Data
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Ref</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Vehicle / Package</th>
                  <th className="py-3.5 px-4">Route</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Fare</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No reservations found.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-600">#{b.id}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-700">
                          {b.booking_type === 'route_rental' ? 'Route Rental' : 'Tour Package'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{b.customer_name}</div>
                        <div className="text-xs text-slate-500">{b.customer_phone || b.customer_email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">
                          {b.vehicle_name || b.package_title || 'Custom Travel'}
                        </div>
                        <div className="text-xs text-slate-400">{b.travelers_count} passenger(s)</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {b.booking_type === 'route_rental' ? (
                          <div>
                            <div className="text-xs font-semibold text-slate-800">{b.pickup_location} ➔ {b.dropoff_location}</div>
                            <div className="text-[11px] text-blue-600 font-bold">{b.distance_km} km</div>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-xs">Standard Itinerary</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">{b.travel_date}</td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        {formatINR(b.total_price)}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={b.status || 'Confirmed'}
                          onChange={(e) => handleUpdateStatus(b.id, e.target.value as BookingStatus)}
                          className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-800 outline-none cursor-pointer"
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
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-4">
              Create New South India Tour Package
            </h3>

            {pkgMessage && (
              <div className="bg-emerald-50 text-emerald-700 text-xs p-3 rounded-lg border border-emerald-200 mb-4">
                {pkgMessage}
              </div>
            )}

            <form onSubmit={handleCreatePackage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Trip Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rameshwaram &amp; Dhanushkodi Island"
                    value={pkgForm.title}
                    onChange={(e) => setPkgForm({ ...pkgForm, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Destination Spot *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rameshwaram &amp; Madurai"
                    value={pkgForm.destination}
                    onChange={(e) => setPkgForm({ ...pkgForm, destination: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    State *
                  </label>
                  <select
                    value={pkgForm.state}
                    onChange={(e) => setPkgForm({ ...pkgForm, state: e.target.value as SouthIndiaState })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium"
                  >
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Karnataka">Karnataka</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={pkgForm.category}
                    onChange={(e) => setPkgForm({ ...pkgForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium"
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
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Price Per Person (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={pkgForm.price}
                    onChange={(e) => setPkgForm({ ...pkgForm, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Duration (Days) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={pkgForm.duration_days}
                    onChange={(e) => setPkgForm({ ...pkgForm, duration_days: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={pkgForm.image_url}
                  onChange={(e) => setPkgForm({ ...pkgForm, image_url: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Highlights (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Pamban Sea Bridge, Ramanathaswamy Temple, Sunset Point"
                  value={pkgForm.highlights}
                  onChange={(e) => setPkgForm({ ...pkgForm, highlights: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Overview Description
                </label>
                <textarea
                  rows={3}
                  value={pkgForm.description}
                  onChange={(e) => setPkgForm({ ...pkgForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={pkgSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition shadow-sm text-sm"
              >
                {pkgSaving ? 'Saving...' : 'Publish Tour to D1'}
              </button>
            </form>
          </div>

          {/* Existing Packages List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 text-sm mb-3">
              Existing Trips ({packages.length})
            </h4>
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {packages.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{p.title}</div>
                    <div className="text-slate-500">{p.state} • {formatINR(p.price)}</div>
                  </div>
                  <button
                    onClick={() => handleDeletePackage(p.id)}
                    className="text-rose-600 hover:text-rose-800 font-semibold"
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
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-4">
              Add Vehicle to Fleet (Bus / Car)
            </h3>

            {vehMessage && (
              <div className="bg-emerald-50 text-emerald-700 text-xs p-3 rounded-lg border border-emerald-200 mb-4">
                {vehMessage}
              </div>
            )}

            <form onSubmit={handleCreateVehicle} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Vehicle Model Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Toyota Innova Hycross / Volvo B11R"
                    value={vehForm.name}
                    onChange={(e) => setVehForm({ ...vehForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Vehicle Type *
                  </label>
                  <select
                    value={vehForm.type}
                    onChange={(e) => setVehForm({ ...vehForm, type: e.target.value as 'Car' | 'Bus' })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium"
                  >
                    <option value="Car">Car</option>
                    <option value="Bus">Bus</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Per KM Billing Rate (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={vehForm.per_km_rate}
                    onChange={(e) => setVehForm({ ...vehForm, per_km_rate: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Base Fare (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={vehForm.base_fare}
                    onChange={(e) => setVehForm({ ...vehForm, base_fare: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Passenger Capacity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={vehForm.capacity}
                    onChange={(e) => setVehForm({ ...vehForm, capacity: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    AC Specification
                  </label>
                  <input
                    type="text"
                    value={vehForm.ac_type}
                    onChange={(e) => setVehForm({ ...vehForm, ac_type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={vehForm.image_url}
                  onChange={(e) => setVehForm({ ...vehForm, image_url: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Vehicle Description
                </label>
                <textarea
                  rows={2}
                  value={vehForm.description}
                  onChange={(e) => setVehForm({ ...vehForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={vehSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition shadow-sm text-sm"
              >
                {vehSaving ? 'Saving...' : 'Add Vehicle to D1 Fleet'}
              </button>
            </form>
          </div>

          {/* Active Fleet List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 text-sm mb-3">
              Active Fleet ({vehicles.length})
            </h4>
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {vehicles.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{v.name}</div>
                    <div className="text-slate-500">{v.type} • ₹{v.per_km_rate}/km • {v.capacity} seats</div>
                  </div>
                  <button
                    onClick={() => handleDeleteVehicle(v.id)}
                    className="text-rose-600 hover:text-rose-800 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
