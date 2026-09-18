import React, { useState } from 'react';
import type { Booking, Package, Vehicle } from '../api';
import {
  createPackage,
  createVehicle,
  updateBookingStatus,
  deletePackage,
  deleteVehicle,
} from '../api';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [adminTab, setAdminTab] = useState<'bookings' | 'add-package' | 'add-vehicle'>('bookings');

  // New Package Form
  const [newPackage, setNewPackage] = useState({
    title: '',
    destination: '',
    state: 'Tamil Nadu' as 'Tamil Nadu' | 'Kerala' | 'Karnataka',
    category: 'Hill Station',
    price: 12000,
    duration_days: 3,
    image_url: '',
    description: '',
    highlights: '',
    featured: 0,
  });
  const [packageSaving, setPackageSaving] = useState(false);
  const [packageSuccess, setPackageSuccess] = useState('');

  // New Vehicle Form
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    type: 'Car' as 'Car' | 'Bus',
    category: 'Sedan',
    per_km_rate: 18,
    base_fare: 600,
    capacity: 4,
    ac_type: 'Full AC',
    luggage_capacity: 3,
    image_url: '',
    description: '',
  });
  const [vehicleSaving, setVehicleSaving] = useState(false);
  const [vehicleSuccess, setVehicleSuccess] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === 'admin123' || pinInput === '1234') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Incorrect PIN code. Hint: use admin123');
    }
  };

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      onRefreshData();
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setPackageSaving(true);
    setPackageSuccess('');
    try {
      await createPackage(newPackage);
      setPackageSuccess('New South India trip plan successfully created in D1!');
      setNewPackage({
        title: '',
        destination: '',
        state: 'Tamil Nadu',
        category: 'Hill Station',
        price: 12000,
        duration_days: 3,
        image_url: '',
        description: '',
        highlights: '',
        featured: 0,
      });
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to create trip plan');
    } finally {
      setPackageSaving(false);
    }
  };

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setVehicleSaving(true);
    setVehicleSuccess('');
    try {
      await createVehicle(newVehicle);
      setVehicleSuccess('Vehicle successfully added to fleet in D1!');
      setNewVehicle({
        name: '',
        type: 'Car',
        category: 'Sedan',
        per_km_rate: 18,
        base_fare: 600,
        capacity: 4,
        ac_type: 'Full AC',
        luggage_capacity: 3,
        image_url: '',
        description: '',
      });
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to add vehicle');
    } finally {
      setVehicleSaving(false);
    }
  };

  const handleDeletePackage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this trip plan?')) return;
    try {
      await deletePackage(id);
      onRefreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteVehicle = async (id: number) => {
    if (!confirm('Are you sure you want to remove this vehicle?')) return;
    try {
      await deleteVehicle(id);
      onRefreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: 420, margin: '3rem auto', textAlign: 'center' }}>
        <div className="ios-hero-badge">Staff Access</div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Travel Agencie Admin
        </h2>
        <p style={{ color: 'var(--ios-text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          Enter staff PIN code to manage reservations, upload vehicles, and create trip packages.
        </p>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--ios-border)',
            borderRadius: 'var(--ios-radius-lg)',
            padding: '2rem',
          }}
        >
          <form onSubmit={handleLogin}>
            {pinError && (
              <div
                style={{
                  background: '#fef2f2',
                  color: '#991b1b',
                  padding: '0.65rem',
                  borderRadius: 8,
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                }}
              >
                {pinError}
              </div>
            )}

            <div className="ios-form-group" style={{ textAlign: 'left' }}>
              <label className="ios-form-label">Passcode / PIN</label>
              <input
                type="password"
                required
                className="ios-form-input"
                placeholder="Enter PIN (admin123)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="ios-btn-black"
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
            >
              Unlock Admin Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Admin Sub Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <span className="ios-hero-badge">Admin &amp; Operations</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            Fleet &amp; Booking Management
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="ios-segmented-control">
            <button
              className={`ios-segment-btn ${adminTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setAdminTab('bookings')}
            >
              Bookings ({bookings.length})
            </button>
            <button
              className={`ios-segment-btn ${adminTab === 'add-package' ? 'active' : ''}`}
              onClick={() => setAdminTab('add-package')}
            >
              + New Trip Plan
            </button>
            <button
              className={`ios-segment-btn ${adminTab === 'add-vehicle' ? 'active' : ''}`}
              onClick={() => setAdminTab('add-vehicle')}
            >
              + Add Vehicle
            </button>
          </div>

          <button
            className="ios-btn-secondary"
            onClick={() => setIsAuthenticated(false)}
          >
            Lock
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: All Bookings */}
      {adminTab === 'bookings' && (
        <div className="ios-table-container">
          <table className="ios-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Customer</th>
                <th>Vehicle / Package</th>
                <th>Route / Distance</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--ios-text-secondary)' }}>
                    No bookings recorded yet.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontFamily: 'monospace' }}>#{b.id}</td>
                    <td>
                      <span className="ios-mini-pill" style={{ textTransform: 'capitalize' }}>
                        {b.booking_type === 'route_rental' ? '🚗 Route Rental' : '🌴 Tour Package'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.customer_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ios-text-tertiary)' }}>
                        {b.customer_phone || b.customer_email}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>
                        {b.vehicle_name || b.package_title || 'Custom Tour'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ios-text-secondary)' }}>
                        {b.travelers_count} passenger(s)
                      </div>
                    </td>
                    <td>
                      {b.booking_type === 'route_rental' ? (
                        <div style={{ fontSize: '0.8rem' }}>
                          <div>{b.pickup_location} → {b.dropoff_location}</div>
                          <div style={{ color: 'var(--ios-blue)', fontWeight: 600 }}>{b.distance_km} km</div>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--ios-text-secondary)' }}>Standard Itinerary</span>
                      )}
                    </td>
                    <td>{b.travel_date}</td>
                    <td style={{ fontWeight: 700, color: 'var(--ios-text-primary)' }}>
                      ₹{b.total_price ? b.total_price.toLocaleString() : '—'}
                    </td>
                    <td>
                      <select
                        className="ios-form-input"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem', width: 'auto' }}
                        value={b.status || 'Confirmed'}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
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
      )}

      {/* Sub-Tab 2: Add New Trip Plan */}
      {adminTab === 'add-package' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--ios-border)',
              borderRadius: 'var(--ios-radius-lg)',
              padding: '1.75rem',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
              Create South India Tour Package
            </h3>

            {packageSuccess && (
              <div style={{ background: 'var(--ios-green-soft)', color: 'var(--ios-green-text)', padding: '0.65rem', borderRadius: 8, fontSize: '0.85rem', marginBottom: '1rem' }}>
                {packageSuccess}
              </div>
            )}

            <form onSubmit={handleCreatePackage}>
              <div className="ios-form-row">
                <div className="ios-form-group">
                  <label className="ios-form-label">Trip Title *</label>
                  <input
                    type="text"
                    required
                    className="ios-form-input"
                    placeholder="e.g. Rameshwaram & Dhanushkodi Island Tour"
                    value={newPackage.title}
                    onChange={(e) => setNewPackage({ ...newPackage, title: e.target.value })}
                  />
                </div>
                <div className="ios-form-group">
                  <label className="ios-form-label">Destination *</label>
                  <input
                    type="text"
                    required
                    className="ios-form-input"
                    placeholder="e.g. Rameshwaram & Madurai"
                    value={newPackage.destination}
                    onChange={(e) => setNewPackage({ ...newPackage, destination: e.target.value })}
                  />
                </div>
              </div>

              <div className="ios-form-row">
                <div className="ios-form-group">
                  <label className="ios-form-label">State *</label>
                  <select
                    className="ios-form-input"
                    value={newPackage.state}
                    onChange={(e) =>
                      setNewPackage({ ...newPackage, state: e.target.value as any })
                    }
                  >
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Karnataka">Karnataka</option>
                  </select>
                </div>
                <div className="ios-form-group">
                  <label className="ios-form-label">Category</label>
                  <select
                    className="ios-form-input"
                    value={newPackage.category}
                    onChange={(e) => setNewPackage({ ...newPackage, category: e.target.value })}
                  >
                    <option value="Hill Station">Hill Station</option>
                    <option value="Backwaters">Backwaters</option>
                    <option value="Heritage">Heritage</option>
                    <option value="Coastal">Coastal</option>
                    <option value="Wildlife">Wildlife</option>
                  </select>
                </div>
              </div>

              <div className="ios-form-row">
                <div className="ios-form-group">
                  <label className="ios-form-label">Price per person (₹) *</label>
                  <input
                    type="number"
                    required
                    className="ios-form-input"
                    value={newPackage.price}
                    onChange={(e) =>
                      setNewPackage({ ...newPackage, price: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="ios-form-group">
                  <label className="ios-form-label">Duration (Days) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="ios-form-input"
                    value={newPackage.duration_days}
                    onChange={(e) =>
                      setNewPackage({ ...newPackage, duration_days: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="ios-form-group">
                <label className="ios-form-label">Image URL</label>
                <input
                  type="url"
                  className="ios-form-input"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newPackage.image_url}
                  onChange={(e) => setNewPackage({ ...newPackage, image_url: e.target.value })}
                />
              </div>

              <div className="ios-form-group">
                <label className="ios-form-label">Highlights (comma separated)</label>
                <input
                  type="text"
                  className="ios-form-input"
                  placeholder="Pamban Bridge View, Ramanathaswamy Temple, Ghost Town Walk"
                  value={newPackage.highlights}
                  onChange={(e) => setNewPackage({ ...newPackage, highlights: e.target.value })}
                />
              </div>

              <div className="ios-form-group">
                <label className="ios-form-label">Overview / Description</label>
                <textarea
                  rows={3}
                  className="ios-form-input"
                  placeholder="Summary of itinerary..."
                  value={newPackage.description}
                  onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={packageSaving}
                className="ios-btn-black"
                style={{ width: '100%', padding: '0.75rem' }}
              >
                {packageSaving ? 'Saving to D1...' : 'Publish Trip Plan'}
              </button>
            </form>
          </div>

          {/* Existing Packages List with Delete */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--ios-border)',
              borderRadius: 'var(--ios-radius-lg)',
              padding: '1.75rem',
              maxHeight: 650,
              overflowY: 'auto',
            }}
          >
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Existing Trips ({packages.length})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: '#f5f5f7',
                    borderRadius: 10,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{pkg.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ios-text-secondary)' }}>
                      {pkg.state} • ₹{pkg.price.toLocaleString()}
                    </div>
                  </div>

                  <button
                    type="button"
                    style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                    onClick={() => handleDeletePackage(pkg.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Add New Vehicle */}
      {adminTab === 'add-vehicle' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--ios-border)',
              borderRadius: 'var(--ios-radius-lg)',
              padding: '1.75rem',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
              Add Vehicle to Fleet (Bus &amp; Car)
            </h3>

            {vehicleSuccess && (
              <div style={{ background: 'var(--ios-green-soft)', color: 'var(--ios-green-text)', padding: '0.65rem', borderRadius: 8, fontSize: '0.85rem', marginBottom: '1rem' }}>
                {vehicleSuccess}
              </div>
            )}

            <form onSubmit={handleCreateVehicle}>
              <div className="ios-form-row">
                <div className="ios-form-group">
                  <label className="ios-form-label">Vehicle Name *</label>
                  <input
                    type="text"
                    required
                    className="ios-form-input"
                    placeholder="e.g. Toyota Innova Hycross / Volvo B11R"
                    value={newVehicle.name}
                    onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                  />
                </div>
                <div className="ios-form-group">
                  <label className="ios-form-label">Vehicle Type *</label>
                  <select
                    className="ios-form-input"
                    value={newVehicle.type}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, type: e.target.value as any })
                    }
                  >
                    <option value="Car">Car</option>
                    <option value="Bus">Bus</option>
                  </select>
                </div>
              </div>

              <div className="ios-form-row">
                <div className="ios-form-group">
                  <label className="ios-form-label">Per KM Rate (₹) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    className="ios-form-input"
                    placeholder="e.g. 22"
                    value={newVehicle.per_km_rate}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, per_km_rate: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="ios-form-group">
                  <label className="ios-form-label">Base Fare (₹) *</label>
                  <input
                    type="number"
                    required
                    className="ios-form-input"
                    value={newVehicle.base_fare}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, base_fare: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="ios-form-row">
                <div className="ios-form-group">
                  <label className="ios-form-label">Seating Capacity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="ios-form-input"
                    value={newVehicle.capacity}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, capacity: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="ios-form-group">
                  <label className="ios-form-label">AC Specification</label>
                  <input
                    type="text"
                    className="ios-form-input"
                    placeholder="e.g. Dual Zone Climate Control"
                    value={newVehicle.ac_type}
                    onChange={(e) => setNewVehicle({ ...newVehicle, ac_type: e.target.value })}
                  />
                </div>
              </div>

              <div className="ios-form-group">
                <label className="ios-form-label">Image URL</label>
                <input
                  type="url"
                  className="ios-form-input"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newVehicle.image_url}
                  onChange={(e) => setNewVehicle({ ...newVehicle, image_url: e.target.value })}
                />
              </div>

              <div className="ios-form-group">
                <label className="ios-form-label">Description / Amenities</label>
                <textarea
                  rows={2}
                  className="ios-form-input"
                  placeholder="Pushback leather seats, USB charging on every seat, large boot..."
                  value={newVehicle.description}
                  onChange={(e) => setNewVehicle({ ...newVehicle, description: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={vehicleSaving}
                className="ios-btn-black"
                style={{ width: '100%', padding: '0.75rem' }}
              >
                {vehicleSaving ? 'Saving to D1...' : 'Add Vehicle to Fleet'}
              </button>
            </form>
          </div>

          {/* Existing Fleet List with Delete */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--ios-border)',
              borderRadius: 'var(--ios-radius-lg)',
              padding: '1.75rem',
              maxHeight: 650,
              overflowY: 'auto',
            }}
          >
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Active Fleet Vehicles ({vehicles.length})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: '#f5f5f7',
                    borderRadius: 10,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{v.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ios-text-secondary)' }}>
                      {v.type} • ₹{v.per_km_rate}/km • {v.capacity} seats
                    </div>
                  </div>

                  <button
                    type="button"
                    style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                    onClick={() => handleDeleteVehicle(v.id)}
                  >
                    Remove
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
