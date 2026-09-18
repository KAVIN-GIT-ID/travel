import React, { useState } from 'react';
import type { Vehicle } from '../../types';
import { formatINR } from '../../utils/distance';

interface VehicleFleetProps {
  vehicles: Vehicle[];
  onRentVehicle: (v: Vehicle) => void;
}

export const VehicleFleet: React.FC<VehicleFleetProps> = ({
  vehicles,
  onRentVehicle,
}) => {
  const [filterType, setFilterType] = useState<'All' | 'Car' | 'Bus'>('All');

  const filtered = vehicles.filter(
    (v) => filterType === 'All' || v.type === filterType
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            🚌 Outstation Cars &amp; Tourist Buses
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Interstate Fleet Across Tamil Nadu, Kerala &amp; Karnataka
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2 leading-relaxed">
            All vehicles are commercially licensed with valid All-India Tourist Permits (AITP), GPS tracking, verified chauffeurs, and comprehensive passenger insurance.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="mt-6 flex flex-wrap gap-2 pt-6 border-t border-slate-100">
          {(['All', 'Car', 'Bus'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                filterType === type
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {type === 'All' ? 'All Vehicles' : type === 'Car' ? 'Cars & Prime SUVs' : 'Buses & Luxury Coaches'}
            </button>
          ))}
        </div>
      </div>

      {/* Fleet Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group"
          >
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              <img
                src={vehicle.image_url}
                alt={vehicle.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                loading="lazy"
              />
              <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                {vehicle.type} • {vehicle.category}
              </span>
              <span className="absolute top-3 right-3 bg-blue-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-md shadow-sm">
                ₹{vehicle.per_km_rate}/km
              </span>
            </div>

            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-bold text-base text-slate-900">
                {vehicle.name}
              </h3>

              <div className="flex flex-wrap gap-2 text-xs text-slate-500 mt-2">
                <span className="bg-slate-100 px-2.5 py-1 rounded-md">👥 {vehicle.capacity} Seats</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md">❄️ {vehicle.ac_type}</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md">🧳 {vehicle.luggage_capacity} Luggage</span>
              </div>

              <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                {vehicle.description}
              </p>

              <div className="mt-4 bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Billing Rate:</span>
                  <strong className="text-slate-900">₹{vehicle.per_km_rate} / km</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Base Fare (Driver / Pickup):</span>
                  <span className="font-medium text-slate-800">{formatINR(vehicle.base_fare)}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Per KM Rate</div>
                  <div className="text-lg font-extrabold text-slate-900">
                    ₹{vehicle.per_km_rate} <span className="text-xs font-normal text-slate-500">/ km</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRentVehicle(vehicle)}
                  className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition"
                >
                  Book Vehicle
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
