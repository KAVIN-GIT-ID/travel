import React, { useState } from 'react';
import type { User } from '../../types';
import { BusLogo } from './BusLogo';
import { NavIcon } from './NavIcon';

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
  }[] = [
    {
      id: 'home',
      label: 'Home',
      sublabel: 'Holiday Trips',
    },
    {
      id: 'tours',
      label: 'Tour Packages',
      sublabel: 'Curated Holidays',
    },
    {
      id: 'route-calc',
      label: 'Trip Planner',
      sublabel: 'Route & Map',
    },
    {
      id: 'fleet',
      label: 'Tourist Fleet',
      sublabel: 'Cabs & Buses',
    },
    {
      id: 'inquiry',
      label: 'Group Tours',
      sublabel: 'Custom Charters',
    },
    {
      id: 'admin',
      label: 'My Bookings',
      sublabel: currentUser?.role === 'admin' ? 'Admin Access' : 'User Portal',
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
            <span className="text-slate-300">Tolls, Driver Allowance &amp; Taxes Included</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-blue-400 font-semibold">Tamil Nadu • Kerala • Karnataka</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">Fast Interstate Permits</span>
          </div>
        </div>
      </div>

      {/* Main Bar with MakeMyTrip Navigation Layout */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 sm:h-18">
          {/* Brand Logo with Moving Bus Emblem */}
          <div
            className="cursor-pointer select-none py-1"
            onClick={() => handleTabClick('home')}
          >
            <div className="block sm:hidden">
              <BusLogo size="sm" showTagline={false} />
            </div>
            <div className="hidden sm:block">
              <BusLogo size="md" />
            </div>
          </div>

          {/* Desktop Category Navigation Icons */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 h-full">
            {navCategories.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`h-full px-2 xl:px-3.5 flex flex-col items-center justify-center transition-all border-b-3 cursor-pointer ${
                    isActive
                      ? 'border-[#008cff] text-[#008cff] bg-blue-50/40'
                      : 'border-transparent text-gray-600 hover:text-[#008cff] hover:bg-gray-50'
                  }`}
                >
                  <div className="mb-1 flex items-center justify-center">
                    <NavIcon tab={item.id} active={isActive} size="md" />
                  </div>
                  <span className={`text-xs font-bold leading-tight whitespace-nowrap ${isActive ? 'text-[#008cff]' : 'text-gray-800'}`}>
                    {item.label}
                  </span>
                  <span className="text-[10px] text-gray-500 font-normal leading-tight hidden xl:block whitespace-nowrap">
                    {item.sublabel}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Action */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2 border border-gray-200 py-1.5 px-3 rounded-lg bg-gray-50 shrink-0">
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
                    {currentUser.role === 'admin' ? 'Admin' : 'Customer'}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="text-gray-400 hover:text-rose-600 text-xs ml-1 cursor-pointer"
                  title="Sign Out"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="border border-gray-300 hover:border-gray-400 bg-white text-gray-800 font-bold text-xs px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
              >
                {/* Google Icon */}
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
              className="bg-[#008cff] hover:bg-[#0077e6] active:bg-[#0055ff] text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-md shadow-sm transition active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
            >
              Plan a Tour
            </button>
          </div>

          {/* Mobile Right Action */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Quick Call Button */}
            <a
              href="tel:+919840123456"
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-lg transition shrink-0"
              title="24x7 Helpline"
            >
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="hidden xs:inline">Call</span>
            </a>

            {/* Mobile Auth Button */}
            {!currentUser ? (
              <button
                type="button"
                onClick={onOpenLogin}
                className="border border-gray-300 bg-white text-gray-800 font-bold text-xs px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer shadow-2xs shrink-0"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Login</span>
              </button>
            ) : (
              <div className="flex items-center gap-1 bg-gray-100 py-1 px-2 rounded-lg text-xs">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </span>
                <button
                  onClick={onLogout}
                  className="text-gray-400 hover:text-rose-600 ml-1 text-xs"
                  title="Logout"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition border border-gray-200"
              aria-label="Toggle Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Mobile Top Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1 shadow-xl">
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
              <NavIcon tab={item.id} active={activeTab === item.id} size="md" />
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

      {/* Mobile Bottom Navigation Bar (MNC MakeMyTrip Standard) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 py-1.5 px-1 flex justify-around items-center shadow-lg"
      >
        {[
          { id: 'home', label: 'Holidays' },
          { id: 'tours', label: 'Packages' },
          { id: 'route-calc', label: 'Plan Tour' },
          { id: 'fleet', label: 'Fleet' },
          { id: 'inquiry', label: 'Custom' },
          { id: 'admin', label: 'Bookings' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id as NavTab)}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-lg transition-all active:scale-95 ${
                isActive ? 'text-[#008cff]' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                <NavIcon tab={tab.id as NavTab} active={isActive} size="md" />
              </div>
              <span className={`text-[10px] tracking-tight mt-1 whitespace-nowrap ${isActive ? 'font-bold text-[#008cff]' : 'font-medium'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1 bg-[#008cff] rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Floating WhatsApp Quick Action for Mobile & Desktop */}
      <a
        href="https://wa.me/919840123456?text=Hello%20South%20India%20Travels,%20I%20would%20like%20to%20plan%20a%20holiday%20tour."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-18 right-3.5 lg:bottom-6 lg:right-6 z-40 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3 rounded-full shadow-2xl flex items-center gap-2 transition active:scale-95 group"
        title="Chat with Tour Planner on WhatsApp"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
        <span className="hidden sm:inline text-xs font-bold tracking-wide">WhatsApp Us</span>
      </a>
    </header>
  );
};


