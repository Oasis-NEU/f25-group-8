// Profile page
// @ts-nocheck
"use client"

import React, { useState, useEffect } from 'react';
import { User, Trophy, Palette, MapPin, TrendingUp, Award, Clock, DollarSign } from 'lucide-react';
import TopBar from '@/components/TopBar';
import HamburgerMenu from '@/components/HamburgerMenu';
import { supabase } from '@/lib/supabase/client';

// Add this type definition at the top of your file
type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bgColor: string;
};

type TabButtonProps = {
  active: boolean;
  onClick: () => void;
  label: string;
};

type WinCardProps = {
  win: {
    id: string;
    thumbnailUrl: string | null;
    title: string;
    location: string;
    earnedCurrency: number;
    date: string;
  };
};

type SubmissionRowProps = {
  submission: {
    id: string;
    thumbnailUrl: string | null;
    commissionTitle: string;
    location: string;
    status: 'pending' | 'won' | 'lost';
    submittedDate: string;
  };
};

type CommissionRowProps = {
  commission: {
    id: string;
    title: string;
    location: string;
    prompt: string;
    category: string;
    currency: number;
    submissionCount?: number;
    status?: string;
    created_by?: string;
  };
};

// Mock data - replace with actual API calls
const mockUserData = {
  id: 'user123',
  username: 'User123',
  profileImage: null,
  joinDate: '2025-10-12',
  bio: 'Bio goes here?',
  stats: {
    currency: 2450,
    totalSubmissions: 47,
    wins: 12,
    commissionsPosted: 8,
    winRate: 25.5,
    totalEarned: 5670,
    averageRating: 4.7
  },
  recentWins: [
    {
      id: 'c1',
      thumbnailUrl: null,
      title: 'Sunset at Golden Gate',
      location: 'San Francisco, CA',
      earnedCurrency: 500,
      date: '2024-10-05'
    },
    {
      id: 'c2',
      thumbnailUrl: null,
      title: 'Rainy Tokyo Streets',
      location: 'Tokyo, Japan',
      earnedCurrency: 750,
      date: '2024-09-28'
    },
    {
      id: 'c3',
      thumbnailUrl: null,
      title: 'Mountain Serenity',
      location: 'Swiss Alps',
      earnedCurrency: 600,
      date: '2024-09-20'
    }
  ],
  recentSubmissions: [
    {
      id: 's1',
      thumbnailUrl: null,
      commissionTitle: 'Urban Jungle',
      location: 'New York, NY',
      status: 'pending',
      submittedDate: '2024-10-10'
    },
    {
      id: 's2',
      thumbnailUrl: null,
      commissionTitle: 'Desert Dreams',
      location: 'Dubai, UAE',
      status: 'lost',
      submittedDate: '2024-10-08'
    }
  ],
  achievements: [
    { id: 'a1', name: 'First Win', icon: '🏆', unlocked: true },
    { id: 'a2', name: 'World Traveler', icon: '🌍', unlocked: true },
    { id: 'a3', name: 'Hot Streak', icon: '🔥', unlocked: false },
    { id: 'a4', name: 'Commission Master', icon: '👑', unlocked: false }
  ]
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const user = mockUserData;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userCommissions, setUserCommissions] = useState([]);
  const [loadingCommissions, setLoadingCommissions] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserCommissions();
    }
  }, [isAuthenticated]);

  const checkAuthentication = async () => {
    try {
      const currentUser = localStorage.getItem('currentUser');
      
      if (!currentUser) {
        // User is not logged in, redirect to login page
        window.location.href = '/login';
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      window.location.href = '/login';
    } finally {
      setCheckingAuth(false);
    }
  };

  const fetchUserCommissions = async () => {
    try {
      setLoadingCommissions(true);
      const currentUser = localStorage.getItem('currentUser');
      
      if (!currentUser) {
        console.log('No authenticated user');
        return;
      }

      const userData = JSON.parse(currentUser);

      const { data, error } = await supabase
        .from('commissions')
        .select('*')
        .eq('created_by', userData.user_id);

      if (error) {
        console.error('Error fetching commissions:', error);
      } else {
        setUserCommissions(data || []);
        console.log('Fetched commissions:', data);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoadingCommissions(false);
    }
  };

  // Show loading state while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render the page if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Top Navigation Bar */}
      <TopBar onMenuClick={() => setIsMenuOpen(true)} />

      {/* Hamburger Menu */}
      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <button className="px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-start gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.username} className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{user.username}</h2>
              <p className="text-gray-600 mb-4">{user.bio}</p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Joined {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{user.stats.totalSubmissions} submissions worldwide</span>
                </div>
              </div>
            </div>

            {/* Currency Display */}
            <div className="flex-shrink-0 text-right">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg">
                <DollarSign className="w-5 h-5" />
                {user.stats.currency.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-2">Available Balance</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<Trophy className="w-6 h-6 text-yellow-500" />}
            label="Total Wins"
            value={user.stats.wins}
            bgColor="bg-yellow-50"
          />
          <StatCard
            icon={<Palette className="w-6 h-6 text-purple-500" />}
            label="Submissions"
            value={user.stats.totalSubmissions}
            bgColor="bg-purple-50"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6 text-green-500" />}
            label="Win Rate"
            value={`${user.stats.winRate}%`}
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<Award className="w-6 h-6 text-blue-500" />}
            label="Total Earned"
            value={`$${user.stats.totalEarned.toLocaleString()}`}
            bgColor="bg-blue-50"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-2xl shadow-lg">
          <div className="flex border-b">
            <TabButton
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
              label="Overview"
            />
            <TabButton
              active={activeTab === 'commissions'}
              onClick={() => setActiveTab('commissions')}
              label="Commissions"
            />
            <TabButton
              active={activeTab === 'wins'}
              onClick={() => setActiveTab('wins')}
              label="Winning Submissions"
            />
            <TabButton
              active={activeTab === 'submissions'}
              onClick={() => setActiveTab('submissions')}
              label="All Submissions"
            />
            <TabButton
              active={activeTab === 'achievements'}
              onClick={() => setActiveTab('achievements')}
              label="Achievements"
            />
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab user={user} />}
            {activeTab === 'commissions' && <CommissionsTab commissions={userCommissions} loading={loadingCommissions} />}
            {activeTab === 'wins' && <WinsTab wins={user.recentWins} />}
            {activeTab === 'submissions' && <SubmissionsTab submissions={user.recentSubmissions} />}
            {activeTab === 'achievements' && <AchievementsTab achievements={user.achievements} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Component: Stat Card
const StatCard = ({ icon, label, value, bgColor }: StatCardProps) => (
  <div className={`${bgColor} rounded-xl p-6 border border-gray-100`}>
    <div className="flex items-center gap-3 mb-2">
      {icon}
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

// Component: Tab Button
const TabButton = ({ active, onClick, label }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`px-6 py-4 font-medium transition ${
      active
        ? 'text-purple-600 border-b-2 border-purple-600'
        : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    {label}
  </button>
);

// Tab: Overview
const OverviewTab = ({ user }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Wins</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {user.recentWins.map((win) => (
          <WinCard key={win.id} win={win} />
        ))}
      </div>
    </div>
    
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Latest Submissions</h3>
      <div className="space-y-3">
        {user.recentSubmissions.map((submission) => (
          <SubmissionRow key={submission.id} submission={submission} />
        ))}
      </div>
    </div>
  </div>
);

// Tab: Commissions
const CommissionsTab = ({ commissions, loading }) => (
  <div className="space-y-4">
    {loading ? (
      <div className="text-center py-8 text-gray-500">
        <p>Loading your commissions...</p>
      </div>
    ) : commissions.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        <p>You haven't created any commissions yet</p>
      </div>
    ) : (
      commissions.map((commission) => (
        <CommissionRow key={commission.id} commission={commission} />
      ))
    )}
  </div>
);

// Tab: Wins
const WinsTab = ({ wins }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {wins.map((win) => (
      <WinCard key={win.id} win={win} />
    ))}
  </div>
);

// Tab: Submissions
const SubmissionsTab = ({ submissions }) => (
  <div className="space-y-3">
    {submissions.map((submission) => (
      <SubmissionRow key={submission.id} submission={submission} />
    ))}
  </div>
);

// Tab: Achievements
const AchievementsTab = ({ achievements }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {achievements.map((achievement) => (
      <div
        key={achievement.id}
        className={`p-6 rounded-xl border-2 text-center transition ${
          achievement.unlocked
            ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300'
            : 'bg-gray-50 border-gray-200 opacity-50'
        }`}
      >
        <div className="text-4xl mb-2">{achievement.icon}</div>
        <p className="font-semibold text-gray-900">{achievement.name}</p>
        {!achievement.unlocked && (
          <p className="text-xs text-gray-500 mt-1">Locked</p>
        )}
      </div>
    ))}
  </div>
);

// Component: Win Card
const WinCard = ({ win }: WinCardProps) => (
  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer">
    <div className="aspect-square bg-gradient-to-br from-purple-300 to-blue-300 flex items-center justify-center">
      {win.thumbnailUrl ? (
        <img src={win.thumbnailUrl} alt={win.title} className="w-full h-full object-cover" />
      ) : (
        <Palette className="w-16 h-16 text-white opacity-50" />
      )}
    </div>
    <div className="p-4">
      <h4 className="font-bold text-gray-900 mb-1">{win.title}</h4>
      <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
        <MapPin className="w-3 h-3" />
        <span className="truncate">{win.location}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {new Date(win.date).toLocaleDateString()}
        </span>
        <span className="text-sm font-bold text-green-600">
          +${win.earnedCurrency}
        </span>
      </div>
    </div>
  </div>
);

// Component: Submission Row
const SubmissionRow = ({ submission }: SubmissionRowProps) => (
  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer">
    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-300 to-blue-300 flex-shrink-0 flex items-center justify-center">
      {submission.thumbnailUrl ? (
        <img src={submission.thumbnailUrl} alt={submission.commissionTitle} className="w-full h-full object-cover rounded-lg" />
      ) : (
        <Palette className="w-8 h-8 text-white opacity-50" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-semibold text-gray-900 truncate">{submission.commissionTitle}</h4>
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <MapPin className="w-3 h-3" />
        <span className="truncate">{submission.location}</span>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500">
        {new Date(submission.submittedDate).toLocaleDateString()}
      </span>
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          submission.status === 'pending'
            ? 'bg-blue-100 text-blue-700'
            : submission.status === 'won'
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-700'
        }`}
      >
        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
      </span>
    </div>
  </div>
);

// Component: Commission Row
const CommissionRow = ({ commission }: CommissionRowProps) => (
  <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 mb-1">{commission.title}</h4>
        <p className="text-sm text-gray-600 mb-2">{commission.prompt}</p>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {commission.location}
          </div>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {commission.category}
          </span>
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-4">
        <p className="font-bold text-green-600 mb-1">${commission.currency}</p>
        {commission.submissionCount && (
          <p className="text-xs text-gray-500 mb-2">{commission.submissionCount} submissions</p>
        )}
        {commission.status && (
          <span className={`text-xs px-2 py-1 rounded ${
            commission.status === 'active' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {commission.status}
          </span>
        )}
      </div>
    </div>
  </div>
);

export default ProfilePage;