// src/app/page.tsx
"use client"

import React, { useState } from 'react';
import MapView from '@/components/MapView';
import TopBar from '@/components/TopBar';
import HamburgerMenu from '@/components/HamburgerMenu';
import CommissionCard from '@/components/CommissionCard';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function HomePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedCommission, setSelectedCommission] = useState(null);

    return (
        <div className="relative h-screen w-screen overflow-hidden">
          {/* Top Navigation Bar */}
          <TopBar onMenuClick={() => setIsMenuOpen(true)} />

          {/* Hamburger Menu */}
          <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          
          {/* Map View */}
          <MapView />

          {/* Card - positioned absolutely on top of map */}
          <div className="absolute bottom-0 right-0 z-10 
              bg-white rounded-t-lg shadow-lg 
              max-w-md my-auto mb-4">
              <CommissionCard />
          </div>
          
        </div>
    );
}


/*
User clicks hamburger button 
  ↓
Button's built-in onClick fires
  ↓
Runs onMenuClick (the prop)
  ↓
onMenuClick is actually () => setIsMenuOpen(true)
  ↓
setIsMenuOpen(true) runs
  ↓
isMenuOpen becomes true
  ↓
React re-renders
  ↓
HamburgerMenu sees isOpen={true} and slides into view
*/