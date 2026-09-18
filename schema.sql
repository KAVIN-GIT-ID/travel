-- Recreate South India Travel Agencie Schema on Cloudflare D1

DROP TABLE IF EXISTS packages;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS inquiries;

CREATE TABLE packages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  state TEXT NOT NULL, -- 'Tamil Nadu', 'Kerala', 'Karnataka'
  category TEXT NOT NULL, -- 'Hill Station', 'Heritage', 'Wildlife', 'Backwaters', 'Coastal'
  price REAL NOT NULL,
  duration_days INTEGER NOT NULL,
  rating REAL NOT NULL DEFAULT 4.9,
  reviews_count INTEGER NOT NULL DEFAULT 150,
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  highlights TEXT NOT NULL,
  featured INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'Car', 'SUV', 'Mini Bus', 'Luxury Bus'
  category TEXT NOT NULL, -- 'Sedan', 'Prime SUV', 'Tempo Traveler', 'Volvo Coach'
  per_km_rate REAL NOT NULL, -- e.g. 14, 20, 26, 35, 45
  base_fare REAL NOT NULL DEFAULT 500,
  capacity INTEGER NOT NULL, -- Number of passengers
  ac_type TEXT NOT NULL DEFAULT 'AC',
  luggage_capacity INTEGER NOT NULL DEFAULT 3,
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  package_id INTEGER,
  package_title TEXT,
  vehicle_id INTEGER,
  vehicle_name TEXT,
  booking_type TEXT NOT NULL DEFAULT 'package', -- 'package' or 'route_rental'
  pickup_location TEXT,
  dropoff_location TEXT,
  distance_km REAL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  travel_date TEXT NOT NULL,
  travelers_count INTEGER DEFAULT 1,
  special_requests TEXT,
  status TEXT DEFAULT 'Confirmed',
  total_price REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'New',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed South India Packages (Tamil Nadu, Kerala, Karnataka)
INSERT INTO packages (id, title, destination, country, state, category, price, duration_days, rating, reviews_count, image_url, description, highlights, featured) VALUES
(1, 'Queen of Hills & Tea Valleys', 'Ooty & Coonoor', 'India', 'Tamil Nadu', 'Hill Station', 12500, 3, 4.9, 210, 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1000&q=80', 'Breathtaking Nilgiri mountain railway, botanical gardens, Pykara lake boat rides, and lush organic tea plantations.', 'Nilgiri Heritage Toy Train, Doddabetta Peak, Pykara Falls Boat Safari, Coonoor Tea Tasting', 1),
(2, 'Emerald Hills & Alleppey Backwaters', 'Munnar & Alleppey', 'India', 'Kerala', 'Backwaters', 16800, 4, 4.95, 340, 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80', 'Misty cardamom and tea plantations in Munnar followed by a traditional luxury houseboat cruise through Alleppey backwaters.', 'Munnar Eravikulam National Park, Private Alleppey Houseboat, Mattupetty Dam, Kathakali Show', 1),
(3, 'Scotland of India & Coffee Country', 'Coorg (Kodagu)', 'India', 'Karnataka', 'Hill Station', 13900, 3, 4.88, 185, 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1000&q=80', 'Endless coffee and pepper estates, cascading Abbey Falls, golden Namdroling Tibetan monastery, and gentle misty breezes.', 'Abbey Falls, Namdroling Tibetan Monastery, Dubare Elephant Camp, Raja Seat Sunset', 1),
(4, 'Princess of Hill Stations', 'Kodaikanal', 'India', 'Tamil Nadu', 'Hill Station', 11800, 3, 4.86, 175, 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80', 'Star-shaped lake cycling, misty Pillar Rocks, pine forest trails, and cool mountain weather high in the Palani hills.', 'Kodaikanal Lake Boating, Pillar Rocks Viewpoint, Coakers Walk, Silver Cascade Falls', 0),
(5, 'Rainforest Trails & Ancient Caves', 'Wayanad', 'India', 'Kerala', 'Wildlife', 14200, 3, 4.92, 190, 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80', 'Untouched Western Ghats wilderness, prehistoric Edakkal rock engravings, Banasura Sagar dam, and bamboo rafting.', 'Edakkal Caves Trek, Banasura Sagar Earth Dam, Chembra Peak View, Wayanad Wildlife Sanctuary', 0),
(6, 'UNESCO Vijayanagara Stone Empire', 'Hampi', 'India', 'Karnataka', 'Heritage', 15500, 4, 4.94, 260, 'https://images.unsplash.com/photo-1600100397608-f010f443b2a3?auto=format&fit=crop&w=1000&q=80', 'Marvel at colossal boulder-strewn landscapes, stone chariot temples, Virupaksha, and Coracle boat rides on the Tungabhadra river.', 'Stone Chariot & Vittala Temple, Virupaksha Ancient Shrine, Tungabhadra Coracle Ride, Sunset at Matanga Hill', 1);

-- Seed South India Travel Vehicles (Cars & Buses with per-km rates)
INSERT INTO vehicles (id, name, type, category, per_km_rate, base_fare, capacity, ac_type, luggage_capacity, image_url, description) VALUES
(1, 'Maruti Swift Dzire / Toyota Etios', 'Car', 'Sedan', 14.0, 500, 4, 'Full AC', 3, 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80', 'Ideal for family trips and business travels. Fuel efficient, comfortable legroom, and verified professional driver.'),
(2, 'Toyota Innova Crysta', 'Car', 'Prime SUV', 20.0, 800, 7, 'Full Dual AC', 5, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80', 'The gold standard for South Indian hill station journeys. Superior suspension, captain seats, and high luggage space.'),
(3, 'Force Urbania / Tempo Traveler', 'Bus', 'Mini Bus / Traveler', 26.0, 1200, 12, 'Pushback AC', 10, 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80', 'Perfect for medium family reunions and friends groups. Individual pushback seats, sound system, and generous boot space.'),
(4, 'BharatBenz Luxury Mini Coach', 'Bus', 'Mini Coach', 35.0, 1800, 21, 'Air Suspension AC', 18, 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80', 'Smooth air suspension ride through ghat roads in Nilgiris and Western Ghats. High deck panoramic windows.'),
(5, 'Volvo Multi-Axle Luxury Sleeper', 'Bus', 'Luxury Bus', 45.0, 2500, 40, 'Climate Control AC', 40, 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80', 'Interstate luxury coach for corporate tours, college trips, and grand wedding travels across TN, Kerala, and Karnataka.');

-- Seed test booking
INSERT INTO bookings (id, package_id, package_title, vehicle_id, vehicle_name, booking_type, pickup_location, dropoff_location, distance_km, customer_name, customer_email, customer_phone, travel_date, travelers_count, special_requests, status, total_price) VALUES
(1, NULL, 'Custom Route Rental', 2, 'Toyota Innova Crysta', 'route_rental', 'Bangalore, Karnataka', 'Ooty, Tamil Nadu', 270.0, 'Karthik Subramanian', 'karthik.subbu@example.com', '+91 98401 23456', '2026-10-10', 4, 'Pick up at Indiranagar 6 AM, Ghat road careful driver', 'Confirmed', 6200.0);
