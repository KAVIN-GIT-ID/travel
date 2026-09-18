import React, { useState } from 'react';
import type { Package } from '../../types';
import { formatINR } from '../../utils/distance';

interface TourListProps {
  packages: Package[];
  loading: boolean;
  selectedState: string;
  onSelectState: (state: string) => void;
  onBookPackage: (pkg: Package) => void;
}

export const TourList: React.FC<TourListProps> = ({
  packages,
  loading,
  selectedState,
  onSelectState,
  onBookPackage,
}) => {
  const [selectedTourDetails, setSelectedTourDetails] = useState<Package | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const states = ['All', 'Tamil Nadu', 'Kerala', 'Karnataka'];

  const filtered = packages.filter((p) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.destination.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-6">
        <div className="max-w-3xl">
          <span className="eyebrow block mb-1">
            Holiday Packages
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Handcrafted Tours in Tamil Nadu, Kerala &amp; Karnataka
          </h2>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
            From the misty tea estates of Nilgiris and Munnar to the royal palaces of Mysore and ancient stone empires of Hampi. Complete tour packages with hotel stay, private car/bus, and sightseeing.
          </p>
        </div>

        {/* State Filters and Search */}
        <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-5 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {states.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => onSelectState(st)}
                className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition cursor-pointer ${
                  selectedState === st
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {st === 'All' ? 'All South India' : st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search destination or package..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      {loading ? (
        <div className="text-center py-16 text-gray-500 text-sm">
          <div className="inline-block w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
          <div>Loading verified South India tour packages...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200 text-gray-500 text-sm">
          No tours match your current filter. Please select another state or clear search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:border-gray-300 transition flex flex-col"
            >
              <div className="relative h-48 bg-gray-100 overflow-hidden">
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
                  {pkg.destination} • {pkg.duration_days} Days / {pkg.duration_days - 1} Nights
                </div>

                <h3 className="font-bold text-base text-gray-900">
                  {pkg.title}
                </h3>

                <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                  {pkg.description}
                </p>

                {/* Highlights */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {pkg.highlights.split(',').slice(0, 3).map((h, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-gray-700 text-xs font-normal px-2 py-0.5 rounded"
                    >
                      {h.trim()}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="eyebrow block text-[10px]">Price Per Person</span>
                    <span className="text-lg font-extrabold text-gray-900 price">
                      {formatINR(pkg.price)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTourDetails(pkg)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-3 py-2 rounded-md transition cursor-pointer"
                    >
                      Itinerary
                    </button>
                    <button
                      type="button"
                      onClick={() => onBookPackage(pkg)}
                      className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-medium px-3.5 py-2 rounded-md transition shadow-sm cursor-pointer"
                    >
                      Book Tour
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Itinerary Modal */}
      {selectedTourDetails && (
        <div
          className="fixed inset-0 z-50 bg-gray-900/60 flex items-center justify-center p-4"
          onClick={() => setSelectedTourDetails(null)}
        >
          <div
            className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48 bg-gray-100">
              <img
                src={selectedTourDetails.image_url}
                alt={selectedTourDetails.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedTourDetails(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white text-gray-700 flex items-center justify-center font-bold shadow-sm hover:bg-gray-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {selectedTourDetails.state} • {selectedTourDetails.destination}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mt-1">
                {selectedTourDetails.title}
              </h3>
              <div className="text-xs text-gray-500 mt-0.5">
                Duration: {selectedTourDetails.duration_days} Days / {selectedTourDetails.duration_days - 1} Nights
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">Trip Overview</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {selectedTourDetails.description}
                </p>
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">Package Inclusions &amp; Highlights</h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700">
                  {selectedTourDetails.highlights.split(',').map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{h.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">Package Starting Fare</div>
                  <div className="text-xl font-extrabold text-gray-900">
                    {formatINR(selectedTourDetails.price)}
                    <span className="text-xs font-normal text-gray-500"> / person</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const t = selectedTourDetails;
                    setSelectedTourDetails(null);
                    onBookPackage(t);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 rounded-md font-semibold text-sm shadow-sm transition cursor-pointer"
                >
                  Book This Tour
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
