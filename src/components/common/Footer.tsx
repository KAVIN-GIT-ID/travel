import React from 'react';
import type { NavTab } from './Navbar';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <span className="text-white font-bold text-base uppercase tracking-tight block">South India Travels</span>
                <span className="text-[10px] text-slate-400">Intercity Bus &amp; Car Rentals</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Leading intercity bus &amp; outstation car travels provider operating across Tamil Nadu, Kerala, and Karnataka. Commercial permits, GPS-tracked fleet, and transparent per-kilometer fares.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              Licensed All-India Tourist Permit (AITP) Fleet Operator
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Top Routes</h4>
            <ul className="space-y-2 text-xs">
              <li>Bangalore ➔ Ooty (270 km)</li>
              <li>Bangalore ➔ Coorg (255 km)</li>
              <li>Chennai ➔ Rameshwaram (560 km)</li>
              <li>Kochi ➔ Munnar (130 km)</li>
              <li>Coimbatore ➔ Kodaikanal (175 km)</li>
              <li>Bangalore ➔ Hampi (345 km)</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Fleet Categories</h4>
            <ul className="space-y-2 text-xs">
              <li>Maruti Swift Dzire &amp; Etios (4-Seater)</li>
              <li>Toyota Innova Crysta (7-Seater Prime SUV)</li>
              <li>Force Urbania &amp; Tempo Traveler (12-Seater)</li>
              <li>BharatBenz AC Coach (21-Seater Mini Bus)</li>
              <li>Volvo Multi-Axle AC Sleeper (40-Seater)</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTab('home')} className="hover:text-white transition">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('route-calc')} className="hover:text-white transition">
                  Route &amp; Distance Fare Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('tours')} className="hover:text-white transition">
                  South India Holiday Packages
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('fleet')} className="hover:text-white transition">
                  Car &amp; Bus Fleet Rentals
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('inquiry')} className="hover:text-white transition">
                  Corporate &amp; Group Travel Inquiry
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('admin')} className="hover:text-white transition">
                  Staff Admin Portal
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            &copy; {new Date().getFullYear()} South India Travels. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span>Interstate Tax Included</span>
            <span>Driver Allowance Included</span>
            <span>24/7 Helpline: +91 98401 23456</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
