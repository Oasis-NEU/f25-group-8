'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import TopBar from '@/components/TopBar';
import HamburgerMenu from '@/components/HamburgerMenu';
import { getUserProfile } from '@/lib/supabase/client';

export default function SettingsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      console.log('About to call getUserProfile...');
      const data = await getUserProfile("JPork");
      console.log('getUserProfile returned:', data);
      console.log('Type of data:', typeof data);
      console.log('Is data an array?', Array.isArray(data));
      
      if (data) {
        setUsers(data);
      }
    }

    loadUser();
  }, []);

  return (
    <div>
      <div>
        {/* Top Navigation Bar */}
        <TopBar onMenuClick={() => setIsMenuOpen(true)} />

        {/* Hamburger Menu */}
        <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
      <div className="pt-20 px-6">
        <h1>Users:</h1>
        <p>Found {users.length} users</p>
        <p>Users data: {JSON.stringify(users)}</p>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user.Name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}