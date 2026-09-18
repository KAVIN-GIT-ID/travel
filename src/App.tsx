import React, { useState, useEffect, useMemo } from 'react';
import type { Package, Booking } from './api';
import {
  fetchPackages,
  createBooking,
  fetchBookings,
  createInquiry,
  checkBackendHealth,
  API_BASE_URL,
} from './api';

export default function App() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'tours' | 'inquiry' | 'agent'>('tours');

  // Backend Health
  const [backendStatus, setBackendStatus] = useState<'checking' | 'healthy' | 'offline'>('checking');

  // Booking Modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
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

  // Agent Portal Bookings
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);

  // Inquiry Form
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  const categories = [
    'All',
    'Cultural',
    'Luxury',
    'Beach & Culture',
    'Adventure',
    'Wildlife',
    'Romantic',
  ];

  const loadPackages = async () => {
    try {
      setLoading(true);
      const data = await fetchPackages(selectedCategory, searchQuery);
      setPackages(data);
    } catch (err) {
      console.error('Failed to load packages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackendHealth().then((res) => {
      setBackendStatus(res.status === 'healthy' ? 'healthy' : 'offline');
    });
    loadPackages();
  }, [selectedCategory]);

  const loadAgentBookings = async () => {
    try {
      setAdminLoading(true);
      const data = await fetchBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'agent') {
      loadAgentBookings();
    }
  }, [activeTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadPackages();
  };

  const handleOpenBooking = (pkg: Package) => {
    setSelectedPackage(pkg);
    setBookingSuccess(null);
    setBookingError('');
    setBookingModalOpen(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;
    setBookingSubmitting(true);
    setBookingError('');
    try {
      const res = await createBooking({
        package_id: selectedPackage.id,
        package_title: selectedPackage.title,
        customer_name: bookingForm.customer_name,
        customer_email: bookingForm.customer_email,
        customer_phone: bookingForm.customer_phone,
        travel_date: bookingForm.travel_date,
        travelers_count: bookingForm.travelers_count,
        special_requests: bookingForm.special_requests,
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
    } catch (err: any) {
      setBookingError(err.message || 'Failed to complete booking');
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
        subject: inquiryForm.subject || 'General Inquiry',
        message: inquiryForm.message,
      });
      setInquirySuccess(true);
      setInquiryForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setInquiryError(err.message || 'Failed to submit inquiry');
    } finally {
      setInquirySubmitting(false);
    }
  };

  const computedTotal = useMemo(() => {
    if (!selectedPackage) return 0;
    return selectedPackage.price * (bookingForm.travelers_count || 1);
  }, [selectedPackage, bookingForm.travelers_count]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* iOS Frosted Navigation Bar */}
      <header className="ios-navbar">
        <div className="ios-nav-container">
          <div
            className="ios-logo-group"
            onClick={() => {
              setActiveTab('tours');
              setSelectedCategory('All');
            }}
          >
            <div className="ios-logo-circle">TA</div>
            <span className="ios-logo-title">Travel Agencie</span>
          </div>

          {/* iOS Segmented Control */}
          <div className="ios-segmented-control">
            <button
              className={`ios-segment-btn ${activeTab === 'tours' ? 'active' : ''}`}
              onClick={() => setActiveTab('tours')}
            >
              Curated Tours
            </button>
            <button
              className={`ios-segment-btn ${activeTab === 'inquiry' ? 'active' : ''}`}
              onClick={() => setActiveTab('inquiry')}
            >
              Inquiry
            </button>
            <button
              className={`ios-segment-btn ${activeTab === 'agent' ? 'active' : ''}`}
              onClick={() => setActiveTab('agent')}
            >
              Agent D1
            </button>
          </div>

          <div className="ios-nav-actions">
            <div className="ios-status-pill" title={`Connected to ${API_BASE_URL}`}>
              <span
                className="ios-status-dot"
                style={{
                  backgroundColor: backendStatus === 'healthy' ? '#34c759' : '#ff9500',
                }}
              />
              <span>{backendStatus === 'healthy' ? 'D1 Live' : 'Offline'}</span>
            </div>

            <button
              className="ios-btn-black"
              onClick={() => {
                if (packages.length > 0) handleOpenBooking(packages[0]);
              }}
            >
              Reserve
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="ios-main-container" style={{ flex: 1 }}>
        {activeTab === 'tours' && (
          <div>
            {/* iOS Simple Clean Hero */}
            <div className="ios-hero-clean">
              <div className="ios-hero-badge">Curated Itineraries</div>
              <h1 className="ios-hero-heading">
                Simple, thoughtful travel planning.
              </h1>
              <p className="ios-hero-subheading">
                Browse handpicked destinations, review itineraries, and confirm reservations instantly via Cloudflare D1 SQL.
              </p>

              {/* iOS Clean Search */}
              <form onSubmit={handleSearch} className="ios-search-bar">
                <input
                  type="text"
                  className="ios-search-input"
                  placeholder="Search Bali, Kyoto, Amalfi, Alps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  className="ios-category-dropdown"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c === 'All' ? 'All Categories' : c}
                    </option>
                  ))}
                </select>
                <button type="submit" className="ios-btn-primary">
                  Search
                </button>
              </form>

              {/* iOS Category Filter Pills */}
              <div className="ios-filter-scroll">
                {categories.map((c) => (
                  <button
                    key={c}
                    className={`ios-filter-pill ${selectedCategory === c ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Section Header */}
            <div className="ios-section-header">
              <h2 className="ios-section-title">Available Expeditions</h2>
              <span className="ios-section-meta">
                {packages.length} {packages.length === 1 ? 'package' : 'packages'}
              </span>
            </div>

            {/* Cards Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--ios-text-secondary)' }}>
                Loading packages from Cloudflare D1...
              </div>
            ) : packages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--ios-text-secondary)' }}>
                No destinations found.
              </div>
            ) : (
              <div className="ios-grid">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="ios-card">
                    <div className="ios-card-media">
                      <img src={pkg.image_url} alt={pkg.title} className="ios-card-img" loading="lazy" />
                      <span className="ios-card-tag">{pkg.category}</span>
                    </div>

                    <div className="ios-card-content">
                      <div className="ios-card-location">
                        {pkg.destination}, {pkg.country} • {pkg.duration_days} Days
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
                          ${pkg.price.toLocaleString()}
                          <span>/ person</span>
                        </div>

                        <div className="ios-card-actions">
                          <button
                            className="ios-btn-secondary"
                            onClick={() => setDetailsPackage(pkg)}
                          >
                            Details
                          </button>
                          <button
                            className="ios-btn-primary"
                            onClick={() => handleOpenBooking(pkg)}
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

        {/* Custom Inquiry Tab */}
        {activeTab === 'inquiry' && (
          <div style={{ maxWidth: 580, margin: '0 auto', paddingTop: '1.5rem' }}>
            <div className="ios-hero-badge">Direct Concierge</div>
            <h2 className="ios-hero-heading" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              Custom Itinerary Request
            </h2>
            <p className="ios-hero-subheading" style={{ marginBottom: '2rem' }}>
              Have a specific destination or schedule in mind? Tell us what you need and our travel curators will assemble a proposal.
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
                    Inquiry Sent
                  </h3>
                  <p style={{ color: 'var(--ios-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Your request was recorded in Cloudflare D1. We will reach out shortly.
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
                      <label className="ios-form-label">Full Name</label>
                      <input
                        type="text"
                        required
                        className="ios-form-input"
                        placeholder="Sarah Jenkins"
                        value={inquiryForm.name}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      />
                    </div>
                    <div className="ios-form-group">
                      <label className="ios-form-label">Email</label>
                      <input
                        type="email"
                        required
                        className="ios-form-input"
                        placeholder="sarah@example.com"
                        value={inquiryForm.email}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="ios-form-group">
                    <label className="ios-form-label">Destination of Interest</label>
                    <input
                      type="text"
                      className="ios-form-input"
                      placeholder="e.g. Iceland Northern Lights or Amalfi Coast"
                      value={inquiryForm.subject}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, subject: e.target.value })}
                    />
                  </div>

                  <div className="ios-form-group">
                    <label className="ios-form-label">Trip Notes &amp; Estimated Dates</label>
                    <textarea
                      rows={4}
                      required
                      className="ios-form-input"
                      placeholder="Party size, preferred time of year, pace, special requests..."
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
                    {inquirySubmitting ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Agent Portal Tab */}
        {activeTab === 'agent' && (
          <div style={{ paddingTop: '1.5rem' }}>
            <div className="ios-section-header" style={{ marginTop: 0 }}>
              <div>
                <div className="ios-hero-badge">Cloudflare D1 Table</div>
                <h2 className="ios-section-title">Confirmed Reservations</h2>
              </div>
              <button
                className="ios-btn-secondary"
                onClick={loadAgentBookings}
                disabled={adminLoading}
              >
                {adminLoading ? 'Refreshing...' : 'Refresh Records'}
              </button>
            </div>

            <div className="ios-table-container">
              <table className="ios-table">
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Customer</th>
                    <th>Package</th>
                    <th>Travel Date</th>
                    <th>Guests</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {adminLoading ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--ios-text-secondary)' }}>
                        Fetching records from Cloudflare D1...
                      </td>
                    </tr>
                  ) : bookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--ios-text-secondary)' }}>
                        No bookings found in database.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b) => (
                      <tr key={b.id}>
                        <td style={{ fontFamily: 'ui-monospace, monospace', color: 'var(--ios-text-secondary)' }}>
                          #{b.id}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{b.customer_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--ios-text-tertiary)' }}>
                            {b.customer_email}
                          </div>
                        </td>
                        <td>{b.package_title}</td>
                        <td>{b.travel_date}</td>
                        <td>{b.travelers_count}</td>
                        <td style={{ fontWeight: 600 }}>
                          ${b.total_price ? b.total_price.toLocaleString() : '—'}
                        </td>
                        <td>
                          <span className="ios-badge-confirmed">
                            ● {b.status || 'Confirmed'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* iOS Booking Sheet / Modal */}
      {bookingModalOpen && selectedPackage && (
        <div className="ios-modal-backdrop" onClick={() => setBookingModalOpen(false)}>
          <div className="ios-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ios-modal-grabber" />
            <div className="ios-modal-header">
              <h3 className="ios-modal-title">Confirm Reservation</h3>
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
                    Booking reference #{bookingSuccess.id} has been saved to Cloudflare D1. Total: <strong>${bookingSuccess.total.toLocaleString()}</strong>.
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
                  {/* Selected Package Capsule */}
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
                    <img
                      src={selectedPackage.image_url}
                      alt={selectedPackage.title}
                      style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                        {selectedPackage.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--ios-text-secondary)' }}>
                        {selectedPackage.destination} • ${selectedPackage.price.toLocaleString()} per person
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
                    <label className="ios-form-label">Guest Name</label>
                    <input
                      type="text"
                      required
                      className="ios-form-input"
                      placeholder="David Miller"
                      value={bookingForm.customer_name}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, customer_name: e.target.value })
                      }
                    />
                  </div>

                  <div className="ios-form-row">
                    <div className="ios-form-group">
                      <label className="ios-form-label">Email</label>
                      <input
                        type="email"
                        required
                        className="ios-form-input"
                        placeholder="david@example.com"
                        value={bookingForm.customer_email}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, customer_email: e.target.value })
                        }
                      />
                    </div>
                    <div className="ios-form-group">
                      <label className="ios-form-label">Phone</label>
                      <input
                        type="tel"
                        className="ios-form-input"
                        placeholder="+1 555-0199"
                        value={bookingForm.customer_phone}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, customer_phone: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="ios-form-row">
                    <div className="ios-form-group">
                      <label className="ios-form-label">Travel Date</label>
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
                      <label className="ios-form-label">Travelers</label>
                      <input
                        type="number"
                        min="1"
                        max="16"
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
                    <label className="ios-form-label">Special Requests</label>
                    <textarea
                      rows={2}
                      className="ios-form-input"
                      placeholder="Room preferences, dietary requirements..."
                      value={bookingForm.special_requests}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, special_requests: e.target.value })
                      }
                    />
                  </div>

                  <div className="ios-price-summary-card">
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--ios-text-secondary)' }}>
                        Estimated Total ({bookingForm.travelers_count} guests)
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--ios-text-tertiary)' }}>
                        Taxes &amp; transfers included
                      </div>
                    </div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                      ${computedTotal.toLocaleString()}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingSubmitting}
                    className="ios-btn-black"
                    style={{ width: '100%', padding: '0.75rem' }}
                  >
                    {bookingSubmitting ? 'Saving to D1...' : 'Confirm Reservation'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
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
                {detailsPackage.destination}, {detailsPackage.country} • {detailsPackage.duration_days} Days • Rating: {detailsPackage.rating} / 5
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--ios-text-primary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {detailsPackage.description}
              </p>

              <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                Highlights
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
                  ${detailsPackage.price.toLocaleString()}
                  <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--ios-text-tertiary)', marginLeft: 4 }}>
                    / person
                  </span>
                </div>

                <button
                  className="ios-btn-black"
                  onClick={() => {
                    const p = detailsPackage;
                    setDetailsPackage(null);
                    handleOpenBooking(p);
                  }}
                >
                  Book This Tour
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* iOS Clean Footer */}
      <footer className="ios-footer">
        <div className="ios-footer-content">
          <div>
            &copy; {new Date().getFullYear()} Travel Agencie. Powered by Cloudflare Workers &amp; D1.
          </div>
          <div className="ios-footer-links">
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('tours'); }}>Tours</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('inquiry'); }}>Inquiry</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('agent'); }}>Agent Portal</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
