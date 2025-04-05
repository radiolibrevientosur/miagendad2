import React from 'react';
import { EventCard } from './EventCard';
import { EventFormData } from '../types';
import { motion } from 'framer-motion';

interface FavoritesSectionProps {
  events: EventFormData[];
  onEdit: (event: EventFormData) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  events,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const favoriteEvents = events.filter(event => event.isFavorite);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="p-4 space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Eventos Favoritos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteEvents.map(event => (
          <EventCard
            key={event.id}
            event={event}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleFavorite={() => onToggleFavorite(event.id)}
          />
        ))}
        {favoriteEvents.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No tienes eventos favoritos aún.
          </div>
        )}
      </div>
    </motion.div>
  );
};