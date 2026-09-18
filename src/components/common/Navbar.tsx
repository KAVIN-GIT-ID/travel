import React, { useState } from 'react';

export type NavTab = 'route-calc' | 'tours' | 'fleet' | 'inquiry' | 'admin';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onBookClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onBookClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'route-calc', label: 'Route & Fare Calculator' },
    { id: 'tours', label: 'Tour Packages' },
    { id: 'fleet', label: 'Bus & Car Fleet' },
    { id: 'inquiry', label: 'Group Travel' },
    { id: 'admin', label: 'Admin Portal' },
  ];

  const handleTabClick = (id: NavTab) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Top Utility Bar - Real World Travel Standard */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>24x7 Helpline: <strong className="text-white">+91 98401 23456</strong></span>
            </span>
            <span className="text-slate-600">|</span>
            <span>All-India Tourist Permit (AITP) Certified</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-medium">● Tamil Nadu • Kerala • Karnataka Services</span>
            <span className="text-slate-600">|</span>
            <span>Govt. Regd: TN-2024-TRV</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => handleTabClick('route-calc')}
          >
            <div className="w-9 h-9 rounded-md bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-gray-900 text-base sm:text-lg tracking-tight uppercase">
                South India Travels
              </div>
              <div className="text-[11px] text-gray-500 font-medium -mt-0.5">
                Outstation Cabs &amp; Tourist Buses
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links - Normal Text Links with Clean Active Line */}
          <nav className="hidden lg:flex items-center gap-1 h-full">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`h-full px-3.5 flex items-center text-sm font-medium transition-colors border-b-2 ${
                    isActive
                      ? 'border-blue-600 text-blue-600 font-semibold'
                      : 'border-transparent text-gray-700 hover:text-blue-600 hover:border-gray-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Action */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="text-right hidden xl:block">
              <div className="text-[11px] text-gray-500 uppercase tracking-wide">Instant Booking</div>
              <div className="text-xs font-semibold text-gray-800">No Advance Required</div>
            </div>
            <button
              onClick={onBookClick}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition"
            >
              Book Now
            </button>
          </div>

          {/* Mobile Actions & Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onBookClick}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium"
            >
              Book Now
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1 shadow-md">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 mt-2 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
            <span>Helpline: +91 98401 23456</span>
            <span className="text-emerald-600 font-medium">TN • KL • KA</span>
          </div>
        </div>
      )}
    </header>
  );
};

