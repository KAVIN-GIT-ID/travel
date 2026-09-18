import React from 'react';
import type { NavTab } from './Navbar';

interface NavIconProps {
  tab: NavTab;
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const NavIcon: React.FC<NavIconProps> = ({
  tab,
  active = false,
  size = 'md',
  className = '',
}) => {
  const pixelSize = size === 'sm' ? 22 : size === 'lg' ? 32 : 26;
  const primary = active ? '#008cff' : '#4b5563';
  const fillLight = active ? 'rgba(0, 140, 255, 0.12)' : 'rgba(156, 163, 175, 0.08)';

  switch (tab) {
    // ------------------------------------------------------------
    // 1. HOLIDAYS / HOME: Isometric Holiday Villa & Palm Frond
    // ------------------------------------------------------------
    case 'home':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-colors ${className}`}
        >
          {/* Ground shadow */}
          <ellipse cx="16" cy="27" rx="12" ry="3.5" fill={fillLight} />
          {/* Left Wall */}
          <path
            d="M8 15L16 20V27L8 22V15Z"
            fill={active ? '#dbeafe' : '#f3f4f6'}
            stroke={primary}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Right Wall */}
          <path
            d="M16 20L24 15V22L16 27V20Z"
            fill={active ? '#bfdbfe' : '#e5e7eb'}
            stroke={primary}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Roof Left */}
          <path
            d="M16 6L6 13L16 18L26 13L16 6Z"
            fill={active ? '#3b82f6' : '#6b7280'}
            stroke={primary}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Roof Ridge Highlight */}
          <path
            d="M16 6L26 13L16 18"
            fill={active ? '#1d4ed8' : '#4b5563'}
            opacity="0.35"
          />
          {/* Front Door */}
          <path
            d="M11 19.5L13.5 21V25L11 23.5V19.5Z"
            fill={primary}
          />
          {/* Window Right */}
          <path
            d="M18 19L21.5 17V20L18 22V19Z"
            fill={active ? '#93c5fd' : '#cbd5e1'}
            stroke={primary}
            strokeWidth="1"
          />
        </svg>
      );

    // ------------------------------------------------------------
    // 2. TOUR PACKAGES: Isometric Sun Umbrella & Travel Luggage
    // ------------------------------------------------------------
    case 'tours':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-colors ${className}`}
        >
          {/* Ground shadow */}
          <ellipse cx="16" cy="27" rx="13" ry="3.5" fill={fillLight} />
          {/* Beach Umbrella Canopy Left */}
          <path
            d="M16 5C10 5 6 11 6 15L16 17L26 15C26 11 22 5 16 5Z"
            fill={active ? '#93c5fd' : '#e5e7eb'}
            stroke={primary}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Canopy Color Segment */}
          <path
            d="M16 5C13 5 11 11 11 16L16 17L21 16C21 11 19 5 16 5Z"
            fill={active ? '#2563eb' : '#4b5563'}
            stroke={primary}
            strokeWidth="1.2"
          />
          {/* Umbrella Pole */}
          <path
            d="M16 17V27"
            stroke={primary}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Holiday Suitcase (Isometric) */}
          <path
            d="M20 20L27 16V22L20 26V20Z"
            fill={active ? '#3b82f6' : '#9ca3af'}
            stroke={primary}
            strokeWidth="1.2"
          />
          <path
            d="M20 20L16 22.5V28.5L20 26V20Z"
            fill={active ? '#1d4ed8' : '#6b7280'}
            stroke={primary}
            strokeWidth="1.2"
          />
          <path
            d="M20 20L27 16L23 14.5L16 18.5L20 20Z"
            fill={active ? '#60a5fa' : '#d1d5db'}
            stroke={primary}
            strokeWidth="1.2"
          />
          {/* Luggage Handle */}
          <path
            d="M21 15V13H23V15"
            stroke={primary}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      );

    // ------------------------------------------------------------
    // 3. TRIP PLANNER: Isometric 3D Folding Map & Destination Pin
    // ------------------------------------------------------------
    case 'route-calc':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-colors ${className}`}
        >
          {/* Ground shadow */}
          <ellipse cx="16" cy="27" rx="12" ry="3" fill={fillLight} />
          {/* Folded Map Panel 1 (Left) */}
          <path
            d="M5 10L12 7V22L5 25V10Z"
            fill={active ? '#bfdbfe' : '#e5e7eb'}
            stroke={primary}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Folded Map Panel 2 (Center) */}
          <path
            d="M12 7L20 10V25L12 22V7Z"
            fill={active ? '#dbeafe' : '#f3f4f6'}
            stroke={primary}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Folded Map Panel 3 (Right) */}
          <path
            d="M20 10L27 7V22L20 25V10Z"
            fill={active ? '#bfdbfe' : '#e5e7eb'}
            stroke={primary}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Route path dashed on map */}
          <path
            d="M8 18Q14 13 18 19T24 13"
            stroke={active ? '#2563eb' : '#9ca3af'}
            strokeWidth="1.5"
            strokeDasharray="2 2"
            fill="none"
          />
          {/* 3D Location Marker Pin */}
          <g transform="translate(18, 5)">
            <path
              d="M4 0C1.8 0 0 1.8 0 4C0 7 4 12 4 12C4 12 8 7 8 4C8 1.8 6.2 0 4 0Z"
              fill={active ? '#ef4444' : '#6b7280'}
              stroke={primary}
              strokeWidth="1.2"
            />
            <circle cx="4" cy="4" r="1.5" fill="#ffffff" />
          </g>
        </svg>
      );

    // ------------------------------------------------------------
    // 4. TOURIST FLEET: Isometric Luxury Tourist Coach / Bus
    // ------------------------------------------------------------
    case 'fleet':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-colors ${className}`}
        >
          {/* Ground shadow */}
          <ellipse cx="16" cy="27" rx="13" ry="3.5" fill={fillLight} />
          {/* Front Bumper & Grill (Isometric Facing Left-Front) */}
          <path
            d="M6 16L12 19.5V25L6 21.5V16Z"
            fill={active ? '#1d4ed8' : '#4b5563'}
            stroke={primary}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Bus Body Side (Isometric Facing Right) */}
          <path
            d="M12 19.5L27 12V18L12 25V19.5Z"
            fill={active ? '#3b82f6' : '#9ca3af'}
            stroke={primary}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Bus Roof */}
          <path
            d="M6 16L21 8.5L27 12L12 19.5L6 16Z"
            fill={active ? '#93c5fd' : '#e5e7eb'}
            stroke={primary}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Front Windshield Glass */}
          <path
            d="M7 16.5L11.5 19V22L7 19.5V16.5Z"
            fill={active ? '#dbeafe' : '#ffffff'}
            stroke={primary}
            strokeWidth="1"
          />
          {/* Passenger Windows Along Side */}
          <path
            d="M14 18.5L25 13V15.5L14 21V18.5Z"
            fill={active ? '#dbeafe' : '#ffffff'}
            stroke={primary}
            strokeWidth="1"
          />
          {/* Headlight Accent */}
          <circle cx="8" cy="21" r="1" fill="#facc15" />
          {/* Isometric Wheels */}
          <ellipse cx="10" cy="25" rx="2" ry="1.5" fill="#1e293b" />
          <ellipse cx="23" cy="18.5" rx="2" ry="1.5" fill="#1e293b" />
        </svg>
      );

    // ------------------------------------------------------------
    // 5. GROUP TOURS / CUSTOM CHARTERS: Isometric Charter Van / Group
    // ------------------------------------------------------------
    case 'inquiry':
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-colors ${className}`}
        >
          {/* Ground shadow */}
          <ellipse cx="16" cy="27" rx="13" ry="3.5" fill={fillLight} />
          {/* Primary Traveler Silhouette (Isometric Perspective) */}
          <circle
            cx="13"
            cy="10"
            r="3.5"
            fill={active ? '#3b82f6' : '#6b7280'}
            stroke={primary}
            strokeWidth="1.2"
          />
          <path
            d="M7 23C7 18 10 16 13 16C16 16 19 18 19 23V25H7V23Z"
            fill={active ? '#2563eb' : '#4b5563'}
            stroke={primary}
            strokeWidth="1.2"
          />
          {/* Secondary Traveler (Back Right) */}
          <circle
            cx="21"
            cy="11"
            r="3"
            fill={active ? '#93c5fd' : '#9ca3af'}
            stroke={primary}
            strokeWidth="1"
          />
          <path
            d="M17 21C17 17.5 19 15.5 22 15.5C25 15.5 27 17.5 27 21V23H17V21Z"
            fill={active ? '#60a5fa' : '#6b7280'}
            stroke={primary}
            strokeWidth="1"
          />
          {/* Group Charter Badge Pin */}
          <circle cx="24" cy="9" r="2.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
        </svg>
      );

    // ------------------------------------------------------------
    // 6. BOOKINGS: Isometric Confirmed Ticket / Boarding Pass
    // ------------------------------------------------------------
    case 'admin':
    default:
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-colors ${className}`}
        >
          {/* Ground shadow */}
          <ellipse cx="16" cy="27" rx="12" ry="3" fill={fillLight} />
          {/* Ticket Back Shadow Layer */}
          <path
            d="M9 7L24 14V22L9 15V7Z"
            fill={active ? '#bfdbfe' : '#cbd5e1'}
            opacity="0.6"
          />
          {/* Main Boarding Pass / Ticket (Isometric) */}
          <path
            d="M7 9L22 16V24L7 17V9Z"
            fill={active ? '#ffffff' : '#f8fafc'}
            stroke={primary}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Ticket Perforation Notch */}
          <path
            d="M17 13.7L18.5 14.4V16L17 15.3V13.7Z"
            fill={primary}
          />
          {/* Ticket Header Band */}
          <path
            d="M7 9L12 11.3V19.3L7 17V9Z"
            fill={active ? '#3b82f6' : '#6b7280'}
            stroke={primary}
            strokeWidth="1"
          />
          {/* Verified Checkmark Badge */}
          <circle cx="21" cy="20" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
          <path
            d="M19 20L20.5 21.5L23.5 18.5"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
};
