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

-- Seed Authentic South India Packages (Tamil Nadu, Kerala, South Karnataka)
INSERT INTO packages (id, title, destination, country, state, category, price, duration_days, rating, reviews_count, image_url, description, highlights, featured) VALUES
(1, 'Queen of Hills & Tea Valleys', 'Ooty & Coonoor', 'India', 'Tamil Nadu', 'Hill Station', 12500, 3, 4.92, 320, 'https://images.unsplash.com/photo-1623648919321-30c07d2084ac?auto=format&fit=crop&w=1000&q=80', 'Historic Nilgiri mountain railway toy train, Doddabetta peak panoramic view, Pykara lake speedboating, and lush green organic tea plantations.', 'Nilgiri Heritage Toy Train, Doddabetta Peak, Pykara Lake Boating & Falls, Coonoor Sim’s Park, Ooty Botanical Gardens', 1),
(2, 'Princess of Hill Stations & Pine Trails', 'Kodaikanal', 'India', 'Tamil Nadu', 'Hill Station', 11800, 3, 4.88, 280, 'https://images.unsplash.com/photo-1593692716621-1e228b0a9224?auto=format&fit=crop&w=1000&q=80', 'Cool mountain mist high in the Palani Hills. Star-shaped Kodai lake cycling, misty Pillar Rocks, pine forest trails, and homemade artisan chocolates.', 'Kodaikanal Lake Boating, Pillar Rocks Viewpoint, Pine Forest Walk, Coaker’s Walk, Silver Cascade Falls', 1),
(3, 'Temple Corridors & Pamban Ocean Bridge', 'Madurai, Rameshwaram & Dhanushkodi', 'India', 'Tamil Nadu', 'Heritage', 16500, 4, 4.96, 450, 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80', 'Historic Madurai Meenakshi Amman temple, crossing the iconic Pamban Sea Bridge, Ramanathaswamy 1200-pillar corridor, holy teerthams, and Dhanushkodi ghost town.', 'Madurai Meenakshi Temple, Pamban Sea Bridge, Rameshwaram 22 Teerthams, Dhanushkodi Ghost Town, APJ Abdul Kalam Memorial', 1),
(4, 'Land’s End Sunrise & Triveni Sangam', 'Kanyakumari', 'India', 'Tamil Nadu', 'Coastal', 13500, 3, 4.90, 290, 'https://images.unsplash.com/photo-1572886034137-b77ee990d594?auto=format&fit=crop&w=1000&q=80', 'The southern tip of India where the Bay of Bengal, Arabian Sea, and Indian Ocean meet. Ferry ride to Vivekananda Rock and 133-ft Thiruvalluvar Statue.', 'Vivekananda Rock Memorial, Thiruvalluvar Statue, Triveni Sangam Sunset, Padmanabhapuram Palace, Suchindram Temple', 1),
(5, 'Shore Temples & French Colonial Promenade', 'Mahabalipuram & Pondicherry', 'India', 'Tamil Nadu', 'Heritage', 12800, 3, 4.87, 310, 'https://images.unsplash.com/photo-1665003815164-8f5bc853ef44?auto=format&fit=crop&w=1000&q=80', 'UNESCO World Heritage Shore Temple and monolithic rock chariots in Mamallapuram followed by the French quarter cafes and serene Promenade Beach in Pondicherry.', 'Shore Temple, Pancha Rathas, Arjuna’s Penance, Promenade Beach, Auroville Matrimandir, French Colony Walk', 0),
(6, 'Jewel of Shevaroy Hills & Coffee Groves', 'Yercaud', 'India', 'Tamil Nadu', 'Hill Station', 9800, 2, 4.82, 195, 'https://images.unsplash.com/photo-1529057299613-a565b7ce93aa?auto=format&fit=crop&w=1000&q=80', 'Charming hilltop getaway in the Eastern Ghats. Pedal boating on Emerald Lake, panoramic views from Pagoda Point, Killiyur waterfalls, and fragrant spice estates.', 'Yercaud Emerald Lake Boating, Pagoda Point Valley View, Killiyur Falls, Shevaroy Cave Temple, Lady’s Seat', 0),
(7, 'Great Living Chola Temples & Art Heritage', 'Thanjavur & Kumbakonam', 'India', 'Tamil Nadu', 'Heritage', 14200, 3, 4.93, 230, 'https://images.unsplash.com/photo-1541173061692-bbec3dc2bf85?auto=format&fit=crop&w=1000&q=80', 'Marvel at the 1000-year-old Brihadeeswara Big Temple (Periya Kovil) in Thanjavur, ancient Chola stone sculpture, Maratha Palace, and sacred temple town of Kumbakonam.', 'Thanjavur Brihadeeswara Big Temple, Royal Palace & Museum, Airavatesvara Temple Darasuram, Kumbakonam Brass Arts', 0),
(8, 'Herbal Spa Waterfalls & Western Ghats', 'Courtallam (Kutralam)', 'India', 'Tamil Nadu', 'Wildlife', 10500, 2, 4.85, 210, 'https://images.unsplash.com/photo-1684574409329-d8e82157ee85?auto=format&fit=crop&w=1000&q=80', 'Famous spa waterfalls of South India cascading with therapeutic herbal mountain water from Agasthiyar hills. Rejuvenating bath at Main Falls and Five Falls.', 'Main Falls Bath, Five Falls (Aintharuvi), Old Courtallam, Tenkasi Kasi Viswanathar Temple, Agasthiyar Falls Papanasam', 0),
(9, 'Misty Tea Plantations & Mountain Gap', 'Munnar', 'India', 'Kerala', 'Hill Station', 13800, 3, 4.95, 410, 'https://images.unsplash.com/photo-1629813538702-64c925934e19?auto=format&fit=crop&w=1000&q=80', 'Rolling emerald hills blanketed with fresh tea leaves. Mattupetty Dam speedboating, rare Nilgiri Tahr mountain goats at Eravikulam, and cool mountain breezes.', 'Mattupetty Dam & Echo Point, Eravikulam Tahr National Park, KDHP Tea Museum, Cheeyappara Waterfalls, Photo Point', 1),
(10, 'Luxury Houseboat Cruise & Backwaters', 'Alleppey (Alappuzha)', 'India', 'Kerala', 'Backwaters', 15900, 3, 4.94, 380, 'https://images.unsplash.com/photo-1609828913552-f9138ed9e42d?auto=format&fit=crop&w=1000&q=80', 'Board a traditional luxury wooden kettuvallam houseboat with private chef. Glide past lush paddy fields, coir villages, and coconut lagoons on Vembanad Lake.', 'Private AC Houseboat Overnight Cruise, Vembanad Lake, Traditional Kerala Sadya & Karimeen Fry, Shikara Village Canal Tour', 1),
(11, 'Rainforest Waterfalls, Caves & Earth Dam', 'Wayanad', 'India', 'Kerala', 'Wildlife', 14500, 3, 4.91, 265, 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80', 'Pristine Western Ghats greenery. Speedboating at Banasura Sagar (Asia’s 2nd largest earth dam), Neolithic rock engravings at Edakkal Caves, and bamboo rafting.', 'Banasura Sagar Earth Dam, Edakkal Prehistoric Caves, Soochipara Waterfalls, Chembra Peak Viewpoint, Pookode Lake', 1),
(12, 'Periyar Tiger Reserve & Spice Valleys', 'Thekkady (Periyar)', 'India', 'Kerala', 'Wildlife', 13200, 3, 4.89, 240, 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1000&q=80', 'Wildlife boat cruise on Periyar Lake spotting wild elephants, bison, and deer. Cardamom and clove spice plantation walk, and live Kathakali & Kalaripayattu shows.', 'Periyar Lake Wildlife Boat Safari, Organic Spice Garden Tour, Elephant Junction Interaction, Martial Arts Kalaripayattu Show', 0),
(13, 'Niagara of South India Waterfalls', 'Athirappilly & Thrissur', 'India', 'Kerala', 'Wildlife', 11200, 2, 4.90, 225, 'https://images.unsplash.com/photo-1684574409329-d8e82157ee85?auto=format&fit=crop&w=1000&q=80', 'Witness the roaring 80-foot Athirappilly Waterfalls cascading into the Chalakudy river, surrounded by Sholayar rainforests (famous from Baahubali and Raavan movies).', 'Athirappilly Main Falls, Vazhachal Forest Rapids, Thumboormuzhy Hanging Bridge & Butterfly Park, Chalakudy Riverwalk', 0),
(14, 'Sacred Krishna Darshan & Elephant Haven', 'Guruvayur', 'India', 'Kerala', 'Heritage', 10900, 2, 4.93, 310, 'https://images.unsplash.com/photo-1541173061692-bbec3dc2bf85?auto=format&fit=crop&w=1000&q=80', 'Devotional trip to Sri Krishna Temple (Bhuloka Vaikuntam) in Guruvayur, followed by visiting Punnathur Kotta elephant palace sanctuary with over 50 temple elephants.', 'Guruvayurappan Temple Darshan, Punnathur Kotta Elephant Sanctuary, Mammiyoor Mahadeva Temple, Chavakkad Beach Sunset', 0),
(15, 'Lighthouse Beach & Poovar Estuary', 'Kovalam & Poovar Island', 'India', 'Kerala', 'Coastal', 14800, 3, 4.87, 260, 'https://images.unsplash.com/photo-1572886034137-b77ee990d594?auto=format&fit=crop&w=1000&q=80', 'Relax by the iconic red-and-white striped Lighthouse Beach in Kovalam and take a boat safari through Poovar’s mangrove estuaries where the river meets the Arabian Sea.', 'Kovalam Lighthouse Beach, Poovar Island Mangrove Boat Safari, Golden Sand Beach Estuary, Padmanabhaswamy Temple Trivandrum', 0),
(16, 'City of Palaces, Chamundi & Musical Fountains', 'Mysore (Mysuru)', 'India', 'Karnataka', 'Heritage', 11500, 2, 4.93, 350, 'https://images.unsplash.com/photo-1600112356915-089abb8fc71a?auto=format&fit=crop&w=1000&q=80', 'The royal heritage capital of Karnataka. Tour the grand Ambavilas Mysore Palace, visit Chamundeshwari Temple atop Chamundi Hills, and evening musical fountain show at Brindavan Gardens.', 'Mysore Palace Grand Tour, Chamundi Hills & Bull Temple, Brindavan Gardens Musical Dancing Fountain, Sri Chamarajendra Zoo', 1),
(17, 'Coffee Highlands, Abbey Falls & Golden Temple', 'Coorg (Kodagu)', 'India', 'Karnataka', 'Hill Station', 13900, 3, 4.91, 330, 'https://images.unsplash.com/photo-1569996980833-901b5cd2eb70?auto=format&fit=crop&w=1000&q=80', 'Misty coffee, pepper, and cardamom plantations in Madikeri. Roaring Abbey Falls, sunset at Raja’s Seat, and the golden Buddhist statues at Bylakuppe Namdroling Monastery.', 'Abbey Falls, Namdroling Tibetan Golden Temple, Dubare Elephant Camp, Raja’s Seat Sunset Viewpoint, Talakaveri Kaveri River Source', 1),
(18, 'Highest Mountain Peaks & Coffee Cradle', 'Chikmagalur', 'India', 'Karnataka', 'Hill Station', 13200, 3, 4.89, 220, 'https://images.unsplash.com/photo-1730621697273-233e874a7f88?auto=format&fit=crop&w=1000&q=80', 'Climb Mullayanagiri (highest mountain peak in Karnataka at 1,930m), visit the shrine of Baba Budangiri, walk through aromatic coffee estates, and relax at Hebbe Falls.', 'Mullayanagiri Peak Trek, Baba Budangiri Hills, Z Point Kemmangundi, Hebbe Waterfalls, Coffee Plantation Tour', 0),
(19, 'UNESCO Vijayanagara Stone Chariot & Coracle', 'Hampi', 'India', 'Karnataka', 'Heritage', 15500, 4, 4.95, 340, 'https://images.unsplash.com/photo-1616606484004-5ef3cc46e39d?auto=format&fit=crop&w=1000&q=80', 'Marvel at colossal boulder-strewn landscapes, the iconic monolithic Stone Chariot, musical pillars of Vijaya Vittala Temple, Virupaksha ancient shrine, and circular Coracle boat rides on the Tungabhadra river.', 'Stone Chariot & Vittala Temple, Virupaksha Ancient Shrine, Tungabhadra River Coracle Ride, Lotus Mahal & Elephant Stables, Hemakuta Sunset', 1),
(20, 'Wild Tiger & Elephant Jungle Safari', 'Bandipur & Kabini', 'India', 'Karnataka', 'Wildlife', 16800, 3, 4.92, 215, 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1000&q=80', 'Open-jeep safari through Bandipur Tiger Reserve and boat safari along Kabini river backwaters. High probability of spotting herds of wild elephants, leopards, sloth bears, and gaurs.', 'Bandipur Forest Jeep Safari, Kabini Wildlife Boat Cruise, Elephant Herd Spotting, Jungle Naturalist Tour, Mysore Transit Stop', 0);

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
