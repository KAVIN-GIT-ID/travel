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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
          🏢 Corporate, College &amp; Family Inquiries
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Custom Itinerary &amp; Bulk Bus Rental
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Planning an industrial visit, wedding, pilgrimage, or group holiday in Tamil Nadu, Kerala, or Karnataka? Share your itinerary requirements.
        </p>

        {success ? (
          <div className="text-center py-10">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold mb-3">
              ✓
            </div>
            <h3 className="text-xl font-bold text-slate-900">Inquiry Received</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Thank you! Our South India route coordinator will review your requirements and share an all-inclusive quote within 24 hours.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-6 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-5 py-2.5 rounded-xl text-sm transition"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-lg border border-rose-200">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vignesh Sundaram"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="vignesh@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Trip Requirement / Destination
              </label>
              <input
                type="text"
                placeholder="e.g. 3-Day Wayanad &amp; Coorg Trip with 21-Seater Mini Bus"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Trip Details, Headcount &amp; Tentative Dates *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Number of passengers, pickup city, destinations to cover, AC preferences..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-3 rounded-xl transition shadow-sm text-sm"
            >
              {submitting ? 'Submitting...' : 'Send Travel Inquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
