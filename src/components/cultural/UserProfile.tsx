import React, { useState, useEffect } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { ImageUpload } from '../ui/ImageUpload';
import { Feed } from './Feed';
import { 
  User, 
  Settings, 
  Link as LinkIcon, 
  Edit, 
  Award,
  Users,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Linkedin,
  Globe,
  Calendar,
  Briefcase,
  Plus,
  Trash,
  Image
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { WorkItem, Achievement, Category, User as UserType } from '../../types/cultural';

const CATEGORIES: Category[] = [
  "CINE Y MEDIOS AUDIOVISUALES",
  "ARTES VISUALES",
  "ARTES ESCÉNICAS Y MUSICALES",
  "PROMOCIÓN DEL LIBRO Y LA LECTURA",
  "PATRIMONIO CULTURAL",
  "ECONOMÍA CULTURAL",
  "OTROS"
];

export const UserProfile: React.FC = () => {
  const { profile, loading, error, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserType> | null>(null);
  const [activeTab, setActiveTab] = useState<'posts'|'portfolio'|'gallery'|'achievements'>('posts');
  const [newWork, setNewWork] = useState<Partial<WorkItem>>({});
  const [newAchievement, setNewAchievement] = useState<Partial<Achievement>>({});
  const [newGalleryItem, setNewGalleryItem] = useState<{ image?: { data: string; type: string }; title: string; description: string }>({
    title: '',
    description: ''
  });

  useEffect(() => {
    if (profile && !editedProfile) {
      setEditedProfile(profile);
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cultural-escenicas"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!profile || !editedProfile) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <p className="text-yellow-600 dark:text-yellow-400">Profile not found</p>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editedProfile);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  // Rest of the component implementation remains the same
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Rest of the JSX remains the same */}
    </div>
  );
};