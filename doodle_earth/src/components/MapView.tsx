"use client"

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import CommissionPin from './CommissionPin';
import { supabase } from '@/lib/supabase/client';

type Commission = {
  id: number;
  location: { lat: number; lng: number; name: string };
  title: string;
  prompt: string;
  category: string;
  currency: number;
  timeRemaining: string;
  submissionCount: number;
  image_url: string;
};

const MapView = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch commissions from Supabase
  useEffect(() => {
    fetchCommissions();
  }, []);

  async function fetchCommissions() {
    try {
      const { data, error } = await supabase
        .from('Post')
        .select('*')
        .order('time_posted', { ascending: false });

      if (error) throw error;

      // Transform data to match Commission type
      const formattedCommissions = data?.map((post: any) => {
        // Parse location string to get lat/lng
        // Assuming location is stored as "lat, lng" or just an address
        const locationParts = post.location.split(',').map((s: string) => s.trim());
        let lat = 42.3601; // Default to Boston
        let lng = -71.0589;
        
        // Try to parse coordinates from location string
        if (locationParts.length >= 2) {
          const parsedLat = parseFloat(locationParts[0]);
          const parsedLng = parseFloat(locationParts[1]);
          if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
            lat = parsedLat;
            lng = parsedLng;
          }
        }

        // Calculate time remaining
        const timeExpired = new Date(post.time_expired);
        const now = new Date();
        const hoursRemaining = Math.max(0, Math.floor((timeExpired.getTime() - now.getTime()) / (1000 * 60 * 60)));

        return {
          id: post.post_id,
          location: {
            lat: lat,
            lng: lng,
            name: post.location
          },
          title: `Commission #${post.post_id}`,
          prompt: post.prompt,
          category: 'background',
          currency: 500, // You can add this to your Post table
          timeRemaining: `${hoursRemaining}h`,
          submissionCount: 0, // You'll need to count from Entry table
          image_url: post.image_url
        };
      }) || [];

      setCommissions(formattedCommissions);
    } catch (error) {
      console.error('Error fetching commissions:', error);
    } finally {
      setLoading(false);
    }
  }

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
      console.log('Map loaded');
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add markers when commissions are loaded
  useEffect(() => {
    if (!map.current || loading || commissions.length === 0) return;

    console.log('Adding markers for', commissions.length, 'commissions');

    commissions.forEach((commission) => {
      if (!map.current) return;

      // Create marker element
      const el = document.createElement('div');
      el.className = 'commission-marker';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#8B5CF6';
      el.style.border = '3px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.transition = 'all 0.3s ease';

      // Add hover effect
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
        el.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      });

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
  }, [commissions, loading]);

  return (
    <>
      <div 
        ref={mapContainer} 
        className="absolute inset-0 z-0"
        style={{ width: '100%', height: '100%' }}
      />
      
      {loading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg z-10">
          <p className="text-gray-600">Loading commissions...</p>
        </div>
      )}
      
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