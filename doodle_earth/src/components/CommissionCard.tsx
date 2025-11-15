// Card that shows commission details
"use client"

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MapPin, Clock, Users, DollarSign, Palette } from 'lucide-react';

type CommissionCardProps = {
  commission: {
    post_id: number;
    image_url: string | null;
    location: string;
    prompt: string;
    time_posted: string;
    time_expired: string;
    user_id: number;
  };
  // Optional props for display
  userName?: string;
  submissionCount?: number;
  category?: string;
  currency?: number;
};

export default function CommissionCard({ 
  commission, 
  userName = 'User123',
  submissionCount = 0,
  category = 'Art',
  currency = 100
}: CommissionCardProps) {
  const router = useRouter();

  const handleSubmit = () => {
    // Navigate to draw page with the post_id
    router.push(`/draw?postId=${commission.post_id}`);
  };

  const handleViewDetails = () => {
    // Navigate to commission details page (if you have one)
    router.push(`/commission/${commission.post_id}`);
  };

  // Calculate time remaining
  const getTimeRemaining = () => {
    const now = new Date();
    const expiry = new Date(commission.time_expired);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Commission Image */}
      <div className="relative h-64 bg-gradient-to-br from-purple-400 to-blue-500">
        {commission.image_url ? (
          <Image 
            src={commission.image_url}
            alt="Commission Image"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Palette className="w-20 h-20 text-white opacity-50" />
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <span className="text-xs font-semibold text-gray-700">{category}</span>
        </div>

        {/* Currency Badge */}
        {currency && (
          <div className="absolute top-3 right-3 bg-amber-400 text-white px-3 py-1.5 rounded-full flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span className="font-bold text-sm">{currency}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* User Info */}
        <p className="text-sm text-gray-500 mb-2">{userName}'s Commission</p>
        
        {/* Prompt */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {commission.prompt || 'No prompt provided'}
        </h2>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{commission.location}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b text-sm">
          <div className="flex items-center gap-1 text-orange-500">
            <Clock className="w-4 h-4" />
            <span className="font-semibold">{getTimeRemaining()}</span>
          </div>
          <div className="flex items-center gap-1 text-blue-500">
            <Users className="w-4 h-4" />
            <span className="font-semibold">{submissionCount} entries</span>
          </div>
        </div>

        {/* Posted Date */}
        <p className="text-xs text-gray-500 mb-4">
          Posted {new Date(commission.time_posted).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleViewDetails}
            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition"
          >
            View Details
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition shadow-lg"
          >
            Submit Art
          </button>
        </div>
      </div>
    </div>
  );
}