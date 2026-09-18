import React, { useState, useMemo } from 'react';
import type { LocationPoint, Vehicle } from '../../types';
import { SOUTH_INDIA_LOCATIONS, POPULAR_ROUTES } from '../../data/southIndiaLocations';
import { calculateRoadDistanceKm, formatDrivingDuration, formatINR } from '../../utils/distance';
import { LeafletMap } from './LeafletMap';

interface RouteCalculatorProps {
  vehicles: Vehicle[];
  onBookRoute: (data: {
    pickup: string;
    dropoff: string;
    distanceKm: number;
    vehicle: Vehicle;
    totalFare: number;
  }) => void;
}

export const RouteCalculator: React.FC<RouteCalculatorProps> = ({
  vehicles,
  onBookRoute,
}) => {
  const [pickupPoint, setPickupPoint] = useState<LocationPoint>(SOUTH_INDIA_LOCATIONS[19]); // Bengaluru
  const [dropoffPoint, setDropoffPoint] = useState<LocationPoint>(SOUTH_INDIA_LOCATIONS[3]); // Ooty
  const [vehicleFilter, setVehicleFilter] = useState<'All' | 'Car' | 'Bus'>('All');
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');

  // Calculate distance in KM
  const distanceKm = useMemo(() => {
    return calculateRoadDistanceKm(
      pickupPoint.lat,
      pickupPoint.lng,
      dropoffPoint.lat,
      dropoffPoint.lng
    );
  }, [pickupPoint, dropoffPoint]);

  const durationEstimate = useMemo(() => {
    return formatDrivingDuration(distanceKm);
  }, [distanceKm]);

  // GPS User Location
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Detecting your GPS position...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setPickupPoint({
          id: 'user-gps',
          name: 'My Current Location (GPS)',
          state: 'Tamil Nadu',
          lat: latitude,
          lng: longitude,
        });
        setLocationStatus('GPS position verified.');
        setTimeout(() => setLocationStatus(''), 4000);
      },
      (err) => {
        setIsLocating(false);
        setLocationStatus(`GPS access error: ${err.message}. Selected default hub.`);
        setTimeout(() => setLocationStatus(''), 4000);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Map Click Location Select
  const handleMapLocationSelect = (coords: { lat: number; lng: number }) => {
    setDropoffPoint({
      id: `custom-${Date.now()}`,
      name: `Custom Map Pin (${coords.lat.toFixed(2)}, ${coords.lng.toFixed(2)})`,
      state: 'Tamil Nadu',
      lat: coords.lat,
      lng: coords.lng,
    });
  };

  // Preset Route Selection
  const handlePresetSelect = (fromId: string, toId: string) => {
    const from = SOUTH_INDIA_LOCATIONS.find((l) => l.id === fromId);
    const to = SOUTH_INDIA_LOCATIONS.find((l) => l.id === toId);
    if (from && to) {
      setPickupPoint(from);
      setDropoffPoint(to);
    }
  };

  // Swap Locations
  const handleSwap = () => {
    const temp = pickupPoint;
    setPickupPoint(dropoffPoint);
    setDropoffPoint(temp);
  };

  // Filtered vehicles
  const filteredVehicles = vehicles.filter(
    (v) => vehicleFilter === 'All' || v.type === vehicleFilter
  );

  const calculateFare = (v: Vehicle) => {
    return Math.round(distanceKm * v.per_km_rate + (v.base_fare || 0));
  };

  return (
    <div className="space-y-8">
      {/* Route Planner Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
              <span>🗺️ Intercity Route Planner</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              South India Distance &amp; Vehicle Fare Calculator
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select pickup &amp; drop destinations across Tamil Nadu, Kerala, and Karnataka to compute instant per-KM fares.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCurrentLocation}
            disabled={isLocating}
            className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-4 py-2.5 rounded-xl text-sm font-semibold transition active:scale-95 self-start sm:self-auto"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>{isLocating ? 'Locating...' : 'Use My Current Location'}</span>
          </button>
        </div>

        {locationStatus && (
          <div className="mt-3 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg inline-block">
            {locationStatus}
          </div>
        )}

        {/* Popular Quick Route Chips */}
        <div className="mt-5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Popular South India Routes:
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_ROUTES.map((route) => (
              <button
                key={route.title}
                type="button"
                onClick={() => handlePresetSelect(route.fromId, route.toId)}
                className="text-xs font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition"
              >
                {route.title}
              </button>
            ))}
          </div>
        </div>

        {/* Origin & Destination Inputs */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
          {/* Pickup Input */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus-within:border-blue-500 focus-within:bg-white transition">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Pickup City / Hub (Point A)
            </label>
            <select
              className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none cursor-pointer"
              value={pickupPoint.id}
              onChange={(e) => {
                const found = SOUTH_INDIA_LOCATIONS.find((l) => l.id === e.target.value);
                if (found) setPickupPoint(found);
              }}
            >
              {SOUTH_INDIA_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} — {loc.state}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSwap}
              title="Swap Locations"
              className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 active:scale-90 flex items-center justify-center text-slate-600 shadow-sm transition"
            >
              ⇄
            </button>
          </div>

          {/* Dropoff Input */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus-within:border-blue-500 focus-within:bg-white transition">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              Destination City / Tourist Spot (Point B)
            </label>
            <select
              className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none cursor-pointer"
              value={dropoffPoint.id}
              onChange={(e) => {
                const found = SOUTH_INDIA_LOCATIONS.find((l) => l.id === e.target.value);
                if (found) setDropoffPoint(found);
              }}
            >
              {SOUTH_INDIA_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} — {loc.state}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calculated Distance & Metrics Summary Banner */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-blue-50/70 border border-blue-100 rounded-xl p-4 text-slate-800">
          <div>
            <div className="text-xs font-medium text-slate-500">Calculated Distance</div>
            <div className="text-lg sm:text-xl font-extrabold text-blue-700 mt-0.5">
              {distanceKm} km
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Est. Driving Time</div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              ~{durationEstimate}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">State Permitting</div>
            <div className="text-xs sm:text-sm font-bold text-emerald-700 mt-1">
              TN • KL • KA Commercial Permit
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Tolls &amp; Driver Beta</div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
              All Inclusive Quote
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map Visualizer */}
      <div className="space-y-2">
        <LeafletMap
          pickup={pickupPoint}
          dropoff={dropoffPoint}
          onMapLocationSelect={handleMapLocationSelect}
        />
      </div>

      {/* Vehicle Selection & Fare Calculator */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Select Vehicle &amp; Calculate Fare for {distanceKm} km
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Rates calculated on verified commercial ₹/km billing with no hidden fees.
            </p>
          </div>

          {/* Vehicle Type Tabs */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
            {(['All', 'Car', 'Bus'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setVehicleFilter(filter)}
                className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition ${
                  vehicleFilter === filter
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter === 'All' ? 'All Fleet' : filter === 'Car' ? 'Cars & SUVs' : 'Buses & Coaches'}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVehicles.map((vehicle) => {
            const totalFare = calculateFare(vehicle);
            return (
              <div
                key={vehicle.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Vehicle Image */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={vehicle.image_url}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                    {vehicle.type} • {vehicle.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur text-blue-700 font-extrabold text-xs px-2.5 py-1 rounded-md shadow-sm border border-slate-100">
                    ₹{vehicle.per_km_rate}/km
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h4 className="font-bold text-base text-slate-900">
                    {vehicle.name}
                  </h4>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    <span>👥 {vehicle.capacity} Seats</span>
                    <span>❄️ {vehicle.ac_type}</span>
                    <span>🧳 {vehicle.luggage_capacity} Bags</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                    {vehicle.description}
                  </p>

                  {/* Pricing Breakdown Card */}
                  <div className="mt-4 bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Rate ({distanceKm} km × ₹{vehicle.per_km_rate}):</span>
                      <span className="font-semibold text-slate-900">
                        {formatINR(distanceKm * vehicle.per_km_rate)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Base / Driver Allowance:</span>
                      <span className="font-semibold text-slate-900">
                        {formatINR(vehicle.base_fare)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
                      <span>Estimated Total:</span>
                      <span className="text-blue-600 text-base">
                        {formatINR(totalFare)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Fare</div>
                      <div className="text-lg font-extrabold text-slate-900">
                        {formatINR(totalFare)}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onBookRoute({
                          pickup: `${pickupPoint.name} (${pickupPoint.state})`,
                          dropoff: `${dropoffPoint.name} (${dropoffPoint.state})`,
                          distanceKm,
                          vehicle,
                          totalFare,
                        })
                      }
                      className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition"
                    >
                      Book This Vehicle
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
