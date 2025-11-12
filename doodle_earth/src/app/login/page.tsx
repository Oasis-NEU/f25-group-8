"use client"

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import TopBar from '@/components/TopBar';
import HamburgerMenu from '@/components/HamburgerMenu';

export default function LoginPage() {
  // State for menu
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // State for form mode
  const [isLogin, setIsLogin] = useState<boolean>(true);

  // State for form fields
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  // State for submission
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Check if user is already logged in
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      // User is already logged in, redirect to home
      window.location.href = '/';
    }
  }

  // Handle login
  async function handleLogin(): Promise<void> {
    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Try to find user by username first
      let { data: users, error } = await supabase
        .from('Users')
        .select('*')
        .eq('Username', email)
        .eq('Password', password);

      // If not found by username, try by email in Name field
      if (!users || users.length === 0) {
        const { data: emailUsers, error: emailError } = await supabase
          .from('Users')
          .select('*')
          .like('Name', `%${email}%`)
          .eq('Password', password);
        
        users = emailUsers;
        error = emailError;
      }

      if (error || !users || users.length === 0) {
        setErrorMessage('Invalid username/email or password');
      } else {
        setSuccessMessage('Login successful!');
        // Store user session in localStorage
        localStorage.setItem('currentUser', JSON.stringify(users[0]));
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle signup
  async function handleSignup(): Promise<void> {
    if (!email || !password || !name || !username) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Check if username already exists
      const { data: existingUser } = await supabase
        .from('Users')
        .select('Username')
        .eq('Username', username)
        .single();

      if (existingUser) {
        setErrorMessage('Username already taken');
        setIsSubmitting(false);
        return;
      }

      // Insert new user into Users table (storing email in Name field for now)
      const { error: profileError } = await supabase
        .from('Users')
        .insert([
          {
            Name: `${name}|${email}`, // Store both name and email
            Username: username,
            Password: password,
            Points: 0,
            Level: 'Beginner',
          }
        ]);

      if (profileError) {
        setErrorMessage('Failed to create account: ' + profileError.message);
      } else {
        setSuccessMessage('Account created successfully!');
        setTimeout(() => {
          // Switch to login mode
          setIsLogin(true);
          setSuccessMessage('');
        }, 1500);
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <TopBar onMenuClick={() => setIsMenuOpen(!isMenuOpen)} />
      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      {/* Main Content */}
      <div className="pt-24 p-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-lg text-gray-600">
              {isLogin ? 'Log in to continue' : 'Sign up to get started'}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Toggle Login/Signup */}
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-colors ${
                  isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-colors ${
                  !isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error/Success Messages */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg">
                {successMessage}
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Name (Signup only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
              )}

              {/* Username (Signup only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {isLogin ? 'Username or Email' : 'Email'}
                </label>
                <input
                  type={isLogin ? "text" : "email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isLogin ? "Enter username or email" : "Enter your email"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={isLogin ? handleLogin : handleSignup}
              disabled={isSubmitting}
              className="w-full mt-6 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
            </button>

            {/* Additional Links */}
            {isLogin && (
              <div className="mt-4 text-center">
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}