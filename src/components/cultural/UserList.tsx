[file name]: UserList.tsx
[file content begin]
import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { User } from 'lucide-react';

interface ContactUser {
  id: string;
  username: string;
  avatar_url?: string;
  full_name?: string;
}

export const UserList: React.FC = () => {
  const [contacts, setContacts] = useState<ContactUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    const { data: userData } = await supabase.auth.getUser();
    
    const { data } = await supabase
      .from('contacts')
      .select(`
        contact_user_id:users!contact_user_id (
          id,
          username,
          avatar_url,
          full_name
        )
      `)
      .eq('user_id', userData.user?.id);

    return data?.map(item => item.contact_user_id) || [];
  };

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const contactsData = await fetchContacts();
        setContacts(contactsData);
      } catch (error) {
        console.error('Error loading contacts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadContacts();
  }, []);

  if (loading) return <div>Cargando contactos...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        <Users className="inline-block mr-2 h-5 w-5" />
        Mis Contactos
      </h2>
      
      <div className="space-y-4">
        {contacts.map(user => (
          <div key={user.id} className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
            {user.avatar_url ? (
              <img 
                src={user.avatar_url} 
                alt={user.username}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-cultural-escenicas flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            )}
            <div className="ml-4">
              <p className="font-medium text-gray-900 dark:text-white">
                {user.full_name || user.username}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                @{user.username}
              </p>
            </div>
          </div>
        ))}
        
        {contacts.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No tienes contactos agregados
          </p>
        )}
      </div>
    </div>
  );
};
[file content end]