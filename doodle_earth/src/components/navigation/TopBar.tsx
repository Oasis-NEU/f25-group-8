// Top bar with profile/menu buttons

// src/components/navigation/TopBar.tsx
"use client"

import React from 'react';
import { Menu, User, PlusCircle, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

type TopBarProps = {
  onMenuClick: () => void;
};

const TopBar = ({ onMenuClick }: TopBarProps) => {
  const router = useRouter();

  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Hamburger Menu */}
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Open menu" /* Accessibility feature if using screen reader */
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        {/* Center: Logo/Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            DoodleEarth
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Currency Display */}
          <div className="hidden sm:flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-semibold text-sm">
            <DollarSign className="w-4 h-4" />
            <span>2,450</span>
          </div>

          {/* Create Commission Button */}
          <button
            onClick={() => router.push('/post')}
            className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            aria-label="Create commission"
          >
            <PlusCircle className="w-5 h-5" />
          </button>

          {/* Profile Button */}
          <button
            onClick={() => router.push('/profile')}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="View profile"
          >
            <User className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;