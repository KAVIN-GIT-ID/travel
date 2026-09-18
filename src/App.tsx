import { useState, useEffect } from 'react';
import type { Package, Vehicle, Booking, BookingRequest, User } from './types';
import { packageService, vehicleService, bookingService } from './services/api';
import { Navbar, type NavTab } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/home/HomePage';
import { RouteCalculator } from './components/route/RouteCalculator';
import { TourList } from './components/tours/TourList';
import { VehicleFleet } from './components/vehicles/VehicleFleet';
import { CustomInquiry } from './components/inquiry/CustomInquiry';
import { AdminPortal } from './components/admin/AdminPortal';
import { BookingModal } from './components/booking/BookingModal';
import { GoogleLoginModal } from './components/auth/GoogleLoginModal';

const TAB_ROUTES: Record<NavTab, string> = {
  'home': '/',
  'route-calc': '/route',
  'tours': '/tours',
  'fleet': '/fleet',
  'inquiry': '/group-travel',
  'admin': '/admin',
};

const getTabFromPath = (path: string): NavTab => {
  const cleanPath = path.toLowerCase().replace(/\/+$/, '') || '/';
  if (cleanPath === '/admin' || cleanPath === '/login') return 'admin';
  if (cleanPath === '/route' || cleanPath === '/map' || cleanPath === '/route-calc') return 'route-calc';
  if (cleanPath === '/tours' || cleanPath === '/packages') return 'tours';
  if (cleanPath === '/fleet' || cleanPath === '/vehicles') return 'fleet';
  if (cleanPath === '/group-travel' || cleanPath === '/custom' || cleanPath === '/inquiry') return 'inquiry';
  return 'home';
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>(() => getTabFromPath(window.location.pathname));

  // Current Logged In User (Strictly database driven)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('travel_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Google Login Modal State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string>('');

  // 1. Ask for user location permission on application load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocationNotice(
            `📍 Location verified (${latitude.toFixed(2)}, ${longitude.toFixed(2)}). South India departure hub auto-calibrated.`
          );
          setTimeout(() => setLocationNotice(''), 6000);
        },
        (err) => {
          console.log('Location permission info:', err.message);
        },
        { timeout: 8000, enableHighAccuracy: false }
      );
    }
  }, []);

  // 2. Ask user to login/signup via Google OAuth after 10 seconds (if not logged in)
  useEffect(() => {
    if (!currentUser) {
      const timer = setTimeout(() => {
        const alreadyPrompted = sessionStorage.getItem('travel_login_prompted_10s');
        if (!alreadyPrompted && !localStorage.getItem('travel_user')) {
          sessionStorage.setItem('travel_login_prompted_10s', 'true');
          setShowLoginModal(true);
        }
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [currentUser]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('travel_user', JSON.stringify(user));
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('travel_user');
  };

  // Sync tab change with browser URL
  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    const targetPath = TAB_ROUTES[tab];
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab }, '', targetPath);
    }
  };

  // Sync browser back/forward and normalize initial URL
  useEffect(() => {
    const currentPath = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
    // If user arrived on /login, normalize URL to /admin
    if (currentPath === '/login') {
      window.history.replaceState({ tab: 'admin' }, '', '/admin');
    } else if (!Object.values(TAB_ROUTES).includes(currentPath)) {
      // Unknown route - normalize to /
      window.history.replaceState({ tab: 'home' }, '', '/');
    }

    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.tab) {
        setActiveTab(e.state.tab);
      } else {
        setActiveTab(getTabFromPath(window.location.pathname));
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Application Data
  const [packages, setPackages] = useState<Package[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter for Tour Packages
  const [selectedState, setSelectedState] = useState('All');

  // Booking Checkout State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [activeCheckoutData, setActiveCheckoutData] = useState<{
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

  // Load all initial data from Cloudflare Worker & D1
  const loadAllData = async () => {
    try {
      setLoading(true);
      const [pkgs, vhcls, bks] = await Promise.all([
        packageService.getAll(selectedState),
        vehicleService.getAll(),
        bookingService.getAll(),
      ]);
      setPackages(pkgs);
      setVehicles(vhcls);
      setBookings(bks);
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [selectedState]);

  // Handlers for Booking Triggers
  const handleOpenTourBooking = (pkg: Package) => {
    setActiveCheckoutData({
      booking_type: 'package',
      package_id: pkg.id,
      package_title: pkg.title,
      total_price: pkg.price,
      image_url: pkg.image_url,
    });
    setBookingModalOpen(true);
  };

  const handleOpenRouteBooking = (data: {
    pickup: string;
    dropoff: string;
    distanceKm: number;
    vehicle: Vehicle;
    totalFare: number;
  }) => {
    setActiveCheckoutData({
      booking_type: 'route_rental',
      vehicle_id: data.vehicle.id,
      vehicle_name: `${data.vehicle.name} (${data.vehicle.type})`,
      pickup_location: data.pickup,
      dropoff_location: data.dropoff,
      distance_km: data.distanceKm,
      total_price: data.totalFare,
      image_url: data.vehicle.image_url,
    });
    setBookingModalOpen(true);
  };

  const handleOpenVehicleRental = (v: Vehicle) => {
    setActiveCheckoutData({
      booking_type: 'route_rental',
      vehicle_id: v.id,
      vehicle_name: `${v.name} (${v.type})`,
      pickup_location: 'Bengaluru / Chennai / Kochi',
      dropoff_location: 'South India Destination',
      distance_km: 150,
      total_price: 150 * v.per_km_rate + v.base_fare,
      image_url: v.image_url,
    });
    setBookingModalOpen(true);
  };

  const handleSubmitBooking = async (payload: BookingRequest) => {
    const res = await bookingService.create(payload);
    // Refresh bookings in background
    bookingService.getAll().then(setBookings);
    return res;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Location Notice Banner */}
      {locationNotice && (
        <div className="bg-blue-600 text-white text-xs py-2 px-4 text-center font-medium shadow-sm transition flex items-center justify-center gap-2">
          <span>{locationNotice}</span>
          <button
            onClick={() => setLocationNotice('')}
            className="text-blue-200 hover:text-white font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Enterprise Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onBookClick={() => {
          if (vehicles.length > 0) handleOpenVehicleRental(vehicles[0]);
        }}
        currentUser={currentUser}
        onOpenLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Responsive Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-8 pb-24 lg:pb-12">
        {activeTab === 'home' && (
          <HomePage
            packages={packages}
            vehicles={vehicles}
            onNavigate={handleSelectTab}
            onBookPackage={handleOpenTourBooking}
            onRentVehicle={handleOpenVehicleRental}
            onBookRoute={handleOpenRouteBooking}
          />
        )}

        {activeTab === 'route-calc' && (
          <RouteCalculator
            vehicles={vehicles}
            onBookRoute={handleOpenRouteBooking}
          />
        )}

        {activeTab === 'tours' && (
          <TourList
            packages={packages}
            loading={loading}
            selectedState={selectedState}
            onSelectState={setSelectedState}
            onBookPackage={handleOpenTourBooking}
          />
        )}

        {activeTab === 'fleet' && (
          <VehicleFleet
            vehicles={vehicles}
            onRentVehicle={handleOpenVehicleRental}
          />
        )}

        {activeTab === 'inquiry' && <CustomInquiry />}

        {activeTab === 'admin' && (
          <AdminPortal
            currentUser={currentUser}
            onOpenLogin={() => setShowLoginModal(true)}
            bookings={bookings}
            packages={packages}
            vehicles={vehicles}
            onRefreshData={loadAllData}
          />
        )}
      </main>

      {/* Booking Checkout Modal */}
      {bookingModalOpen && activeCheckoutData && (
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          bookingData={activeCheckoutData}
          onSubmitBooking={handleSubmitBooking}
        />
      )}

      {/* Google OAuth Login / Sign Up Modal */}
      <GoogleLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
        title="Sign In with Google"
        subtitle="Access exclusive South India travel fares, manage cab reservations, and verify permissions."
      />

      {/* Enterprise Footer */}
      <Footer onSelectTab={handleSelectTab} />
    </div>
  );
}
