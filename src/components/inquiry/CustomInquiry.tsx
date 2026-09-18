import React, { useState } from 'react';
import { inquiryService } from '../../services/api';

export const CustomInquiry: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'South India Group Travel / Bus Rental',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await inquiryService.create(form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: 'South India Group Travel / Bus Rental', message: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-6">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
          Group &amp; Corporate Travel
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Custom Itinerary &amp; Bulk Bus Rental
        </h2>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
          Planning an industrial visit, wedding, pilgrimage, or group holiday in Tamil Nadu, Kerala, or Karnataka? Share your requirements for a customized quote.
        </p>

        {success ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold mb-3">
              ✓
            </div>
            <h3 className="text-xl font-bold text-gray-900">Inquiry Received</h3>
            <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
              Thank you! Our South India route coordinator will review your requirements and share an all-inclusive quote within 24 hours.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-md text-sm transition cursor-pointer"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-md border border-rose-200">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vignesh Sundaram"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                  placeholder="vignesh@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                Trip Requirement / Destination
              </label>
              <input
                type="text"
                placeholder="e.g. 3-Day Wayanad &amp; Coorg Trip with 21-Seater Mini Bus"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                Trip Details, Headcount &amp; Tentative Dates *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Number of passengers, pickup city, destinations to cover, AC preferences..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 rounded-md transition shadow-sm text-sm cursor-pointer"
            >
              {submitting ? 'Submitting...' : 'Send Travel Inquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
