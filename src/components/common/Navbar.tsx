import React, { useState } from 'react';
import type { User } from '../../types';

export type NavTab = 'home' | 'route-calc' | 'tours' | 'fleet' | 'inquiry' | 'admin';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onBookClick: () => void;
  currentUser: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onBookClick,
  currentUser,
  onOpenLogin,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navCategories: {
    id: NavTab;
    label: string;
    sublabel: string;
    icon: string;
  }[] = [
    {
      id: 'home',
      label: 'Home',
      sublabel: 'Overview',
      icon: '🏠',
    },
    {
      id: 'route-calc',
      label: 'Outstation Cabs',
      sublabel: 'Route & Map',
      icon: '🚗',
    },
    {
      id: 'tours',
      label: 'Holiday Packages',
      sublabel: 'TN • KL • KA',
      icon: '🌴',
    },
    {
      id: 'fleet',
      label: 'Bus & Car Fleet',
      sublabel: '4 to 40 Seaters',
      icon: '🚌',
    },
    {
      id: 'inquiry',
      label: 'Group Travel',
      sublabel: 'Bulk Bus Charter',
      icon: '🏢',
    },
    {
      id: 'admin',
      label: 'My Bookings / Admin',
      sublabel: currentUser?.role === 'admin' ? '🛡️ Admin Access' : 'User Portal',
      icon: '📑',
    },
  ];

  const handleTabClick = (id: NavTab) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
      {/* Top Utility Bar - MakeMyTrip style */}
      <div className="bg-[#051329] text-slate-300 text-xs py-1.5 px-4 hidden md:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-slate-200 font-medium">
              <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>24x7 Customer Support: <strong className="text-white">+91 98401 23456</strong></span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-medium">✓ All-India Tourist Permit (AITP) Certified</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">Tolls, Driver Beta &amp; Taxes Included</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-slate-200 font-medium flex items-center gap-1.5">
                  {currentUser.picture ? (
                    <img
                      src={currentUser.picture}
                      alt={currentUser.name}
                      className="w-4 h-4 rounded-full"
                    />
                  ) : (
                    <span>👤</span>
                  )}
                  <span>{currentUser.name}</span>
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    currentUser.role === 'admin'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}
                >
                  {currentUser.role === 'admin' ? '🛡️ ADMIN (DB)' : 'USER'}
                </span>
                <button
                  onClick={onLogout}
                  className="text-slate-400 hover:text-rose-300 underline text-[11px] ml-1 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="text-white bg-blue-600 hover:bg-blue-500 px-2.5 py-0.5 rounded font-semibold text-[11px] transition flex items-center gap-1 cursor-pointer"
              >
                <span>Google Login</span>
              </button>
            )}
            <span className="text-slate-600">|</span>
            <span className="text-blue-400 font-semibold">Tamil Nadu • Kerala • Karnataka</span>
          </div>
        </div>
      </div>

      {/* Main Bar with MakeMyTrip Navigation Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* MakeMyTrip Style Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none py-1"
            onClick={() => handleTabClick('home')}
          >
            <div className="flex items-center">
              <div className="h-9 px-2.5 rounded-l-md bg-[#008cff] text-white flex items-center font-black text-lg tracking-tighter shadow-xs">
                my
              </div>
              <div className="h-9 px-2 rounded-r-md bg-rose-600 text-white flex items-center font-bold text-xs uppercase tracking-wider shadow-xs">
                TRIP
              </div>
            </div>
            <div>
              <div className="font-extrabold text-gray-900 text-base sm:text-lg tracking-tight leading-none uppercase">
                South India Travels
              </div>
              <div className="text-[10px] text-gray-500 font-semibold tracking-wide mt-0.5">
                Outstation Cabs &amp; Holiday Tours
              </div>
            </div>
          </div>

          {/* Desktop Category Navigation Icons (MakeMyTrip signature navigation) */}
          <nav className="hidden lg:flex items-center gap-1 h-full">
            {navCategories.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`h-full px-3.5 flex flex-col items-center justify-center transition-all border-b-3 cursor-pointer ${
                    isActive
                      ? 'border-[#008cff] text-[#008cff] bg-blue-50/40'
                      : 'border-transparent text-gray-600 hover:text-[#008cff] hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg leading-none mb-1">{item.icon}</span>
                  <span className={`text-xs font-bold leading-tight ${isActive ? 'text-[#008cff]' : 'text-gray-800'}`}>
                    {item.label}
                  </span>
                  <span className="text-[10px] text-gray-500 font-normal leading-tight hidden xl:block">
                    {item.sublabel}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Action */}
          <div className="hidden lg:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2 border border-gray-200 py-1.5 px-3 rounded-full bg-gray-50">
                {currentUser.picture ? (
                  <img
                    src={currentUser.picture}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-900 leading-none truncate max-w-[100px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[9px] font-semibold text-emerald-700 uppercase leading-none mt-0.5">
                    {currentUser.role === 'admin' ? '🛡️ Admin' : 'Customer'}
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="border border-gray-300 hover:border-gray-400 bg-white text-gray-800 font-bold text-xs px-3.5 py-2 rounded-full transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {/* Google Icon */}
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Login / Sign Up</span>
              </button>
            )}

            <button
              onClick={onBookClick}
              className="bg-gradient-to-r from-[#008cff] to-[#0a58ca] hover:from-[#007ad6] hover:to-[#084298] text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-md shadow-sm transition active:scale-95 cursor-pointer"
            >
              Book Cab Now
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            {!currentUser ? (
              <button
                onClick={onOpenLogin}
                className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded font-bold cursor-pointer"
              >
                Login
              </button>
            ) : null}
            <button
              onClick={onBookClick}
              className="bg-[#008cff] text-white px-3 py-1.5 rounded-md text-xs font-semibold"
            >
              Book
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
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1 shadow-lg">
          {navCategories.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-semibold flex items-center gap-3 transition ${
                activeTab === item.id
                  ? 'bg-blue-50 text-[#008cff]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <div>
                <div>{item.label}</div>
                <div className="text-[11px] text-gray-600 font-normal">{item.sublabel}</div>
              </div>
            </button>
          ))}
          <div className="pt-3 mt-2 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
            <span>24x7 Helpline: +91 98401 23456</span>
            <span className="text-emerald-600 font-semibold">TN • KL • KA</span>
          </div>
        </div>
      )}
    </header>
  );
};


