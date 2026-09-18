import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  Calendar,
  Users,
  MapPin,
  Star,
  CheckCircle2,
  X,
  Search,
  Clock,
  Send,
  Database,
  Globe2,
  Layers,
  Sparkles,
  PlaneTakeoff,
  RefreshCw,
  Phone,
  Mail,
  User,
  ShieldCheck,
} from 'lucide-react';
import type {
  Package,
  Booking,
} from './api';
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
  const [activeTab, setActiveTab] = useState<'explore' | 'inquiry' | 'admin'>('explore');

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
  const [detailsModalPackage, setDetailsModalPackage] = useState<Package | null>(null);

  // Agent / Admin Bookings state
  const [adminBookings, setAdminBookings] = useState<Booking[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);

  // Inquiry Form state
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    subject: 'Custom Luxury Itinerary',
    message: '',
  });
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  // Categories list
  const categories = ['All', 'Beach & Culture', 'Cultural', 'Luxury', 'Adventure', 'Wildlife', 'Romantic'];

  // Load packages
  const loadPackages = async () => {
    try {
      setLoading(true);
      const data = await fetchPackages(selectedCategory, searchQuery);
      setPackages(data);
    } catch (err) {
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check health and load packages on mount
  useEffect(() => {
    checkBackendHealth().then((res) => {
      if (res.status === 'healthy') setBackendStatus('healthy');
      else setBackendStatus('offline');
    });
    loadPackages();
  }, [selectedCategory]);

  // Load bookings for admin view
  const loadAdminBookings = async () => {
    try {
      setAdminLoading(true);
      const data = await fetchBookings();
      setAdminBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'admin') {
      loadAdminBookings();
    }
  }, [activeTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
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
      // Reset form fields
      setBookingForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        travel_date: '',
        travelers_count: 2,
        special_requests: '',
      });
    } catch (err: any) {
      setBookingError(err.message || 'Booking submission failed');
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitting(true);
    setInquiryError('');
    try {
      await createInquiry(inquiryForm);
      setInquirySuccess(true);
      setInquiryForm({
        name: '',
        email: '',
        subject: 'Custom Luxury Itinerary',
        message: '',
      });
    } catch (err: any) {
      setInquiryError(err.message || 'Inquiry submission failed');
    } finally {
      setInquirySubmitting(false);
    }
  };

  const computedTotal = useMemo(() => {
    if (!selectedPackage) return 0;
    return selectedPackage.price * (bookingForm.travelers_count || 1);
  }, [selectedPackage, bookingForm.travelers_count]);

  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
      <header className="header-nav">
        <div className="nav-container">
          <div className="brand-logo">
            <PlaneTakeoff className="text-amber-500" size={26} />
            <span>Travel Agencie</span>
            <span className="brand-badge">Cloudflare D1</span>
          </div>

          <ul className="nav-links">
            <li
              className={`nav-item ${activeTab === 'explore' ? 'active' : ''}`}
              onClick={() => setActiveTab('explore')}
            >
              Curated Escapes
            </li>
            <li
              className={`nav-item ${activeTab === 'inquiry' ? 'active' : ''}`}
              onClick={() => setActiveTab('inquiry')}
            >
              Custom Inquiry
            </li>
            <li
              className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              Agent D1 Portal
            </li>
          </ul>

          <div className="nav-actions">
            <div className="edge-pill" title={`Connected to ${API_BASE_URL}`}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: backendStatus === 'healthy' ? '#10b981' : '#f59e0b',
                  boxShadow: backendStatus === 'healthy' ? '0 0 8px #10b981' : 'none',
                }}
              />
              <span>{backendStatus === 'healthy' ? 'D1 Edge Online' : 'Connecting'}</span>
            </div>

            <button
              className="btn-primary"
              onClick={() => {
                if (packages.length > 0) handleOpenBooking(packages[0]);
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Areas */}
      {activeTab === 'explore' && (
        <main>
          {/* Hero Section */}
          <section className="hero-wrapper">
            <div className="hero-tag">
              <Sparkles size={14} /> Exceptional Global Journeys
            </div>
            <h1 className="hero-title">
              Journeys Crafted for the <br />
              <span className="hero-highlight">Discerning Explorer</span>
            </h1>
            <p className="hero-subtitle">
              Handpicked luxury itineraries, sacred heritage, and breathtaking sanctuaries.
              Powered by Cloudflare Workers &amp; Serverless D1 SQL.
            </p>

            {/* Search & Filter Bar */}
            <div className="search-box-container">
              <form className="search-form-grid" onSubmit={handleSearchSubmit}>
                <div className="input-field-group">
                  <Search size={18} />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search destinations, countries, or tours..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="input-field-group">
                  <Compass size={18} />
                  <select
                    className="category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === 'All' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn-primary">
                  Search Expeditions
                </button>
              </form>
            </div>

            {/* Category Filter Pills */}
            <div className="category-pills-row">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Trust & Guarantee Stats Strip */}
            <div className="stats-strip">
              <div className="stat-item">
                <div className="stat-icon-wrap">
                  <ShieldCheck size={22} />
                </div>
                <div className="stat-content">
                  <h4>Vetted Luxury Accommodations</h4>
                  <p>Hand-inspected 5-star villas &amp; ryokans</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon-wrap">
                  <Clock size={22} />
                </div>
                <div className="stat-content">
                  <h4>24/7 Private Concierge</h4>
                  <p>Dedicated personal travel specialist</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon-wrap">
                  <Globe2 size={22} />
                </div>
                <div className="stat-content">
                  <h4>Instant Edge Booking</h4>
                  <p>Synchronized to Cloudflare D1</p>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Travel Packages Section */}
          <section className="section-container">
            <div className="section-head">
              <div>
                <h2 className="section-title">Signature Itineraries</h2>
                <p className="section-desc">
                  Curated world expeditions with verified guest ratings &amp; transparent pricing.
                </p>
              </div>
              <div className="text-subtle text-sm">
                Showing {packages.length} luxury packages
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 1rem' }} />
                <p>Loading curated packages from Cloudflare D1...</p>
              </div>
            ) : packages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                <p>No travel packages match your filter criteria.</p>
                <button
                  className="btn-pill-subtle"
                  style={{ marginTop: '1rem' }}
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="packages-grid">
                {packages.map((pkg) => (
                  <article key={pkg.id} className="package-card">
                    <div className="card-img-box">
                      <img src={pkg.image_url} alt={pkg.title} className="card-img" loading="lazy" />
                      <span className="card-badge-category">{pkg.category}</span>
                      {pkg.featured === 1 && (
                        <span className="card-badge-featured">
                          <Sparkles size={12} /> Featured
                        </span>
                      )}
                    </div>

                    <div className="card-body">
                      <div className="card-location">
                        <MapPin size={14} />
                        <span>{pkg.destination}, {pkg.country}</span>
                        <span style={{ margin: '0 0.35rem', color: 'var(--text-subtle)' }}>•</span>
                        <span style={{ color: 'var(--text-muted)' }}>{pkg.duration_days} Days</span>
                      </div>

                      <h3 className="card-title">{pkg.title}</h3>
                      <p className="card-description">{pkg.description}</p>

                      <div className="card-highlights">
                        {pkg.highlights.split(',').slice(0, 3).map((item, idx) => (
                          <span key={idx} className="highlight-tag">
                            {item.trim()}
                          </span>
                        ))}
                      </div>

                      <div className="card-footer">
                        <div className="price-box">
                          <span className="price-sub">Starting From</span>
                          <span className="price-amount">${pkg.price.toLocaleString()}</span>
                        </div>

                        <div className="card-actions">
                          <button
                            className="btn-card-details"
                            title="View Itinerary"
                            onClick={() => setDetailsModalPackage(pkg)}
                          >
                            <Compass size={16} />
                          </button>
                          <button
                            className="btn-card-book"
                            onClick={() => handleOpenBooking(pkg)}
                          >
                            Reserve
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      {/* Inquiry Tab */}
      {activeTab === 'inquiry' && (
        <section className="section-container" style={{ maxWidth: 760, paddingTop: '4rem' }}>
          <div className="hero-tag" style={{ display: 'inline-flex' }}>
            <Mail size={14} /> Bespoke Tailored Travel
          </div>
          <h2 className="hero-title" style={{ fontSize: '2.5rem', textAlign: 'left', marginBottom: '0.75rem' }}>
            Request a Custom Expedition
          </h2>
          <p className="section-desc" style={{ marginBottom: '2.5rem' }}>
            Tell our travel curators where you wish to explore. We design custom luxury itineraries
            tailored specifically to your pace, preferences, and desires.
          </p>

          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.25rem',
            }}
          >
            {inquirySuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <CheckCircle2 size={54} color="#10b981" style={{ margin: '0 auto 1.25rem' }} />
                <h3 className="card-title" style={{ color: '#10b981', fontSize: '1.5rem' }}>
                  Inquiry Received!
                </h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: 460, margin: '0 auto 1.5rem' }}>
                  Your travel inquiry has been saved into Cloudflare D1. A luxury travel specialist
                  will get back to you with custom proposals within 24 hours.
                </p>
                <button
                  className="btn-primary"
                  onClick={() => setInquirySuccess(false)}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit}>
                {inquiryError && (
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '1.25rem',
                      fontSize: '0.88rem',
                    }}
                  >
                    {inquiryError}
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. Lady Vivienne Montgomery"
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      required
                      className="form-control"
                      placeholder="vivienne@example.com"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Destination of Interest</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Swiss Alps & Lake Como Grand Tour"
                    value={inquiryForm.subject}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Trip Details, Dates &amp; Requirements *</label>
                  <textarea
                    rows={4}
                    required
                    className="form-control"
                    placeholder="Describe your ideal trip, estimated dates, party size, and any special experiences you desire..."
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={inquirySubmitting}
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.85rem' }}
                >
                  <Send size={16} />
                  {inquirySubmitting ? 'Transmitting to Cloudflare D1...' : 'Submit Travel Inquiry'}
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      {/* Agent D1 Portal Tab */}
      {activeTab === 'admin' && (
        <section className="section-container" style={{ paddingTop: '3.5rem' }}>
          <div className="section-head">
            <div>
              <div className="hero-tag" style={{ display: 'inline-flex' }}>
                <Database size={14} /> Cloudflare D1 Live Records
              </div>
              <h2 className="section-title">Agent Booking Management</h2>
              <p className="section-desc">
                Live bookings table synchronized directly from Cloudflare D1 (<code>travel-agencie-db</code>).
              </p>
            </div>

            <button
              className="btn-pill-subtle"
              onClick={loadAdminBookings}
              disabled={adminLoading}
            >
              <RefreshCw size={14} className={adminLoading ? 'animate-spin' : ''} />
              <span>Refresh Records</span>
            </button>
          </div>

          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}
          >
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Ref #</th>
                    <th>Guest</th>
                    <th>Package</th>
                    <th>Travel Date</th>
                    <th>Party</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {adminLoading ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        <RefreshCw className="animate-spin" size={24} style={{ margin: '0 auto 0.75rem' }} />
                        Querying Cloudflare D1 database...
                      </td>
                    </tr>
                  ) : adminBookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        No bookings found in D1 database.
                      </td>
                    </tr>
                  ) : (
                    adminBookings.map((b) => (
                      <tr key={b.id}>
                        <td style={{ fontFamily: 'monospace', color: 'var(--accent-gold)' }}>
                          #BK-{String(b.id).padStart(4, '0')}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{b.customer_name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                            {b.customer_email}
                          </div>
                        </td>
                        <td>{b.package_title}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Calendar size={13} color="var(--accent-blue)" />
                            {b.travel_date}
                          </div>
                        </td>
                        <td>{b.travelers_count} guests</td>
                        <td style={{ fontWeight: 700, color: 'var(--accent-gold-light)' }}>
                          ${b.total_price ? b.total_price.toLocaleString() : '—'}
                        </td>
                        <td>
                          <span className="badge-status confirmed">
                            <CheckCircle2 size={12} /> {b.status || 'Confirmed'}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                          {b.created_at ? new Date(b.created_at).toLocaleDateString() : 'Just now'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Booking Modal */}
      {bookingModalOpen && selectedPackage && (
        <div className="modal-overlay" onClick={() => setBookingModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Reserve Itinerary</h3>
              <button
                className="btn-close-modal"
                onClick={() => setBookingModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              {bookingSuccess ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <CheckCircle2 size={58} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                  <h3 className="card-title" style={{ color: '#10b981', fontSize: '1.4rem' }}>
                    Booking Confirmed!
                  </h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: '0.92rem' }}>
                    Reference ID: <strong style={{ color: 'var(--accent-gold)' }}>#BK-{String(bookingSuccess.id).padStart(4, '0')}</strong>
                  </p>
                  <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    Your reservation has been securely committed to Cloudflare D1. Total amount due upon concierge consultation: <strong>${bookingSuccess.total.toLocaleString()}</strong>.
                  </p>
                  <button
                    className="btn-primary"
                    onClick={() => setBookingModalOpen(false)}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit}>
                  {/* Selected Package Header */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center',
                      background: 'rgba(255, 255, 255, 0.04)',
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <img
                      src={selectedPackage.image_url}
                      alt={selectedPackage.title}
                      style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                        {selectedPackage.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {selectedPackage.destination}, {selectedPackage.country} • {selectedPackage.duration_days} Days
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
                        ${selectedPackage.price.toLocaleString()} / person
                      </div>
                    </div>
                  </div>

                  {bookingError && (
                    <div
                      style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1.25rem',
                        fontSize: '0.85rem',
                      }}
                    >
                      {bookingError}
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Primary Guest Full Name *</label>
                    <div className="input-field-group">
                      <User size={16} />
                      <input
                        type="text"
                        required
                        className="search-input"
                        placeholder="e.g. Eleanor Vance"
                        value={bookingForm.customer_name}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, customer_name: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <div className="input-field-group">
                        <Mail size={16} />
                        <input
                          type="email"
                          required
                          className="search-input"
                          placeholder="eleanor@example.com"
                          value={bookingForm.customer_email}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, customer_email: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <div className="input-field-group">
                        <Phone size={16} />
                        <input
                          type="tel"
                          className="search-input"
                          placeholder="+1 (555) 019-2831"
                          value={bookingForm.customer_phone}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, customer_phone: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Preferred Start Date *</label>
                      <div className="input-field-group">
                        <Calendar size={16} />
                        <input
                          type="date"
                          required
                          className="search-input"
                          value={bookingForm.travel_date}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, travel_date: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Number of Guests *</label>
                      <div className="input-field-group">
                        <Users size={16} />
                        <input
                          type="number"
                          min="1"
                          max="20"
                          required
                          className="search-input"
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
                  </div>

                  <div className="form-group">
                    <label className="form-label">Special Requests / Dietary Needs</label>
                    <textarea
                      rows={2}
                      className="form-control"
                      placeholder="Vegetarian preference, airport transfer, honeymoon suite..."
                      value={bookingForm.special_requests}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, special_requests: e.target.value })
                      }
                    />
                  </div>

                  <div className="booking-summary-box">
                    <div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
                        Estimated Total ({bookingForm.travelers_count} {bookingForm.travelers_count === 1 ? 'Guest' : 'Guests'})
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Includes taxes, luxury stays &amp; private guide
                      </div>
                    </div>
                    <div className="booking-summary-total">
                      ${computedTotal.toLocaleString()}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingSubmitting}
                    className="btn-primary"
                    style={{ width: '100%', padding: '0.85rem' }}
                  >
                    {bookingSubmitting ? 'Saving to Cloudflare D1...' : 'Confirm Reservation'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Package Details Modal */}
      {detailsModalPackage && (
        <div className="modal-overlay" onClick={() => setDetailsModalPackage(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{detailsModalPackage.title}</h3>
              <button
                className="btn-close-modal"
                onClick={() => setDetailsModalPackage(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              <img
                src={detailsModalPackage.image_url}
                alt={detailsModalPackage.title}
                style={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span className="card-badge-category" style={{ position: 'static' }}>
                  {detailsModalPackage.category}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 600 }}>
                  <Star size={14} fill="var(--accent-gold)" />
                  {detailsModalPackage.rating} ({detailsModalPackage.reviews_count} reviews)
                </span>
              </div>

              <h4 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1rem' }}>Expedition Overview</h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.92rem' }}>
                {detailsModalPackage.description}
              </p>

              <h4 style={{ color: '#fff', marginBottom: '0.75rem', fontSize: '1rem' }}>Curated Highlights</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                {detailsModalPackage.highlights.split(',').map((h, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontSize: '0.88rem' }}>
                    <CheckCircle2 size={16} color="var(--accent-gold)" />
                    <span>{h.trim()}</span>
                  </li>
                ))}
              </ul>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Price Per Person</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-gold-light)', fontFamily: 'var(--font-serif)' }}>
                    ${detailsModalPackage.price.toLocaleString()}
                  </div>
                </div>

                <button
                  className="btn-primary"
                  onClick={() => {
                    const pkg = detailsModalPackage;
                    setDetailsModalPackage(null);
                    handleOpenBooking(pkg);
                  }}
                >
                  Book This Journey
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer-wrap">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="brand-logo" style={{ marginBottom: '1rem' }}>
              <PlaneTakeoff size={24} />
              <span>Travel Agencie</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, maxWidth: 320 }}>
              Crafting extraordinary luxury expeditions with state-of-the-art serverless architecture.
            </p>
            <div className="edge-badges-row">
              <span className="edge-pill">
                <Database size={12} /> Cloudflare D1 SQL
              </span>
              <span className="edge-pill">
                <Layers size={12} /> Cloudflare Workers
              </span>
              <span className="edge-pill">
                <Globe2 size={12} /> Cloudflare Pages
              </span>
            </div>
          </div>

          <div className="footer-col">
            <h5>Destinations</h5>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory('Cultural'); }}>Kyoto &amp; Tokyo</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory('Luxury'); }}>Amalfi Coast</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory('Beach & Culture'); }}>Bali Sacred Temples</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory('Adventure'); }}>Swiss Alps</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory('Wildlife'); }}>Serengeti Safari</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Navigation</h5>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('explore'); }}>Featured Tours</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('inquiry'); }}>Custom Inquiries</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('admin'); }}>Agent Portal</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Cloudflare Edge Stack</h5>
            <p style={{ color: 'var(--text-subtle)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
              Worker: <code>travel-agencie</code><br />
              Database: <code>travel-agencie-db</code><br />
              Pages: <code>travel-agencie.pages.dev</code>
            </p>
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)' }}>
              100% Free Cloudflare Edge Architecture
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>&copy; {new Date().getFullYear()} Travel Agencie. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Edge Status: Healthy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
