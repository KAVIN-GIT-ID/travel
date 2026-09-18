import React, { useState, useMemo } from 'react';
import type { Package, Vehicle } from '../../types';
import type { NavTab } from '../common/Navbar';
import { formatINR } from '../../utils/distance';

interface HomePageProps {
  packages: Package[];
  vehicles: Vehicle[];
  onNavigate: (tab: NavTab) => void;
  onBookPackage: (pkg: Package) => void;
  onRentVehicle: (vehicle: Vehicle) => void;
  onBookRoute: (data: {
    pickup: string;
    dropoff: string;
    distanceKm: number;
    vehicle: Vehicle;
    totalFare: number;
  }) => void;
}

interface TouristDestination {
  id: string;
  name: string;
  state: 'Tamil Nadu' | 'Kerala' | 'Karnataka';
  tagline: string;
  category: 'Hill Station' | 'Backwaters' | 'Heritage' | 'Wildlife' | 'Coastal';
  defaultDays: number;
  baseKmFromHub: number;
  imageUrl: string;
  topSights: string[];
  suggestedItinerary: { day: number; title: string; sights: string }[];
  matchedPackageTitle?: string;
}

const TOURIST_DESTINATIONS: TouristDestination[] = [
  {
    id: 'dest-ooty',
    name: 'Ooty & Coonoor',
    state: 'Tamil Nadu',
    tagline: 'Queen of Nilgiri Hill Stations',
    category: 'Hill Station',
    defaultDays: 3,
    baseKmFromHub: 280,
    imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1000&q=80',
    topSights: ['Nilgiri Toy Train', 'Doddabetta Peak', 'Pykara Lake & Falls', 'Sim’s Park Coonoor', 'Tea Factory'],
    matchedPackageTitle: 'Queen of Hills & Tea Valleys',
    suggestedItinerary: [
      { day: 1, title: 'Scenic Nilgiri Ghat Climb & Ooty Arrival', sights: 'Drive through Bandipur/Mudumalai, check-in, Botanical Gardens & sunset boat ride at Ooty Lake.' },
      { day: 2, title: 'Full Day Pykara & Mountain Peak Safari', sights: 'Doddabetta Peak panoramic view, Tea Museum & tasting, Pykara Falls & motorboat safari.' },
      { day: 3, title: 'Heritage Toy Train & Coonoor Valleys', sights: 'Historic Nilgiri Toy Train to Coonoor, Dolphin’s Nose viewpoint, Sim’s Park, leisurely return drive.' },
    ],
  },
  {
    id: 'dest-munnar',
    name: 'Munnar & Alleppey',
    state: 'Kerala',
    tagline: 'Misty Tea Hills & Serene Backwaters',
    category: 'Backwaters',
    defaultDays: 4,
    baseKmFromHub: 290,
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
    topSights: ['Eravikulam Tahr Park', 'Mattupetty Dam', 'Alleppey Houseboat', 'Vembanad Lake', 'Spice Gardens'],
    matchedPackageTitle: 'Emerald Hills & Alleppey Backwaters',
    suggestedItinerary: [
      { day: 1, title: 'Munnar Arrival & Cardamom Hills', sights: 'Scenic drive past Cheeyappara & Valara waterfalls, hotel check-in, evening spice plantation walk.' },
      { day: 2, title: 'Eravikulam National Park & Tea Estate Sights', sights: 'Spot Nilgiri Tahr at Rajamalai, Mattupetty Dam boating, Echo Point, Tea Museum.' },
      { day: 3, title: 'Scenic Descent to Alleppey Houseboat Cruise', sights: 'Drive down to Alleppey jetty, board traditional luxury AC houseboat, backwater canal cruise.' },
      { day: 4, title: 'Morning Canoe Ride & Coastal Journey', sights: 'Sunrise village canoe ride in backwaters, traditional Kerala lunch, return journey.' },
    ],
  },
  {
    id: 'dest-coorg',
    name: 'Coorg (Madikeri)',
    state: 'Karnataka',
    tagline: 'Scotland of India & Coffee Highlands',
    category: 'Hill Station',
    defaultDays: 3,
    baseKmFromHub: 250,
    imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1000&q=80',
    topSights: ['Abbey Falls', 'Namdroling Golden Temple', 'Dubare Elephant Camp', 'Raja’s Seat', 'Mandalpatti Safari'],
    matchedPackageTitle: 'Scotland of India & Coffee Country',
    suggestedItinerary: [
      { day: 1, title: 'Bylakuppe Tibetan Monasteries & Madikeri Check-in', sights: 'Visit Namdroling Monastery Golden Temple, Cauvery Nisargadhama, sunset at Raja’s Seat.' },
      { day: 2, title: 'Abbey Falls & Mandalpatti 4x4 Jeep Safari', sights: 'Trek to cascading Abbey Falls, thrilling off-road jeep safari to Mandalpatti peak, spice shopping.' },
      { day: 3, title: 'Dubare Elephant Camp & River Rafting', sights: 'Dubare Elephant Camp river crossing, elephant interaction, organic coffee estate tour, return drive.' },
    ],
  },
  {
    id: 'dest-kodai',
    name: 'Kodaikanal',
    state: 'Tamil Nadu',
    tagline: 'Princess of Hills & Pine Forests',
    category: 'Hill Station',
    defaultDays: 3,
    baseKmFromHub: 210,
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
    topSights: ['Kodaikanal Lake', 'Pillar Rocks', 'Coaker’s Walk', 'Pine Forest', 'Silver Cascade Falls'],
    matchedPackageTitle: 'Princess of Hill Stations',
    suggestedItinerary: [
      { day: 1, title: 'Scenic Palani Ghat Climb & Lake Boating', sights: 'Silver Cascade waterfall photo stop, check-in, pedal boating on star-shaped Kodai Lake.' },
      { day: 2, title: 'Pillar Rocks, Caves & Pine Forest Trails', sights: 'Panoramic Pillar Rocks view, Guna Caves, misty Pine Forest walk, Coaker’s Walk promenade.' },
      { day: 3, title: 'Bryant Park & Homemade Chocolates', sights: 'Floral tour at Bryant Park, homemade Kodai artisan chocolate tasting, leisurely descent.' },
    ],
  },
  {
    id: 'dest-wayanad',
    name: 'Wayanad',
    state: 'Kerala',
    tagline: 'Misty Rainforests, Waterfalls & Ancient Caves',
    category: 'Wildlife',
    defaultDays: 3,
    baseKmFromHub: 270,
    imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80',
    topSights: ['Edakkal Caves', 'Banasura Sagar Dam', 'Soochipara Falls', 'Wayanad Sanctuary', 'Chembra View'],
    matchedPackageTitle: 'Rainforest Trails & Ancient Caves',
    suggestedItinerary: [
      { day: 1, title: 'Thamarassery Ghat Drive & Banasura Dam', sights: 'Drive through 9 hairpin bends, check-in, Asia’s 2nd largest earth dam speedboating at Banasura.' },
      { day: 2, title: 'Prehistoric Edakkal Caves & Soochipara Falls', sights: 'Climb to Neolithic rock carvings at Edakkal Caves, three-tier Soochipara waterfall dip, tea estates.' },
      { day: 3, title: 'Wildlife Sanctuary & Heritage Village', sights: 'Muthanga Wildlife safari, bamboo crafts shopping in Sultan Bathery, return journey.' },
    ],
  },
  {
    id: 'dest-hampi',
    name: 'Hampi & Badami',
    state: 'Karnataka',
    tagline: 'UNESCO World Heritage Stone Empire',
    category: 'Heritage',
    defaultDays: 4,
    baseKmFromHub: 350,
    imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010f443b2a3?auto=format&fit=crop&w=1000&q=80',
    topSights: ['Stone Chariot', 'Virupaksha Temple', 'Tungabhadra Coracle', 'Badami Caves', 'Pattadakal'],
    matchedPackageTitle: 'UNESCO Vijayanagara Stone Empire',
    suggestedItinerary: [
      { day: 1, title: 'Arrival at Vijayanagara & Hemakuta Sunset', sights: 'Drive from hub to Hampi, check-in, sunset at boulder-strewn Hemakuta Hill and Sasivekalu Ganesha.' },
      { day: 2, title: 'Iconic Stone Chariot & Tungabhadra Coracle', sights: 'Vijaya Vittala musical pillars & Stone Chariot, active Virupaksha shrine, circular Coracle boat ride.' },
      { day: 3, title: 'Royal Enclosure & Badami Rock-Cut Caves', sights: 'Lotus Mahal, Elephant Stables, afternoon drive to Badami 6th-century rock-cut cave temples & lake.' },
      { day: 4, title: 'Aihole & Pattadakal UNESCO Monuments', sights: 'Cradle of Indian temple architecture at Aihole, Pattadakal complex, return journey.' },
    ],
  },
  {
    id: 'dest-ramesh',
    name: 'Madurai & Rameshwaram',
    state: 'Tamil Nadu',
    tagline: 'Sacred Temples, Pamban Sea Bridge & Dhanushkodi',
    category: 'Heritage',
    defaultDays: 3,
    baseKmFromHub: 320,
    imageUrl: 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1000&q=80',
    topSights: ['Meenakshi Amman Temple', 'Pamban Bridge', 'Rameshwaram 22 Teerthams', 'Dhanushkodi Ghost Town', 'APJ Kalam Memorial'],
    suggestedItinerary: [
      { day: 1, title: 'Madurai Meenakshi Temple & Royal Palace', sights: 'Magnificent Meenakshi Amman Temple darshan, Thirumalai Nayakkar Mahal evening sound & light show.' },
      { day: 2, title: 'Pamban Sea Bridge & Rameshwaram Teerthams', sights: 'Drive over historic ocean bridge, Ramanathaswamy 1200-pillar corridor, holy teertham holy bath.' },
      { day: 3, title: 'Dhanushkodi Ghost Town & Indian Ocean Coast', sights: '4x4 shoreline drive to Dhanushkodi tip (Arichal Munai), Dr. APJ Abdul Kalam memorial, return drive.' },
    ],
  },
];

const DEPARTURE_HUBS = [
  { id: 'hub-blr', name: 'Bengaluru (Bangalore)', state: 'Karnataka' },
  { id: 'hub-che', name: 'Chennai', state: 'Tamil Nadu' },
  { id: 'hub-cbe', name: 'Coimbatore', state: 'Tamil Nadu' },
  { id: 'hub-koc', name: 'Kochi (Cochin)', state: 'Kerala' },
  { id: 'hub-mdu', name: 'Madurai', state: 'Tamil Nadu' },
  { id: 'hub-mng', name: 'Mangalore', state: 'Karnataka' },
];

export const HomePage: React.FC<HomePageProps> = ({
  packages,
  vehicles,
  onNavigate,
  onBookPackage,
  onRentVehicle,
}) => {
  // Planner State
  const [selectedDestId, setSelectedDestId] = useState<string>('dest-ooty');
  const [selectedHubId, setSelectedHubId] = useState<string>('hub-blr');
  const [selectedDays, setSelectedDays] = useState<number>(3);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('SUV'); // 'Sedan' | 'SUV' | 'Van' | 'Bus'

  // Active Destination
  const currentDestination = useMemo(() => {
    return TOURIST_DESTINATIONS.find((d) => d.id === selectedDestId) || TOURIST_DESTINATIONS[0];
  }, [selectedDestId]);

  const currentHub = useMemo(() => {
    return DEPARTURE_HUBS.find((h) => h.id === selectedHubId) || DEPARTURE_HUBS[0];
  }, [selectedHubId]);

  // Match package from backend if available
  const matchedPackage = useMemo(() => {
    if (!packages || packages.length === 0) return null;
    return packages.find(
      (p) =>
        p.destination.toLowerCase().includes(currentDestination.name.toLowerCase().split(' ')[0]) ||
        p.title.toLowerCase().includes(currentDestination.name.toLowerCase().split(' ')[0])
    ) || packages[0];
  }, [packages, currentDestination]);

  // Selected Tourist Vehicle for the Trip
  const chosenVehicle = useMemo(() => {
    if (selectedVehicleType === 'Sedan') {
      return vehicles.find((v) => v.type === 'Car' && v.category === 'Sedan') || vehicles[0];
    }
    if (selectedVehicleType === 'Van') {
      return vehicles.find((v) => v.category.includes('Tempo') || v.category.includes('Traveler') || v.capacity >= 12) || vehicles[2] || vehicles[0];
    }
    if (selectedVehicleType === 'Bus') {
      return vehicles.find((v) => v.type === 'Bus' && v.capacity >= 20) || vehicles[3] || vehicles[0];
    }
    // Default Prime SUV (Crysta)
    return vehicles.find((v) => v.category.includes('SUV')) || vehicles[1] || vehicles[0];
  }, [vehicles, selectedVehicleType]);

  // Calculate estimated complete tour price
  const estimatedTourFare = useMemo(() => {
    const dailyAllowance = 600 * selectedDays;
    const estTotalKm = currentDestination.baseKmFromHub * 2 + selectedDays * 70; // 70km sightseeing per day
    const kmFare = estTotalKm * (chosenVehicle?.per_km_rate || 18);
    const baseTourFare = kmFare + dailyAllowance + (chosenVehicle?.base_fare || 500);
    return Math.round(baseTourFare / 100) * 100;
  }, [currentDestination, selectedDays, chosenVehicle]);

  // Filtered packages for the explore grid
  const filteredPackages = useMemo(() => {
    if (selectedCategory === 'All') return packages;
    return packages.filter((p) => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));
  }, [packages, selectedCategory]);

  const handleBookCurrentPlan = () => {
    if (matchedPackage) {
      onBookPackage(matchedPackage);
    } else if (chosenVehicle) {
      onRentVehicle(chosenVehicle);
    }
  };

  const scrollToPlanner = (destId?: string) => {
    if (destId) setSelectedDestId(destId);
    const el = document.getElementById('tourist-planner-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-8 sm:space-y-14 -mt-1 sm:-mt-2">
      {/* ============================================================ */}
      {/* 1. TOURIST TRIP PLANNER HERO BANNER */}
      {/* ============================================================ */}
      <div className="relative bg-[#051329] text-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-slate-800">
        <div className="relative z-10 px-3.5 py-6 sm:px-10 sm:pt-10 sm:pb-14 max-w-6xl mx-auto">
          {/* Header Subtitle Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-blue-400 font-bold uppercase tracking-wider text-[11px] sm:text-xs">
                South India Holiday Specialist
              </span>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span className="text-slate-300 text-[11px] sm:text-xs">
                Tamil Nadu • Kerala • Karnataka
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-semibold text-[11px] sm:text-xs">
                ✓ Verified Tourist Chauffeurs
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-2 sm:mb-3 leading-tight">
            Plan Your South India Holiday &amp; Tourist Trips
          </h1>
          <p className="text-slate-300 text-xs sm:text-base max-w-3xl mb-5 sm:mb-8 leading-relaxed">
            Handcrafted tour packages, day-by-day sightseeing itineraries, and private tourist vehicles across Ooty, Munnar, Coorg, Kodaikanal, Wayanad &amp; heritage circuits.
          </p>

          {/* ------------------------------------------------------------ */}
          {/* INTERACTIVE TOUR TRIP PLANNER WIDGET */}
          {/* ------------------------------------------------------------ */}
          <div id="tourist-planner-anchor" className="bg-white text-gray-900 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-100 p-3.5 sm:p-7">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl">🗺️</span>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-gray-900">
                    Interactive Holiday &amp; Itinerary Planner
                  </h2>
                  <p className="text-[11px] sm:text-xs text-gray-500">
                    Tap a destination below or customize duration &amp; vehicle for an instant plan.
                  </p>
                </div>
              </div>
              <span className="hidden md:inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                ✓ Interstate Permits &amp; Sightseeing Tolls Included
              </span>
            </div>

            {/* Mobile-First Visual Destination Swipe Carousel */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Popular Holiday Destinations (1-Tap Select):
                </span>
                <span className="text-[10px] text-blue-600 font-semibold sm:hidden">Swipe ➔</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar scroll-smooth">
                {TOURIST_DESTINATIONS.map((dest) => {
                  const isSelected = selectedDestId === dest.id;
                  return (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => {
                        setSelectedDestId(dest.id);
                        setSelectedDays(dest.defaultDays);
                      }}
                      className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition active:scale-95 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-300'
                          : 'bg-slate-50 hover:bg-gray-100 text-gray-800 border-gray-200'
                      }`}
                    >
                      <img
                        src={dest.imageUrl}
                        alt={dest.name}
                        className="w-8 h-8 rounded-lg object-cover shrink-0"
                      />
                      <div>
                        <div className="text-xs font-bold whitespace-nowrap leading-none">
                          {dest.name}
                        </div>
                        <div className={`text-[10px] mt-0.5 whitespace-nowrap ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                          {dest.defaultDays} Days • {dest.state}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4-Step Tourist Planner Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* 1. Tourist Destination */}
              <div className="bg-slate-50 hover:bg-blue-50/50 p-3 sm:p-3.5 rounded-xl border border-gray-200 transition">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  1. Holiday Destination
                </label>
                <select
                  value={selectedDestId}
                  onChange={(e) => {
                    setSelectedDestId(e.target.value);
                    const dest = TOURIST_DESTINATIONS.find((d) => d.id === e.target.value);
                    if (dest) setSelectedDays(dest.defaultDays);
                  }}
                  className="w-full bg-transparent font-bold text-sm text-gray-900 focus:outline-none cursor-pointer py-1"
                >
                  {TOURIST_DESTINATIONS.map((dest) => (
                    <option key={dest.id} value={dest.id}>
                      {dest.name} ({dest.state})
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-blue-600 font-semibold mt-0.5 truncate">
                  {currentDestination.tagline}
                </div>
              </div>

              {/* 2. Departure Hub */}
              <div className="bg-slate-50 hover:bg-blue-50/50 p-3.5 rounded-xl border border-gray-200 transition">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  2. Starting Departure Hub
                </label>
                <select
                  value={selectedHubId}
                  onChange={(e) => setSelectedHubId(e.target.value)}
                  className="w-full bg-transparent font-bold text-sm text-gray-900 focus:outline-none cursor-pointer"
                >
                  {DEPARTURE_HUBS.map((hub) => (
                    <option key={hub.id} value={hub.id}>
                      {hub.name}
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-gray-500 font-medium mt-1">
                  Home / Hotel / Airport Pickup
                </div>
              </div>

              {/* 3. Tour Duration */}
              <div className="bg-slate-50 hover:bg-blue-50/50 p-3.5 rounded-xl border border-gray-200 transition">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  3. Tour Duration (Days / Nights)
                </label>
                <select
                  value={selectedDays}
                  onChange={(e) => setSelectedDays(Number(e.target.value))}
                  className="w-full bg-transparent font-bold text-sm text-gray-900 focus:outline-none cursor-pointer"
                >
                  <option value={2}>2 Days / 1 Night (Weekend Trip)</option>
                  <option value={3}>3 Days / 2 Nights (Classic Holiday)</option>
                  <option value={4}>4 Days / 3 Nights (Explorer Tour)</option>
                  <option value={5}>5 Days / 4 Nights (Grand Circuit)</option>
                  <option value={6}>6 Days / 5 Nights (Extended Tour)</option>
                </select>
                <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                  {selectedDays} Days sightseeing plan
                </div>
              </div>

              {/* 4. Tourist Vehicle */}
              <div className="bg-slate-50 hover:bg-blue-50/50 p-3.5 rounded-xl border border-gray-200 transition">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  4. Travel Group Vehicle
                </label>
                <select
                  value={selectedVehicleType}
                  onChange={(e) => setSelectedVehicleType(e.target.value)}
                  className="w-full bg-transparent font-bold text-sm text-gray-900 focus:outline-none cursor-pointer"
                >
                  <option value="Sedan">AC Sedan (Swift Dzire / Etios - 4 Seats)</option>
                  <option value="SUV">Prime SUV (Innova Crysta - 6-7 Seats)</option>
                  <option value="Van">Tempo Traveller (12-16 Pushback Seats)</option>
                  <option value="Bus">Luxury Tourist Coach (21-40 Seater)</option>
                </select>
                <div className="text-[11px] text-gray-600 font-medium mt-1 truncate">
                  {chosenVehicle?.name || 'Innova Crysta'} (₹{chosenVehicle?.per_km_rate}/km)
                </div>
              </div>
            </div>

            {/* Quick Holiday Vibe Chips */}
            <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-gray-500 mr-1 text-[11px] uppercase tracking-wider">
                  Holiday Vibes:
                </span>
                {[
                  { label: '🏔️ Hill Stations', destId: 'dest-ooty' },
                  { label: '🌴 Backwaters', destId: 'dest-munnar' },
                  { label: '☕ Coffee Highlands', destId: 'dest-coorg' },
                  { label: '🛕 Temple Circuits', destId: 'dest-ramesh' },
                  { label: '🏛️ World Heritage', destId: 'dest-hampi' },
                  { label: '🐅 Wildlife Forests', destId: 'dest-wayanad' },
                ].map((vibe) => (
                  <button
                    key={vibe.label}
                    type="button"
                    onClick={() => {
                      setSelectedDestId(vibe.destId);
                      const d = TOURIST_DESTINATIONS.find((x) => x.id === vibe.destId);
                      if (d) setSelectedDays(d.defaultDays);
                    }}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer border ${
                      selectedDestId === vibe.destId
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
                    }`}
                  >
                    {vibe.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('generated-itinerary-card');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>View Trip Plan &amp; Itinerary</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. GENERATED DAY-BY-DAY TOUR ITINERARY & VEHICLE PACKAGE */}
      {/* ============================================================ */}
      <div id="generated-itinerary-card" className="scroll-mt-20 space-y-4 sm:space-y-6">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 pb-5 sm:pb-6 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <span className="bg-blue-100 text-blue-800 text-[11px] sm:text-xs font-extrabold px-2 py-0.5 rounded">
                  {currentDestination.category} Holiday
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  {currentDestination.state}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs font-bold text-emerald-700">
                  {selectedDays} Days / {selectedDays - 1} Nights Complete Tour
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {currentHub.name} ➔ {currentDestination.name} Tour
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Private air-conditioned tourist vehicle dedicated for your entire tour with verified local sightseeing chauffeur.
              </p>
            </div>

            {/* Total Tour Fare & Booking CTA */}
            <div className="bg-slate-50 border border-slate-200 p-3.5 sm:p-4 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 w-full lg:w-auto justify-between lg:justify-start">
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold block">
                  Complete Tour Package From
                </span>
                <div className="text-2xl sm:text-3xl font-black text-gray-900 leading-none mt-0.5">
                  {formatINR(estimatedTourFare)}
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                  ✓ Fuel, Driver Batta &amp; Tolls Included
                </span>
              </div>

              <button
                type="button"
                onClick={handleBookCurrentPlan}
                className="bg-[#008cff] hover:bg-[#0077e6] active:bg-[#0055ff] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider px-5 py-3 rounded-lg shadow-md transition cursor-pointer text-center"
              >
                Book This Tour
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            {/* Left: Day-by-Day Sightseeing Itinerary (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <h3 className="text-base font-extrabold text-gray-900 uppercase tracking-wide flex items-center gap-2 mb-4">
                  <span>🗓️ Day-by-Day Sightseeing Itinerary</span>
                  <span className="text-xs text-gray-500 font-normal">({selectedDays} Days)</span>
                </h3>

                <div className="space-y-4">
                  {currentDestination.suggestedItinerary.slice(0, selectedDays).map((itin, idx) => (
                    <div
                      key={itin.day}
                      className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-slate-50/60 hover:bg-slate-50 transition"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                        D{idx + 1}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm sm:text-base text-gray-900">
                          {itin.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          {itin.sights}
                        </p>
                      </div>
                    </div>
                  ))}

                  {selectedDays > currentDestination.suggestedItinerary.length && (
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-slate-50/60">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                        D{selectedDays}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-gray-900">
                          Extended Leisure &amp; Return Departure
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          Morning sunrise viewpoints, local organic spice/handicraft shopping, and comfortable return drop to {currentHub.name}.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Key Attractions Included */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                  Sightseeing Highlights Included:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentDestination.topSights.map((sight) => (
                    <span
                      key={sight}
                      className="bg-white border border-gray-200 text-gray-800 text-xs font-medium px-3 py-1 rounded-md shadow-2xs flex items-center gap-1.5"
                    >
                      <span className="text-emerald-600">✓</span>
                      <span>{sight}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Assigned Tourist Vehicle & Trip Inclusions (4 cols) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-2xs space-y-4">
                <div className="relative h-44 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                  <img
                    src={chosenVehicle?.image_url || currentDestination.imageUrl}
                    alt={chosenVehicle?.name || 'Tourist Vehicle'}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-gray-900/85 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {chosenVehicle?.type === 'Bus' ? 'Tourist Bus / Coach' : 'Private Tourist Cab'}
                  </span>
                  <span className="absolute top-2.5 right-2.5 bg-blue-600 text-white text-xs font-extrabold px-2 py-0.5 rounded shadow-sm">
                    {chosenVehicle?.capacity} Seats
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-base text-gray-900">
                    {chosenVehicle?.name || 'Toyota Innova Crysta'}
                  </h4>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {chosenVehicle?.category || 'Prime SUV'} • {chosenVehicle?.ac_type || 'Dual Air Conditioned'}
                  </div>
                </div>

                {/* Inclusions Checklist */}
                <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-gray-700">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <span>✓</span>
                    <span>100% Local Sightseeing Included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Hill-Driving Certified Chauffeur</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Driver Batta &amp; Night Stay Included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Interstate All-India Tourist Permit (AITP)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Highway Toll Taxes &amp; Sightseeing Parking</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBookCurrentPlan}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Reserve This Tour Package
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. FEATURED SOUTH INDIA HOLIDAY PACKAGES */}
      {/* ============================================================ */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              Curated Holidays
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Popular South India Holiday Tour Packages
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              Handcrafted packages with private transport, sightseeing, and verified hotel options.
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar">
            {/* Category Filter Pills */}
            <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50 text-xs font-semibold shrink-0">
              {['All', 'Hill Station', 'Backwaters', 'Heritage'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-md transition cursor-pointer text-xs ${
                    selectedCategory === cat
                      ? 'bg-white text-blue-600 shadow-xs font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {cat === 'All' ? 'All Tours' : cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => onNavigate('tours')}
              className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 ml-2"
            >
              <span>View All</span>
              <span>➔</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.slice(0, 6).map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:border-blue-400 hover:shadow-md transition flex flex-col group"
            >
              <div className="relative h-52 bg-gray-100 overflow-hidden">
                <img
                  src={pkg.image_url}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-gray-900/85 text-white text-[11px] font-semibold px-2.5 py-1 rounded">
                  {pkg.state}
                </span>
                <span className="absolute top-3 right-3 bg-white text-gray-900 text-[11px] font-bold px-2.5 py-1 rounded shadow-sm border border-gray-200">
                  {pkg.category}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between text-xs text-blue-600 font-semibold mb-1">
                  <span>{pkg.destination}</span>
                  <span className="text-gray-500 font-medium">
                    {pkg.duration_days} Days / {pkg.duration_days - 1} Nights
                  </span>
                </div>

                <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition leading-snug">
                  {pkg.title}
                </h3>

                <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                  {pkg.description}
                </p>

                {/* Sights Checklist */}
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 text-xs text-gray-600">
                  <div className="font-semibold text-gray-800 text-[11px] uppercase tracking-wider mb-1">
                    Key Highlights:
                  </div>
                  {pkg.highlights.split(',').slice(0, 2).map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5 truncate">
                      <span className="text-emerald-600">✓</span>
                      <span className="truncate">{h.trim()}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                      Tour Package From
                    </span>
                    <span className="text-xl font-black text-gray-900">
                      {formatINR(pkg.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onBookPackage(pkg)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-xs cursor-pointer"
                    >
                      Book Tour
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. CLASSIC MULTI-DAY TOUR CIRCUITS IN SOUTH INDIA */}
      {/* ============================================================ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              Multi-Day Road Trips
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Iconic South India Holiday Circuits
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              Multi-destination scenic road trips connecting waterfalls, wildlife sanctuaries, and hill peaks.
            </p>
          </div>
          <button
            onClick={() => onNavigate('route-calc')}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Circuit Map</span>
            <span>➔</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              circuit: 'Nilgiri Mountain & Tea Trail',
              route: 'Bangalore ➔ Mysore Palace ➔ Ooty ➔ Coonoor',
              days: '3 Days / 2 Nights',
              state: 'Karnataka & Tamil Nadu',
              highlight: 'Toy Train & Doddabetta',
              fare: 12500,
              destId: 'dest-ooty',
            },
            {
              circuit: 'God’s Own Backwaters & Tea Hills',
              route: 'Kochi ➔ Munnar Hills ➔ Alleppey Houseboat',
              days: '4 Days / 3 Nights',
              state: 'Kerala',
              highlight: 'Houseboat & Eravikulam',
              fare: 16800,
              destId: 'dest-munnar',
            },
            {
              circuit: 'Southern Temple Odyssey',
              route: 'Madurai ➔ Pamban ➔ Rameshwaram ➔ Kanyakumari',
              days: '4 Days / 3 Nights',
              state: 'Tamil Nadu',
              highlight: 'Sea Bridge & Meenakshi',
              fare: 17200,
              destId: 'dest-ramesh',
            },
            {
              circuit: 'Coffee & Wilderness Trail',
              route: 'Bangalore ➔ Coorg Coffee Country ➔ Dubare Camp',
              days: '3 Days / 2 Nights',
              state: 'Karnataka',
              highlight: 'Abbey Falls & Elephants',
              fare: 13900,
              destId: 'dest-coorg',
            },
            {
              circuit: 'Vijayanagara Stone Empire',
              route: 'Bangalore ➔ Hampi Chariot ➔ Badami Caves',
              days: '4 Days / 3 Nights',
              state: 'Karnataka',
              highlight: 'UNESCO Stone Chariot',
              fare: 15500,
              destId: 'dest-hampi',
            },
            {
              circuit: 'Palani Hills & Pine Forests',
              route: 'Coimbatore ➔ Kodaikanal Lake ➔ Pillar Rocks',
              days: '3 Days / 2 Nights',
              state: 'Tamil Nadu',
              highlight: 'Misty Lake & Caves',
              fare: 11800,
              destId: 'dest-kodai',
            },
          ].map((c) => (
            <div
              key={c.circuit}
              onClick={() => scrollToPlanner(c.destId)}
              className="bg-white border border-gray-200 hover:border-blue-500 rounded-2xl p-5 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                  <span className="font-bold text-blue-600">{c.state}</span>
                  <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded text-[11px]">
                    {c.days}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-gray-900 group-hover:text-blue-600 transition">
                  {c.circuit}
                </h3>
                <p className="text-xs text-gray-600 mt-1 font-medium">
                  {c.route}
                </p>
                <div className="text-[11px] text-emerald-700 mt-2 flex items-center gap-1">
                  <span>★ Top Sight:</span>
                  <span className="font-semibold">{c.highlight}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">Estimated Package</span>
                  <span className="font-black text-base text-gray-900">
                    {formatINR(c.fare)}
                  </span>
                </div>
                <span className="text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition">
                  Plan Itinerary ➔
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. TOURIST FLEET FOR FAMILIES & GROUP TRAVEL */}
      {/* ============================================================ */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              Dedicated Tourist Vehicles
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Tourist Cabs, Vans &amp; Luxury Coaches
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              Air-conditioned vehicles with luggage carriers, pushback seats, and hill-driving certified drivers.
            </p>
          </div>

          <button
            onClick={() => onNavigate('fleet')}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Fleet</span>
            <span>➔</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {vehicles.slice(0, 4).map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:border-gray-300 transition flex flex-col"
            >
              <div className="relative h-40 bg-gray-100 overflow-hidden">
                <img
                  src={v.image_url}
                  alt={v.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="absolute top-2.5 left-2.5 bg-gray-900/85 text-white text-[11px] font-medium px-2 py-0.5 rounded">
                  {v.type}
                </span>
                <span className="absolute top-2.5 right-2.5 bg-blue-600 text-white font-extrabold text-xs px-2 py-0.5 rounded shadow-xs">
                  ₹{v.per_km_rate}/km
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-sm text-gray-900">{v.name}</h3>
                <div className="text-xs text-gray-500 mt-1">
                  👥 {v.capacity} Passenger Seats • ❄️ {v.ac_type}
                </div>
                <p className="text-[11px] text-gray-600 mt-2 line-clamp-2">
                  {v.description}
                </p>

                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-700">
                    Ghat Driving Certified
                  </span>

                  <button
                    type="button"
                    onClick={() => onRentVehicle(v)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition cursor-pointer"
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 6. WHY TOUR WITH SOUTH INDIA TRAVELS */}
      {/* ============================================================ */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
            Why Tour With Us
          </span>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Designed for Sightseeing &amp; Leisure Touring
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Unlike regular city-to-city cabs, our fleet and chauffeurs are dedicated to multi-day tourist sightseeing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
              🌄
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">100% Sightseeing Flexibility</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Stop at viewpoints, tea gardens, and roadside waterfalls at your pace without arbitrary point-to-point drop constraints.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shrink-0">
              ⛰️
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">Ghat Road Experts</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Commercial chauffeurs verified for hairpin curves across Ooty (36 hairpins), Munnar, Kodaikanal, and Wayanad.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">
              ✓
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">All-India Tourist Permits</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Valid AITP permits for Tamil Nadu, Kerala, and Karnataka. Seamless interstate border checkpost crossings.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg shrink-0">
              📞
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">24x7 Trip Concierge</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Direct route manager support at +91 98401 23456 for hotel coordination, driver logistics, and itinerary adjustments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 7. GROUP TOUR & BULK BUS CHARTER */}
      {/* ============================================================ */}
      <div className="bg-[#051329] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
            Group, College &amp; Family Tour Charters
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Need a Dedicated Tourist Bus or Custom Holiday Itinerary?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
            We provide 14-seater Tempo Travellers, 21-seater mini coaches, and 40-seater luxury Volvo buses for college industrial trips, family reunions, and pilgrim tours across South India.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('inquiry')}
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold px-6 py-3 rounded-lg text-sm shadow-md transition whitespace-nowrap cursor-pointer"
        >
          Plan Custom Group Tour ➔
        </button>
      </div>
    </div>
  );
};
