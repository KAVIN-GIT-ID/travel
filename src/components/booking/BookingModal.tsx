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
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              {bookingData.booking_type === 'route_rental' ? 'Outstation Vehicle Booking' : 'Holiday Tour Reservation'}
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Confirm Your Travel Details
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold mb-4">
                ✓
              </div>
              <h4 className="text-xl font-bold text-slate-900">
                Reservation Confirmed!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Booking reference <strong className="text-slate-900">#{success.id}</strong> has been created.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-5 text-sm text-slate-700">
                <div className="flex justify-between font-semibold">
                  <span>Total Payable:</span>
                  <span className="text-blue-600 font-extrabold">{formatINR(success.total)}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Our route manager will contact you with driver and vehicle assignment details.
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition shadow-sm"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selected Summary Card */}
              <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                {bookingData.image_url && (
                  <img
                    src={bookingData.image_url}
                    alt="Preview"
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {bookingData.vehicle_name || bookingData.package_title}
                  </div>
                  {bookingData.booking_type === 'route_rental' ? (
                    <div className="text-xs text-slate-500 mt-0.5 truncate">
                      {bookingData.pickup_location} → {bookingData.dropoff_location} ({bookingData.distance_km} km)
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 mt-0.5">
                      Curated South India Tour Package
                    </div>
                  )}
                  <div className="text-xs font-extrabold text-blue-600 mt-1">
                    Total: {formatINR(bookingData.total_price)}
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-lg border border-rose-200">
                  {error}
                </div>
              )}

              {/* Form Inputs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Traveler Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Ranganathan"
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone / Mobile *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98401 XXXXX"
                    value={form.customer_phone}
                    onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="anand@example.com"
                    value={form.customer_email}
                    onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Travel Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.travel_date}
                    onChange={(e) => setForm({ ...form, travel_date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Passenger Count *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={form.travelers_count}
                    onChange={(e) => setForm({ ...form, travelers_count: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pickup Landmark &amp; Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Exact pickup address, flight arrival time, luggage details..."
                  value={form.special_requests}
                  onChange={(e) => setForm({ ...form, special_requests: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-3 rounded-xl transition shadow-sm text-sm"
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
