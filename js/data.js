// ============================================================
//  data.js — All sample data for Stackly Travel
// ============================================================

const DESTINATIONS = [
  {
    id: 1,
    name: "Bali",
    country: "Indonesia",
    image: "images/destinations/bali.webp",
    rating: 4.9,
    reviews: 2847,
    priceFrom: 299,
    tag: "Trending",
    tagColor: "#FF6B6B",
    description: "Tropical paradise with ancient temples, lush terraces & world-class surf.",
    category: "beach",
    highlights: ["Rice Terraces", "Uluwatu Temple", "Seminyak Beach"]
  },
  {
    id: 2,
    name: "Paris",
    country: "France",
    image: "images/destinations/paris.webp",
    rating: 4.8,
    reviews: 5312,
    priceFrom: 549,
    tag: "Popular",
    tagColor: "#4ECDC4",
    description: "The City of Light — art, cuisine, fashion & the iconic Eiffel Tower.",
    category: "city",
    highlights: ["Eiffel Tower", "Louvre Museum", "Montmartre"]
  },
  {
    id: 3,
    name: "Maldives",
    country: "Indian Ocean",
    image: "images/destinations/maldives.webp",
    rating: 5.0,
    reviews: 1923,
    priceFrom: 899,
    tag: "Luxury",
    tagColor: "#F5A623",
    description: "Pristine atolls, overwater bungalows & the world's most vivid waters.",
    category: "beach",
    highlights: ["Overwater Villas", "Coral Reefs", "Sunset Cruises"]
  },
  {
    id: 4,
    name: "Santorini",
    country: "Greece",
    image: "images/destinations/santorini.webp",
    rating: 4.9,
    reviews: 3148,
    priceFrom: 479,
    tag: "Romantic",
    tagColor: "#C77DFF",
    description: "Iconic blue domes, caldera views & the most breathtaking sunsets on earth.",
    category: "island",
    highlights: ["Oia Village", "Caldera Views", "Wine Tasting"]
  },
  {
    id: 5,
    name: "Tokyo",
    country: "Japan",
    image: "images/destinations/tokyo.webp",
    rating: 4.8,
    reviews: 4201,
    priceFrom: 399,
    tag: "Culture",
    tagColor: "#06D6A0",
    description: "Where ancient tradition meets hyper-modern innovation in neon-lit streets.",
    category: "city",
    highlights: ["Shibuya Crossing", "Mount Fuji", "Tsukiji Market"]
  },
  {
    id: 6,
    name: "New York",
    country: "USA",
    image: "images/destinations/newyork.webp",
    rating: 4.7,
    reviews: 6890,
    priceFrom: 349,
    tag: "Must Visit",
    tagColor: "#FFB703",
    description: "The city that never sleeps — skyscrapers, Broadway, Central Park & more.",
    category: "city",
    highlights: ["Central Park", "Times Square", "Brooklyn Bridge"]
  }
];

// ─────────────────────────────────────────────────────────────
//  HOTELS  (10 listings)
// ─────────────────────────────────────────────────────────────
const HOTELS = [
  {
    id: 1,
    name: "Azure Beachfront Resort",
    location: "Bali, Indonesia",
    destination: "Bali",
    stars: 5,
    rating: 4.9,
    reviews: 1248,
    pricePerNight: 420,
    image: "images/hotels/azure_resort.webp",
    imageFallback: "linear-gradient(135deg,#0077B6,#00B4D8,#90E0EF)",
    amenities: ["Pool", "Spa", "Free WiFi", "Beach Access", "Restaurant", "Gym"],
    category: "resort",
    badge: "Best Seller",
    badgeColor: "#FF6B6B",
    description: "Luxury beachfront retreat with infinity pools overlooking the Indian Ocean."
  },
  {
    id: 2,
    name: "Grand Palais Hôtel",
    location: "Paris, France",
    destination: "Paris",
    stars: 5,
    rating: 4.8,
    reviews: 2340,
    pricePerNight: 680,
    image: "images/hotels/grand_palace.webp",
    imageFallback: "linear-gradient(135deg,#B5838D,#E5989B,#FFB4A2)",
    amenities: ["Concierge", "Spa", "Free WiFi", "Fine Dining", "Bar", "Valet Parking"],
    category: "luxury",
    badge: "5-Star",
    badgeColor: "#F5A623",
    description: "Classic Parisian opulence in the heart of the 8th arrondissement."
  },
  {
    id: 3,
    name: "Manhattan Sky Tower",
    location: "New York, USA",
    destination: "New York",
    stars: 5,
    rating: 4.7,
    reviews: 3102,
    pricePerNight: 590,
    image: "images/hotels/sky_tower.webp",
    imageFallback: "linear-gradient(135deg,#2D3561,#4A4E8C,#C05C7E)",
    amenities: ["Rooftop Pool", "Sky Bar", "Free WiFi", "City View", "Gym", "Business Center"],
    category: "city",
    badge: "City View",
    badgeColor: "#4ECDC4",
    description: "Iconic glass tower with breathtaking Manhattan skyline panoramas."
  },
  {
    id: 4,
    name: "Sakura Ryokan Inn",
    location: "Tokyo, Japan",
    destination: "Tokyo",
    stars: 4,
    rating: 4.8,
    reviews: 987,
    pricePerNight: 320,
    image: "images/hotels/sakura_inn.webp",
    imageFallback: "linear-gradient(135deg,#FF758C,#FF7EB3,#FFACC7)",
    amenities: ["Onsen Bath", "Tea Ceremony", "Free WiFi", "Zen Garden", "Traditional Meals"],
    category: "boutique",
    badge: "Cultural",
    badgeColor: "#06D6A0",
    description: "Authentic Japanese ryokan experience blending tradition with modern luxury."
  },
  {
    id: 5,
    name: "Coral Waters Villa",
    location: "Maldives",
    destination: "Maldives",
    stars: 5,
    rating: 5.0,
    reviews: 764,
    pricePerNight: 1250,
    image: "images/hotels/maldives_overwater.webp",
    imageFallback: "linear-gradient(135deg,#0096C7,#00B4D8,#48CAE4)",
    amenities: ["Overwater Villa", "Glass Floor", "Snorkeling", "Private Chef", "Spa", "Sunset Deck"],
    category: "villa",
    badge: "Top Pick",
    badgeColor: "#C77DFF",
    description: "Exclusive overwater bungalows above a pristine turquoise lagoon."
  },
  {
    id: 6,
    name: "Caldera Cave Suites",
    location: "Santorini, Greece",
    destination: "Santorini",
    stars: 5,
    rating: 4.9,
    reviews: 1521,
    pricePerNight: 780,
    image: "images/hotels/santorini_cave.webp",
    imageFallback: "linear-gradient(135deg,#E07C5B,#F4A261,#FFCB77)",
    amenities: ["Plunge Pool", "Caldera View", "Free WiFi", "Wine Cellar", "Helicopter Pad"],
    category: "boutique",
    badge: "Romantic",
    badgeColor: "#C77DFF",
    description: "Cave suites carved into volcanic cliffs with private infinity plunge pools."
  },
  {
    id: 7,
    name: "Jungle Canopy Retreat",
    location: "Ubud, Bali",
    destination: "Bali",
    stars: 4,
    rating: 4.6,
    reviews: 892,
    pricePerNight: 280,
    image: "images/hotels/azure_resort.webp",
    imageFallback: "linear-gradient(135deg,#2D6A4F,#52B788,#95D5B2)",
    amenities: ["Jungle View", "Yoga Deck", "Free WiFi", "Infinity Pool", "Organic Restaurant"],
    category: "eco",
    badge: "Eco Luxury",
    badgeColor: "#06D6A0",
    description: "Sustainable luxury resort nestled in the heart of Bali's sacred jungle."
  },
  {
    id: 8,
    name: "Le Marais Boutique",
    location: "Paris, France",
    destination: "Paris",
    stars: 4,
    rating: 4.5,
    reviews: 1673,
    pricePerNight: 390,
    image: "images/hotels/grand_palace.webp",
    imageFallback: "linear-gradient(135deg,#8D99AE,#ABB5BE,#D6DCE4)",
    amenities: ["Free WiFi", "Rooftop Terrace", "Bar", "Concierge", "City View"],
    category: "boutique",
    badge: "Charming",
    badgeColor: "#FFB703",
    description: "Chic boutique hotel in the vibrant Le Marais district, steps from the Seine."
  },
  {
    id: 9,
    name: "Alpine Sky Lodge",
    location: "New York, USA",
    destination: "New York",
    stars: 3,
    rating: 4.3,
    reviews: 2211,
    pricePerNight: 220,
    image: "images/hotels/sky_tower.webp",
    imageFallback: "linear-gradient(135deg,#4A4E69,#9A8C98,#C9ADA7)",
    amenities: ["Free WiFi", "Breakfast", "Gym", "24/7 Concierge"],
    category: "budget",
    badge: "Great Value",
    badgeColor: "#4ECDC4",
    description: "Smart, comfortable stays in Midtown Manhattan at unbeatable value."
  }
];

// ─────────────────────────────────────────────────────────────
//  OFFERS  (3 promotions)
// ─────────────────────────────────────────────────────────────
const OFFERS = [
  {
    id: 1,
    title: "Early Bird Summer Escape",
    description: "Book your summer holiday at least 60 days in advance and unlock incredible savings on hotels and flights to our top destinations.",
    discount: "30% OFF",
    code: "SUMMER30",
    expiry: "2026-12-31",
    validFor: "All destinations",
    gradient: "linear-gradient(135deg,#F5A623,#FF6B6B)",
    icon: '<i class="fa-solid fa-sun"></i>',
    minSpend: "$500"
  },
  {
    id: 2,
    title: "Honeymoon Luxury Package",
    description: "Celebrate love in paradise. Exclusive rates on overwater villas, cave suites & private beach resorts with complimentary champagne.",
    discount: "25% OFF",
    code: "HONEYMOON25",
    expiry: "2026-12-31",
    validFor: "5-star hotels only",
    gradient: "linear-gradient(135deg,#C77DFF,#FF6B6B)",
    icon: '<i class="fa-solid fa-heart"></i>',
    minSpend: "$1,000"
  },
  {
    id: 3,
    title: "Weekend Flash Sale",
    description: "Lightning deals every weekend! Score up to 40% off last-minute bookings for spontaneous travellers looking for their next adventure.",
    discount: "40% OFF",
    code: "FLASH40",
    expiry: "2026-11-30",
    validFor: "Weekend stays",
    gradient: "linear-gradient(135deg,#4ECDC4,#0077B6)",
    icon: '<i class="fa-solid fa-bolt"></i>',
    minSpend: "$200"
  }
];

// ─────────────────────────────────────────────────────────────
//  TESTIMONIALS  (6 reviews)
// ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Mitchell",
    country: "United Kingdom",
    flag: '<i class="fa-solid fa-circle-check" style="color:var(--accent-ink)"></i>',
    initials: "SM",
    avatarColor: "#D97706",
    rating: 5,
    destination: "Bali, Indonesia",
    review: "Stackly made our Bali honeymoon absolutely magical. The Azure Beachfront Resort was breathtaking — every detail was perfect. The sunset dinners on the beach, the spa treatments, the warm hospitality... I still dream about it every day!",
    date: "October 2026"
  },
  {
    id: 2,
    name: "James Beaumont",
    country: "Canada",
    flag: '<i class="fa-solid fa-circle-check" style="color:var(--accent-ink)"></i>',
    initials: "JB",
    avatarColor: "#B45309",
    rating: 5,
    destination: "Santorini, Greece",
    review: "The Caldera Cave Suites in Santorini were beyond anything I've ever experienced. Watching the sunset from our private infinity pool with a glass of local wine... pure perfection. Stackly's customer service was flawless from start to finish.",
    date: "September 2026"
  },
  {
    id: 3,
    name: "Priya Sharma",
    country: "India",
    flag: '<i class="fa-solid fa-circle-check" style="color:var(--accent-ink)"></i>',
    initials: "PS",
    avatarColor: "#1A160D",
    rating: 5,
    destination: "Maldives",
    review: "I had always dreamed of an overwater bungalow in the Maldives. Stackly turned that dream into reality! The Coral Waters Villa was straight out of a fairy tale — the glass floor showing the coral reef below was incredible. 10/10, no hesitation!",
    date: "August 2026"
  },
  {
    id: 4,
    name: "Marcus Weber",
    country: "Germany",
    flag: '<i class="fa-solid fa-circle-check" style="color:var(--accent-ink)"></i>',
    initials: "MW",
    avatarColor: "#30291A",
    rating: 4,
    destination: "Tokyo, Japan",
    review: "Tokyo blew my mind. The Sakura Ryokan Inn was the perfect blend of tradition and comfort — the onsen bath experience alone was worth the trip. Stackly's itinerary recommendations were spot-on, covering all the hidden gems we'd never find alone.",
    date: "November 2026"
  },
  {
    id: 5,
    name: "Isabelle Fontaine",
    country: "France",
    flag: '<i class="fa-solid fa-circle-check" style="color:var(--accent-ink)"></i>',
    initials: "IF",
    avatarColor: "#B45309",
    rating: 5,
    destination: "New York, USA",
    review: "Even as a French person visiting New York, Stackly's local tips transformed the trip. The Manhattan Sky Tower's views at night were jaw-dropping. The booking process was seamless and the price estimation tool helped me plan my budget perfectly.",
    date: "October 2026"
  },
  {
    id: 6,
    name: "Liam O'Brien",
    country: "Australia",
    flag: '<i class="fa-solid fa-circle-check" style="color:var(--accent-ink)"></i>',
    initials: "LO",
    avatarColor: "#1A160D",
    rating: 5,
    destination: "Paris, France",
    review: "Paris with Stackly was something else entirely. Grand Palais Hôtel was straight-up royalty living. The concierge got us reservations at a Michelin-starred restaurant that was supposedly fully booked. These guys have connections! Would book again in a heartbeat.",
    date: "September 2026"
  }
];

// ─────────────────────────────────────────────────────────────
//  STATS (Why Choose Us counters)
// ─────────────────────────────────────────────────────────────
const STATS = [
  { value: 150, suffix: "+", label: "Destinations", icon: '<i class="fa-solid fa-earth-americas"></i>' },
  { value: 50000, suffix: "+", label: "Happy Travellers", icon: '<i class="fa-solid fa-face-smile"></i>' },
  { value: 1200, suffix: "+", label: "Luxury Hotels", icon: '<i class="fa-solid fa-hotel"></i>' },
  { value: 98, suffix: "%", label: "Satisfaction Rate", icon: '<i class="fa-solid fa-star"></i>' }
];

// ─────────────────────────────────────────────────────────────
//  WHY CHOOSE US features
// ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: '<i class="fa-solid fa-shield-halved"></i>',
    title: "Secure Booking",
    description: "Every booking is protected with 256-bit SSL encryption and our best-price guarantee."
  },
  {
    icon: '<i class="fa-solid fa-clock"></i>',
    title: "24/7 Support",
    description: "Our expert travel concierge team is available around the clock, every day of the year."
  },
  {
    icon: '<i class="fa-solid fa-plane-departure"></i>',
    title: "Flexible Cancellation",
    description: "Plans change — cancel or modify your booking up to 48 hours before with no penalties."
  },
  {
    icon: '<i class="fa-solid fa-gem"></i>',
    title: "Exclusive Deals",
    description: "Members-only rates, flash sales and partner perks you won't find anywhere else."
  },
  {
    icon: '<i class="fa-solid fa-map-location-dot"></i>',
    title: "Expert Curation",
    description: "Every destination and hotel is personally vetted by our team of seasoned travellers."
  },
  {
    icon: '<i class="fa-solid fa-globe"></i>',
    title: "Global Network",
    description: "150+ destinations and 1,200+ hotels across all 7 continents — the world is yours."
  }
];
