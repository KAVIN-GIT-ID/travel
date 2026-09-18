import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import type { Vehicle } from '../api';

export interface LocationPoint {
  name: string;
  state: 'Tamil Nadu' | 'Kerala' | 'Karnataka';
  lat: number;
  lng: number;
}

export const SOUTH_INDIA_LOCATIONS: LocationPoint[] = [
  // Tamil Nadu
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
  { name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198 },
  { name: 'Ooty (Nilgiris)', state: 'Tamil Nadu', lat: 11.4102, lng: 76.695 },
  { name: 'Kodaikanal', state: 'Tamil Nadu', lat: 10.2381, lng: 77.4892 },
  { name: 'Rameshwaram', state: 'Tamil Nadu', lat: 9.2876, lng: 79.3129 },
  { name: 'Kanyakumari', state: 'Tamil Nadu', lat: 8.0883, lng: 77.5385 },
  { name: 'Tiruchirappalli (Trichy)', state: 'Tamil Nadu', lat: 10.7905, lng: 78.7047 },
  { name: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.146 },

  // Kerala
  { name: 'Kochi (Cochin)', state: 'Kerala', lat: 9.9312, lng: 76.2673 },
  { name: 'Thiruvananthapuram (Trivandrum)', state: 'Kerala', lat: 8.5241, lng: 76.9366 },
  { name: 'Munnar', state: 'Kerala', lat: 10.0889, lng: 77.0595 },
  { name: 'Alleppey (Alappuzha)', state: 'Kerala', lat: 9.4981, lng: 76.3388 },
  { name: 'Wayanad (Kalpetta)', state: 'Kerala', lat: 11.6103, lng: 76.0827 },
  { name: 'Kozhikode (Calicut)', state: 'Kerala', lat: 11.2588, lng: 75.7804 },
  { name: 'Varkala', state: 'Kerala', lat: 8.7379, lng: 76.7163 },

  // Karnataka
  { name: 'Bengaluru (Bangalore)', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Mysuru (Mysore)', state: 'Karnataka', lat: 12.2958, lng: 76.6394 },
  { name: 'Coorg (Madikeri)', state: 'Karnataka', lat: 12.4244, lng: 75.7382 },
  { name: 'Hampi', state: 'Karnataka', lat: 15.335, lng: 76.46 },
  { name: 'Chikmagalur', state: 'Karnataka', lat: 13.3161, lng: 75.772 },
  { name: 'Mangalore', state: 'Karnataka', lat: 12.9141, lng: 74.856 },
  { name: 'Gokarna', state: 'Karnataka', lat: 14.5479, lng: 74.3188 },
];

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightKm = R * c;

  // Road factor: South India highways & ghat roads are ~1.28x straight line distance
  const roadKm = Math.round(straightKm * 1.28);
  return Math.max(15, roadKm);
}

interface RouteCalculatorProps {
  vehicles: Vehicle[];
  onBookRoute: (bookingData: {
    pickup: string;
    dropoff: string;
    distanceKm: number;
    vehicle: Vehicle;
    totalFare: number;
  }) => void;
}

export const RouteCalculator: React.FC<RouteCalculatorProps> = ({ vehicles, onBookRoute }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const [pickupPoint, setPickupPoint] = useState<LocationPoint>(SOUTH_INDIA_LOCATIONS[16]); // Bangalore
  const [dropoffPoint, setDropoffPoint] = useState<LocationPoint>(SOUTH_INDIA_LOCATIONS[3]); // Ooty
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<'All' | 'Car' | 'Bus'>('All');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');

  // Default vehicle selection once vehicles load
  useEffect(() => {
    if (vehicles.length > 0 && !selectedVehicle) {
      setSelectedVehicle(vehicles[0]);
    }
  }, [vehicles]);

  // Compute distance
  const distanceKm = useMemo(() => {
    return calculateDistanceKm(
      pickupPoint.lat,
      pickupPoint.lng,
      dropoffPoint.lat,
      dropoffPoint.lng
    );
  }, [pickupPoint, dropoffPoint]);

  // Compute driving duration estimate
  const estimatedHours = useMemo(() => {
    const hours = distanceKm / 50; // Avg 50km/hr in South India routes
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  }, [distanceKm]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered on South India (Tamil Nadu, Kerala, Karnataka)
    const map = L.map(mapContainerRef.current, {
      center: [11.8, 77.4],
      zoom: 7,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    // Allow user to click anywhere on map to set dropoff or pickup
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setDropoffPoint({
        name: `Custom Map Pin (${lat.toFixed(2)}, ${lng.toFixed(2)})`,
        state: 'Tamil Nadu',
        lat,
        lng,
      });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map pins and route line whenever points change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = markersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // Custom iOS style pin icons
    const pickupIcon = L.divIcon({
      className: 'ios-map-pin',
      html: `<div style="background:#34C759;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid #fff;">A</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const dropoffIcon = L.divIcon({
      className: 'ios-map-pin',
      html: `<div style="background:#0071E3;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid #fff;">B</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    L.marker([pickupPoint.lat, pickupPoint.lng], { icon: pickupIcon })
      .bindPopup(`<b>Pickup Point</b><br/>${pickupPoint.name} (${pickupPoint.state})`)
      .addTo(group);

    L.marker([dropoffPoint.lat, dropoffPoint.lng], { icon: dropoffIcon })
      .bindPopup(`<b>Destination Point</b><br/>${dropoffPoint.name} (${dropoffPoint.state})`)
      .addTo(group);

    // Draw route line
    L.polyline(
      [
        [pickupPoint.lat, pickupPoint.lng],
        [dropoffPoint.lat, dropoffPoint.lng],
      ],
      { color: '#0071E3', weight: 4, opacity: 0.8, dashArray: '6, 8' }
    ).addTo(group);

    // Fit bounds
    const bounds = L.latLngBounds([
      [pickupPoint.lat, pickupPoint.lng],
      [dropoffPoint.lat, dropoffPoint.lng],
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [pickupPoint, dropoffPoint]);

  // Handle GPS location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Acquiring your GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;

        setPickupPoint({
          name: 'My Current Location (GPS)',
          state: 'Tamil Nadu',
          lat: latitude,
          lng: longitude,
        });
        setLocationStatus('GPS location acquired.');
      },
      (err) => {
        setIsLocating(false);
        setLocationStatus(`Could not access GPS (${err.message}). Selected default city.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Filtered vehicles
  const filteredVehicles = vehicles.filter(
    (v) => vehicleTypeFilter === 'All' || v.type === vehicleTypeFilter
  );

  const calculateTotalFare = (v: Vehicle) => {
    return Math.round(distanceKm * v.per_km_rate + (v.base_fare || 0));
  };

  const handleBookSelected = (v: Vehicle) => {
    onBookRoute({
      pickup: `${pickupPoint.name} (${pickupPoint.state})`,
      dropoff: `${dropoffPoint.name} (${dropoffPoint.state})`,
      distanceKm,
      vehicle: v,
      totalFare: calculateTotalFare(v),
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Controls Box */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--ios-border)',
          borderRadius: 'var(--ios-radius-lg)',
          padding: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span className="ios-hero-badge">Tamil Nadu • Kerala • Karnataka</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
              South India Route &amp; Distance Fare Calculator
            </h2>
          </div>

          <button
            type="button"
            className="ios-btn-secondary"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
          >
            {isLocating ? 'Locating...' : '📍 Use My Current Location'}
          </button>
        </div>

        {locationStatus && (
          <div style={{ fontSize: '0.8rem', color: 'var(--ios-text-secondary)', marginBottom: '0.75rem' }}>
            {locationStatus}
          </div>
        )}

        {/* Location Dropdowns */}
        <div className="ios-form-row">
          <div className="ios-form-group">
            <label className="ios-form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34C759' }} />
              Pickup City / Hub
            </label>
            <select
              className="ios-form-input"
              value={pickupPoint.name}
              onChange={(e) => {
                const found = SOUTH_INDIA_LOCATIONS.find((l) => l.name === e.target.value);
                if (found) setPickupPoint(found);
              }}
            >
              {SOUTH_INDIA_LOCATIONS.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name} ({loc.state})
                </option>
              ))}
            </select>
          </div>

          <div className="ios-form-group">
            <label className="ios-form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0071E3' }} />
              Dropoff Destination (or click on Map)
            </label>
            <select
              className="ios-form-input"
              value={dropoffPoint.name}
              onChange={(e) => {
                const found = SOUTH_INDIA_LOCATIONS.find((l) => l.name === e.target.value);
                if (found) setDropoffPoint(found);
              }}
            >
              {SOUTH_INDIA_LOCATIONS.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name} ({loc.state})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Distance & Time Metrics Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f5f5f7',
            padding: '0.85rem 1.25rem',
            borderRadius: 12,
            marginTop: '0.5rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ios-text-secondary)' }}>Calculated Road Distance</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {distanceKm} km
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ios-text-secondary)' }}>Estimated Travel Time</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
              ~{estimatedHours}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ios-text-secondary)' }}>Permit &amp; Coverage</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ios-green-text)' }}>
              All TN / KL / KA Interstate Permits Included
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--ios-border)',
          borderRadius: 'var(--ios-radius-lg)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--ios-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            Interactive South India Route Map
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--ios-text-secondary)' }}>
            Tip: Click anywhere on map to set dropoff point
          </span>
        </div>
        <div
          ref={mapContainerRef}
          style={{ height: 360, width: '100%', zIndex: 1 }}
        />
      </div>

      {/* Vehicle Selection & Fare Breakdown */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Select Vehicle (Bus &amp; Car Fleet)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--ios-text-secondary)' }}>
              Choose your vehicle type. Fares calculated dynamically at ₹/km.
            </p>
          </div>

          <div className="ios-segmented-control">
            <button
              className={`ios-segment-btn ${vehicleTypeFilter === 'All' ? 'active' : ''}`}
              onClick={() => setVehicleTypeFilter('All')}
            >
              All Vehicles
            </button>
            <button
              className={`ios-segment-btn ${vehicleTypeFilter === 'Car' ? 'active' : ''}`}
              onClick={() => setVehicleTypeFilter('Car')}
            >
              Cars Only
            </button>
            <button
              className={`ios-segment-btn ${vehicleTypeFilter === 'Bus' ? 'active' : ''}`}
              onClick={() => setVehicleTypeFilter('Bus')}
            >
              Buses Only
            </button>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="ios-grid">
          {filteredVehicles.map((v) => {
            const totalFare = calculateTotalFare(v);
            return (
              <div key={v.id} className="ios-card">
                <div className="ios-card-media" style={{ height: 160 }}>
                  <img src={v.image_url} alt={v.name} className="ios-card-img" />
                  <span className="ios-card-tag">{v.type} • {v.category}</span>
                </div>

                <div className="ios-card-content">
                  <h4 className="ios-card-name" style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                    {v.name}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ios-text-secondary)', marginBottom: '0.75rem' }}>
                    {v.capacity} Passengers • {v.ac_type} • {v.luggage_capacity} Luggage Bags
                  </div>

                  <p className="ios-card-summary" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
                    {v.description}
                  </p>

                  <div style={{ background: '#f5f5f7', padding: '0.65rem 0.85rem', borderRadius: 10, marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--ios-text-secondary)' }}>Per KM Rate:</span>
                      <strong>₹{v.per_km_rate} / km</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--ios-text-secondary)' }}>Base Fare:</span>
                      <span>₹{v.base_fare}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.35rem', marginTop: '0.35rem' }}>
                      <span style={{ color: 'var(--ios-text-primary)', fontWeight: 600 }}>Total for {distanceKm} km:</span>
                      <strong style={{ color: 'var(--ios-blue)', fontSize: '1.05rem' }}>₹{totalFare.toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="ios-card-footer">
                    <div className="ios-card-price">
                      ₹{totalFare.toLocaleString()}
                      <span>all-inclusive</span>
                    </div>

                    <button
                      type="button"
                      className="ios-btn-black"
                      onClick={() => handleBookSelected(v)}
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
