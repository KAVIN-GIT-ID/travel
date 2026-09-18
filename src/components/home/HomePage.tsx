import React, { useState, useMemo } from 'react';
import type { Package, Vehicle, LocationPoint } from '../../types';
import type { NavTab } from '../common/Navbar';
import { SOUTH_INDIA_LOCATIONS, POPULAR_ROUTES } from '../../data/southIndiaLocations';
import { calculateRoadDistanceKm, formatDrivingDuration, formatINR } from '../../utils/distance';

interface HomePageProps {
  packages: Package[];
  vehicles: Vehicle[];
  onNavigate: (tab: NavTab) => void;
  onBookPackage: (pkg: Package) => void;
  onRentVehicle: (vehicle: Vehicle) => void;
  onBookRoute: (data: {
    pickup: string;
    dropoff: string;
    distanceKm: number;
    vehicle: Vehicle;
    totalFare: number;
  }) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  packages,
  vehicles,
  onNavigate,
  onBookPackage,
  onRentVehicle,
  onBookRoute,
}) => {
  // Search Widget State - default Chennai to Bengaluru
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip' | 'airport'>('oneway');
  const [pickupCityId, setPickupCityId] = useState<string>('tn-che'); // Chennai
  const [dropoffCityId, setDropoffCityId] = useState<string>('ka-blr'); // Bengaluru
  const [departureDate, setDepartureDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [pickupTime, setPickupTime] = useState<string>('06:00');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Car' | 'Bus'>('All');

  // Selected Points
  const pickupPoint = useMemo<LocationPoint>(() => {
    return SOUTH_INDIA_LOCATIONS.find((l) => l.id === pickupCityId) || SOUTH_INDIA_LOCATIONS[0];
  }, [pickupCityId]);

  const dropoffPoint = useMemo<LocationPoint>(() => {
    return SOUTH_INDIA_LOCATIONS.find((l) => l.id === dropoffCityId) || SOUTH_INDIA_LOCATIONS[20];
  }, [dropoffCityId]);

  // Road distance and duration calculation
  const distanceKm = useMemo(() => {
    const rawKm = calculateRoadDistanceKm(
      pickupPoint.lat,
      pickupPoint.lng,
      dropoffPoint.lat,
      dropoffPoint.lng
    );
    return tripType === 'roundtrip' ? rawKm * 2 : rawKm;
  }, [pickupPoint, dropoffPoint, tripType]);

  const durationText = useMemo(() => {
    return formatDrivingDuration(distanceKm);
  }, [distanceKm]);

  // Filtered vehicles for search results
  const filteredVehicles = useMemo(() => {
    if (categoryFilter === 'All') return vehicles;
    return vehicles.filter((v) => v.type === categoryFilter);
  }, [vehicles, categoryFilter]);

  // City swapping
  const handleSwapCities = () => {
    const temp = pickupCityId;
    setPickupCityId(dropoffCityId);
    setDropoffCityId(temp);
  };

  // Popular route selection handler
  const handleSelectPopularRoute = (fromId: string, toId: string) => {
    setPickupCityId(fromId);
    setDropoffCityId(toId);
    // Smooth scroll to search results
    const resultsEl = document.getElementById('search-results-anchor');
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Trigger search
  const handleSearchClick = () => {
    const resultsEl = document.getElementById('search-results-anchor');
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Format date for MMT display (e.g., "19 Sep'26, Sat")
  const formattedDisplayDate = useMemo(() => {
    try {
      const d = new Date(departureDate);
      return d.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return departureDate;
    }
  }, [departureDate]);

  // Featured lists
  const featuredPackages = packages.slice(0, 3);
  const featuredFleet = vehicles.slice(0, 4);

  return (
    <div className="space-y-10 sm:space-y-14 -mt-2">
      {/* ============================================================ */}
      {/* 1. MAKEMYTRIP SIGNATURE HERO & OUTSTATION SEARCH WIDGET */}
      {/* ============================================================ */}
      <div className="relative bg-gradient-to-b from-[#051329] via-[#092247] to-[#0c2f60] text-white rounded-2xl shadow-xl overflow-hidden border border-slate-800">
        {/* Subtle Background Pattern & Glow */}
        <div className="absolute inset-0 z-0 opacity-15 bg-[radial-gradient(#008cff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 px-4 sm:px-8 pt-8 pb-14 max-w-6xl mx-auto">
          {/* Top Brand Subheader */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-blue-300 text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>South India Outstation Cabs &amp; Tourist Buses</span>
            </div>
            <div className="text-xs text-slate-300 flex items-center gap-3">
              <span>Coverage: <strong className="text-white">Tamil Nadu • Kerala • Karnataka</strong></span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 font-semibold">✓ AITP All-India Permits</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-2 leading-tight">
            Book Outstation Cabs &amp; Buses Across South India
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl mb-8">
            Transparent per-kilometer billing with verified commercial chauffeurs. Clean AC sedans, Innova Crystas, Tempo Travelers, and luxury tourist buses.
          </p>

          {/* ------------------------------------------------------------ */}
          {/* THE MAKEMYTRIP ELEVATED SEARCH BOX */}
          {/* ------------------------------------------------------------ */}
          <div className="bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-100 p-4 sm:p-6 transition">
            {/* Top Trip Type Radio Bar */}
            <div className="flex flex-wrap items-center gap-6 pb-4 border-b border-gray-100 text-sm font-semibold">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="tripType"
                  value="oneway"
                  checked={tripType === 'oneway'}
                  onChange={() => setTripType('oneway')}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className={tripType === 'oneway' ? 'text-blue-600 font-bold' : 'text-gray-600'}>
                  ONE WAY DROP
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="tripType"
                  value="roundtrip"
                  checked={tripType === 'roundtrip'}
                  onChange={() => setTripType('roundtrip')}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className={tripType === 'roundtrip' ? 'text-blue-600 font-bold' : 'text-gray-600'}>
                  ROUND TRIP
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="tripType"
                  value="airport"
                  checked={tripType === 'airport'}
                  onChange={() => setTripType('airport')}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className={tripType === 'airport' ? 'text-blue-600 font-bold' : 'text-gray-600'}>
                  AIRPORT / RAILWAY TRANSFER
                </span>
              </label>

              <div className="ml-auto hidden md:flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-medium border border-emerald-200">
                <span>🛡️ Zero Hidden Charges • Tolls Included Option</span>
              </div>
            </div>

            {/* MMT Tile Grid */}
            <div className="relative grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-0 mt-4 border md:border-gray-200 md:rounded-xl overflow-visible bg-white">
              {/* Tile 1: FROM CITY (col 1-4) */}
              <div className="md:col-span-4 p-3.5 sm:p-4 hover:bg-blue-50/40 transition rounded-lg md:rounded-l-xl md:rounded-r-none border-b md:border-b-0 md:border-r border-gray-200 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    FROM (PICKUP CITY)
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                    {pickupPoint.state}
                  </span>
                </div>
                <div className="mt-1">
                  <select
                    value={pickupCityId}
                    onChange={(e) => setPickupCityId(e.target.value)}
                    aria-label="Select Pickup City"
                    className="w-full text-lg sm:text-xl font-black text-gray-900 bg-transparent border-0 p-0 focus:ring-0 cursor-pointer"
                  >
                    <optgroup label="Tamil Nadu">
                      {SOUTH_INDIA_LOCATIONS.filter((l) => l.state === 'Tamil Nadu').map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Kerala">
                      {SOUTH_INDIA_LOCATIONS.filter((l) => l.state === 'Kerala').map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Karnataka">
                      {SOUTH_INDIA_LOCATIONS.filter((l) => l.state === 'Karnataka').map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    Any Address, Airport or Hotel in {pickupPoint.name}
                  </p>
                </div>
              </div>

              {/* City Swap Floating Button (centered over divider) */}
              <div className="hidden md:flex absolute left-[33.33%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <button
                  type="button"
                  onClick={handleSwapCities}
                  title="Swap Pickup and Dropoff"
                  className="w-8 h-8 rounded-full bg-white border border-gray-300 shadow-md flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition transform hover:scale-110 active:scale-95 cursor-pointer"
                >
                  ⇄
                </button>
              </div>

              {/* Tile 2: TO CITY (col 5-8) */}
              <div className="md:col-span-4 p-3.5 sm:p-4 hover:bg-blue-50/40 transition border-b md:border-b-0 md:border-r border-gray-200 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    TO (DROPOFF CITY)
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                    {dropoffPoint.state}
                  </span>
                </div>
                <div className="mt-1">
                  <select
                    value={dropoffCityId}
                    onChange={(e) => setDropoffCityId(e.target.value)}
                    aria-label="Select Dropoff City"
                    className="w-full text-lg sm:text-xl font-black text-gray-900 bg-transparent border-0 p-0 focus:ring-0 cursor-pointer"
                  >
                    <optgroup label="Tamil Nadu">
                      {SOUTH_INDIA_LOCATIONS.filter((l) => l.state === 'Tamil Nadu').map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Kerala">
                      {SOUTH_INDIA_LOCATIONS.filter((l) => l.state === 'Kerala').map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Karnataka">
                      {SOUTH_INDIA_LOCATIONS.filter((l) => l.state === 'Karnataka').map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    Doorstep Drop / Destination in {dropoffPoint.name}
                  </p>
                </div>
              </div>

              {/* Tile 3: DEPARTURE DATE (col 9-10) */}
              <div className="md:col-span-2 p-3.5 sm:p-4 hover:bg-blue-50/40 transition border-b md:border-b-0 md:border-r border-gray-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                  DEPARTURE DATE
                </span>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full font-bold text-gray-900 bg-transparent border-0 p-0 text-sm focus:ring-0 cursor-pointer mt-1"
                />
                <span className="text-[11px] text-blue-600 font-semibold block truncate">
                  {formattedDisplayDate}
                </span>
              </div>

              {/* Tile 4: PICKUP TIME (col 11-12) */}
              <div className="md:col-span-2 p-3.5 sm:p-4 hover:bg-blue-50/40 transition rounded-lg md:rounded-r-xl md:rounded-l-none">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                  PICKUP TIME
                </span>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  aria-label="Select Pickup Time"
                  className="w-full font-bold text-gray-900 bg-transparent border-0 p-0 text-sm focus:ring-0 cursor-pointer mt-1"
                >
                  <option value="05:00">05:00 AM (Early Start)</option>
                  <option value="06:00">06:00 AM</option>
                  <option value="07:00">07:00 AM</option>
                  <option value="08:00">08:00 AM</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="12:00">12:00 PM (Noon)</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="18:00">06:00 PM</option>
                  <option value="21:00">09:00 PM (Night)</option>
                </select>
                <span className="text-[11px] text-gray-500 block truncate">
                  24/7 Chauffeur Dispatch
                </span>
              </div>
            </div>

            {/* Centered MakeMyTrip Big Search Button */}
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleSearchClick}
                className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-gradient-to-r from-[#008cff] to-[#0055ff] hover:from-[#0077e6] hover:to-[#0044dd] text-white font-extrabold text-sm sm:text-base uppercase tracking-wider shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>SEARCH CABS &amp; BUSES</span>
                <span>➔</span>
              </button>
            </div>
          </div>

          {/* Quick Popular Corridors Strip */}
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              Popular Routes:
            </span>
            {POPULAR_ROUTES.map((route) => (
              <button
                key={route.title}
                type="button"
                onClick={() => handleSelectPopularRoute(route.fromId, route.toId)}
                className="bg-slate-800/80 hover:bg-blue-600 hover:text-white px-3 py-1 rounded-full text-slate-200 border border-slate-700 transition cursor-pointer text-xs font-medium"
              >
                {route.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. MAKEMYTRIP STYLE CAB SEARCH RESULTS SECTION */}
      {/* ============================================================ */}
      <div id="search-results-anchor" className="scroll-mt-24 space-y-6">
        {/* Route Summary Ribbon */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                {pickupPoint.name} to {dropoffPoint.name} Cabs &amp; Buses
              </h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded">
                {tripType === 'roundtrip' ? 'Round Trip' : 'One Way'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mt-1.5">
              <span className="font-semibold text-gray-900">
                🛣️ Distance: <strong className="text-blue-600">{distanceKm} km</strong>
              </span>
              <span>•</span>
              <span>⏱️ Driving Duration: <strong>~{durationText}</strong></span>
              <span>•</span>
              <span>📅 {formattedDisplayDate} at {pickupTime}</span>
              <span>•</span>
              <span className="text-emerald-700 font-medium">✓ Tolls &amp; Driver Beta Included</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            {/* Filter Pills */}
            <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50 text-xs font-semibold">
              {(['All', 'Car', 'Bus'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-white text-blue-600 shadow-xs font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {cat === 'All' ? 'All Fleet' : cat === 'Car' ? 'Cars (4-7)' : 'Buses (12-40)'}
                </button>
              ))}
            </div>

            {/* Map Route Button */}
            <button
              onClick={() => onNavigate('route-calc')}
              className="border border-blue-200 hover:border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              title="Open full interactive map route calculator"
            >
              <span>🗺️</span>
              <span className="hidden sm:inline">Interactive Map</span>
            </button>
          </div>
        </div>

        {/* Results Cards List */}
        <div className="space-y-4">
          {filteredVehicles.map((vehicle) => {
            const vehicleFare = distanceKm * vehicle.per_km_rate + vehicle.base_fare;
            const originalPrice = Math.round(vehicleFare * 1.15); // Strikethrough MMT style

            return (
              <div
                key={vehicle.id}
                className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                {/* Column 1: Image & Badges */}
                <div className="w-full md:w-48 sm:shrink-0 flex md:flex-col items-center md:items-start gap-3">
                  <div className="relative w-28 h-20 md:w-44 md:h-28 rounded-lg overflow-hidden bg-gray-100 border border-gray-100 shrink-0">
                    <img
                      src={vehicle.image_url}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute top-1.5 left-1.5 bg-gray-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {vehicle.type}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 w-fit">
                      <span>★ 4.8</span>
                      <span className="text-gray-400 font-normal">/ 5.0 (300+ trips)</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 w-fit">
                      AITP Certified
                    </span>
                  </div>
                </div>

                {/* Column 2: Vehicle Specs & Inclusions */}
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="text-lg font-black text-gray-900 tracking-tight">
                      {vehicle.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mt-1">
                      <span className="font-semibold text-gray-800">
                        👥 {vehicle.capacity} Passengers
                      </span>
                      <span>•</span>
                      <span>❄️ {vehicle.ac_type}</span>
                      <span>•</span>
                      <span>🧳 {vehicle.type === 'Car' ? '3 Large Bags' : 'Luggage Boot'}</span>
                      <span>•</span>
                      <span>⛽ Diesel / GPS</span>
                    </div>
                  </div>

                  {/* MakeMyTrip Inclusions Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <span>✓</span>
                      <span>{distanceKm} km included in total fare</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <span>✓</span>
                      <span>Extra km rate: <strong>₹{vehicle.per_km_rate}/km</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <span>✓</span>
                      <span>Interstate taxes &amp; permits pre-paid</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <span>✓</span>
                      <span>Driver Beta &amp; allowances included</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 pt-1">
                    Free cancellation up to 6 hours before scheduled departure. Instant reservation confirmation.
                  </p>
                </div>

                {/* Column 3: MMT Price Block & Instant Book Button */}
                <div className="w-full md:w-56 pt-3 md:pt-0 border-t md:border-t-0 md:border-l md:border-gray-100 md:pl-6 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0">
                  <div className="text-left md:text-right">
                    <div className="text-xs text-gray-400 line-through">
                      {formatINR(originalPrice)}
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-none">
                      {formatINR(vehicleFare)}
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                      Taxes &amp; Tolls Included
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">
                      Base rate: ₹{vehicle.per_km_rate}/km
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onBookRoute({
                        pickup: pickupPoint.name,
                        dropoff: dropoffPoint.name,
                        distanceKm,
                        vehicle,
                        totalFare: vehicleFare,
                      })
                    }
                    className="w-full sm:w-auto md:w-full bg-[#008cff] hover:bg-[#0077e6] active:bg-[#0055ff] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider px-6 py-3 rounded-lg shadow-sm transition cursor-pointer text-center"
                  >
                    BOOK NOW
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. POPULAR OUTSTATION CORRIDORS (MMT STYLE CARDS) */}
      {/* ============================================================ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              Frequent Routes
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Popular Outstation Corridors in South India
            </h2>
          </div>
          <button
            onClick={() => onNavigate('route-calc')}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All on Map</span>
            <span>➔</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { from: 'ka-blr', to: 'tn-oot', title: 'Bangalore ➔ Ooty', km: 280, fromCity: 'Bangalore', toCity: 'Ooty', rate: 4200, state: 'KA - TN' },
            { from: 'ka-blr', to: 'ka-coo', title: 'Bangalore ➔ Coorg', km: 255, fromCity: 'Bangalore', toCity: 'Coorg', rate: 3850, state: 'KA' },
            { from: 'tn-che', to: 'tn-ram', title: 'Chennai ➔ Rameshwaram', km: 560, fromCity: 'Chennai', toCity: 'Rameshwaram', rate: 8400, state: 'TN' },
            { from: 'kl-koc', to: 'kl-mun', title: 'Kochi ➔ Munnar', km: 130, fromCity: 'Kochi', toCity: 'Munnar', rate: 2100, state: 'KL' },
            { from: 'tn-che', to: 'ka-blr', title: 'Chennai ➔ Bangalore', km: 345, fromCity: 'Chennai', toCity: 'Bangalore', rate: 5200, state: 'TN - KA' },
            { from: 'ka-blr', to: 'ka-mys', title: 'Bangalore ➔ Mysore', km: 145, fromCity: 'Bangalore', toCity: 'Mysore', rate: 2200, state: 'KA' },
            { from: 'tn-cbe', to: 'tn-kod', title: 'Coimbatore ➔ Kodaikanal', km: 175, fromCity: 'Coimbatore', toCity: 'Kodaikanal', rate: 2650, state: 'TN' },
            { from: 'kl-koc', to: 'kl-all', title: 'Kochi ➔ Alleppey', km: 60, fromCity: 'Kochi', toCity: 'Alleppey', rate: 1200, state: 'KL' },
          ].map((corridor) => (
            <div
              key={corridor.title}
              onClick={() => handleSelectPopularRoute(corridor.from, corridor.to)}
              className="bg-white border border-gray-200 hover:border-blue-500 rounded-xl p-4 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span className="font-semibold text-blue-600">{corridor.state}</span>
                  <span>{corridor.km} km</span>
                </div>
                <h3 className="font-bold text-base text-gray-900 group-hover:text-blue-600 transition">
                  {corridor.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  One-way drop &amp; round trip available
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">Fares From</span>
                  <span className="font-extrabold text-sm text-gray-900">
                    {formatINR(corridor.rate)}
                  </span>
                </div>
                <span className="text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition">
                  Book ➔
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. TRUST & VALUE PROPOSITIONS (WHY BOOK WITH US) */}
      {/* ============================================================ */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
            Why Book With Us
          </span>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            South India Interstate Travel Specialists
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Authorised interstate tourist transport covering Tamil Nadu, Kerala, and Karnataka with verified commercial chauffeurs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
              ₹
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">Fixed Per-KM Rates</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Zero surge pricing. Rates strictly fixed per kilometer from ₹14/km for Sedans to ₹45/km for Volvo coaches.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shrink-0">
              ✓
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">AITP Border Permits</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                All commercial vehicles possess valid All-India Tourist Permits. No stoppage at interstate checkposts.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">
              👥
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">Cars &amp; Large Buses</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Whether 4 passengers in a Dzire or 40 passengers in a Volvo coach for college or marriage trips, we have you covered.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg shrink-0">
              📞
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">24x7 Trip Support</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Round-the-clock telephone control room at +91 98401 23456 with live GPS vehicle dispatch and driver coordination.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. INTERACTIVE ROUTE MAP TEASER */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="max-w-2xl">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
            Need Live Map View?
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Open Interactive South India Route &amp; Distance Calculator
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Click any two points on the map or use your current GPS location to see real driving paths, ghat road curves, driving durations, and exact per-km vehicle pricing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('route-calc')}
          className="bg-white hover:bg-slate-100 text-gray-900 font-extrabold px-6 py-3 rounded-lg text-sm shadow-md transition whitespace-nowrap cursor-pointer flex items-center gap-2"
        >
          <span>Open Route Map</span>
          <span>➔</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* 6. FEATURED HOLIDAY TOUR PACKAGES */}
      {/* ============================================================ */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              Curated Holidays
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              South India Holiday Tour Packages
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              All-inclusive itineraries with private car/bus transport and handpicked hotels.
            </p>
          </div>

          <button
            onClick={() => onNavigate('tours')}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Packages</span>
            <span>➔</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:border-blue-400 hover:shadow-md transition flex flex-col group"
            >
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img
                  src={pkg.image_url}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-gray-900/85 text-white text-[11px] font-semibold px-2.5 py-1 rounded">
                  {pkg.state}
                </span>
                <span className="absolute top-3 right-3 bg-white text-gray-900 text-[11px] font-bold px-2.5 py-1 rounded shadow-sm border border-gray-200">
                  {pkg.category}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="text-xs text-blue-600 font-semibold mb-1">
                  {pkg.destination} • {pkg.duration_days} Days / {pkg.duration_days - 1} Nights
                </div>
                <h3 className="font-bold text-base text-gray-900 group-hover:text-blue-600 transition">
                  {pkg.title}
                </h3>
                <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                  {pkg.description}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">All Inclusive From</span>
                    <span className="text-lg font-black text-gray-900">
                      {formatINR(pkg.price)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onBookPackage(pkg)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-xs cursor-pointer"
                  >
                    Book Tour
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 7. FLEET PREVIEW & GROUP TRAVEL BANNER */}
      {/* ============================================================ */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              Verified Vehicles
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Commercial Fleet &amp; Fixed Kilometric Rates
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              Sedans, Premium SUVs, Tempo Travelers, and Luxury Coaches.
            </p>
          </div>

          <button
            onClick={() => onNavigate('fleet')}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Fleet</span>
            <span>➔</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredFleet.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:border-gray-300 transition flex flex-col"
            >
              <div className="relative h-40 bg-gray-100 overflow-hidden">
                <img
                  src={v.image_url}
                  alt={v.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="absolute top-2.5 left-2.5 bg-gray-900/85 text-white text-[11px] font-medium px-2 py-0.5 rounded">
                  {v.type}
                </span>
                <span className="absolute top-2.5 right-2.5 bg-blue-600 text-white font-extrabold text-xs px-2 py-0.5 rounded shadow-xs">
                  ₹{v.per_km_rate}/km
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-sm text-gray-900">{v.name}</h3>
                <div className="text-xs text-gray-500 mt-1">
                  👥 {v.capacity} Seats • ❄️ {v.ac_type}
                </div>

                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-900">₹{v.per_km_rate}</span>
                    <span className="text-[10px] text-gray-500"> / km</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRentVehicle(v)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition cursor-pointer"
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Group Bus Charter Card */}
      <div className="bg-[#051329] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
            Group &amp; Corporate Bus Rentals
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Need Bulk Bus Booking for Weddings, Colleges, or Corporate Offsites?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
            We provide 21-seater mini coaches and 40-seater multi-axle sleeper buses with customized pickup points, luggage space, and dedicated trip coordinators.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('inquiry')}
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold px-6 py-3 rounded-lg text-sm shadow-md transition whitespace-nowrap cursor-pointer"
        >
          Send Bulk Inquiry ➔
        </button>
      </div>
    </div>
  );
};
