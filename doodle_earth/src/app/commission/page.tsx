"use client"

import React, { useState, useEffect } from 'react';
import { X, Trophy } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import TopBar from '@/components/TopBar';
import HamburgerMenu from '@/components/HamburgerMenu';

type Submission = {
  id: number;
  imageUrl: string;
  artistName: string;
  isWinner: boolean;
};

const CommissionPage = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);  
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    try {
      setLoading(true);
  
      const { data, error } = await supabase
        .from('Entry')
        .select(`
          entry_id,
          image_url,
          comp_winner,
          Users!inner (
            Name,
            Username
          )
        `)
        .order('entry_id', { ascending: false });
      
      if (error) throw error;
      
      const formattedData = data?.map((item: any) => ({
        id: item.entry_id,
        imageUrl: item.image_url,
        artistName: item.Users?.Username || item.Users?.Name || 'Anonymous',
        isWinner: item.comp_winner || false
      })) || [];
      
      setSubmissions(formattedData);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  }

  const createConfetti = () => {
    const confettiCount = 150;
    const confetti = [];
    
    for (let i = 0; i < confettiCount; i++) {
      confetti.push({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 3,
        backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd93d', '#6bcf7f', '#a29bfe'][Math.floor(Math.random() * 6)]
      });
    }
    
    return confetti;
  };

  const handleDeclareWinner = async () => {
    if (!selectedSubmission) return;

    try {
      // Update the entry to mark as winner
      const { error } = await supabase
        .from('Entry')
        .update({ comp_winner: true })
        .eq('entry_id', selectedSubmission.id);

      if (error) throw error;

      console.log('Winner declared:', selectedSubmission);
      setShowConfetti(true);
      
      setTimeout(() => {
        setShowConfetti(false);
        setSelectedSubmission(null);
        fetchSubmissions(); // Refresh submissions
      }, 4000);
    } catch (error) {
      console.error('Error declaring winner:', error);
      alert('Failed to declare winner. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        .animate-confetti {
          animation: confetti-fall 3s ease-in forwards;
        }
      `}</style>

      {/* Navigation */}
      <TopBar onMenuClick={() => setIsMenuOpen(!isMenuOpen)} />
      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="pt-24 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Commission Submissions</h1>
            <p className="text-gray-600">Review and select the winning submission</p>
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading submissions...</p>
            </div>
          )}

          {/* Camera Roll Grid */}
          {!loading && submissions.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  onClick={() => setSelectedSubmission(submission)}
                  className="relative aspect-square cursor-pointer rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-105"
                >
                  <img
                    src={submission.imageUrl}
                    alt={`Submission by ${submission.artistName}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Winner Badge */}
                  {submission.isWinner && (
                    <div className="absolute top-2 right-2 bg-yellow-400 rounded-full p-2 shadow-lg">
                      <Trophy className="w-5 h-5 text-yellow-900" />
                    </div>
                  )}
                  {/* Artist Name Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-sm font-semibold truncate">
                      {submission.artistName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && submissions.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No submissions yet</p>
              <p className="text-gray-400 text-sm mt-2">Check back soon for new entries!</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Popup */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          {/* Confetti */}
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
              {createConfetti().map((piece) => (
                <div
                  key={piece.id}
                  className="absolute w-3 h-3 animate-confetti"
                  style={{
                    left: `${piece.left}%`,
                    top: '-10%',
                    backgroundColor: piece.backgroundColor,
                    animationDelay: `${piece.animationDelay}s`,
                  }}
                />
              ))}
            </div>
          )}
          
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedSubmission(null)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>

            {/* Modal Content */}
            <div className="p-6">
              {/* Submission Image */}
              <div className="rounded-lg overflow-hidden mb-6 relative">
                <img
                  src={selectedSubmission.imageUrl}
                  alt={`Submission by ${selectedSubmission.artistName}`}
                  className="w-full h-auto"
                />
                {selectedSubmission.isWinner && (
                  <div className="absolute top-4 right-4 bg-yellow-400 rounded-full p-3 shadow-lg">
                    <Trophy className="w-8 h-8 text-yellow-900" />
                  </div>
                )}
              </div>

              {/* Artist Info */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Submission by {selectedSubmission.artistName}
                </h2>
                <p className="text-gray-600">Submission ID: #{selectedSubmission.id}</p>
              </div>

              {/* Declare Winner Button */}
              {!selectedSubmission.isWinner ? (
                <button
                  onClick={handleDeclareWinner}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg shadow-lg hover:shadow-xl"
                >
                  🏆 Declare Winner
                </button>
              ) : (
                <div className="w-full bg-yellow-100 border-2 border-yellow-400 text-yellow-900 font-semibold py-4 px-6 rounded-lg text-center text-lg">
                  <Trophy className="w-6 h-6 inline-block mr-2" />
                  Winner!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommissionPage;