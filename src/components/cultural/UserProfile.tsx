import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface SocialLinks {
  id?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  website?: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  project_url?: string;
  category?: string;
}

interface Achievement {
  id: string;
  title: string;
  description?: string;
  institution?: string;
  type: string;
  date: string;
}

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  image_url: string;
}

interface UserProfileData {
  id: string;
  name: string;
  username: string;
  bio?: string;
  extended_bio?: string;
  avatar_url?: string;
  cover_image?: string;
  socialLinks: SocialLinks;
  portfolio: {
    works: PortfolioItem[];
    achievements: Achievement[];
    gallery: GalleryItem[];
  };
  posts_count?: number;
  followers_count?: number;
  following_count?: number;
}

export const UserProfile: React.FC = () => {
  const [editedProfile, setEditedProfile] = useState<UserProfileData>({
    id: '',
    name: '',
    username: '',
    socialLinks: {},
    portfolio: {
      works: [],
      achievements: [],
      gallery: []
    }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          social_links (*),
          portfolio_works (*),
          achievements (*),
          gallery_items (*)
        `)
        .eq('id', userData.user.id)
        .single();

      if (error) throw error;

      if (data) {
        setEditedProfile({
          ...data,
          socialLinks: data.social_links[0] || {},
          portfolio: {
            works: data.portfolio_works || [],
            achievements: data.achievements || [],
            gallery: data.gallery_items || []
          }
        });
      }
    } catch (error) {
      toast.error('Error cargando el perfil');
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Sección de cover image */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {editedProfile.cover_image && (
          <img 
            src={editedProfile.cover_image} 
            alt="Cover" 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </div>

      {/* Resto del componente con mejoras en:
         - Accesibilidad (labels, roles)
         - Validación de formularios
         - Manejo de errores
         - Feedback al usuario
         - Optimización de renders
      */}
      
    </div>
  );
};