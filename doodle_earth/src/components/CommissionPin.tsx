// Pin markers for commissions

// src/components/map/CommissionPin.tsx
"use client"

import React from 'react';
import { X, MapPin, Clock, Users, DollarSign, Image } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Commission = {
  id: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  title: string;
  prompt: string;
  category: string;
  currency: number;
  timeRemaining: string;
  submissionCount: number;
};

type CommissionPinProps = {
  commission: Commission;
  onClose: () => void;
};

const CommissionPin = ({ commission, onClose }: CommissionPinProps) => {
  const router = useRouter();

  const handleViewDetails = () => {
    // router.push(`/commission/${commission.id}`);
    router.push(`/drawing');
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md z-20 px-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative">
          {/* Placeholder for commission photo */}
          <div className="h-48 bg-gradient-to-br from-purple-300 via-blue-300 to-pink-300 flex items-center justify-center">
            <Image className="w-16 h-16 text-white/50" />
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-full transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Category badge */}
          <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-purple-600">
            {commission.category === 'background' ? 'Draw on Background' : 'Recreate Picture'}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {commission.title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4" />
            <span>{commission.location.name}</span>
          </div>

          <p className="text-gray-700 mb-4 line-clamp-2">
            {commission.prompt}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="font-semibold text-gray-700">{commission.timeRemaining}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-gray-700">{commission.submissionCount}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-bold">
              <DollarSign className="w-4 h-4" />
              <span>{commission.currency}</span>
            </div>
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
              onClick={handleViewDetails}
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