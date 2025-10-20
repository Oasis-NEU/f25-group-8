// Page where posts are created
"use client"

import React, { useState } from 'react';
import Image from 'next/image'
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapLocationPicker from '@/components/MapLocationPicker';
import MapView from '@/components/MapView';

// Sample prompts that would come from database later
const SAMPLE_PROMPTS = [
  "Add a dragon flying in the sky",
  "Turn this into an underwater scene with fish",
  "Add a rainbow and unicorns",
  "Use only red and blues",
  "Draw contours/outlines only",
];

const PostPage = () => {
  // State to track if dropdown is visible
  const [showPromptDropdown, setshowPromptDropdown] = useState(false);
  const [showLocationDropdown, setshowLocationDropdown] = useState(false);

  // State to track selected prompt
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // ADD: Store the actual coordinates
  const [savedLng, setSavedLng] = useState(-71.09); // Default: Boston
  const [savedLat, setSavedLat] = useState(42.34);

  // Function to handle when user clicks a prompt
  function handlePromptSelect(prompt) {
    setSelectedPrompt(prompt);
    setshowPromptDropdown(false); // Close dropdown after selection
  }

  function handleLocationSelect(location) {
    setSelectedLocation(location.address);
    // SAVE the coordinates for next time
    setSavedLng(location.lng);
    setSavedLat(location.lat);
    setshowLocationDropdown(false); // Close dropdown after selection
  }

  return (
    <div>
      <div className="p-16 bg-blue-100">
        <h1 className="
          my-2 
          text-blue-600 
          text-4xl 
          font-bold 
          text-center
        ">
          Create New Commission
        </h1>
      <Image className="
        max-wd-md
        mx-auto
        "
        src="/placeholder_image.png"
        width={500}
        height={500}
      />
      <button className="
        my-2
        p-2 
        bg-sky-500 
        hover:bg-sky-700 
        rounded-lg 
        max-w-md
        mx-auto
        block
      ">
        Upload Photo
      </button>
      <div className="
        text-center
        ">
        Location: {selectedLocation || "Choose a location"}
      </div>
      <button className="
        my-2
        p-2 
        bg-sky-500 
        hover:bg-sky-700 
        rounded-lg 
        max-w-md
        mx-auto
        block
        "
        onClick={() => setshowLocationDropdown(!showLocationDropdown)}
      >
        Choose Location
      </button>


      {/* Location selection menu - only shows when showLocationDropdown is true */}
      {showLocationDropdown && (
        <div className="
          max-w-2xl
          mx-auto
          h-full
          bg-white
          border-2
          border-gray-300
          rounded-lg
          shadow-lg
          my-2
          p-4
        ">
          <MapLocationPicker 
            onLocationSelect={handleLocationSelect} 
            defaultLng={savedLng}
            defaultLat={savedLat}
          />
        </div>
      )}


      <div className="
        text-center
        ">
        Prompt: {selectedPrompt || "Choose a prompt"}
      </div>
      <button className="
        my-2
        p-2 
        bg-sky-500 
        hover:bg-sky-700 
        rounded-lg 
        max-w-md
        mx-auto
        block
        "
      onClick={() => setshowPromptDropdown(!showPromptDropdown)}
      >
        Choose Prompt
      </button>
      
      {/* Dropdown menu - only shows when showPromptDropdown is true */}
      {showPromptDropdown && (
        <div className="
          max-w-md
          mx-auto
          bg-white
          border-2
          border-gray-300
          rounded-lg
          shadow-lg
          my-2
        ">
          {SAMPLE_PROMPTS.map((prompt, index) => (
            <div
              key={index}
              onClick={() => handlePromptSelect(prompt)}
              className="
                p-3
                hover:bg-blue-100
                cursor-pointer
                border-b
                border-gray-200
                last:border-b-0
              "
            >
              {prompt}
            </div>
          ))}
        </div>
      )}

      <button className="
        my-2
        p-2 
        bg-sky-500 
        hover:bg-sky-700 
        rounded-lg 
        max-w-md
        mx-auto
        block
      ">
        Create Commission
      </button>
      </div> 
    </div>
  )}
  
export default PostPage;
