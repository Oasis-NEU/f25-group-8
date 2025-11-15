"use client"
import TopBar from '@/components/TopBar';
import HamburgerMenu from '@/components/HamburgerMenu';
import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { useSearchParams, useRouter } from 'next/navigation';

const DrawingPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const postId = searchParams.get('postId'); // Get postId from URL
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedBrush, setSelectedBrush] = useState(0);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [unlockedColors, setUnlockedColors] = useState<string[]>(['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF']);
  const [unlockedBrushes, setUnlockedBrushes] = useState<number[]>([0, 1, 2, 3, 4, 5]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [postData, setPostData] = useState<any>(null);
  const [loadingPost, setLoadingPost] = useState(true);

  // Brush definitions with fixed sizes
  const brushes = [
    { id: 0, name: 'Thin Pencil', type: 'pencil', size: 2, icon: '✏️', locked: false },
    { id: 1, name: 'Pencil', type: 'pencil', size: 4, icon: '✏️', locked: false },
    { id: 2, name: 'Thick Pencil', type: 'pencil', size: 8, icon: '✏️', locked: false },
    
    { id: 3, name: 'Fine Brush', type: 'normal', size: 3, icon: '🖌️', locked: false },
    { id: 4, name: 'Brush', type: 'normal', size: 6, icon: '🖌️', locked: false },
    { id: 5, name: 'Large Brush', type: 'normal', size: 12, icon: '🖌️', locked: false },
    { id: 6, name: 'Huge Brush', type: 'normal', size: 20, icon: '🖌️', locked: false },
    
    { id: 7, name: 'Thin Marker', type: 'marker', size: 4, icon: '🖊️', locked: true },
    { id: 8, name: 'Marker', type: 'marker', size: 8, icon: '🖊️', locked: true },
    { id: 9, name: 'Wide Marker', type: 'marker', size: 14, icon: '🖊️', locked: true },
    
    { id: 10, name: 'Spray Small', type: 'spray', size: 8, icon: '💨', locked: true },
    { id: 11, name: 'Spray Large', type: 'spray', size: 16, icon: '💨', locked: true },
    
    { id: 12, name: 'Calligraphy Pen', type: 'calligraphy', size: 5, icon: '🖋️', locked: true },
    { id: 13, name: 'Calligraphy Brush', type: 'calligraphy', size: 10, icon: '🖋️', locked: true },
    
    { id: 14, name: 'Watercolor Small', type: 'watercolor', size: 10, icon: '🎨', locked: true },
    { id: 15, name: 'Watercolor Large', type: 'watercolor', size: 20, icon: '🎨', locked: true },
    
    { id: 16, name: 'Ink Pen', type: 'ink', size: 2, icon: '🖊️', locked: true },
    { id: 17, name: 'Ink Brush', type: 'ink', size: 5, icon: '🖊️', locked: true },
    
    { id: 18, name: 'Charcoal Stick', type: 'charcoal', size: 8, icon: '⬛', locked: false },
    { id: 19, name: 'Charcoal Block', type: 'charcoal', size: 16, icon: '⬛', locked: false },
  ];

  // Color palette
  const colorPalette = [
    { name: 'Black', hex: '#000000', locked: false },
    { name: 'White', hex: '#FFFFFF', locked: false },
    { name: 'Crimson', hex: '#DC143C', locked: false },
    { name: 'Red', hex: '#FF0000', locked: false },
    { name: 'Brick Red', hex: '#CB4154', locked: true },
    { name: 'Rose', hex: '#FF007F', locked: true },
    { name: 'Coral', hex: '#FF7F50', locked: true },
    { name: 'Sunset Orange', hex: '#FF4500', locked: true },
    { name: 'Tangerine', hex: '#FF8C00', locked: false },
    { name: 'Marigold', hex: '#FFA500', locked: true },
    { name: 'Gold', hex: '#FFD700', locked: true },
    { name: 'Yellow', hex: '#FFFF00', locked: false },
    { name: 'Lime', hex: '#00FF00', locked: false },
    { name: 'Grass', hex: '#7CFC00', locked: true },
    { name: 'Forest', hex: '#228B22', locked: true },
    { name: 'Emerald', hex: '#50C878', locked: true },
    { name: 'Mint', hex: '#98FF98', locked: true },
    { name: 'Teal', hex: '#008080', locked: true },
    { name: 'Turquoise', hex: '#40E0D0', locked: true },
    { name: 'Cyan', hex: '#00FFFF', locked: true },
    { name: 'Sky Blue', hex: '#87CEEB', locked: true },
    { name: 'Blue', hex: '#0000FF', locked: false },
    { name: 'Royal Blue', hex: '#4169E1', locked: true },
    { name: 'Navy', hex: '#000080', locked: true },
    { name: 'Indigo', hex: '#4B0082', locked: true },
    { name: 'Violet', hex: '#8B00FF', locked: true },
    { name: 'Purple', hex: '#800080', locked: true },
    { name: 'Magenta', hex: '#FF00FF', locked: true },
    { name: 'Hot Pink', hex: '#FF69B4', locked: true },
    { name: 'Bubblegum', hex: '#FFB6C1', locked: true },
    { name: 'Peach', hex: '#FFDAB9', locked: true },
    { name: 'Beige', hex: '#F5F5DC', locked: true },
    { name: 'Tan', hex: '#D2B48C', locked: true },
    { name: 'Brown', hex: '#8B4513', locked: true },
    { name: 'Chocolate', hex: '#D2691E', locked: true },
    { name: 'Mahogany', hex: '#C04000', locked: true },
    { name: 'Slate', hex: '#708090', locked: true },
    { name: 'Steel', hex: '#71797E', locked: true },
    { name: 'Charcoal', hex: '#36454F', locked: true },
    { name: 'Silver', hex: '#C0C0C0', locked: true },
  ];

  // Fetch post data on mount
  useEffect(() => {
    if (postId) {
      fetchPostData();
    } else {
      setLoadingPost(false);
    }
  }, [postId]);

  const fetchPostData = async () => {
    if (!postId) return;
    
    try {
      setLoadingPost(true);
      const { data, error } = await supabase
        .from('Post')
        .select('*')
        .eq('post_id', postId)
        .single();

      if (error) {
        console.error('Error fetching post:', error);
      } else {
        setPostData(data);
        console.log('Fetched post data:', data);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoadingPost(false);
    }
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  }, []);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const brush = brushes[selectedBrush];
    const brushSize = brush.size;
    const brushType = brush.type;

    switch (brushType) {
      case 'normal':
        ctx.lineTo(x, y);
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        break;

      case 'spray':
        const density = 20;
        for (let i = 0; i < density; i++) {
          const offsetX = (Math.random() - 0.5) * brushSize * 2;
          const offsetY = (Math.random() - 0.5) * brushSize * 2;
          ctx.fillStyle = selectedColor;
          ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
        }
        break;

      case 'calligraphy':
        ctx.lineTo(x, y);
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = brushSize * 1.5;
        ctx.lineCap = 'square';
        ctx.lineJoin = 'miter';
        ctx.stroke();
        break;

      case 'marker':
        ctx.lineTo(x, y);
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = brushSize * 1.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 0.7;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
        break;

      case 'pencil':
        const pencilDensity = 5;
        for (let i = 0; i < pencilDensity; i++) {
          const offsetX = (Math.random() - 0.5) * brushSize * 0.5;
          const offsetY = (Math.random() - 0.5) * brushSize * 0.5;
          ctx.fillStyle = selectedColor;
          ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
        }
        ctx.lineTo(x, y);
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = brushSize * 0.8;
        ctx.lineCap = 'round';
        ctx.stroke();
        break;

      case 'watercolor':
        ctx.shadowBlur = brushSize * 2;
        ctx.shadowColor = selectedColor;
        ctx.fillStyle = selectedColor;
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
        break;

      case 'ink':
        ctx.lineTo(x, y);
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = Math.max(1, brushSize * 0.5);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        break;

      case 'charcoal':
        const charcoalDensity = 15;
        for (let i = 0; i < charcoalDensity; i++) {
          const offsetX = (Math.random() - 0.5) * brushSize * 1.5;
          const offsetY = (Math.random() - 0.5) * brushSize * 1.5;
          const alpha = Math.random() * 0.3 + 0.1;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = selectedColor;
          ctx.fillRect(x + offsetX, y + offsetY, 2, 2);
        }
        ctx.globalAlpha = 1.0;
        break;
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const undo = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const newStep = historyStep - 1;
      ctx.putImageData(history[newStep], 0, 0);
      setHistoryStep(newStep);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const newStep = historyStep + 1;
      ctx.putImageData(history[newStep], 0, 0);
      setHistoryStep(newStep);
    }
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'my-drawing.png';
    link.href = dataUrl;
    link.click();
  };

  // Submit drawing to Supabase
  const submitDrawing = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check if postId exists
    if (!postId) {
      alert('No commission selected. Please navigate from a commission.');
      router.push('/commission');
      return;
    }

    // Check if user is logged in using localStorage
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
      alert('You must be logged in to submit a drawing');
      router.push('/login');
      return;
    }

    const userData = JSON.parse(currentUser);

    setIsSubmitting(true);

    try {
      // Convert canvas to base64 image
      const imageDataUrl = canvas.toDataURL('image/png');

      // Insert into Entry table with dynamic post_id
      const { data, error } = await supabase
        .from('Entry')
        .insert([
          {
            image_url: imageDataUrl,
            user_id: userData.user_id,
            post_id: parseInt(postId), // Use dynamic postId from URL
            comp_winner: false,
          }
        ]);

      if (error) {
        console.error('Error submitting drawing:', error);
        alert('Failed to submit drawing: ' + error.message);
      } else {
        // Show success popup
        setShowSuccessPopup(true);
        
        // Redirect to home after 2 seconds
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting');
    } finally {
      setIsSubmitting(false);
    }
  };

  const unlockBrush = (brushId: number) => {
    if (!unlockedBrushes.includes(brushId)) {
      setUnlockedBrushes([...unlockedBrushes, brushId]);
      alert('Brush unlocked! (In real app, this would cost currency)');
    }
  };

  const unlockColor = (colorHex: string) => {
    if (!unlockedColors.includes(colorHex)) {
      setUnlockedColors([...unlockedColors, colorHex]);
      alert('Color unlocked! (In real app, this would cost currency)');
    }
  };

  const isBrushUnlocked = (brushId: number) => {
    return unlockedBrushes.includes(brushId);
  };

  const isColorUnlocked = (colorHex: string) => {
    return unlockedColors.includes(colorHex);
  };

  // Show error state if no postId
  if (!postId) {
    return (
      <div className="min-h-screen bg-gray-100">
        <TopBar onMenuClick={() => setIsMenuOpen(true)} />
        <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Commission Selected</h2>
            <p className="text-gray-600 mb-6">Please select a commission to start drawing.</p>
            <button
              onClick={() => router.push('/commission')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition"
            >
              Browse Commissions
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Top Navigation Bar */}
      <TopBar onMenuClick={() => setIsMenuOpen(true)} />

      {/* Hamburger Menu */}
      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <div className="max-w-7xl mx-auto pt-20">
        <h1 className="text-3xl font-bold mb-4 text-center">Drawing Studio</h1>

        <div className="flex gap-4 justify-center">
          {/* Left Sidebar - Brush Menu */}
          <div className="w-48 bg-white rounded-lg shadow-lg p-3">
            <h2 className="text-lg font-bold mb-3 text-center">🖌️ Brushes</h2>
            <div className="space-y-1 max-h-[1000px] overflow-y-auto">
              {brushes.map((brush) => {
                const unlocked = isBrushUnlocked(brush.id);
                const isActive = selectedBrush === brush.id;
                
                return (
                  <button
                    key={brush.id}
                    onClick={() => {
                      if (unlocked) {
                        setSelectedBrush(brush.id);
                      } else {
                        unlockBrush(brush.id);
                      }
                    }}
                    className={`w-full p-2 rounded-lg border-2 transition-all text-left ${
                      isActive
                        ? 'border-blue-500 bg-blue-50'
                        : unlocked
                        ? 'border-gray-200 hover:border-gray-400 bg-white'
                        : 'border-gray-200 bg-gray-100 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{brush.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate">{brush.name}</div>
                        <div className="text-xs text-gray-500">{brush.size}px</div>
                      </div>
                      {!unlocked && <span className="text-sm">🔒</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center - Canvas and Controls */}
          <div className="flex flex-col items-center">
            {/* Top Image - Loading or Post Image */}
            {loadingPost ? (
              <div className="w-[500px] h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Loading commission...</p>
              </div>
            ) : postData?.image_url ? (
              <img 
                className="max-w-md mx-auto rounded-lg shadow-lg"
                src={postData.image_url}
                width={500}
                height={500}
                alt="Commission Image"
              />
            ) : (
              <div className="w-[500px] h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}

            <h1 className="text-xl font-bold my-4 text-center">
              {loadingPost ? 'Loading...' : postData?.prompt || 'No prompt available'}
            </h1>

            {/* Canvas */}
            <div className="bg-white rounded-lg shadow-lg p-4 relative">

                <div className="absolute top-6 right-6 z-10 flex gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md">
                <button 
                  onClick={undo}
                  disabled={historyStep <= 0}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-bold text-xl font-large"
                >
                  ↶
                </button>
                <button 
                  onClick={redo}
                  disabled={historyStep >= history.length - 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-xl font-medium"
                >
                  ↷
                </button>
                <button 
                  onClick={clearCanvas}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-medium"
                >
                  🗑️
                </button>
                <button 
                  onClick={saveDrawing}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm font-medium"
                >
                  💾
                </button>
              </div>

              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="border-2 border-gray-300 rounded cursor-crosshair"
              />
              
            </div>

            {/* Submit Button */}
            <button
              onClick={submitDrawing}
              disabled={isSubmitting}
              className="mt-4 w-full max-w-2xl py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? '✨ Submitting...' : '🎨 Post Submission'}
            </button>
 
          </div>


          {/* Right Sidebar - Color Picker */}
          <div className="w-56 bg-white rounded-lg shadow-lg p-3">
            <h2 className="text-lg font-bold mb-3 text-center">🎨 Colors</h2>
            
            {/* Current Color Display */}
            <div className="mb-3 p-2 bg-gray-50 rounded-lg">
              <div className="text-xs font-medium mb-1">Current</div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-10 h-10 rounded border-2 border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: selectedColor }}
                />
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">
                    {colorPalette.find(c => c.hex === selectedColor)?.name || 'Custom'}
                  </div>
                  <div className="text-xs text-gray-600">{selectedColor}</div>
                </div>
              </div>
            </div>

            {/* Color Grid */}
            <div className="grid grid-cols-4 gap-2 max-h-[1000px] overflow-y-auto pr-1">
              {colorPalette.map((color) => {
                const unlocked = isColorUnlocked(color.hex);
                const isActive = selectedColor === color.hex;
                
                return (
                  <div
                    key={color.hex}
                    className="relative group"
                    title={color.name}
                  >
                    <button
                      onClick={() => {
                        if (unlocked) {
                          setSelectedColor(color.hex);
                        } else {
                          unlockColor(color.hex);
                        }
                      }}
                      className={`w-full aspect-square rounded-lg border-2 transition-all relative ${
                        isActive
                          ? 'border-blue-500 scale-110'
                          : 'border-gray-300 hover:scale-105'
                      } ${!unlocked ? 'opacity-40' : ''}`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {!unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg drop-shadow-lg">🔒</span>
                        </div>
                      )}
                    </button>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {color.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center animate-bounce">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Success!</h2>
            <p className="text-gray-600">Drawing submitted successfully!</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting to map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrawingPage;