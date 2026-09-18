-- Cloudflare D1 Database Schema for Travel Agencie

CREATE TABLE IF NOT EXISTS packages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  country TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  duration_days INTEGER NOT NULL,
  rating REAL NOT NULL DEFAULT 4.8,
  reviews_count INTEGER NOT NULL DEFAULT 120,
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  highlights TEXT NOT NULL,
  featured INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  package_id INTEGER,
  package_title TEXT NOT NULL,
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

CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'New',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial popular travel packages
INSERT OR IGNORE INTO packages (id, title, destination, country, category, price, duration_days, rating, reviews_count, image_url, description, highlights, featured) VALUES
(1, 'Tropical Haven & Sacred Temples', 'Bali', 'Indonesia', 'Beach & Culture', 899, 7, 4.9, 342, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80', 'Experience the enchanting beauty of Bali, from terraced rice fields in Ubud to sun-drenched beaches of Seminyak and ancient sea temples.', 'Ubud Monkey Forest, Uluwatu Temple Sunset, Nusa Penida Day Tour, Balinese Cooking Class', 1),
(2, 'Imperial Cherry Blossom Journey', 'Kyoto & Tokyo', 'Japan', 'Cultural', 1450, 9, 4.95, 518, 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80', 'Immerse in the timeless harmony of neon skylines and ancient wooden pagodas, serene bamboo groves, and authentic tea ceremonies.', 'Fushimi Inari Shrine, Mount Fuji Panorama, Shinkansen Bullet Train, Traditional Ryokan Stay', 1),
(3, 'Amalfi Coastline Romance & Wine', 'Amalfi & Positano', 'Italy', 'Luxury', 1890, 6, 4.88, 276, 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80', 'Cliffside pastel villages over sparkling turquoise waters. Indulge in authentic Italian gastronomy, private yacht cruises, and Limoncello tastings.', 'Private Capri Boat Cruise, Ravello Villa Gardens, Michelin Wine Tasting, Positano Cliff Walk', 1),
(4, 'Alpine Majesty & Glacier Express', 'Zermatt & Lucerne', 'Switzerland', 'Adventure', 1750, 8, 4.92, 198, 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80', 'Breathtaking peaks of the Matterhorn, crystal alpine lakes, scenic panoramic railways, and world-class fondue lodges.', 'Matterhorn Glacier Paradise, Glacier Express Ride, Lake Lucerne Steam Boat, Mountain Hiking Tour', 1),
(5, 'Serengeti Migration & Safari Trek', 'Serengeti & Ngorongoro', 'Tanzania', 'Wildlife', 2200, 7, 4.97, 164, 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1000&q=80', 'Witness Earths greatest wildlife spectacle. Encounter the Big Five in their natural habitats with luxury tented camp stays under the stars.', 'Big Five Game Drives, Hot Air Balloon Safari, Maasai Village Visit, Ngorongoro Crater Tour', 1),
(6, 'Santorini Caldera Sunset Odyssey', 'Santorini', 'Greece', 'Romantic', 1250, 5, 4.86, 310, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1000&q=80', 'Dazzling whitewashed cliffs, cobalt blue domes, and world-renowned Aegean sunsets paired with volcanic wines and luxury infinity pools.', 'Oia Sunset Sail, Red Beach Catamaran, Akrotiri Ruins, Volcanic Vineyard Tasting', 0);

-- Seed initial test booking to demonstrate DB queries
INSERT OR IGNORE INTO bookings (id, package_id, package_title, customer_name, customer_email, customer_phone, travel_date, travelers_count, special_requests, status, total_price) VALUES
(1, 1, 'Tropical Haven & Sacred Temples', 'Alexander Wright', 'alex.wright@example.com', '+1 (555) 234-5678', '2026-10-15', 2, 'Vegetarian meals preferred, ocean-view room', 'Confirmed', 1798.00);
