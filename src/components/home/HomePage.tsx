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
  // =================== TAMIL NADU ===================
  {
    id: 'dest-ooty',
    name: 'Ooty & Coonoor',
    state: 'Tamil Nadu',
    tagline: 'Queen of Nilgiri Hill Stations',
    category: 'Hill Station',
    defaultDays: 3,
    baseKmFromHub: 280,
    imageUrl: 'https://images.unsplash.com/photo-1623648919321-30c07d2084ac?auto=format&fit=crop&w=1000&q=80',
    topSights: ['Nilgiri Toy Train', 'Doddabetta Peak', 'Pykara Lake & Falls', 'Sim’s Park Coonoor', 'Tea Factory'],
    matchedPackageTitle: 'Queen of Hills & Tea Valleys',
    suggestedItinerary: [
      { day: 1, title: 'Scenic Nilgiri Ghat Climb & Ooty Arrival', sights: 'Drive through Bandipur/Mudumalai, hotel check-in, Ooty Botanical Gardens & sunset boat ride at Ooty Lake.' },
      { day: 2, title: 'Full Day Pykara Safari & Doddabetta Peak', sights: 'Doddabetta Peak panoramic view, Tea Museum & tasting, Pykara Falls & motorboat safari.' },
      { day: 3, title: 'Heritage Toy Train & Coonoor Valleys', sights: 'Historic Nilgiri Toy Train to Coonoor, Dolphin’s Nose viewpoint, Sim’s Park, leisurely return drive.' },
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
    imageUrl: 'https://images.unsplash.com/photo-1593692716621-1e228b0a9224?auto=format&fit=crop&w=1000&q=80',
    topSights: ['Kodaikanal Lake', 'Pillar Rocks', 'Coaker’s Walk', 'Pine Forest', 'Silver Cascade Falls'],
    matchedPackageTitle: 'Princess of Hill Stations & Pine Trails',
    suggestedItinerary: [
      { day: 1, title: 'Scenic Palani Ghat Climb & Lake Boating', sights: 'Silver Cascade waterfall photo stop, check-in, pedal boating and cycling around star-shaped Kodai Lake.' },
      { day: 2, title: 'Pillar Rocks, Caves & Pine Forest Trails', sights: 'Panoramic Pillar Rocks view, Guna Caves, misty Pine Forest walk, Coaker’s Walk promenade.' },
      { day: 3, title: 'Bryant Park & Homemade Chocolates', sights: 'Floral tour at Bryant Park, Kurinji Andavar Temple, artisan chocolate tasting, leisurely descent.' },
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
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
    topSights: ['Meenakshi Amman Temple', 'Pamban Bridge', 'Rameshwaram 22 Teerthams', 'Dhanushkodi Ghost Town', 'APJ Kalam Memorial'],
    matchedPackageTitle: 'Temple Corridors & Pamban Ocean Bridge',
    suggestedItinerary: [
      { day: 1, title: 'Madurai Meenakshi Temple & Royal Palace', sights: 'Magnificent Meenakshi Amman Temple darshan, Thirumalai Nayakkar Mahal evening sound & light show.' },
      { day: 2, title: 'Pamban Sea Bridge & Rameshwaram Teerthams', sights: 'Drive over historic ocean bridge, Ramanathaswamy 1200-pillar corridor, holy teertham sacred bath.' },
      { day: 3, title: 'Dhanushkodi Ghost Town & Indian Ocean Coast', sights: '4x4 shoreline drive to Dhanushkodi tip (Arichal Munai), Dr. APJ Abdul Kalam memorial, return drive.' },
    ],
  },
  {
    id: 'dest-kanya',
    name: 'Kanyakumari',
    state: 'Tamil Nadu',
    tagline: 'Triveni Sangam, Vivekananda Rock & Thiruvalluvar Statue',
    category: 'Coastal',
    defaultDays: 3,
    baseKmFromHub: 360,
    imageUrl: 'https://images.unsplash.com/photo-1572886034137-b77ee990d594?auto=format&fit=crop&w=1000&q=80',
    topSights: ['Vivekananda Rock', 'Thiruvalluvar Statue', 'Triveni Sangam', 'Sunset Beach', 'Padmanabhapuram Palace'],
    matchedPackageTitle: 'Land’s End Sunrise & Triveni Sangam',
    suggestedItinerary: [
      { day: 1, title: 'Arrival & Triveni Sangam Sunset', sights: 'Scenic coastal highway drive, hotel check-in, witness sunset where three oceans meet at Triveni Sangam.' },
      { day: 2, title: 'Vivekananda Rock Memorial & Giant Statue Ferry', sights: 'Ferry ride to Vivekananda Rock Memorial, 133-ft Thiruvalluvar Statue, Gandhi Memorial, sunset view.' },
      { day: 3, title: 'Padmanabhapuram Wooden Palace & Return', sights: 'Magnificent 16th-century Padmanabhapuram wooden palace, Suchindram Thanumalayan Temple, return journey.' },
    ],
  },
  {
    id: 'dest-pondicherry',
    name: 'Mahabalipuram & Pondicherry',
    state: 'Tamil Nadu',
    tagline: 'UNESCO Shore Temples & French Promenade Beach',
    category: 'Heritage',
    defaultDays: 3,
    baseKmFromHub: 160,
    imageUrl: 'https://images.unsplash.com/photo-1665003815164-8f5bc853ef44?auto=format&fit=crop&w=1000&q=80',
    topSights: ['Shore Temple', 'Pancha Rathas', 'Arjuna’s Penance', 'Promenade Beach', 'Auroville'],
    matchedPackageTitle: 'Shore Temples & French Colonial Promenade',
    suggestedItinerary: [
      { day: 1, title: 'East Coast Road & Mahabalipuram Rock Monuments', sights: 'Scenic ECR ocean drive, UNESCO Shore Temple, monolithic Pancha Rathas, Arjuna’s Penance carvings.' },
      { day: 2, title: 'Auroville & French Colony Heritage Walk', sights: 'Auroville Matrimandir viewpoint, colorful French Quarter promenade, Sri Aurobindo Ashram, beach walk.' },
      { day: 3, title: 'Paradise Beach Boat Cruise & Return', sights: 'Chunnambar boat cruise to golden sands of Paradise Beach, cafe breakfast, leisurely return drive.' },
    ],
  },
  {
    id: 'dest-yercaud',
    name: 'Yercaud',
    state: 'Tamil Nadu',
    tagline: 'Jewel of Shevaroy Hills & Coffee Groves',
    category: 'Hill Station',
    defaultDays: 2,
    baseKmFromHub: 220,
    imageUrl: 'https://images.unsplash.com/photo-1529057299613-a565b7ce93aa?auto=format&fit=crop&w=1000&q=80',
    topSights: ['Emerald Lake', 'Pagoda Point', 'Killiyur Falls', 'Shevaroy Temple', 'Lady’s Seat'],
    matchedPackageTitle: 'Jewel of Shevaroy Hills & Coffee Groves',
    suggestedItinerary: [
      { day: 1, title: '20 Hairpin Bends & Emerald Lake Boating', sights: 'Climb 20 scenic hairpin bends, check-in, boating at Yercaud Emerald Lake, sunset from Lady’s Seat.' },
      { day: 2, title: 'Killiyur Falls & Pagoda Point Panoramas', sights: 'Trek to Killiyur waterfalls, panoramic views from Pagoda Point, Shevaroy cave shrine, organic coffee shopping.' },
    ],
  },

  // =================== KERALA ===================
  {
    id: 'dest-munnar',
    name: 'Munnar',
    state: 'Kerala',
    tagline: 'Misty Tea Hills, Waterfalls & Eravikulam',
    category: 'Hill Station',
    defaultDays: 3,
    baseKmFromHub: 290,
    imageUrl: 'https://images.unsplash.com/photo-1629813538702-64c925934e19?auto=format&fit=crop&w=1000&q=80',
    topSights: ['Mattupetty Dam', 'Eravikulam Tahr Park', 'Echo Point', 'Tea Museum', 'Cheeyappara Falls'],
    matchedPackageTitle: 'Misty Tea Plantations & Mountain Gap',
    suggestedItinerary: [
      { day: 1, title: 'Scenic Ghat Drive & Cheeyappara Waterfalls', sights: 'Drive past Cheeyappara & Valara waterfalls, hotel check-in, evening spice plantation walk.' },
      { day: 2, title: 'Eravikulam National Park & Mattupetty Boating', sights: 'Spot rare Nilgiri Tahr mountain goats at Rajamalai, speedboating at Mattupetty Dam, Echo Point, Tea Museum.' },
      { day: 3, title: 'Kundala Lake, Top Station & Return', sights: 'Pedal boating at Kundala arch dam lake, panoramic valley view from Top Station, scenic return drive.' },
    ],
  },
  {
    id: 'dest-alleppey',
    name: 'Alleppey (Alappuzha)',
    state: 'Kerala',
    tagline: 'Luxury AC Houseboat & Palm Backwaters',
    category: 'Backwaters',
    defaultDays: 3,
    baseKmFromHub: 310,
    imageUrl: 'https://images.unsplash.com/photo-1609828913552-f9138ed9e42d?auto=format&fit=crop&w=1000&q=80',
    topSights: ['Alleppey Houseboat', 'Vembanad Lake', 'Shikara Canals', 'Marari Beach', 'Village Coir Making'],
    matchedPackageTitle: 'Luxury Houseboat Cruise & Backwaters',
    suggestedItinerary: [
      { day: 1, title: 'Boarding Luxury Kettuvallam Houseboat', sights: 'Board private AC traditional houseboat at noon, welcome drink, leisurely cruise through Vembanad Lake lagoons.' },
      { day: 2, title: 'Shikara Village Canal Cruise & Kerala Sadya', sights: 'Small-canal canoe ride seeing village coir making, traditional banana leaf lunch with fresh Karimeen, sunset.' },
      { day: 3, title: 'Marari Beach Promenade & Return', sights: 'Morning breakfast on boat, disembark, explore peaceful Marari beach palm groves, comfortable return journey.' },
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
    topSights: ['Edakkal Caves', 'Banasura Sagar Dam', 'Soochipara Falls', 'Chembra Viewpoint', 'Pookode Lake'],
    matchedPackageTitle: 'Rainforest Waterfalls, Caves & Earth Dam',
    suggestedItinerary: [
      { day: 1, title: 'Thamarassery Ghat Drive & Banasura Dam', sights: 'Climb 9 hairpin bends of Thamarassery Ghat, check-in, speedboating at Banasura Sagar earth dam, Pookode lake.' },
      { day: 2, title: 'Prehistoric Edakkal Caves & Soochipara Falls', sights: 'Trek to Neolithic rock carvings at Edakkal Caves, three-tier Soochipara waterfall dip, tea estates.' },
      { day: 3, title: 'Wayanad Wildlife Safari & Return', sights: 'Morning Muthanga forest jeep safari spotting wild deer & elephants, bamboo handicrafts shopping, return journey.' },
    ],
  },
  {
    id: 'dest-thekkady',
    name: 'Thekkady & Periyar',
    state: 'Kerala',
    tagline: 'Tiger Reserve Boat Safari & Cardamom Valleys',
    category: 'Wildlife',
    defaultDays: 3,
    baseKmFromHub: 280,
    imageUrl: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1000&q=80',
    topSights: ['Periyar Lake Safari', 'Elephant Junction', 'Spice Plantation', 'Kathakali Show', 'Kalaripayattu'],
    matchedPackageTitle: 'Periyar Tiger Reserve & Spice Valleys',
    suggestedItinerary: [
      { day: 1, title: 'Periyar Arrival & Spice Garden Walk', sights: 'Scenic Western Ghats drive, check-in, guided aromatic cardamom/pepper garden tour, evening Kathakali show.' },
      { day: 2, title: 'Periyar Lake Wildlife Boat Safari', sights: 'Forest department boat cruise on Periyar Lake spotting wild elephants and bisons, elephant bath and interaction.' },
      { day: 3, title: 'Kumily Spice Bazaar & Return', sights: 'Fresh cinnamon, cardamom, and clove shopping in Kumily town, scenic descent towards plains.' },
    ],
  },

  // =================== SOUTH KARNATAKA ===================
  {
    id: 'dest-mysore',
    name: 'Mysore (Mysuru)',
    state: 'Karnataka',
    tagline: 'City of Palaces, Chamundi & Musical Fountains',
    category: 'Heritage',
    defaultDays: 2,
    baseKmFromHub: 140,
    imageUrl: 'https://images.unsplash.com/photo-1600112356915-089abb8fc71a?auto=format&fit=crop&w=1000&q=80',
    topSights: ['Mysore Palace', 'Chamundeshwari Temple', 'Brindavan Gardens', 'Mysore Zoo', 'St. Philomena’s'],
    matchedPackageTitle: 'City of Palaces, Chamundi & Musical Fountains',
    suggestedItinerary: [
      { day: 1, title: 'Grand Ambavilas Palace & Brindavan Musical Fountains', sights: 'Tour the royal Mysore Palace, visit world-famous Sri Chamarajendra Zoo, evening dancing musical fountains at Brindavan Gardens.' },
      { day: 2, title: 'Chamundeshwari Hill Temple & Sandalwood Shopping', sights: 'Climb Chamundi Hills to Chamundeshwari Temple and giant monolith Nandi Bull, authentic Mysore pak & silk saree shopping.' },
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
    imageUrl: 'https://images.unsplash.com/photo-1569996980833-901b5cd2eb70?auto=format&fit=crop&w=1000&q=80',
    topSights: ['Abbey Falls', 'Namdroling Golden Temple', 'Dubare Elephant Camp', 'Raja’s Seat', 'Mandalpatti Safari'],
    matchedPackageTitle: 'Coffee Highlands, Abbey Falls & Golden Temple',
    suggestedItinerary: [
      { day: 1, title: 'Bylakuppe Golden Temple & Madikeri Check-in', sights: 'Visit Namdroling Monastery with three 40-ft gilded Buddha statues, Nisargadhama bamboo park, sunset at Raja’s Seat.' },
      { day: 2, title: 'Abbey Falls & Mandalpatti 4x4 Jeep Safari', sights: 'Trek to cascading Abbey Falls, thrilling off-road jeep safari to Mandalpatti peak, organic coffee estate tour.' },
      { day: 3, title: 'Dubare Elephant Camp & Kaveri River Crossing', sights: 'Dubare Elephant Camp river boat crossing, elephant bathing interaction, Talakaveri sacred river birthplace, return drive.' },
    ],
  },
  {
    id: 'dest-chikmagalur',
    name: 'Chikmagalur',
    state: 'Karnataka',
    tagline: 'Coffee Cradle & Highest Mountain Peaks',
    category: 'Hill Station',
    defaultDays: 3,
    baseKmFromHub: 240,
    imageUrl: 'https://images.unsplash.com/photo-1730621697273-233e874a7f88?auto=format&fit=crop&w=1000&q=80',
    topSights: ['Mullayanagiri Peak', 'Baba Budangiri', 'Z Point Kemmangundi', 'Hebbe Falls', 'Coffee Estate Walk'],
    matchedPackageTitle: 'Highest Mountain Peaks & Coffee Cradle',
    suggestedItinerary: [
      { day: 1, title: 'Arrival & Aromatic Coffee Estate Tour', sights: 'Drive through verdant Western Ghats, hotel check-in, guided private coffee estate tour with fresh filter coffee tasting.' },
      { day: 2, title: 'Mullayanagiri Trek & Baba Budangiri Hills', sights: 'Climb Mullayanagiri (Karnataka’s highest peak at 1,930m), misty views from Baba Budangiri, scenic Z Point trail.' },
      { day: 3, title: 'Hebbe Waterfalls & Belur Temple Stop', sights: 'Jeep ride to cascading Hebbe Waterfalls, stop at historic Belur Chennakeshava Hoysala temple, return journey.' },
    ],
  },
  {
    id: 'dest-hampi',
    name: 'Hampi',
    state: 'Karnataka',
    tagline: 'UNESCO World Heritage Stone Empire & Coracle',
    category: 'Heritage',
    defaultDays: 4,
    baseKmFromHub: 350,
    imageUrl: 'https://images.unsplash.com/photo-1616606484004-5ef3cc46e39d?auto=format&fit=crop&w=1000&q=80',
    topSights: ['Stone Chariot', 'Virupaksha Temple', 'Tungabhadra Coracle', 'Lotus Mahal', 'Hemakuta Sunset'],
    matchedPackageTitle: 'UNESCO Vijayanagara Stone Chariot & Coracle',
    suggestedItinerary: [
      { day: 1, title: 'Arrival at Vijayanagara & Hemakuta Sunset', sights: 'Drive from hub to Hampi, check-in, sunset at boulder-strewn Hemakuta Hill and Sasivekalu Ganesha.' },
      { day: 2, title: 'Iconic Stone Chariot & Tungabhadra Coracle', sights: 'Vijaya Vittala musical pillars & monolithic Stone Chariot, active Virupaksha shrine, circular Coracle boat ride.' },
      { day: 3, title: 'Royal Enclosure, Lotus Mahal & Elephant Stables', sights: 'Royal Enclosure queen’s bath, Lotus Mahal, Elephant Stables, afternoon sunset at Matanga Hill.' },
      { day: 4, title: 'Anegundi Monkey Kingdom & Return', sights: 'Cross river to mythical Kishkindha (Anegundi), Anjanadri Hill birthplace of Hanuman, return journey.' },
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
  const [heroDestFilter, setHeroDestFilter] = useState<string>('All');

  // Helper for starting fare per destination card
  const getDestStartingFare = (dest: TouristDestination) => {
    const estKm = dest.baseKmFromHub * 2 + dest.defaultDays * 70;
    return Math.round((estKm * 15 + 600 * dest.defaultDays + 500) / 100) * 100;
  };

  const visibleDestinations = useMemo(() => {
    if (heroDestFilter === 'All') return TOURIST_DESTINATIONS;
    if (heroDestFilter === 'Tamil Nadu' || heroDestFilter === 'Kerala' || heroDestFilter === 'Karnataka') {
      return TOURIST_DESTINATIONS.filter((d) => d.state === heroDestFilter);
    }
    return TOURIST_DESTINATIONS.filter((d) => d.category === heroDestFilter);
  }, [heroDestFilter]);

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
      {/* 1. TOURIST TRIP PLANNER & VISUAL DESTINATION HERO BANNER */}
      {/* ============================================================ */}
      {/* ============================================================ */}
      {/* 1. TOURIST TRIP PLANNER & VISUAL DESTINATION HERO SECTION */}
      {/* ============================================================ */}
      <div className="space-y-6 sm:space-y-8">
        {/* Simple & Clean Hero Header */}
        <div className="pt-1 sm:pt-2">

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-2 leading-tight">
            Plan Your South India Holiday &amp; Tourist Trips
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl leading-relaxed">
            Handcrafted tour packages, day-by-day sightseeing itineraries, and private tourist vehicles across Ooty, Munnar, Coorg, Kodaikanal, Wayanad &amp; heritage circuits.
          </p>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* COMPACT MOBILE-FIRST TRIP PLANNER WIDGET */}
        {/* ------------------------------------------------------------ */}
        <div id="tourist-planner-anchor" className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-900">
              <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Interactive Holiday &amp; Itinerary Planner</span>
            </div>
            <span className="text-[11px] sm:text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              ✓ Tolls, Driver &amp; Fuel Included
            </span>
          </div>

          {/* 4 Compact Inputs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {/* 1. Destination */}
            <div className="col-span-2 sm:col-span-1 bg-gray-50 hover:bg-blue-50/40 p-2.5 sm:p-3 rounded-xl border border-gray-200 transition">
              <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                <svg className="w-3 h-3 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Holiday Destination</span>
              </label>
              <select
                value={selectedDestId}
                onChange={(e) => {
                  setSelectedDestId(e.target.value);
                  const dest = TOURIST_DESTINATIONS.find((d) => d.id === e.target.value);
                  if (dest) setSelectedDays(dest.defaultDays);
                }}
                className="w-full bg-transparent font-bold text-xs sm:text-sm text-gray-900 focus:outline-none cursor-pointer py-0.5"
              >
                {TOURIST_DESTINATIONS.map((dest) => (
                  <option key={dest.id} value={dest.id}>
                    {dest.name} ({dest.state})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Departure Hub */}
            <div className="col-span-1 bg-gray-50 hover:bg-blue-50/40 p-2.5 sm:p-3 rounded-xl border border-gray-200 transition">
              <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                <svg className="w-3 h-3 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Departure Hub</span>
              </label>
              <select
                value={selectedHubId}
                onChange={(e) => setSelectedHubId(e.target.value)}
                className="w-full bg-transparent font-bold text-xs sm:text-sm text-gray-900 focus:outline-none cursor-pointer py-0.5"
              >
                {DEPARTURE_HUBS.map((hub) => (
                  <option key={hub.id} value={hub.id}>
                    {hub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Duration */}
            <div className="col-span-1 bg-gray-50 hover:bg-blue-50/40 p-2.5 sm:p-3 rounded-xl border border-gray-200 transition">
              <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                <svg className="w-3 h-3 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Duration</span>
              </label>
              <select
                value={selectedDays}
                onChange={(e) => setSelectedDays(Number(e.target.value))}
                className="w-full bg-transparent font-bold text-xs sm:text-sm text-gray-900 focus:outline-none cursor-pointer py-0.5"
              >
                <option value={2}>2 Days / 1N</option>
                <option value={3}>3 Days / 2N</option>
                <option value={4}>4 Days / 3N</option>
                <option value={5}>5 Days / 4N</option>
                <option value={6}>6 Days / 5N</option>
              </select>
            </div>

            {/* 4. Vehicle Type */}
            <div className="col-span-2 sm:col-span-1 bg-gray-50 hover:bg-blue-50/40 p-2.5 sm:p-3 rounded-xl border border-gray-200 transition">
              <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                <svg className="w-3 h-3 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                <span>Vehicle Type</span>
              </label>
              <select
                value={selectedVehicleType}
                onChange={(e) => setSelectedVehicleType(e.target.value)}
                className="w-full bg-transparent font-bold text-xs sm:text-sm text-gray-900 focus:outline-none cursor-pointer py-0.5"
              >
                <option value="Sedan">AC Sedan (Dzire - 4 Seats)</option>
                <option value="SUV">Prime SUV (Innova Crysta - 7 Seats)</option>
                <option value="Van">Tempo Traveller (12-16 Seats)</option>
                <option value="Bus">Luxury Tourist Coach (21-40 Seats)</option>
              </select>
            </div>
          </div>

          {/* Quick Action & Total Summary */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="font-bold text-blue-600">Selected Tour:</span>
              <span className="font-semibold text-gray-900">{currentHub.name} ➔ {currentDestination.name}</span>
              <span className="text-gray-400 hidden sm:inline">•</span>
              <span className="text-sm font-black text-gray-900 price">{formatINR(estimatedTourFare)}</span>
              <span className="text-xs text-gray-500">({chosenVehicle?.name || 'Innova Crysta'})</span>
            </div>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('generated-itinerary-card');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>View Trip Plan &amp; Itinerary</span>
              <span>➔</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* MAIN VISUAL DESTINATIONS CONTENT */}
        {/* ------------------------------------------------------------ */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                Visual Holiday Explorer
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5">
                Top Tourist Destinations Across South India
              </h2>
            </div>
            <div className="text-xs text-gray-500 font-medium hidden sm:flex items-center gap-1">
              <span>Swipe cards to explore</span>
              <span>➔</span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {['All', 'Tamil Nadu', 'Kerala', 'Karnataka', 'Hill Station', 'Backwaters', 'Heritage', 'Wildlife'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setHeroDestFilter(f)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer border ${
                  heroDestFilter === f
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                }`}
              >
                {f === 'All' ? 'All Destinations' : f}
              </button>
            ))}
          </div>

          {/* Rich Visual Cards Horizontal Carousel */}
          <div className="flex items-stretch gap-3.5 overflow-x-auto pb-3 -mx-1 px-1 no-scrollbar scroll-smooth">
            {visibleDestinations.map((dest) => {
              const isSelected = selectedDestId === dest.id;
              const startFare = getDestStartingFare(dest);
              return (
                <div
                  key={dest.id}
                  onClick={() => {
                    setSelectedDestId(dest.id);
                    setSelectedDays(dest.defaultDays);
                    const el = document.getElementById('generated-itinerary-card');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`shrink-0 w-56 sm:w-64 bg-white text-gray-900 rounded-2xl overflow-hidden border transition-all duration-200 cursor-pointer flex flex-col group ${
                    isSelected
                      ? 'ring-2 ring-blue-600 border-blue-600 shadow-md scale-[1.01]'
                      : 'border-gray-200 hover:border-gray-300 shadow-xs hover:shadow-md'
                  }`}
                >
                  <div className="relative h-32 sm:h-36 bg-gray-100 overflow-hidden">
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-gray-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {dest.state}
                    </span>
                    <span className="absolute top-2.5 right-2.5 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      {dest.defaultDays}D / {dest.defaultDays - 1}N
                    </span>
                    <span className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded">
                      {dest.category}
                    </span>
                  </div>

                  <div className="p-3.5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition leading-snug">
                        {dest.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {dest.tagline}
                      </p>
                      <div className="text-[11px] text-gray-600 mt-1.5 truncate">
                        • {dest.topSights.slice(0, 2).join(' • ')}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-semibold block">Tour From</span>
                        <span className="text-sm font-extrabold text-gray-900 price">
                          {formatINR(startFare)}
                        </span>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded transition ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                      }`}>
                        {isSelected ? 'Selected ✓' : 'Plan Trip ➔'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
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
            <div className="bg-slate-50 border border-slate-200 p-3 sm:p-4 rounded-xl flex flex-row items-center justify-between gap-3 sm:gap-5 w-full lg:w-auto">
              <div>
                <span className="eyebrow block text-[10px]">
                  Tour Package From
                </span>
                <div className="text-xl sm:text-3xl font-black text-gray-900 leading-none mt-0.5 price">
                  {formatINR(estimatedTourFare)}
                </div>
                <span className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold block mt-0.5">
                  ✓ Fuel, Driver &amp; Tolls
                </span>
              </div>

              <button
                type="button"
                onClick={handleBookCurrentPlan}
                className="bg-[#008cff] hover:bg-[#0077e6] active:bg-[#0055ff] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg shadow-md transition cursor-pointer text-center whitespace-nowrap shrink-0"
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
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Day-by-Day Sightseeing Itinerary</span>
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
            <span className="eyebrow block mb-1">
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
                    <span className="eyebrow block">
                      Tour Package From
                    </span>
                    <span className="text-xl font-black text-gray-900 price">
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
            <span className="eyebrow block mb-1">
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
                  <span className="eyebrow block">Estimated Package</span>
                  <span className="font-black text-base text-gray-900 price">
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
            <span className="eyebrow block mb-1">
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
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>{v.capacity} Seats</span>
                  </span>
                  <span>•</span>
                  <span>{v.ac_type}</span>
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
          <span className="eyebrow block mb-1">
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
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">100% Sightseeing Flexibility</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Stop at viewpoints, tea gardens, and roadside waterfalls at your pace without arbitrary point-to-point drop constraints.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">Ghat Road Experts</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Commercial chauffeurs verified for hairpin curves across Ooty (36 hairpins), Munnar, Kodaikanal, and Wayanad.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">All-India Tourist Permits</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Valid AITP permits for Tamil Nadu, Kerala, and Karnataka. Seamless interstate border checkpost crossings.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
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
      <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-blue-200/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
            Group, College &amp; Family Tour Charters
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
            Need a Dedicated Tourist Bus or Custom Holiday Itinerary?
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1.5 max-w-2xl leading-relaxed">
            We provide 14-seater Tempo Travellers, 21-seater mini coaches, and 40-seater luxury Volvo buses for college industrial trips, family reunions, and pilgrim tours across South India.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('inquiry')}
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-xs transition whitespace-nowrap cursor-pointer shrink-0"
        >
          Plan Custom Group Tour ➔
        </button>
      </div>
    </div>
  );
};
