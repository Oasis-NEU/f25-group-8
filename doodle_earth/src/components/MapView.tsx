// src/components/MapView.tsx
"use client"

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import CommissionPin from './CommissionPin';
import { supabase } from '@/lib/supabase/client';

interface Commission {
  post_id: number;
  image_url: string;
  location: string;
  prompt: string;
  time_posted: string;
  time_expired: string;
  user_id: number;
}

interface FormattedCommission {
  id: number;
  prompt: string;
  imageUrl: string;
  location: { lat: number; lng: number };
  timePosted: string;
  timeExpired: string;
}

const MapView = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedCommission, setSelectedCommission] = useState<FormattedCommission | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Set Mapbox token
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
    
    console.log('Initializing map...');
    console.log('Token exists:', !!mapboxgl.accessToken);

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-98.5795, 39.8283],
      zoom: 3
    });

    // Fetch commissions from Supabase and add markers
    map.current.on('load', async () => {
      console.log('Map loaded, fetching commissions...');

      try {
        const { data, error } = await supabase
          .from('Post')
          .select('*')
          .order('time_posted', { ascending: false });
        
        if (error) {
          console.error('Supabase error:', error);
          return;
        }

        console.log('Fetched commissions:', data);

        if (!data || data.length === 0) {
          console.log('No commissions found');
          return;
        }

        data.forEach((commission: Commission) => {
          if (!map.current) return;

          // Parse location string (format: "lat,lng")
          const [lat, lng] = commission.location.split(',').map(Number);

          console.log(`Adding marker at lat: ${lat}, lng: ${lng}`);

          // Create marker element
          const el = document.createElement('div');
          el.className = 'commission-marker';
          el.style.width = '30px';
          el.style.height = '30px';
          el.style.borderRadius = '50%';
          el.style.backgroundColor = '#8B5CF6';
          el.style.border = '3px solid white';
          el.style.cursor = 'pointer';
          el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

          // Add marker to map
          new mapboxgl.Marker(el)
            .setLngLat([lng, lat])
            .addTo(map.current!)
            .getElement()
            .addEventListener('click', () => {
              const formattedCommission: FormattedCommission = {
                id: commission.post_id,
                prompt: commission.prompt,
                imageUrl: commission.image_url,
                location: { lat, lng },
                timePosted: commission.time_posted,
                timeExpired: commission.time_expired
              };
              setSelectedCommission(formattedCommission);
              map.current?.flyTo({
                center: [lng, lat],
                zoom: 12,
                duration: 1000
              });
            });
        });

        console.log(`Added ${data.length} markers to map`);
      } catch (error) {
        console.error('Failed to fetch commissions:', error);
      }
    });

    console.log('Map initialized');

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <>
      <div 
        ref={mapContainer} 
        className="absolute inset-0 z-0"
        style={{ width: '100%', height: '100%' }}
      />
      
      {selectedCommission && (
        <CommissionPin
          commission={selectedCommission}
          onClose={() => setSelectedCommission(null)}
        />
      )}
    </>
  );
};

export default MapView;