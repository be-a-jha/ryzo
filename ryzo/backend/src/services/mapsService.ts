import axios from 'axios';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

interface Location {
  lat: number;
  lng: number;
}

interface RouteStep {
  lat: number;
  lng: number;
  instruction: string;
  distance: string;
  duration: string;
}

interface RouteResult {
  success: boolean;
  distance?: string;
  duration?: string;
  steps?: RouteStep[];
  polyline?: string;
  error?: string;
}

/**
 * Get directions between multiple waypoints using Google Maps Directions API
 */
export async function getDirections(
  origin: Location,
  destination: Location,
  waypoints?: Location[]
): Promise<RouteResult> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('Google Maps API key not configured');
    return fallbackRoute(origin, destination, waypoints);
  }

  try {
    const waypointsParam = waypoints
      ? waypoints.map((w) => `${w.lat},${w.lng}`).join('|')
      : '';

    const url = 'https://maps.googleapis.com/maps/api/directions/json';
    const params = {
      origin: `${origin.lat},${origin.lng}`,
      destination: `${destination.lat},${destination.lng}`,
      waypoints: waypointsParam || undefined,
      mode: 'driving',
      key: GOOGLE_MAPS_API_KEY,
    };

    const response = await axios.get(url, { params, timeout: 5000 });

    if (response.data.status !== 'OK') {
      throw new Error(`Google Maps API error: ${response.data.status}`);
    }

    const route = response.data.routes[0];
    const leg = route.legs[0];

    // Extract turn-by-turn steps
    const steps: RouteStep[] = leg.steps.map((step: any) => ({
      lat: step.end_location.lat,
      lng: step.end_location.lng,
      instruction: step.html_instructions.replace(/<[^>]*>/g, ''), // Strip HTML
      distance: step.distance.text,
      duration: step.duration.text,
    }));

    return {
      success: true,
      distance: leg.distance.text,
      duration: leg.duration.text,
      steps,
      polyline: route.overview_polyline.points,
    };
  } catch (error) {
    console.error('Google Maps API error:', error);
    return fallbackRoute(origin, destination, waypoints);
  }
}

/**
 * Fallback route calculation when API is unavailable
 * Uses simple straight-line distance
 */
function fallbackRoute(
  origin: Location,
  destination: Location,
  waypoints?: Location[]
): RouteResult {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Calculate total distance
  let totalDistance = 0;
  let currentPoint = origin;

  if (waypoints) {
    for (const waypoint of waypoints) {
      totalDistance += haversine(
        currentPoint.lat,
        currentPoint.lng,
        waypoint.lat,
        waypoint.lng
      );
      currentPoint = waypoint;
    }
  }

  totalDistance += haversine(
    currentPoint.lat,
    currentPoint.lng,
    destination.lat,
    destination.lng
  );

  // Estimate duration (assuming 30 km/h average speed)
  const durationMinutes = Math.round((totalDistance / 30) * 60);

  // Generate simple steps
  const steps: RouteStep[] = [];

  if (waypoints) {
    waypoints.forEach((waypoint, index) => {
      steps.push({
        lat: waypoint.lat,
        lng: waypoint.lng,
        instruction: `Continue to waypoint ${index + 1}`,
        distance: `${(totalDistance / (waypoints.length + 1)).toFixed(1)} km`,
        duration: `${Math.round(durationMinutes / (waypoints.length + 1))} min`,
      });
    });
  }

  steps.push({
    lat: destination.lat,
    lng: destination.lng,
    instruction: 'Arrive at destination',
    distance: `${totalDistance.toFixed(1)} km`,
    duration: `${durationMinutes} min`,
  });

  return {
    success: true,
    distance: `${totalDistance.toFixed(1)} km`,
    duration: `${durationMinutes} min`,
    steps,
    polyline: '', // No polyline in fallback
  };
}

/**
 * Get distance matrix between multiple origins and destinations
 */
export async function getDistanceMatrix(
  origins: Location[],
  destinations: Location[]
): Promise<number[][]> {
  if (!GOOGLE_MAPS_API_KEY) {
    // Fallback: calculate straight-line distances
    return origins.map((origin) =>
      destinations.map((dest) => {
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const R = 6371;
        const dLat = toRad(dest.lat - origin.lat);
        const dLon = toRad(dest.lng - origin.lng);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(origin.lat)) *
            Math.cos(toRad(dest.lat)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      })
    );
  }

  try {
    const url = 'https://maps.googleapis.com/maps/api/distancematrix/json';
    const params = {
      origins: origins.map((o) => `${o.lat},${o.lng}`).join('|'),
      destinations: destinations.map((d) => `${d.lat},${d.lng}`).join('|'),
      mode: 'driving',
      key: GOOGLE_MAPS_API_KEY,
    };

    const response = await axios.get(url, { params, timeout: 5000 });

    if (response.data.status !== 'OK') {
      throw new Error(`Distance Matrix API error: ${response.data.status}`);
    }

    return response.data.rows.map((row: any) =>
      row.elements.map((element: any) =>
        element.status === 'OK' ? element.distance.value / 1000 : Infinity
      )
    );
  } catch (error) {
    console.error('Distance Matrix API error:', error);
    // Return fallback
    return origins.map((origin) =>
      destinations.map((dest) => {
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const R = 6371;
        const dLat = toRad(dest.lat - origin.lat);
        const dLon = toRad(dest.lng - origin.lng);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(origin.lat)) *
            Math.cos(toRad(dest.lat)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      })
    );
  }
}
