"use client"

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import CommissionPin from './map/CommissionPin';

const mockCommissions = [
  {
    id: 'c1',
    location: { lat: 37.7749, lng: -122.4194, name: 'San Francisco, CA' },
    title: 'Golden Gate Sunset',
    prompt: 'Add a dragon flying over the bridge',
    category: 'background',
    currency: 500,
    timeRemaining: '12h',
    submissionCount: 8
  },
  {
    id: 'c2',
    location: { lat: 42.3601, lng: -71.0589, name: 'Boston Common, MA' },
    title: 'Historic Park Scene',
    prompt: 'Add Revolutionary War soldiers marching through',
    category: 'background',
    currency: 650,
    timeRemaining: '18h',
    submissionCount: 12
  },
  {
    id: 'c3',
    location: { lat: 42.3736, lng: -71.1097, name: 'Harvard Square, MA' },
    title: 'Academic Atmosphere',
    prompt: 'Recreate in anime style',
    category: 'recreate',
    currency: 800,
    timeRemaining: '5h',
    submissionCount: 23
  },
  {
    id: 'c4',
    location: { lat: 42.3555, lng: -71.0603, name: 'Boston Harbor, MA' },
    title: 'Waterfront Sunset',
    prompt: 'Add sailing ships from the 1800s',
    category: 'background',
    currency: 550,
    timeRemaining: '30h',
    submissionCount: 7
  },
  {
    id: 'c5',
    location: { lat: 42.3467, lng: -71.0972, name: 'Fenway Park, MA' },
    title: 'Game Day Energy',
    prompt: 'Use only red and blue colors',
    category: 'recreate',
    currency: 900,
    timeRemaining: '2h',
    submissionCount: 34
  },
  {
    id: 'c6',
    location: { lat: 42.3519, lng: -71.0552, name: 'North End, MA' },
    title: 'Little Italy Vibes',
    prompt: 'Add gondolas in the streets (Venice style)',
    category: 'background',
    currency: 600,
    timeRemaining: '15h',
    submissionCount: 9
  }
];

const MapView = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedCommission, setSelectedCommission] = useState<typeof mockCommissions[0] | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Set Mapbox token
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
    
    console.log('Initializing map...'); // Debug log
    console.log('Token exists:', !!mapboxgl.accessToken); // Debug log

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-98.5795, 39.8283],
      zoom: 3
    });

    // Wait for map to load, then add markers
    map.current.on('load', () => {
        console.log('Map loaded, adding markers...');
        
        mockCommissions.forEach((commission) => {
        if (!map.current) return;

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
            .setLngLat([commission.location.lng, commission.location.lat])
            .addTo(map.current!)
            .getElement()
            .addEventListener('click', () => {
            setSelectedCommission(commission);
            map.current?.flyTo({
                center: [commission.location.lng, commission.location.lat],
                zoom: 12,
                duration: 1000
            });
            });
        });
    });

    console.log('Map initialized'); // Debug log

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