// Dark map style JSON for all map instances
// Applies apple-like dark aesthetic to Google Maps

export const darkMapStyle: google.maps.MapTypeStyle[] = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#1A1A1A' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#0D0D0D' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#888888' }],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#FFFFFF' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#888888' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#0D0D0D' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#555555' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#2A2A2A' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1E1E1E' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#888888' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#2A2A2A' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1E1E1E' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#FFFFFF' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#111111' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#888888' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0D0D0D' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#555555' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#0D0D0D' }],
  },
];

export const defaultMapOptions: google.maps.MapOptions = {
  styles: darkMapStyle,
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  gestureHandling: 'greedy',
};

// Mock route coordinates for Bhopal demo
export const MOCK_ROUTES = {
  swiggyOnly: [
    { lat: 23.2599, lng: 77.4126 }, // McDonald's
    { lat: 23.2450, lng: 77.4300 },
    { lat: 23.2350, lng: 77.4450 },
    { lat: 23.2156, lng: 77.4395 }, // BHEL Sector
  ],
  rapidoOnly: [
    { lat: 23.2400, lng: 77.4500 }, // MP Nagar
    { lat: 23.2300, lng: 77.4400 },
    { lat: 23.2200, lng: 77.4300 },
    { lat: 23.2100, lng: 77.4200 }, // Sarvadharm
  ],
  ryzoOptimized: [
    { lat: 23.2599, lng: 77.4126 }, // McDonald's (pickup food)
    { lat: 23.2500, lng: 77.4200 },
    { lat: 23.2400, lng: 77.4300 },
    { lat: 23.2400, lng: 77.4500 }, // MP Nagar (pickup rider)
    { lat: 23.2300, lng: 77.4400 },
    { lat: 23.2156, lng: 77.4395 }, // BHEL Sector (drop food)
    { lat: 23.2150, lng: 77.4300 },
    { lat: 23.2100, lng: 77.4200 }, // Sarvadharm (drop rider)
  ],
};

export const STOP_LOCATIONS = {
  mcdonalds: { lat: 23.2599, lng: 77.4126 },
  bhelSector: { lat: 23.2156, lng: 77.4395 },
  mpNagar: { lat: 23.2400, lng: 77.4500 },
  sarvadharm: { lat: 23.2100, lng: 77.4200 },
};
