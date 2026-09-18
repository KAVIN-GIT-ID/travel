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
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-6">
        <div className="max-w-3xl">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
            Commercial Fleet
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Outstation Cars &amp; Tourist Buses in South India
          </h2>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
            All vehicles are commercially licensed with valid All-India Tourist Permits (AITP), GPS tracking, verified chauffeurs, and comprehensive passenger insurance across Tamil Nadu, Kerala, and Karnataka.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="mt-5 flex flex-wrap gap-2 pt-5 border-t border-gray-200">
          {(['All', 'Car', 'Bus'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition cursor-pointer ${
                filterType === type
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {type === 'All' ? 'All Vehicles' : type === 'Car' ? 'Cars & Prime SUVs' : 'Buses & Coaches'}
            </button>
          ))}
        </div>
      </div>

      {/* Fleet Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:border-gray-300 transition flex flex-col"
          >
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              <img
                src={vehicle.image_url}
                alt={vehicle.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <span className="absolute top-2.5 left-2.5 bg-gray-900/85 text-white text-[11px] font-medium px-2 py-0.5 rounded">
                {vehicle.type} • {vehicle.category}
              </span>
              <span className="absolute top-2.5 right-2.5 bg-blue-600 text-white font-bold text-xs px-2.5 py-1 rounded shadow-sm">
                ₹{vehicle.per_km_rate}/km
              </span>
            </div>

            <div className="p-4 sm:p-5 flex flex-col flex-1">
              <h3 className="font-bold text-base text-gray-900">
                {vehicle.name}
              </h3>

              <div className="flex flex-wrap gap-2 text-xs text-gray-600 mt-2">
                <span className="bg-gray-100 px-2 py-0.5 rounded">👥 {vehicle.capacity} Seats</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded">❄️ {vehicle.ac_type}</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded">🧳 {vehicle.luggage_capacity} Luggage</span>
              </div>

              <p className="text-xs text-gray-600 mt-2.5 line-clamp-3 leading-relaxed">
                {vehicle.description}
              </p>

              <div className="mt-4 bg-gray-50 border border-gray-200 rounded-md p-3 text-xs space-y-1">
                <div className="flex justify-between text-gray-600">
                  <span>Billing Rate:</span>
                  <strong className="text-gray-900">₹{vehicle.per_km_rate} / km</strong>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Driver &amp; Base Allowance:</span>
                  <span className="font-medium text-gray-900">{formatINR(vehicle.base_fare)}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase font-semibold">Per KM Rate</div>
                  <div className="text-lg font-extrabold text-gray-900">
                    ₹{vehicle.per_km_rate} <span className="text-xs font-normal text-gray-500">/ km</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRentVehicle(vehicle)}
                  className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-xs px-4 py-2 rounded-md shadow-sm transition cursor-pointer"
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
