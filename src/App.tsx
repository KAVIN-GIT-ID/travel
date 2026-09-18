import React, { useState, useEffect } from 'react';
import type { Package, Booking, Vehicle } from './api';
import {
  fetchPackages,
  fetchVehicles,
  createBooking,
  fetchBookings,
  createInquiry,
} from './api';
import { RouteCalculator } from './components/RouteCalculator';
import { AdminPortal } from './components/AdminPortal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'tours' | 'route-calc' | 'fleet' | 'inquiry' | 'admin'>('route-calc');

  // Data
  const [packages, setPackages] = useState<Package[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters for Curated Tours
  const [selectedState, setSelectedState] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Booking Modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [modalBookingData, setModalBookingData] = useState<{
    booking_type: 'package' | 'route_rental';
    package_id?: number;
    package_title?: string;
    vehicle_id?: number;
    vehicle_name?: string;
    pickup_location?: string;
    dropoff_location?: string;
    distance_km?: number;
    total_price: number;
    image_url?: string;
  } | null>(null);

  const [bookingForm, setBookingForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    travel_date: '',
    travelers_count: 2,
    special_requests: '',
  });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<{ id: number; total: number } | null>(null);
  const [bookingError, setBookingError] = useState('');

  // Details Modal
  const [detailsPackage, setDetailsPackage] = useState<Package | null>(null);

  // Inquiry Form
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    subject: 'South India Custom Trip',
    message: '',
  });
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [pkgs, vhcls, bks] = await Promise.all([
        fetchPackages(selectedState, undefined, searchQuery),
        fetchVehicles(),
        fetchBookings(),
      ]);
      setPackages(pkgs);
      setVehicles(vhcls);
      setBookings(bks);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedState]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  // Open modal from Tour Package
  const handleOpenPackageBooking = (pkg: Package) => {
    setModalBookingData({
      booking_type: 'package',
      package_id: pkg.id,
      package_title: pkg.title,
      total_price: pkg.price * bookingForm.travelers_count,
      image_url: pkg.image_url,
    });
    setBookingSuccess(null);
    setBookingError('');
    setBookingModalOpen(true);
  };

  // Open modal from Route Distance Calculator
  const handleOpenRouteBooking = (data: {
    pickup: string;
    dropoff: string;
    distanceKm: number;
    vehicle: Vehicle;
    totalFare: number;
  }) => {
    setModalBookingData({
      booking_type: 'route_rental',
      vehicle_id: data.vehicle.id,
      vehicle_name: `${data.vehicle.name} (${data.vehicle.type})`,
      pickup_location: data.pickup,
      dropoff_location: data.dropoff,
      distance_km: data.distanceKm,
      total_price: data.totalFare,
      image_url: data.vehicle.image_url,
    });
    setBookingSuccess(null);
    setBookingError('');
    setBookingModalOpen(true);
  };

  // Open modal from Fleet View
  const handleOpenFleetBooking = (v: Vehicle) => {
    setModalBookingData({
      booking_type: 'route_rental',
      vehicle_id: v.id,
      vehicle_name: `${v.name} (${v.type})`,
      pickup_location: 'Bengaluru / Chennai / Kochi',
      dropoff_location: 'South India Destination',
      distance_km: 150,
      total_price: 150 * v.per_km_rate + v.base_fare,
      image_url: v.image_url,
    });
    setBookingSuccess(null);
    setBookingError('');
    setBookingModalOpen(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalBookingData) return;
    setBookingSubmitting(true);
    setBookingError('');
    try {
      const res = await createBooking({
        booking_type: modalBookingData.booking_type,
        package_id: modalBookingData.package_id,
        package_title: modalBookingData.package_title,
        vehicle_id: modalBookingData.vehicle_id,
        vehicle_name: modalBookingData.vehicle_name,
        pickup_location: modalBookingData.pickup_location,
        dropoff_location: modalBookingData.dropoff_location,
        distance_km: modalBookingData.distance_km,
        customer_name: bookingForm.customer_name,
        customer_email: bookingForm.customer_email,
        customer_phone: bookingForm.customer_phone,
        travel_date: bookingForm.travel_date,
        travelers_count: bookingForm.travelers_count,
        special_requests: bookingForm.special_requests,
        total_price: modalBookingData.total_price,
      });

      setBookingSuccess({
        id: res.booking_id,
        total: res.total_price,
      });

      setBookingForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        travel_date: '',
        travelers_count: 2,
        special_requests: '',
      });

      // Refresh bookings list
      const updated = await fetchBookings();
      setBookings(updated);
    } catch (err: any) {
      setBookingError(err.message || 'Failed to submit reservation');
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitting(true);
    setInquiryError('');
    try {
      await createInquiry({
        name: inquiryForm.name,
        email: inquiryForm.email,
        subject: inquiryForm.subject || 'South India Trip Inquiry',
        message: inquiryForm.message,
      });
      setInquirySuccess(true);
      setInquiryForm({ name: '', email: '', subject: 'South India Custom Trip', message: '' });
    } catch (err: any) {
      setInquiryError(err.message || 'Failed to submit inquiry');
    } finally {
      setInquirySubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* iOS Clean Navigation Bar */}
      <header className="ios-navbar">
        <div className="ios-nav-container">
          <div
            className="ios-logo-group"
            onClick={() => {
              setActiveTab('route-calc');
            }}
          >
            <div className="ios-logo-circle">TA</div>
            <div>
              <span className="ios-logo-title">Travel Agencie</span>
              <span style={{ fontSize: '0.68rem', background: '#f5f5f7', padding: '2px 6px', borderRadius: 4, marginLeft: 6, fontWeight: 600, color: 'var(--ios-blue)' }}>
                South India
              </span>
            </div>
          </div>

          {/* iOS Segmented Navigation */}
          <div className="ios-segmented-control">
            <button
              className={`ios-segment-btn ${activeTab === 'route-calc' ? 'active' : ''}`}
              onClick={() => setActiveTab('route-calc')}
            >
              Route &amp; Fare Calc
            </button>
            <button
              className={`ios-segment-btn ${activeTab === 'tours' ? 'active' : ''}`}
              onClick={() => setActiveTab('tours')}
            >
              Curated Trips
            </button>
            <button
              className={`ios-segment-btn ${activeTab === 'fleet' ? 'active' : ''}`}
              onClick={() => setActiveTab('fleet')}
            >
              Bus &amp; Car Fleet
            </button>
            <button
              className={`ios-segment-btn ${activeTab === 'inquiry' ? 'active' : ''}`}
              onClick={() => setActiveTab('inquiry')}
            >
              Inquiry
            </button>
            <button
              className={`ios-segment-btn ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              Admin Portal
            </button>
          </div>

          <div className="ios-nav-actions">
            <button
              className="ios-btn-black"
              onClick={() => {
                if (vehicles.length > 0) handleOpenFleetBooking(vehicles[0]);
              }}
            >
              Book Travel
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="ios-main-container" style={{ flex: 1 }}>
        {/* TAB 1: Route & Distance Calculator (Map + GPS + Per-KM Fare) */}
        {activeTab === 'route-calc' && (
          <RouteCalculator
            vehicles={vehicles}
            onBookRoute={handleOpenRouteBooking}
          />
        )}

        {/* TAB 2: Curated South India Trips (Tamil Nadu, Kerala, Karnataka) */}
        {activeTab === 'tours' && (
          <div>
            <div className="ios-hero-clean">
              <div className="ios-hero-badge">Tamil Nadu • Kerala • Karnataka</div>
              <h1 className="ios-hero-heading">
                Explore South India's finest sanctuaries.
              </h1>
              <p className="ios-hero-subheading">
                Handcrafted holiday tours through the Western Ghats, Nilgiri hill stations, coastal backwaters, and heritage ruins.
              </p>

              {/* State Filter Pills */}
              <div className="ios-filter-scroll" style={{ marginBottom: '1.25rem' }}>
                {['All', 'Tamil Nadu', 'Kerala', 'Karnataka'].map((st) => (
                  <button
                    key={st}
                    className={`ios-filter-pill ${selectedState === st ? 'active' : ''}`}
                    onClick={() => setSelectedState(st)}
                  >
                    {st === 'All' ? 'All South India' : st}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <form onSubmit={handleSearch} className="ios-search-bar" style={{ maxWidth: 540 }}>
                <input
                  type="text"
                  className="ios-search-input"
                  placeholder="Search Ooty, Munnar, Coorg, Hampi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="ios-btn-primary">
                  Search
                </button>
              </form>
            </div>

            <div className="ios-section-header">
              <h2 className="ios-section-title">Curated Holiday Packages</h2>
              <span className="ios-section-meta">
                {packages.length} {packages.length === 1 ? 'package' : 'packages'}
              </span>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--ios-text-secondary)' }}>
                Loading South India itineraries...
              </div>
            ) : packages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--ios-text-secondary)' }}>
                No packages found.
              </div>
            ) : (
              <div className="ios-grid">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="ios-card">
                    <div className="ios-card-media">
                      <img src={pkg.image_url} alt={pkg.title} className="ios-card-img" loading="lazy" />
                      <span className="ios-card-tag">{pkg.state}</span>
                    </div>

                    <div className="ios-card-content">
                      <div className="ios-card-location">
                        {pkg.destination} • {pkg.duration_days} Days / {pkg.duration_days - 1} Nights
                      </div>
                      <h3 className="ios-card-name">{pkg.title}</h3>
                      <p className="ios-card-summary">{pkg.description}</p>

                      <div className="ios-card-pills">
                        {pkg.highlights.split(',').slice(0, 3).map((h, i) => (
                          <span key={i} className="ios-mini-pill">
                            {h.trim()}
                          </span>
                        ))}
                      </div>

                      <div className="ios-card-footer">
                        <div className="ios-card-price">
                          ₹{pkg.price.toLocaleString()}
                          <span>/ person</span>
                        </div>

                        <div className="ios-card-actions">
                          <button
                            type="button"
                            className="ios-btn-secondary"
                            onClick={() => setDetailsPackage(pkg)}
                          >
                            Itinerary
                          </button>
                          <button
                            type="button"
                            className="ios-btn-primary"
                            onClick={() => handleOpenPackageBooking(pkg)}
                          >
                            Reserve
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Bus & Car Fleet Showcase */}
        {activeTab === 'fleet' && (
          <div>
            <div className="ios-hero-clean">
              <div className="ios-hero-badge">Interstate Vehicle Rentals</div>
              <h1 className="ios-hero-heading">
                Comfortable Bus &amp; Car travels.
              </h1>
              <p className="ios-hero-subheading">
                Transparent per-kilometer rates across Tamil Nadu, Kerala, and Karnataka. Commercial interstate permits, verified professional drivers, and sanitized AC vehicles.
              </p>
            </div>

            <div className="ios-grid">
              {vehicles.map((v) => (
                <div key={v.id} className="ios-card">
                  <div className="ios-card-media" style={{ height: 180 }}>
                    <img src={v.image_url} alt={v.name} className="ios-card-img" />
                    <span className="ios-card-tag">{v.type} • {v.category}</span>
                  </div>

                  <div className="ios-card-content">
                    <h3 className="ios-card-name" style={{ fontSize: '1.15rem' }}>{v.name}</h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--ios-text-secondary)', marginBottom: '0.75rem' }}>
                      {v.capacity} Passengers • {v.ac_type} • {v.luggage_capacity} Luggage Bags
                    </div>
                    <p className="ios-card-summary">{v.description}</p>

                    <div style={{ background: '#f5f5f7', padding: '0.75rem', borderRadius: 10, marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span>Rate:</span>
                        <strong style={{ color: 'var(--ios-blue)', fontSize: '1.05rem' }}>₹{v.per_km_rate} / km</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--ios-text-secondary)', marginTop: 4 }}>
                        <span>Base Fare:</span>
                        <span>₹{v.base_fare}</span>
                      </div>
                    </div>

                    <div className="ios-card-footer">
                      <div className="ios-card-price">
                        ₹{v.per_km_rate}
                        <span>/ km</span>
                      </div>

                      <button
                        type="button"
                        className="ios-btn-black"
                        onClick={() => handleOpenFleetBooking(v)}
                      >
                        Rent Vehicle
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Custom Inquiry */}
        {activeTab === 'inquiry' && (
          <div style={{ maxWidth: 580, margin: '0 auto', paddingTop: '1.5rem' }}>
            <div className="ios-hero-badge">South India Custom Travels</div>
            <h2 className="ios-hero-heading" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              Tailored Itinerary &amp; Bulk Bus Booking
            </h2>
            <p className="ios-hero-subheading" style={{ marginBottom: '2rem' }}>
              Planning a college industrial visit, family wedding, or pilgrimage across Tamil Nadu, Kerala, or Karnataka? Share your travel details.
            </p>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--ios-border)',
                borderRadius: 'var(--ios-radius-lg)',
                padding: '1.75rem',
              }}
            >
              {inquirySuccess ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'var(--ios-green-soft)',
                      color: 'var(--ios-green-text)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem',
                      fontWeight: 700,
                      fontSize: '1.25rem',
                    }}
                  >
                    ✓
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Inquiry Received
                  </h3>
                  <p style={{ color: 'var(--ios-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Your travel details have been received. A South India route coordinator will contact you shortly.
                  </p>
                  <button
                    className="ios-btn-secondary"
                    onClick={() => setInquirySuccess(false)}
                  >
                    Submit Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit}>
                  {inquiryError && (
                    <div
                      style={{
                        background: '#fef2f2',
                        color: '#991b1b',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 8,
                        fontSize: '0.85rem',
                        marginBottom: '1rem',
                      }}
                    >
                      {inquiryError}
                    </div>
                  )}

                  <div className="ios-form-row">
                    <div className="ios-form-group">
                      <label className="ios-form-label">Contact Person Name</label>
                      <input
                        type="text"
                        required
                        className="ios-form-input"
                        placeholder="e.g. Vignesh Kumar"
                        value={inquiryForm.name}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      />
                    </div>
                    <div className="ios-form-group">
                      <label className="ios-form-label">Email Address</label>
                      <input
                        type="email"
                        required
                        className="ios-form-input"
                        placeholder="vignesh@example.com"
                        value={inquiryForm.email}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="ios-form-group">
                    <label className="ios-form-label">Destination / Route Requirement</label>
                    <input
                      type="text"
                      className="ios-form-input"
                      placeholder="e.g. 3-Day Ooty & Coonoor Tour with 21-Seater Mini Bus"
                      value={inquiryForm.subject}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, subject: e.target.value })}
                    />
                  </div>

                  <div className="ios-form-group">
                    <label className="ios-form-label">Trip Notes, Pickup City &amp; Dates</label>
                    <textarea
                      rows={4}
                      required
                      className="ios-form-input"
                      placeholder="Passenger count, preferred dates, vehicle preference, special requests..."
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={inquirySubmitting}
                    className="ios-btn-black"
                    style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
                  >
                    {inquirySubmitting ? 'Submitting...' : 'Send Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: Role-Protected Admin Portal */}
        {activeTab === 'admin' && (
          <AdminPortal
            bookings={bookings}
            packages={packages}
            vehicles={vehicles}
            onRefreshData={loadData}
          />
        )}
      </main>

      {/* Booking Reservation Modal */}
      {bookingModalOpen && modalBookingData && (
        <div className="ios-modal-backdrop" onClick={() => setBookingModalOpen(false)}>
          <div className="ios-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ios-modal-grabber" />
            <div className="ios-modal-header">
              <h3 className="ios-modal-title">
                {modalBookingData.booking_type === 'route_rental'
                  ? 'Confirm Vehicle Booking'
                  : 'Reserve Tour Package'}
              </h3>
              <button
                className="ios-modal-close-btn"
                onClick={() => setBookingModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="ios-modal-body">
              {bookingSuccess ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: 'var(--ios-green-soft)',
                      color: 'var(--ios-green-text)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem',
                      fontWeight: 700,
                      fontSize: '1.4rem',
                    }}
                  >
                    ✓
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Reservation Confirmed
                  </h3>
                  <p style={{ color: 'var(--ios-text-secondary)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                    Booking reference #{bookingSuccess.id} has been recorded. Estimated Total: <strong>₹{bookingSuccess.total.toLocaleString()}</strong>. Our route manager will contact you with driver and vehicle dispatch details.
                  </p>
                  <button
                    className="ios-btn-black"
                    onClick={() => setBookingModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit}>
                  {/* Summary Box */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      background: '#f5f5f7',
                      borderRadius: 12,
                      padding: '0.75rem',
                      marginBottom: '1.25rem',
                    }}
                  >
                    {modalBookingData.image_url && (
                      <img
                        src={modalBookingData.image_url}
                        alt="Booking preview"
                        style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover' }}
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                        {modalBookingData.vehicle_name || modalBookingData.package_title}
                      </div>
                      {modalBookingData.booking_type === 'route_rental' ? (
                        <div style={{ fontSize: '0.78rem', color: 'var(--ios-text-secondary)' }}>
                          {modalBookingData.pickup_location} → {modalBookingData.dropoff_location} ({modalBookingData.distance_km} km)
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.78rem', color: 'var(--ios-text-secondary)' }}>
                          South India Tour Package
                        </div>
                      )}
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--ios-blue)', marginTop: 2 }}>
                        Fare: ₹{modalBookingData.total_price.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {bookingError && (
                    <div
                      style={{
                        background: '#fef2f2',
                        color: '#991b1b',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 8,
                        fontSize: '0.85rem',
                        marginBottom: '1rem',
                      }}
                    >
                      {bookingError}
                    </div>
                  )}

                  <div className="ios-form-group">
                    <label className="ios-form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      className="ios-form-input"
                      placeholder="e.g. Ramesh Chandran"
                      value={bookingForm.customer_name}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, customer_name: e.target.value })
                      }
                    />
                  </div>

                  <div className="ios-form-row">
                    <div className="ios-form-group">
                      <label className="ios-form-label">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        className="ios-form-input"
                        placeholder="+91 98401 XXXXX"
                        value={bookingForm.customer_phone}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, customer_phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="ios-form-group">
                      <label className="ios-form-label">Email Address *</label>
                      <input
                        type="email"
                        required
                        className="ios-form-input"
                        placeholder="ramesh@example.com"
                        value={bookingForm.customer_email}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, customer_email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="ios-form-row">
                    <div className="ios-form-group">
                      <label className="ios-form-label">Travel Date *</label>
                      <input
                        type="date"
                        required
                        className="ios-form-input"
                        value={bookingForm.travel_date}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, travel_date: e.target.value })
                        }
                      />
                    </div>
                    <div className="ios-form-group">
                      <label className="ios-form-label">Passenger Count *</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        required
                        className="ios-form-input"
                        value={bookingForm.travelers_count}
                        onChange={(e) =>
                          setBookingForm({
                            ...bookingForm,
                            travelers_count: Math.max(1, parseInt(e.target.value) || 1),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="ios-form-group">
                    <label className="ios-form-label">Pickup Address / Special Notes</label>
                    <textarea
                      rows={2}
                      className="ios-form-input"
                      placeholder="Specific pickup landmark, timing, luggage assistance..."
                      value={bookingForm.special_requests}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, special_requests: e.target.value })
                      }
                    />
                  </div>

                  <div className="ios-price-summary-card">
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--ios-text-secondary)' }}>
                        Total Fare
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--ios-text-tertiary)' }}>
                        All interstate permits, fuel &amp; driver allowance included
                      </div>
                    </div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 700 }}>
                      ₹{modalBookingData.total_price.toLocaleString()}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingSubmitting}
                    className="ios-btn-black"
                    style={{ width: '100%', padding: '0.75rem' }}
                  >
                    {bookingSubmitting ? 'Confirming...' : 'Confirm Reservation'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Package Details Modal */}
      {detailsPackage && (
        <div className="ios-modal-backdrop" onClick={() => setDetailsPackage(null)}>
          <div className="ios-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ios-modal-grabber" />
            <div className="ios-modal-header">
              <h3 className="ios-modal-title">{detailsPackage.title}</h3>
              <button
                className="ios-modal-close-btn"
                onClick={() => setDetailsPackage(null)}
              >
                ✕
              </button>
            </div>

            <div className="ios-modal-body">
              <img
                src={detailsPackage.image_url}
                alt={detailsPackage.title}
                style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 12, marginBottom: '1rem' }}
              />

              <div style={{ fontSize: '0.82rem', color: 'var(--ios-text-secondary)', marginBottom: '0.75rem' }}>
                {detailsPackage.destination} ({detailsPackage.state}) • {detailsPackage.duration_days} Days
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--ios-text-primary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {detailsPackage.description}
              </p>

              <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                Key Highlights
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.5rem' }}>
                {detailsPackage.highlights.split(',').map((h, idx) => (
                  <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--ios-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ color: 'var(--ios-blue)' }}>•</span>
                    {h.trim()}
                  </li>
                ))}
              </ul>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--ios-border-light)' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  ₹{detailsPackage.price.toLocaleString()}
                  <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--ios-text-tertiary)', marginLeft: 4 }}>
                    / person
                  </span>
                </div>

                <button
                  className="ios-btn-black"
                  onClick={() => {
                    const p = detailsPackage;
                    setDetailsPackage(null);
                    handleOpenPackageBooking(p);
                  }}
                >
                  Book This Tour
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* iOS Clean Production Footer */}
      <footer className="ios-footer">
        <div className="ios-footer-content">
          <div>
            &copy; {new Date().getFullYear()} Travel Agencie — South India Bus &amp; Car Travels (Tamil Nadu • Kerala • Karnataka).
          </div>
          <div className="ios-footer-links">
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('route-calc'); }}>Route Calculator</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('tours'); }}>Curated Trips</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('fleet'); }}>Fleet</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('admin'); }}>Admin</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
