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
      {/* Hero Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            🌴 Curated South India Holidays
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Handcrafted Tours in Tamil Nadu, Kerala &amp; Karnataka
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2 leading-relaxed">
            From the misty tea estates of Nilgiris and Munnar to the royal palaces of Mysore and ancient stone empires of Hampi. Complete tour packages with hotel stay, private car/bus, and sightseeing.
          </p>
        </div>

        {/* State Filters and Search */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-slate-100">
          <div className="flex flex-wrap gap-2">
            {states.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => onSelectState(st)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  selectedState === st
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {st === 'All' ? 'All South India' : st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search tours or cities..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 text-sm">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
          <div>Loading curated South India tours...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
          No tours match the selected filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={pkg.image_url}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                  {pkg.state}
                </span>
                <span className="absolute top-3 right-3 bg-white/95 backdrop-blur text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                  {pkg.category}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="text-xs text-blue-600 font-semibold mb-1">
                  {pkg.destination} • {pkg.duration_days} Days / {pkg.duration_days - 1} Nights
                </div>

                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition">
                  {pkg.title}
                </h3>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {pkg.description}
                </p>

                {/* Highlights */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {pkg.highlights.split(',').slice(0, 3).map((h, i) => (
                    <span
                      key={i}
                      className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-md"
                    >
                      {h.trim()}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Starting Price</span>
                    <span className="text-lg font-extrabold text-slate-900">
                      {formatINR(pkg.price)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal"> / person</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTourDetails(pkg)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition"
                    >
                      Itinerary
                    </button>
                    <button
                      type="button"
                      onClick={() => onBookPackage(pkg)}
                      className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-sm"
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
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedTourDetails(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48 bg-slate-100">
              <img
                src={selectedTourDetails.image_url}
                alt={selectedTourDetails.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedTourDetails(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-slate-700 flex items-center justify-center font-bold shadow hover:bg-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {selectedTourDetails.state} • {selectedTourDetails.destination}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {selectedTourDetails.title}
              </h3>
              <div className="text-xs text-slate-500 mt-1">
                Duration: {selectedTourDetails.duration_days} Days / {selectedTourDetails.duration_days - 1} Nights
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Overview</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedTourDetails.description}
                </p>
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Tour Highlights</h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                  {selectedTourDetails.highlights.split(',').map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{h.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">Package Fare</div>
                  <div className="text-xl font-extrabold text-slate-900">
                    {formatINR(selectedTourDetails.price)}
                    <span className="text-xs font-normal text-slate-500"> / person</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const t = selectedTourDetails;
                    setSelectedTourDetails(null);
                    onBookPackage(t);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition"
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
