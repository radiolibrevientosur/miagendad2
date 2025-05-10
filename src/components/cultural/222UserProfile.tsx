import React, { useState, useEffect } from 'react';
import { useCultural } from '../../context/CulturalContext';
import { ImageUpload } from '../ui/ImageUpload';
import { Feed } from './Feed';
import { 
  Edit, 
  Trash,
  Image,
  Instagram,
  Twitter,
  Facebook,
  Globe
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { WorkItem, Achievement, Category, CulturalUser } from '../../types/cultural';

const CATEGORIES: Category[] = [
  "CINE Y MEDIOS AUDIOVISUALES",
  "ARTES VISUALES",
  "ARTES ESCÉNICAS Y MUSICALES",
  "PROMOCIÓN DEL LIBRO Y LA LECTURA",
  "PATRIMONIO CULTURAL",
  "ECONOMÍA CULTURAL",
  "OTROS"
];

const emptyUser: CulturalUser = {
  id: '',
  name: '',
  username: '',
  bio: '',
  extendedBio: '',
  avatar: null,
  coverImage: null,
  socialLinks: {},
  portfolio: {
    works: [],
    achievements: [],
    gallery: []
  },
  followers: [],
  following: [],
};

export const UserProfile: React.FC = () => {
  const { state, dispatch } = useCultural();
  const [isEditing, setIsEditing] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [editedProfile, setEditedProfile] = useState<CulturalUser>(emptyUser);
  const [activeTab, setActiveTab] = useState<'posts'|'portfolio'|'gallery'|'achievements'>('posts');
  const [newWork, setNewWork] = useState<Partial<WorkItem>>({});
  const [newAchievement, setNewAchievement] = useState<Partial<Achievement>>({});
  const [newGalleryItem, setNewGalleryItem] = useState<{ image?: { data: string; type: string }; title: string; description: string }>({
    title: '',
    description: ''
  });

  useEffect(() => {
    if (state.currentUser) {
      setEditedProfile(state.currentUser);
      setIsNewUser(false);
      setIsEditing(false);
    } else {
      setEditedProfile(emptyUser);
      setIsNewUser(true);
      setIsEditing(true);
    }
  }, [state.currentUser]);

  const handleSaveProfile = () => {
    if (!editedProfile.name || (isNewUser && !editedProfile.username)) {
      alert('Nombre y usuario son campos requeridos');
      return;
    }

    const userData: CulturalUser = {
      ...editedProfile,
      id: isNewUser ? crypto.randomUUID() : editedProfile.id,
      username: isNewUser ? editedProfile.username : (editedProfile.username || state.currentUser?.username || ''),
    };

    dispatch({
      type: isNewUser ? 'CREATE_USER' : 'UPDATE_USER',
      payload: userData
    });

    if (isNewUser) {
      dispatch({ type: 'SET_CURRENT_USER', payload: userData });
    }
    
    setIsEditing(false);
    setIsNewUser(false);
  };

  const handleCancelEdit = () => {
    if (isNewUser) {
      dispatch({ type: 'LOGOUT' });
    } else {
      setEditedProfile(state.currentUser || emptyUser);
      setIsEditing(false);
    }
  };

  const handleAddWork = () => {
    if (!newWork.title || !newWork.description || !newWork.category) return;

    const work: WorkItem = {
      id: crypto.randomUUID(),
      title: newWork.title,
      description: newWork.description,
      date: new Date(newWork.date || Date.now()),
      category: newWork.category,
      image: newWork.image,
      url: newWork.url,
      isCurrent: newWork.isCurrent || false
    };

    setEditedProfile({
      ...editedProfile,
      portfolio: {
        ...editedProfile.portfolio,
        works: [...editedProfile.portfolio.works, work]
      }
    });
    setNewWork({});
  };

  const handleAddAchievement = () => {
    if (!newAchievement.title || !newAchievement.description || !newAchievement.institution) return;

    const achievement: Achievement = {
      id: crypto.randomUUID(),
      title: newAchievement.title,
      description: newAchievement.description,
      date: new Date(newAchievement.date || Date.now()),
      institution: newAchievement.institution,
      type: newAchievement.type || 'award'
    };

    setEditedProfile({
      ...editedProfile,
      portfolio: {
        ...editedProfile.portfolio,
        achievements: [...editedProfile.portfolio.achievements, achievement]
      }
    });
    setNewAchievement({});
  };

  const handleAddGalleryItem = () => {
    if (!newGalleryItem.image || !newGalleryItem.title) return;

    const galleryItem = {
      id: crypto.randomUUID(),
      ...newGalleryItem,
      date: new Date()
    };

    setEditedProfile({
      ...editedProfile,
      portfolio: {
        ...editedProfile.portfolio,
        gallery: [...editedProfile.portfolio.gallery, galleryItem]
      }
    });
    setNewGalleryItem({ title: '', description: '' });
  };

  const handleDeleteWork = (workId: string) => {
    setEditedProfile({
      ...editedProfile,
      portfolio: {
        ...editedProfile.portfolio,
        works: editedProfile.portfolio.works.filter(w => w.id !== workId)
      }
    });
  };

  const handleDeleteAchievement = (achievementId: string) => {
    setEditedProfile({
      ...editedProfile,
      portfolio: {
        ...editedProfile.portfolio,
        achievements: editedProfile.portfolio.achievements.filter(a => a.id !== achievementId)
      }
    });
  };

  const handleDeleteGalleryItem = (itemId: string) => {
    setEditedProfile({
      ...editedProfile,
      portfolio: {
        ...editedProfile.portfolio,
        gallery: editedProfile.portfolio.gallery.filter(item => item.id !== itemId)
      }
    });
  };

  const renderPortfolioTab = () => (
    <div className="space-y-8">
      {isEditing && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-semibold">Nuevo Trabajo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Título"
              value={newWork.title || ''}
              onChange={(e) => setNewWork({ ...newWork, title: e.target.value })}
              className="p-2 border rounded-lg dark:bg-gray-700"
            />
            <select
              value={newWork.category || ''}
              onChange={(e) => setNewWork({ ...newWork, category: e.target.value as Category })}
              className="p-2 border rounded-lg dark:bg-gray-700"
            >
              <option value="">Seleccionar categoría...</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <textarea
              placeholder="Descripción"
              value={newWork.description || ''}
              onChange={(e) => setNewWork({ ...newWork, description: e.target.value })}
              className="p-2 border rounded-lg dark:bg-gray-700"
            />
            <input
              type="url"
              placeholder="URL"
              value={newWork.url || ''}
              onChange={(e) => setNewWork({ ...newWork, url: e.target.value })}
              className="p-2 border rounded-lg dark:bg-gray-700"
            />
            <div className="col-span-2">
              <ImageUpload
                value={newWork.image}
                onChange={(image) => setNewWork({ ...newWork, image })}
              />
            </div>
            <button
              onClick={handleAddWork}
              className="col-span-2 bg-blue-500 text-white p-2 rounded-lg"
            >
              Agregar Trabajo
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {editedProfile.portfolio.works.map(work => (
          <div key={work.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {work.image && <img src={work.image.data} alt={work.title} className="w-full h-48 object-cover" />}
            <div className="p-4">
              <h4 className="text-lg font-semibold">{work.title}</h4>
              <p className="text-sm text-gray-600">{work.description}</p>
              {isEditing && (
                <button
                  onClick={() => handleDeleteWork(work.id)}
                  className="mt-2 text-red-500 hover:text-red-700"
                >
                  <Trash className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGalleryTab = () => (
    <div className="space-y-8">
      {isEditing && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-semibold">Nueva Imagen</h3>
          <div className="space-y-4">
            <ImageUpload
              value={newGalleryItem.image}
              onChange={(image) => setNewGalleryItem({ ...newGalleryItem, image })}
            />
            <input
              type="text"
              placeholder="Título"
              value={newGalleryItem.title}
              onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700"
            />
            <textarea
              placeholder="Descripción"
              value={newGalleryItem.description}
              onChange={(e) => setNewGalleryItem({ ...newGalleryItem, description: e.target.value })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700"
            />
            <button
              onClick={handleAddGalleryItem}
              className="w-full bg-blue-500 text-white p-2 rounded-lg"
            >
              Agregar a Galería
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {editedProfile.portfolio.gallery.map(item => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <img src={item.image.data} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h4 className="text-lg font-semibold">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
              {isEditing && (
                <button
                  onClick={() => handleDeleteGalleryItem(item.id)}
                  className="mt-2 text-red-500 hover:text-red-700"
                >
                  <Trash className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAchievementsTab = () => (
    <div className="space-y-8">
      {isEditing && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-semibold">Nuevo Logro</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Título"
              value={newAchievement.title || ''}
              onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
              className="p-2 border rounded-lg dark:bg-gray-700"
            />
            <input
              type="text"
              placeholder="Institución"
              value={newAchievement.institution || ''}
              onChange={(e) => setNewAchievement({ ...newAchievement, institution: e.target.value })}
              className="p-2 border rounded-lg dark:bg-gray-700"
            />
            <select
              value={newAchievement.type || 'award'}
              onChange={(e) => setNewAchievement({ ...newAchievement, type: e.target.value as any })}
              className="p-2 border rounded-lg dark:bg-gray-700"
            >
              <option value="award">Premio</option>
              <option value="recognition">Reconocimiento</option>
              <option value="certification">Certificación</option>
            </select>
            <input
              type="date"
              value={newAchievement.date?.toISOString().split('T')[0] || ''}
              onChange={(e) => setNewAchievement({ ...newAchievement, date: new Date(e.target.value) })}
              className="p-2 border rounded-lg dark:bg-gray-700"
            />
            <textarea
              placeholder="Descripción"
              value={newAchievement.description || ''}
              onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
              className="col-span-2 p-2 border rounded-lg dark:bg-gray-700"
            />
            <button
              onClick={handleAddAchievement}
              className="col-span-2 bg-blue-500 text-white p-2 rounded-lg"
            >
              Agregar Logro
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {editedProfile.portfolio.achievements.map(achievement => (
          <div key={achievement.id} className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold">{achievement.title}</h4>
                <p className="text-sm text-gray-600">
                  {achievement.institution} • {format(achievement.date, 'd MMM yyyy', { locale: es })}
                </p>
                <p className="mt-2 text-gray-700">{achievement.description}</p>
              </div>
              {isEditing && (
                <button
                  onClick={() => handleDeleteAchievement(achievement.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 relative">
        {isEditing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageUpload
              value={editedProfile.coverImage}
              onChange={(image) => setEditedProfile({ ...editedProfile, coverImage: image })}
              className="w-full h-full"
            />
          </div>
        )}
      </div>

      <div className="relative px-6 py-4">
        <div className="flex items-end -mt-16">
          <div className="relative">
            <ImageUpload
              value={editedProfile.avatar}
              onChange={(image) => setEditedProfile({ ...editedProfile, avatar: image })}
              variant="profile"
              className="w-32 h-32"
            />
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      className="text-2xl font-bold bg-transparent border-b border-gray-300"
                    />
                    {isNewUser && (
                      <input
                        type="text"
                        placeholder="Nombre de usuario"
                        value={editedProfile.username}
                        onChange={(e) => setEditedProfile({ ...editedProfile, username: e.target.value })}
                        className="text-sm bg-transparent border-b border-gray-300"
                      />
                    )}
                  </div>
                ) : (
                  <div>
                    <h1 className="text-2xl font-bold">{editedProfile.name}</h1>
                    <p className="text-gray-600">@{editedProfile.username}</p>
                  </div>
                )}
              </div>
              <div className="flex space-x-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      {isNewUser ? 'Crear Usuario' : 'Guardar'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-8 mt-6 border-t border-b border-gray-200 py-4">
          <div className="text-center">
            <span className="block text-2xl font-bold">{state.posts.filter(post => post.userId === editedProfile.id).length}</span>
            <span className="text-gray-600">Publicaciones</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold">{editedProfile.followers.length}</span>
            <span className="text-gray-600">Seguidores</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold">{editedProfile.following.length}</span>
            <span className="text-gray-600">Siguiendo</span>
          </div>
        </div>

        <div className="mt-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Biografía Corta</label>
                <textarea
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                  className="w-full p-2 bg-gray-50 rounded-lg"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Biografía Extendida</label>
                <textarea
                  value={editedProfile.extendedBio}
                  onChange={(e) => setEditedProfile({ ...editedProfile, extendedBio: e.target.value })}
                  className="w-full p-2 bg-gray-50 rounded-lg"
                  rows={6}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p>{editedProfile.bio || 'No hay biografía disponible'}</p>
              {editedProfile.extendedBio && <p>{editedProfile.extendedBio}</p>}
            </div>
          )}
        </div>

        <div className="mt-6">
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Instagram</label>
                <input
                  type="text"
                  value={editedProfile.socialLinks?.instagram || ''}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    socialLinks: { ...editedProfile.socialLinks, instagram: e.target.value }
                  })}
                  className="w-full p-2 bg-gray-50 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Twitter</label>
                <input
                  type="text"
                  value={editedProfile.socialLinks?.twitter || ''}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    socialLinks: { ...editedProfile.socialLinks, twitter: e.target.value }
                  })}
                  className="w-full p-2 bg-gray-50 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Facebook</label>
                <input
                  type="text"
                  value={editedProfile.socialLinks?.facebook || ''}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    socialLinks: { ...editedProfile.socialLinks, facebook: e.target.value }
                  })}
                  className="w-full p-2 bg-gray-50 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sitio Web</label>
                <input
                  type="text"
                  value={editedProfile.socialLinks?.website || ''}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    socialLinks: { ...editedProfile.socialLinks, website: e.target.value }
                  })}
                  className="w-full p-2 bg-gray-50 rounded-lg"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {editedProfile.socialLinks?.instagram && (
                <a href={`https://instagram.com/${editedProfile.socialLinks.instagram}`} className="flex items-center gap-2 text-pink-600">
                  <Instagram className="h-5 w-5" />
                  {editedProfile.socialLinks.instagram}
                </a>
              )}
              {editedProfile.socialLinks?.twitter && (
                <a href={`https://twitter.com/${editedProfile.socialLinks.twitter}`} className="flex items-center gap-2 text-blue-400">
                  <Twitter className="h-5 w-5" />
                  {editedProfile.socialLinks.twitter}
                </a>
              )}
              {editedProfile.socialLinks?.facebook && (
                <a href={editedProfile.socialLinks.facebook} className="flex items-center gap-2 text-blue-600">
                  <Facebook className="h-5 w-5" />
                  {editedProfile.socialLinks.facebook}
                </a>
              )}
              {editedProfile.socialLinks?.website && (
                <a href={editedProfile.socialLinks.website} className="flex items-center gap-2 text-gray-600">
                  <Globe className="h-5 w-5" />
                  {editedProfile.socialLinks.website}
                </a>
              )}
            </div>
          )}
        </div>

        <div className="mt-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {['posts', 'portfolio', 'gallery', 'achievements'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-1 py-4 text-sm font-medium border-b-2 ${
                  activeTab === tab 
                    ? 'border-blue-500 text-blue-500' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>

          <div className="mt-6">
            {activeTab === 'posts' && <Feed userId={editedProfile.id} />}
            {activeTab === 'portfolio' && renderPortfolioTab()}
            {activeTab === 'gallery' && renderGalleryTab()}
            {activeTab === 'achievements' && renderAchievementsTab()}
          </div>
        </div>
      </div>
    </div>
  );
};