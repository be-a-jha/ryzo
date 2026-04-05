'use client';

import { useEffect } from 'react';
import { connectSpacetimeDB } from '@/lib/spacetimedb';
import { useMatchTrigger } from '@/hooks/useSpacetimeDB';

export default function SpacetimeInitializer() {
  // Connect to SpacetimeDB on mount
  useEffect(() => {
    if (typeof window === 'undefined') return; // Only run on client
    
    try {
      connectSpacetimeDB();
      console.log('[SpacetimeInitializer] Connection initiated');
    } catch (error) {
      console.error('[SpacetimeInitializer] Connection failed:', error);
    }
  }, []);
  
  // Listen for both orders and trigger match
  useMatchTrigger();

  return null; // This component doesn't render anything
}
