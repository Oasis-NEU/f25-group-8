'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function SettingsPage() {
  const [users, setUsers] = useState<any[]>([]);

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
      <h1>Users:</h1>
      <p>Found {users.length} users</p>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user.Name}</li>
        ))}
      </ul>
    </div>
  );
}