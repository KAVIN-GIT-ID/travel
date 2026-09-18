import React, { useState } from 'react';
import type { BookingRequest } from '../../types';
import { formatINR } from '../../utils/distance';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: {
    booking_type: 'package' | 'route_rental';
    package_id?: number;
    package_title?: string;
    vehicle_id?: number;
    vehicle_name?: string;
    pickup_location?: string;
    dropoff_location?: string;
    distance_km?: number;
    total_price: number;
    image_url?: string;
  };
  onSubmitBooking: (payload: BookingRequest) => Promise<{ booking_id: number; total_price: number }>;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  bookingData,
  onSubmitBooking,
}) => {
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    travel_date: '',
    travelers_count: 2,
    special_requests: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ id: number; total: number } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await onSubmitBooking({
        booking_type: bookingData.booking_type,
        package_id: bookingData.package_id,
        package_title: bookingData.package_title,
        vehicle_id: bookingData.vehicle_id,
        vehicle_name: bookingData.vehicle_name,
        pickup_location: bookingData.pickup_location,
        dropoff_location: bookingData.dropoff_location,
        distance_km: bookingData.distance_km,
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        customer_phone: form.customer_phone,
        travel_date: form.travel_date,
        travelers_count: form.travelers_count,
        special_requests: form.special_requests,
        total_price: bookingData.total_price,
      });

      setSuccess({
        id: res.booking_id,
        total: res.total_price,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit reservation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-900/60 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              {bookingData.booking_type === 'route_rental' ? 'Outstation Vehicle Booking' : 'Holiday Tour Reservation'}
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Confirm Your Travel Details
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-sm transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {success ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold mb-3">
                ✓
              </div>
              <h4 className="text-xl font-bold text-gray-900">
                Reservation Confirmed!
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Booking reference <strong className="text-gray-900">#{success.id}</strong> has been logged in our reservation system.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 my-5 text-sm text-gray-700 text-left">
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>Total Estimated Fare:</span>
                  <span className="text-blue-600 font-bold">{formatINR(success.total)}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1.5">
                  Our route manager will contact you with assigned driver details and vehicle number.
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md transition shadow-sm cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selected Summary Card */}
              <div className="flex items-center gap-3.5 bg-gray-50 border border-gray-200 rounded-md p-3.5">
                {bookingData.image_url && (
                  <img
                    src={bookingData.image_url}
                    alt="Preview"
                    className="w-14 h-14 rounded object-cover flex-shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-gray-900 truncate">
                    {bookingData.vehicle_name || bookingData.package_title}
                  </div>
                  {bookingData.booking_type === 'route_rental' ? (
                    <div className="text-xs text-gray-500 mt-0.5 truncate">
                      {bookingData.pickup_location} → {bookingData.dropoff_location} ({bookingData.distance_km} km)
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 mt-0.5">
                      Curated South India Tour Package
                    </div>
                  )}
                  <div className="text-xs font-bold text-blue-600 mt-1">
                    Total: {formatINR(bookingData.total_price)}
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-md border border-rose-200">
                  {error}
                </div>
              )}

              {/* Form Inputs */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                  Primary Traveler Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Ranganathan"
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98401 XXXXX"
                    value={form.customer_phone}
                    onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="anand@example.com"
                    value={form.customer_email}
                    onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                    Travel Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.travel_date}
                    onChange={(e) => setForm({ ...form, travel_date: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                    Passenger Count *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={form.travelers_count}
                    onChange={(e) => setForm({ ...form, travelers_count: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                  Pickup Landmark &amp; Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Exact pickup landmark, flight arrival time, or luggage requirements..."
                  value={form.special_requests}
                  onChange={(e) => setForm({ ...form, special_requests: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 rounded-md transition shadow-sm text-sm cursor-pointer"
                >
                  {submitting ? 'Confirming Reservation...' : `Confirm Booking • ${formatINR(bookingData.total_price)}`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
