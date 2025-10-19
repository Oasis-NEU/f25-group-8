// components/MapPicker.tsx
"use client"

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your Mapbox token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// Define the type for the location object
interface Location {
  lng: number;
  lat: number;
  address: string;
}

// Define the props type
interface MapPickerProps {
  onLocationSelect: (location: Location) => void;
  defaultLng?: number;  // Optional prop
  defaultLat?: number;  // Optional prop
}

export default function MapPicker({ onLocationSelect, defaultLng = -71.09, defaultLat = 42.34 }: MapPickerProps) {
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  const [lng, setLng] = useState(defaultLng);
  const [lat, setLat] = useState(defaultLat);

  // Initialize map when component loads
  useEffect(() => {
    // Don't create map twice
    if (map.current) return;

    if (!mapContainer.current) return;

    // Create the map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: 12
    });

    // Create a marker (initially hidden)
    marker.current = new mapboxgl.Marker({ color: '#FF0000' })
      .setLngLat([lng, lat])
      .addTo(map.current);

    // When user clicks on map, move marker to that location
    map.current.on('click', (event) => {
      const clickedLng = event.lngLat.lng;
      const clickedLat = event.lngLat.lat;
      
      // Update state
      setLng(clickedLng);
      setLat(clickedLat);
      
      // Move marker to clicked location
      if (marker.current) {
        marker.current.setLngLat([clickedLng, clickedLat]);
      }
    });

  }, []);

  // Function to confirm the selected location
  function confirmLocation() {
    onLocationSelect({
      lng: lng,
      lat: lat,
      address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    });
  }

  // Function to get the user's current location from the browser
  function useCurrentLocation() {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
  
    // Get the user's position
    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        // Update the map marker position
        setLng(userLng);
        setLat(userLat);
        
        // Move the marker on the map
        if (marker.current && map.current) {
          marker.current.setLngLat([userLng, userLat]);
          map.current.flyTo({ center: [userLng, userLat], zoom: 14, duration: 2000});
        }
      },
      // Error callback
      (error) => {
        alert("Could not get your location: " + error.message);
      }
    );
  }

  return (
    <div>
      {/* Map container */}
      <div 
        ref={mapContainer} 
        className="h-64 rounded-lg mb-3"
      />
      
      {/* Display selected coordinates */}
      <div className="text-center text-sm text-gray-600 mb-3">
        <p>Click on the map to select a location</p>
        <p className="font-semibold mt-1">
          Selected: {lat.toFixed(4)}, {lng.toFixed(4)}
        </p>
      </div>

      {/* Use Current Location button */}
      <button
        onClick={useCurrentLocation}
        className="
          w-full
          mb-2
          p-2
          bg-blue-500
          hover:bg-blue-600
          text-white
          rounded-lg
        "
      >
        📍 Use My Current Location
      </button>

      {/* Confirm button */}
      <button
        onClick={confirmLocation}
        className="
          w-full
          p-2
          bg-green-500
          hover:bg-green-600
          text-white
          rounded-lg
          font-semibold
        "
      >
        ✓ Confirm Location
      </button>
    </div>
  );
}