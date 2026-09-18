import React from 'react';
import type { Package, Vehicle } from '../../types';
import type { NavTab } from '../common/Navbar';
import { formatINR } from '../../utils/distance';
import { POPULAR_ROUTES } from '../../data/southIndiaLocations';

interface HomePageProps {
  packages: Package[];
  vehicles: Vehicle[];
  onNavigate: (tab: NavTab) => void;
  onBookPackage: (pkg: Package) => void;
  onRentVehicle: (vehicle: Vehicle) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  packages,
  vehicles,
  onNavigate,
  onBookPackage,
  onRentVehicle,
}) => {
  const featuredPackages = packages.slice(0, 3);
  const featuredVehicles = vehicles.slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Hero Section */}
      <div className="relative bg-slate-900 text-white rounded-lg overflow-hidden border border-slate-800 shadow-md">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-luminosity">
          <img
            src="https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=80"
            alt="South India Scenery"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-600/90 text-white text-xs font-semibold uppercase tracking-wider mb-4">
            South India Interstate Travels
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Outstation Cars &amp; Tourist Buses Across Tamil Nadu, Kerala &amp; Karnataka
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Reliable chauffeur-driven sedans, Innova Crystas, Tempo Travelers, and luxury Volvo buses. Commercial AITP permits, GPS tracking, and transparent per-kilometer billing.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('route-calc')}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-5 py-3 rounded-md shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span>Calculate Route &amp; Fare on Map</span>
            </button>
            <button
              onClick={() => onNavigate('tours')}
              className="bg-white hover:bg-slate-100 text-slate-900 text-sm font-semibold px-5 py-3 rounded-md shadow-sm transition cursor-pointer"
            >
              Explore Holiday Packages
            </button>
            <button
              onClick={() => onNavigate('fleet')}
              className="bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold px-5 py-3 rounded-md border border-slate-700 transition cursor-pointer"
            >
              View Bus &amp; Car Fleet
            </button>
          </div>
        </div>

        {/* Quick Route Strip */}
        <div className="relative z-10 bg-slate-950/80 border-t border-slate-800 px-6 py-4 flex flex-wrap items-center gap-3 text-xs text-slate-300">
          <span className="font-semibold text-white uppercase tracking-wider text-[11px]">
            Popular Corridors:
          </span>
          {POPULAR_ROUTES.slice(0, 4).map((r) => (
            <button
              key={r.title}
              onClick={() => onNavigate('route-calc')}
              className="bg-slate-800/90 hover:bg-blue-600 hover:text-white px-2.5 py-1 rounded text-slate-300 border border-slate-700 transition cursor-pointer"
            >
              {r.title}
            </button>
          ))}
          <button
            onClick={() => onNavigate('route-calc')}
            className="text-blue-400 hover:text-blue-300 font-semibold ml-auto flex items-center gap-1 cursor-pointer"
          >
            <span>Open Route Map</span>
            <span>➔</span>
          </button>
        </div>
      </div>

      {/* 2. Key Benefits / Trust Factors */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
            Why Choose Us
          </span>
          <h2 className="text-2xl font-bold text-gray-900">
            Professional Interstate Travel Services
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            We provide authorized interstate tourist transport across South India with certified drivers and zero hidden costs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg mb-3">
              ₹
            </div>
            <h3 className="font-bold text-base text-gray-900">Transparent Billing</h3>
            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
              Clear per-kilometer rates starting at ₹14/km for Sedans up to ₹45/km for multi-axle Volvo coaches with driver beta included.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="w-10 h-10 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-3">
              ✓
            </div>
            <h3 className="font-bold text-base text-gray-900">Commercial AITP Permit</h3>
            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
              All fleet vehicles operate with valid All-India Tourist Permits. No interstate border stoppage or tax hassles.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="w-10 h-10 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-3">
              📍
            </div>
            <h3 className="font-bold text-base text-gray-900">GPS Tracked Fleet</h3>
            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
              Live location tracking, 24/7 route control room, verified commercial chauffeurs, and emergency road assistance.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="w-10 h-10 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg mb-3">
              📞
            </div>
            <h3 className="font-bold text-base text-gray-900">24/7 Helpline</h3>
            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
              Direct phone support at +91 98401 23456 for instant bookings, schedule adjustments, and customer assistance.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Dedicated Route Map Banner Feature */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
            Interactive Distance Tool
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
            Interactive Route &amp; Distance Fare Calculator
          </h3>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Need an accurate road distance and instant fare estimate? Use our interactive South India map to choose pickup and drop points, see exact road distance, driving duration, and vehicle fares.
          </p>
        </div>

        <button
          onClick={() => onNavigate('route-calc')}
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-6 py-3 rounded-md text-sm shadow-sm transition whitespace-nowrap cursor-pointer"
        >
          Open Route Map Calculator ➔
        </button>
      </div>

      {/* 4. Featured Holiday Tour Packages */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
              Popular Holidays
            </span>
            <h2 className="text-2xl font-bold text-gray-900">
              South India Tour Packages
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">
              Handpicked itineraries with hotel stays and private car or bus transport.
            </p>
          </div>

          <button
            onClick={() => onNavigate('tours')}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View All Packages</span>
            <span>➔</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:border-gray-300 transition flex flex-col"
            >
              <div className="relative h-44 bg-gray-100 overflow-hidden">
                <img
                  src={pkg.image_url}
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="absolute top-2.5 left-2.5 bg-gray-900/85 text-white text-[11px] font-medium px-2 py-0.5 rounded">
                  {pkg.state}
                </span>
                <span className="absolute top-2.5 right-2.5 bg-white text-gray-900 text-[11px] font-bold px-2 py-0.5 rounded shadow-sm border border-gray-200">
                  {pkg.category}
                </span>
              </div>

              <div className="p-4 sm:p-5 flex flex-col flex-1">
                <div className="text-xs text-blue-600 font-semibold mb-1">
                  {pkg.destination} • {pkg.duration_days} Days
                </div>
                <h3 className="font-bold text-base text-gray-900">
                  {pkg.title}
                </h3>
                <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                  {pkg.description}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-semibold block">Starting from</span>
                    <span className="text-lg font-extrabold text-gray-900">
                      {formatINR(pkg.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => onBookPackage(pkg)}
                    className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-medium px-3.5 py-2 rounded-md transition shadow-sm cursor-pointer"
                  >
                    Book Tour
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Fleet Preview */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
              Vehicle Categories
            </span>
            <h2 className="text-2xl font-bold text-gray-900">
              Commercial Fleet &amp; Rates
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">
              Available for round trips, one-way drops, and multi-day tours.
            </p>
          </div>

          <button
            onClick={() => onNavigate('fleet')}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View All Fleet</span>
            <span>➔</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredVehicles.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:border-gray-300 transition flex flex-col"
            >
              <div className="relative h-36 bg-gray-100 overflow-hidden">
                <img
                  src={v.image_url}
                  alt={v.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 bg-gray-900/85 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                  {v.type}
                </span>
                <span className="absolute top-2 right-2 bg-blue-600 text-white font-bold text-xs px-2 py-0.5 rounded">
                  ₹{v.per_km_rate}/km
                </span>
              </div>

              <div className="p-3.5 flex flex-col flex-1">
                <h4 className="font-bold text-sm text-gray-900">{v.name}</h4>
                <div className="text-xs text-gray-500 mt-1">
                  👥 {v.capacity} Seats • ❄️ {v.ac_type}
                </div>

                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-900">₹{v.per_km_rate}</span>
                    <span className="text-[10px] text-gray-500"> / km</span>
                  </div>

                  <button
                    onClick={() => onRentVehicle(v)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition cursor-pointer"
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Corporate & Group Travel Banner */}
      <div className="bg-slate-900 text-white rounded-lg p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
            Group &amp; Corporate Bus Rentals
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Need Bulk Bus Booking for Colleges, Weddings, or IT Companies?
          </h3>
          <p className="text-sm text-slate-300 mt-1.5 max-w-2xl">
            We provide 21-seater mini coaches and 40-seater multi-axle sleeper buses with customized pickup points and dedicated logistics managers.
          </p>
        </div>

        <button
          onClick={() => onNavigate('inquiry')}
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-5 py-2.5 rounded-md text-sm shadow-sm transition whitespace-nowrap cursor-pointer"
        >
          Send Group Inquiry
        </button>
      </div>
    </div>
  );
};
