// Pin markers for commissions

// src/components/CommissionPin.tsx
"use client"

import React from 'react';
import { X, MapPin, Clock, Users, DollarSign, Palette } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Type for MapView's formatted commission
type FormattedCommission = {
  id: number;
  prompt: string;
  imageUrl: string;
  location: { lat: number; lng: number };
  timePosted: string;
  timeExpired: string;
  // Optional display fields
  category?: string;
  currency?: number;
  submissionCount?: number;
  userName?: string;
};

type CommissionPinProps = {
  commission: FormattedCommission;
  onClose: () => void;
};

const CommissionPin = ({ commission, onClose }: CommissionPinProps) => {
  const router = useRouter();

  const handleSubmitArt = () => {
    // Navigate to draw page with the post_id
    router.push(`/draw?postId=${commission.id}`);
  };

  const handleViewDetails = () => {
    // Navigate to commission details page
    router.push(`/commission/${commission.id}`);
  };

  // Calculate time remaining
  const getTimeRemaining = () => {
    const now = new Date();
    const expiry = new Date(commission.timeExpired);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  // Format location for display
  const getLocationName = () => {
    // You can optionally use reverse geocoding here
    // For now, just show coordinates
    return `${commission.location.lat.toFixed(4)}, ${commission.location.lng.toFixed(4)}`;
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md z-20 px-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative">
          {/* Commission Image */}
          <div className="relative h-48 bg-gradient-to-br from-purple-300 via-blue-300 to-pink-300 flex items-center justify-center">
            {commission.imageUrl ? (
              <Image 
                src={commission.imageUrl}
                alt="Commission"
                fill
                className="object-cover"
              />
            ) : (
              <Palette className="w-16 h-16 text-white/50" />
            )}
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-full transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Category badge */}
          {commission.category && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-purple-600">
              {commission.category === 'background' ? 'Draw on Background' : commission.category}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* User info */}
          {commission.userName && (
            <p className="text-sm text-gray-500 mb-2">{commission.userName}'s Commission</p>
          )}

          {/* Prompt as title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {commission.prompt || 'No prompt provided'}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4" />
            <span>{getLocationName()}</span>
          </div>

          {/* Posted date */}
          <p className="text-xs text-gray-500 mb-4">
            Posted {new Date(commission.timePosted).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="font-semibold text-gray-700">{getTimeRemaining()}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-gray-700">
                  {commission.submissionCount || 0}
                </span>
              </div>
            </div>
            {commission.currency && (
              <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-bold">
                <DollarSign className="w-4 h-4" />
                <span>{commission.currency}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleViewDetails}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition"
            >
              View Details
            </button>
            <button
              onClick={handleSubmitArt}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition shadow-lg"
            >
              Submit Art
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionPin;