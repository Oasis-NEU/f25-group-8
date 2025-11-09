// Side navigation menu

// src/components/navigation/HamburgerMenu.tsx
"use client"

import React, { useState, useEffect } from 'react';
import { X, Home, User, PlusCircle, Settings, Trophy, Map, Menu} from 'lucide-react';
import { useRouter } from 'next/navigation';

type HamburgerMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const HamburgerMenu = ({ isOpen, onClose }: HamburgerMenuProps) => {
  const router = useRouter();
  const [username, setUsername] = useState('Guest');

  useEffect(() => {
    loadUserData();
  }, [isOpen]); // Reload when menu opens

  const loadUserData = () => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      setUsername(userData.Username || 'Guest');
    }
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: PlusCircle, label: 'Create Commission', path: '/post' },
    // { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Close menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* User Info Section */}
        <div className="p-6 border-b bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{username}</h3>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className="flex items-center gap-4 w-full p-4 hover:bg-gray-50 rounded-lg transition group"
            >
              <item.icon className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition" />
              <span className="font-medium text-gray-700 group-hover:text-purple-600 transition">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            DoodleEarth v1.0
          </p>
          <p className="text-xs text-gray-400 text-center mt-1">
            Explore. Create. Win.
          </p>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;