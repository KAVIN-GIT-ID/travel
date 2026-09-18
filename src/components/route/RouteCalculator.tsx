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
    <div className="space-y-6 sm:space-y-8">
      {/* Route Planner Box */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-gray-200">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
              Tourist Circuit &amp; Route Planner
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              South India Sightseeing &amp; Holiday Circuit Map
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Select your departure hub and holiday sightseeing destination across Tamil Nadu, Kerala, and Karnataka for driving paths, ghat road travel times, and tourist vehicle pricing.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCurrentLocation}
            disabled={isLocating}
            className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 shadow-sm text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition disabled:opacity-50 self-start sm:self-auto cursor-pointer"
          >
            <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{isLocating ? 'Detecting Location...' : 'Use Current Location'}</span>
          </button>
        </div>

        {locationStatus && (
          <div className="mt-4 text-xs font-medium text-blue-800 bg-blue-50 border border-blue-200 px-3 py-2 rounded-md inline-block">
            {locationStatus}
          </div>
        )}

        {/* Popular Quick Route Chips */}
        <div className="mt-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Popular Holiday Circuits:
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_ROUTES.map((route) => (
              <button
                key={route.title}
                type="button"
                onClick={() => handlePresetSelect(route.fromId, route.toId)}
                className="text-xs font-medium bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-gray-700 px-3 py-1.5 rounded-md border border-gray-300 transition shadow-2xs cursor-pointer"
              >
                {route.title}
              </button>
            ))}
          </div>
        </div>

        {/* Origin & Destination Inputs */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
          {/* Pickup Input */}
          <div className="bg-white border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              From: Pickup City / Transit Hub
            </label>
            <select
              className="w-full bg-white text-sm font-semibold text-gray-900 outline-none cursor-pointer py-1"
              value={pickupPoint.id}
              onChange={(e) => {
                const found = SOUTH_INDIA_LOCATIONS.find((l) => l.id === e.target.value);
                if (found) setPickupPoint(found);
              }}
            >
              {SOUTH_INDIA_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.state})
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
              className="w-9 h-9 rounded-full border border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-700 shadow-sm transition cursor-pointer"
            >
              ⇄
            </button>
          </div>

          {/* Dropoff Input */}
          <div className="bg-white border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              To: Destination / Tourist Spot
            </label>
            <select
              className="w-full bg-white text-sm font-semibold text-gray-900 outline-none cursor-pointer py-1"
              value={dropoffPoint.id}
              onChange={(e) => {
                const found = SOUTH_INDIA_LOCATIONS.find((l) => l.id === e.target.value);
                if (found) setDropoffPoint(found);
              }}
            >
              {SOUTH_INDIA_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.state})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calculated Distance & Metrics Summary Banner */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-md p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          <div className="pt-2 sm:pt-0 sm:px-2 first:px-0 first:pt-0">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Road Distance</div>
            <div className="text-xl font-bold text-blue-700 mt-1">
              {distanceKm} km
            </div>
          </div>
          <div className="pt-2 sm:pt-0 sm:px-3">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Est. Travel Time</div>
            <div className="text-xl font-bold text-gray-900 mt-1">
              ~{durationEstimate}
            </div>
          </div>
          <div className="pt-2 sm:pt-0 sm:px-3">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Permit Coverage</div>
            <div className="text-sm font-semibold text-emerald-700 mt-1">
              TN • KL • KA Commercial Permit
            </div>
          </div>
          <div className="pt-2 sm:pt-0 sm:px-3">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Driver &amp; Tolls</div>
            <div className="text-sm font-semibold text-gray-800 mt-1">
              Driver Allowance Included
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
            <h3 className="text-xl font-bold text-gray-900">
              Select Tourist Vehicle &amp; Calculate Tour Fare ({distanceKm} km)
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Dedicated tourist vehicle with certified ghat road chauffeur and sightseeing allowance included.
            </p>
          </div>

          {/* Vehicle Type Standard Button Group */}
          <div className="inline-flex rounded-md shadow-2xs border border-gray-300 bg-white overflow-hidden divide-x divide-gray-200 self-start sm:self-auto">
            {(['All', 'Car', 'Bus'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setVehicleFilter(filter)}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium transition cursor-pointer ${
                  vehicleFilter === filter
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {filter === 'All' ? 'All Vehicles' : filter === 'Car' ? 'Cars & SUVs' : 'Buses & Coaches'}
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
                className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:border-gray-300 transition flex flex-col"
              >
                {/* Vehicle Image */}
                <div className="relative h-44 bg-gray-100 overflow-hidden">
                  <img
                    src={vehicle.image_url}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-gray-900/85 text-white text-[11px] font-medium px-2 py-0.5 rounded">
                    {vehicle.type} • {vehicle.category}
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-blue-600 text-white font-bold text-xs px-2.5 py-1 rounded shadow-sm">
                    ₹{vehicle.per_km_rate}/km
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <h4 className="font-bold text-base text-gray-900">
                    {vehicle.name}
                  </h4>
                  <div className="text-xs text-gray-600 mt-1 flex items-center gap-3">
                    <span>👥 {vehicle.capacity} Seats</span>
                    <span>❄️ {vehicle.ac_type}</span>
                    <span>🧳 {vehicle.luggage_capacity} Bags</span>
                  </div>

                  <p className="text-xs text-gray-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {vehicle.description}
                  </p>

                  {/* Pricing Breakdown Card */}
                  <div className="mt-4 bg-gray-50 border border-gray-200 rounded-md p-3 space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Rate ({distanceKm} km × ₹{vehicle.per_km_rate}):</span>
                      <span className="font-semibold text-gray-900">
                        {formatINR(distanceKm * vehicle.per_km_rate)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Driver / Base Allowance:</span>
                      <span className="font-semibold text-gray-900">
                        {formatINR(vehicle.base_fare)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm font-bold text-gray-900">
                      <span>Total Estimated Fare:</span>
                      <span className="text-blue-600 text-base font-extrabold">
                        {formatINR(totalFare)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase font-semibold">Total Fare</div>
                      <div className="text-lg font-extrabold text-gray-900">
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
                      className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-xs px-4 py-2 rounded-md shadow-sm transition cursor-pointer"
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
