'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import TopBar from '@/components/TopBar';
import HamburgerMenu from '@/components/HamburgerMenu';

export default function SettingsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    async function getUsers() {
      console.log('Fetching users...');
      
      const { data, error } = await supabase
        .from('Users')
        .select('Name');
      
      console.log('Data:', data);
      console.log('Error:', error);
      
      setUsers(data || []);
    }

    getUsers();
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
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user.Name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}