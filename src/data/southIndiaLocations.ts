import type { LocationPoint } from '../types';

export const SOUTH_INDIA_LOCATIONS: LocationPoint[] = [
  // Tamil Nadu
  { id: 'tn-che', name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, popularHub: true },
  { id: 'tn-cbe', name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558, popularHub: true },
  { id: 'tn-mdu', name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198, popularHub: true },
  { id: 'tn-oot', name: 'Ooty (Nilgiris)', state: 'Tamil Nadu', lat: 11.4102, lng: 76.695, popularHub: true },
  { id: 'tn-kod', name: 'Kodaikanal', state: 'Tamil Nadu', lat: 10.2381, lng: 77.4892, popularHub: true },
  { id: 'tn-ram', name: 'Rameshwaram', state: 'Tamil Nadu', lat: 9.2876, lng: 79.3129, popularHub: true },
  { id: 'tn-kan', name: 'Kanyakumari', state: 'Tamil Nadu', lat: 8.0883, lng: 77.5385, popularHub: true },
  { id: 'tn-pon', name: 'Mahabalipuram & Pondicherry', state: 'Tamil Nadu', lat: 11.9416, lng: 79.8083, popularHub: true },
  { id: 'tn-yer', name: 'Yercaud (Shevaroy Hills)', state: 'Tamil Nadu', lat: 11.7753, lng: 78.2093 },
  { id: 'tn-cou', name: 'Courtallam (Kutralam Waterfalls)', state: 'Tamil Nadu', lat: 8.9304, lng: 77.2755 },
  { id: 'tn-tri', name: 'Tiruchirappalli (Trichy)', state: 'Tamil Nadu', lat: 10.7905, lng: 78.7047 },
  { id: 'tn-sal', name: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.146 },
  { id: 'tn-vel', name: 'Vellore', state: 'Tamil Nadu', lat: 12.9165, lng: 79.1325 },
  { id: 'tn-tir', name: 'Tirunelveli', state: 'Tamil Nadu', lat: 8.7139, lng: 77.7567 },
  { id: 'tn-tha', name: 'Thanjavur & Kumbakonam', state: 'Tamil Nadu', lat: 10.787, lng: 79.1378 },

  // Kerala
  { id: 'kl-koc', name: 'Kochi (Ernakulam)', state: 'Kerala', lat: 9.9312, lng: 76.2673, popularHub: true },
  { id: 'kl-trv', name: 'Thiruvananthapuram (Trivandrum)', state: 'Kerala', lat: 8.5241, lng: 76.9366, popularHub: true },
  { id: 'kl-mun', name: 'Munnar', state: 'Kerala', lat: 10.0889, lng: 77.0595, popularHub: true },
  { id: 'kl-all', name: 'Alleppey (Alappuzha)', state: 'Kerala', lat: 9.4981, lng: 76.3388, popularHub: true },
  { id: 'kl-way', name: 'Wayanad (Kalpetta)', state: 'Kerala', lat: 11.6103, lng: 76.0827, popularHub: true },
  { id: 'kl-the', name: 'Thekkady (Periyar)', state: 'Kerala', lat: 9.6031, lng: 77.1615, popularHub: true },
  { id: 'kl-ath', name: 'Athirappilly Waterfalls', state: 'Kerala', lat: 10.2851, lng: 76.5698 },
  { id: 'kl-gur', name: 'Guruvayur', state: 'Kerala', lat: 10.5946, lng: 76.0408 },
  { id: 'kl-clt', name: 'Kozhikode (Calicut)', state: 'Kerala', lat: 11.2588, lng: 75.7804 },
  { id: 'kl-var', name: 'Varkala & Kovalam', state: 'Kerala', lat: 8.7379, lng: 76.7163 },
  { id: 'kl-tcr', name: 'Thrissur', state: 'Kerala', lat: 10.5276, lng: 76.2144 },

  // Karnataka
  { id: 'ka-blr', name: 'Bengaluru (Bangalore)', state: 'Karnataka', lat: 12.9716, lng: 77.5946, popularHub: true },
  { id: 'ka-mys', name: 'Mysuru (Mysore)', state: 'Karnataka', lat: 12.2958, lng: 76.6394, popularHub: true },
  { id: 'ka-coo', name: 'Coorg (Madikeri)', state: 'Karnataka', lat: 12.4244, lng: 75.7382, popularHub: true },
  { id: 'ka-ham', name: 'Hampi', state: 'Karnataka', lat: 15.335, lng: 76.46, popularHub: true },
  { id: 'ka-chk', name: 'Chikmagalur', state: 'Karnataka', lat: 13.3161, lng: 75.772, popularHub: true },
  { id: 'ka-ban', name: 'Bandipur & Kabini', state: 'Karnataka', lat: 11.6664, lng: 76.6291 },
  { id: 'ka-mng', name: 'Mangalore', state: 'Karnataka', lat: 12.9141, lng: 74.856 },
  { id: 'ka-gok', name: 'Gokarna', state: 'Karnataka', lat: 14.5479, lng: 74.3188 },
  { id: 'ka-udu', name: 'Udupi', state: 'Karnataka', lat: 13.3409, lng: 74.7421 },
  { id: 'ka-hub', name: 'Hubballi (Hubli)', state: 'Karnataka', lat: 15.3647, lng: 75.124 },
];

export interface PopularRoutePreset {
  title: string;
  fromId: string;
  toId: string;
  tag: string;
}

export const POPULAR_ROUTES: PopularRoutePreset[] = [
  { title: 'Bangalore ➔ Mysore ➔ Ooty', fromId: 'ka-blr', toId: 'tn-oot', tag: 'Hill & Royal Palace' },
  { title: 'Bangalore ➔ Coorg', fromId: 'ka-blr', toId: 'ka-coo', tag: 'Coffee Highlands' },
  { title: 'Chennai ➔ Mahabalipuram ➔ Pondicherry', fromId: 'tn-che', toId: 'tn-pon', tag: 'Coast & French Colony' },
  { title: 'Madurai ➔ Rameshwaram ➔ Kanyakumari', fromId: 'tn-mdu', toId: 'tn-kan', tag: 'Sacred Coast' },
  { title: 'Coimbatore ➔ Kodaikanal', fromId: 'tn-cbe', toId: 'tn-kod', tag: 'Princess of Hills' },
  { title: 'Kochi ➔ Munnar ➔ Alleppey', fromId: 'kl-koc', toId: 'kl-all', tag: 'Hills & Backwaters' },
  { title: 'Bangalore ➔ Chikmagalur', fromId: 'ka-blr', toId: 'ka-chk', tag: 'Highest Peak' },
  { title: 'Bangalore ➔ Hampi', fromId: 'ka-blr', toId: 'ka-ham', tag: 'UNESCO Stone Empire' },
];
