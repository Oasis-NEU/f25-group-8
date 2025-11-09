// Page where posts are created
"use client"

import React, { useState } from 'react';
import Image from 'next/image'
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapLocationPicker from '@/components/MapLocationPicker';
import MapView from '@/components/MapView';
import TopBar from '@/components/TopBar';
import HamburgerMenu from '@/components/HamburgerMenu';

// Type definition for location data
interface LocationData {
  address: string;
  lng: number;
  lat: number;
}

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
  const [showPromptDropdown, setshowPromptDropdown] = useState<boolean>(false);
  const [showLocationDropdown, setshowLocationDropdown] = useState<boolean>(false);

  // State to track selected prompt
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  // Store the actual coordinates
  const [savedLng, setSavedLng] = useState<number>(-71.09); // Default: Boston
  const [savedLat, setSavedLat] = useState<number>(42.34);

  // State for uploaded image
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // State for menu
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Function to handle when user clicks a prompt
  function handlePromptSelect(prompt: string): void {
    setSelectedPrompt(prompt);
    setshowPromptDropdown(false); // Close dropdown after selection
  }

  function handleLocationSelect(location: LocationData): void {
    setSelectedLocation(location.address);
    // SAVE the coordinates for next time
    setSavedLng(location.lng);
    setSavedLat(location.lat);
    setshowLocationDropdown(false); // Close dropdown after selection
  }

  // Handle file upload
  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  // Trigger file input click
  function triggerFileInput(): void {
    fileInputRef.current?.click();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <TopBar onMenuClick={() => setIsMenuOpen(!isMenuOpen)} />
      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      {/* Main Content */}
      <div className="pt-24 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">
              Create New Commission
            </h1>
            <p className="text-lg text-gray-600">Upload an image and customize your art request</p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Image Upload Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Image</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 mb-4 hover:border-blue-400 transition-colors">
                <Image 
                  className="mx-auto rounded-lg max-w-full h-auto"
                  src={uploadedImage || "/placeholder_image.png"}
                  width={500}
                  height={500}
                  alt="Post Image"
                />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button 
                onClick={triggerFileInput}
                className="w-full py-3 px-6 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                Upload Photo
              </button>
            </div>

            {/* Location Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Location</h2>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                <p className="text-gray-700 font-medium">
                  {selectedLocation || <span className="text-gray-500 italic">No location selected</span>}
                </p>
              </div>
              <button 
                className="w-full py-3 px-6 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                onClick={() => setshowLocationDropdown(!showLocationDropdown)}
              >
                {showLocationDropdown ? 'Close Map' : 'Choose Location'}
              </button>

              {/* Location selection menu */}
              {showLocationDropdown && (
                <div className="bg-white border-2 border-gray-300 rounded-xl shadow-lg p-4 mt-4">
                  <MapLocationPicker 
                    onLocationSelect={handleLocationSelect} 
                    defaultLng={savedLng}
                    defaultLat={savedLat}
                  />
                </div>
              )}
            </div>

            {/* Prompt Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Art Prompt</h2>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                <p className="text-gray-700 font-medium">
                  {selectedPrompt || <span className="text-gray-500 italic">No prompt selected</span>}
                </p>
              </div>
              <button 
                className="w-full py-3 px-6 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                onClick={() => setshowPromptDropdown(!showPromptDropdown)}
              >
                {showPromptDropdown ? 'Close Prompts' : 'Choose Prompt'}
              </button>
              
              {/* Dropdown menu */}
              {showPromptDropdown && (
                <div className="bg-white border-2 border-gray-300 rounded-xl shadow-lg overflow-hidden mt-4">
                  {SAMPLE_PROMPTS.map((prompt, index) => (
                    <div
                      key={index}
                      onClick={() => handlePromptSelect(prompt)}
                      className="p-4 hover:bg-blue-50 cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors font-medium text-gray-800"
                    >
                      {prompt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <button className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Create Commission
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
  
export default PostPage;