// src/app/page.tsx
"use client"

import React, { useState } from 'react';
import MapView from '@/components/map/MapView';
import TopBar from '@/components/navigation/TopBar';
import HamburgerMenu from '@/components/navigation/HamburgerMenu';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function HomePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="relative h-screen w-screen overflow-hidden">
        {/* Top Navigation Bar */}
        <TopBar onMenuClick={() => setIsMenuOpen(true)} />

        {/* Hamburger Menu */}
        <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        {/* Map View */}
        <MapView />

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