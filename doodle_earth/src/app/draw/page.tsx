// Page where drawing happens
// Generally, this page is only accessed by clicking a button (i.e. "Enter Submission") on a commission on the main map page
"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';


const DrawPage = () => {
  const router = useRouter();

  const handleDrawingComplete = () => {
    // router.push(`/commission/${commission.id}`);
    router.push(`/`)
  };

  return (
    <div>
        <div>Placeholder Draw Page</div>
        <button
            onClick={handleDrawingComplete}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition shadow-lg"
        >
            Finish Drawing
        </button>
    </div>
  )}
  
export default DrawPage;