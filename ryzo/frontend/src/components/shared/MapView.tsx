'use client';

import { useEffect, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, Polyline, Marker } from '@react-google-maps/api';
import { darkMapStyle, defaultMapOptions, MOCK_ROUTES, STOP_LOCATIONS } from '@/lib/maps';
import { motion } from 'framer-motion';
import type { OrderStop } from '@/types/order';

interface MapViewProps {
  variant: 'comparison' | 'navigation';
  riderPosition?: { lat: number; lng: number };
  stops?: OrderStop[];
  routes?: {
    zomatoOnly?: google.maps.LatLngLiteral[];
    rapidoOnly?: google.maps.LatLngLiteral[];
    ryzoOptimized?: google.maps.LatLngLiteral[];
  };
}

export default function MapView({ variant, riderPosition, stops, routes }: MapViewProps) {
  // Check if API key is configured
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const hasValidKey = apiKey && apiKey !== 'your_google_maps_key' && apiKey.length > 20;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: hasValidKey ? apiKey : '',
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (variant === 'comparison' && isLoaded) {
      // Animate polylines drawing
      const duration = 1000; // 1 second
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setAnimationProgress(progress);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [variant, isLoaded]);

  const onLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  const onUnmount = () => {
    setMap(null);
  };

  if (loadError || !hasValidKey) {
    return (
      <div className="w-full h-[200px] rounded-2xl bg-ryzo-surface-2 border border-ryzo-border flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-ryzo-text-secondary text-[12px] mb-2">
            {!hasValidKey ? '🗺️ Google Maps API key not configured' : 'Map failed to load'}
          </p>
          {!hasValidKey && (
            <p className="text-ryzo-text-muted text-[10px]">
              Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[200px] rounded-2xl bg-ryzo-surface-2 border border-ryzo-border flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-ryzo-orange border-t-transparent rounded-full animate-spin" />
          <p className="text-ryzo-text-secondary text-[12px]">Loading map...</p>
        </div>
      </div>
    );
  }

  // Calculate center and zoom based on variant
  const center = variant === 'comparison'
    ? { lat: 23.2300, lng: 77.4300 } // Center of Bhopal routes
    : riderPosition || { lat: 23.2400, lng: 77.4300 };

  const zoom = variant === 'comparison' ? 13 : 14;

  // Use provided routes or fallback to mock routes
  const actualRoutes = routes || MOCK_ROUTES;

  // Calculate animated path lengths
  const getAnimatedPath = (path: google.maps.LatLngLiteral[]) => {
    const targetIndex = Math.floor(path.length * animationProgress);
    return path.slice(0, Math.max(1, targetIndex));
  };

  return (
    <div className={`w-full ${variant === 'comparison' ? 'h-[200px] rounded-2xl' : 'h-[200px]'} overflow-hidden relative`}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          ...defaultMapOptions,
          styles: darkMapStyle,
        }}
      >
        {variant === 'comparison' && (
          <>
            {/* Zomato route - red dashed */}
            {actualRoutes.zomatoOnly && (
              <Polyline
                path={getAnimatedPath(actualRoutes.zomatoOnly)}
                options={{
                  strokeColor: '#E23744',
                  strokeOpacity: 0.7,
                  strokeWeight: 2,
                  geodesic: true,
                  icons: [
                    {
                      icon: {
                        path: 'M 0,-1 0,1',
                        strokeOpacity: 1,
                        scale: 3,
                      },
                      offset: '0',
                      repeat: '12px',
                    },
                  ],
                }}
              />
            )}

            {/* Rapido route - yellow dashed */}
            {actualRoutes.rapidoOnly && (
              <Polyline
                path={getAnimatedPath(actualRoutes.rapidoOnly)}
                options={{
                  strokeColor: '#fcfc03',
                  strokeOpacity: 0.7,
                  strokeWeight: 2,
                  geodesic: true,
                  icons: [
                    {
                      icon: {
                        path: 'M 0,-1 0,1',
                        strokeOpacity: 1,
                        scale: 3,
                      },
                      offset: '0',
                      repeat: '12px',
                    },
                  ],
                }}
              />
            )}

            {/* RYZO AI route - orange solid thick glowing */}
            {actualRoutes.ryzoOptimized && (
              <>
                {/* Glow effect */}
                <Polyline
                  path={getAnimatedPath(actualRoutes.ryzoOptimized)}
                  options={{
                    strokeColor: '#FC8019',
                    strokeOpacity: 0.3,
                    strokeWeight: 8,
                    geodesic: true,
                  }}
                />
                {/* Main line */}
                <Polyline
                  path={getAnimatedPath(actualRoutes.ryzoOptimized)}
                  options={{
                    strokeColor: '#FC8019',
                    strokeOpacity: 1,
                    strokeWeight: 4,
                    geodesic: true,
                  }}
                />
              </>
            )}

            {/* Stop markers for comparison */}
            <Marker
              position={STOP_LOCATIONS.mcdonalds}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 6,
                fillColor: '#FC8019',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
              }}
            />
            <Marker
              position={STOP_LOCATIONS.bhelSector}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 6,
                fillColor: '#FC8019',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
              }}
            />
            <Marker
              position={STOP_LOCATIONS.mpNagar}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 6,
                fillColor: '#1A6FE8',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
              }}
            />
            <Marker
              position={STOP_LOCATIONS.sarvadharm}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 6,
                fillColor: '#1A6FE8',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
              }}
            />
          </>
        )}

        {variant === 'navigation' && (
          <>
            {/* Dotted orange path ahead */}
            {actualRoutes.ryzoOptimized && (
              <Polyline
                path={actualRoutes.ryzoOptimized}
                options={{
                  strokeColor: '#FC8019',
                  strokeOpacity: 0.8,
                  strokeWeight: 3,
                  geodesic: true,
                  icons: [
                    {
                      icon: {
                        path: 'M 0,-1 0,1',
                        strokeOpacity: 1,
                        scale: 4,
                      },
                      offset: '0',
                      repeat: '16px',
                    },
                  ],
                }}
              />
            )}

            {/* Rider position - orange animated dot */}
            {riderPosition && (
              <Marker
                position={riderPosition}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: '#FC8019',
                  fillOpacity: 1,
                  strokeColor: '#FFFFFF',
                  strokeWeight: 2,
                }}
              />
            )}

            {/* Numbered stop markers */}
            {stops && (
              <>
                <Marker
                  position={STOP_LOCATIONS.mcdonalds}
                  label={{
                    text: '1',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: 'bold',
                  }}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: stops[0]?.status === 'done' ? '#22C55E' : '#FC8019',
                    fillOpacity: 1,
                    strokeColor: '#FFFFFF',
                    strokeWeight: 2,
                  }}
                />
                <Marker
                  position={STOP_LOCATIONS.bhelSector}
                  label={{
                    text: '2',
                    color: stops[1]?.status === 'current' ? '#000000' : '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: 'bold',
                  }}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: stops[1]?.status === 'done' ? '#22C55E' : stops[1]?.status === 'current' ? '#FC8019' : '#555555',
                    fillOpacity: 1,
                    strokeColor: '#FFFFFF',
                    strokeWeight: 2,
                  }}
                />
                <Marker
                  position={STOP_LOCATIONS.mpNagar}
                  label={{
                    text: '3',
                    color: '#888888',
                    fontSize: '10px',
                    fontWeight: 'bold',
                  }}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: stops[2]?.status === 'done' ? '#22C55E' : stops[2]?.status === 'current' ? '#FC8019' : '#2A2A2A',
                    fillOpacity: 1,
                    strokeColor: stops[2]?.status === 'upcoming' ? '#888888' : '#FFFFFF',
                    strokeWeight: 2,
                  }}
                />
                <Marker
                  position={STOP_LOCATIONS.sarvadharm}
                  label={{
                    text: '4',
                    color: '#888888',
                    fontSize: '10px',
                    fontWeight: 'bold',
                  }}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: stops[3]?.status === 'done' ? '#22C55E' : stops[3]?.status === 'current' ? '#FC8019' : '#2A2A2A',
                    fillOpacity: 1,
                    strokeColor: stops[3]?.status === 'upcoming' ? '#888888' : '#FFFFFF',
                    strokeWeight: 2,
                  }}
                />
              </>
            )}
          </>
        )}
      </GoogleMap>

      {/* Legend for comparison view */}
      {variant === 'comparison' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-2 right-2 flex gap-3 bg-black/60 px-2 py-1 rounded-lg backdrop-blur-sm"
        >
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#E23744]" />
            <span className="text-[10px] text-ryzo-text-secondary">Zomato</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#fcfc03]" />
            <span className="text-[10px] text-ryzo-text-secondary">Rapido</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-ryzo-orange" />
            <span className="text-[10px] text-ryzo-text-secondary">RYZO AI</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
