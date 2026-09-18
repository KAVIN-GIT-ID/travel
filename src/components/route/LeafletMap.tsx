import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { LocationPoint } from '../../types';

interface LeafletMapProps {
  pickup: LocationPoint;
  dropoff: LocationPoint;
  onMapLocationSelect: (coords: { lat: number; lng: number }) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  pickup,
  dropoff,
  onMapLocationSelect,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered over South India (Tamil Nadu, Kerala, Karnataka)
    const map = L.map(mapContainerRef.current, {
      center: [11.8, 77.2],
      zoom: 7,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    // Map Click Listener
    map.on('click', (e: L.LeafletMouseEvent) => {
      onMapLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers & Route Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // Pickup Marker (Green)
    const pickupIcon = L.divIcon({
      className: '',
      html: `<div class="map-marker-pin bg-emerald-600 w-7 h-7 text-white shadow-md">A</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    // Dropoff Marker (Blue)
    const dropoffIcon = L.divIcon({
      className: '',
      html: `<div class="map-marker-pin bg-blue-600 w-7 h-7 text-white shadow-md">B</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    L.marker([pickup.lat, pickup.lng], { icon: pickupIcon })
      .bindPopup(`<div class="text-xs font-sans"><b>Pickup:</b> ${pickup.name} (${pickup.state})</div>`)
      .addTo(group);

    L.marker([dropoff.lat, dropoff.lng], { icon: dropoffIcon })
      .bindPopup(`<div class="text-xs font-sans"><b>Dropoff:</b> ${dropoff.name} (${dropoff.state})</div>`)
      .addTo(group);

    // Route Polyline
    L.polyline(
      [
        [pickup.lat, pickup.lng],
        [dropoff.lat, dropoff.lng],
      ],
      {
        color: '#2563eb',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
      }
    ).addTo(group);

    // Auto-fit viewport to both coordinates
    const bounds = L.latLngBounds([
      [pickup.lat, pickup.lng],
      [dropoff.lat, dropoff.lng],
    ]);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
  }, [pickup, dropoff]);

  return (
    <div className="relative w-full h-[320px] sm:h-[380px] md:h-[440px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
      <div
        ref={mapContainerRef}
        className="w-full h-full"
      />
      {/* Map Helper Badge */}
      <div className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
        Click anywhere on map to change destination
      </div>
    </div>
  );
};
