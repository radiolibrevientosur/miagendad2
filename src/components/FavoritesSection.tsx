import React from 'react';
import { EventCard } from './EventCard';
import { EventFormData } from '../types';
import { motion } from 'framer-motion';

interface FavoritesSectionProps {
  events: EventFormData[];
  onEdit: (event: EventFormData) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleReminder: (id: string, minutesBefore: number) => void;
}

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  events,
  onEdit,
  onDelete,
  onToggleFavorite,
  onToggleReminder,
}) => {
  const favoriteEvents = events.filter(event => event.isFavorite);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Eventos Favoritos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteEvents.map(event => (
          <EventCard
            key={event.id}
            event={event}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleFavorite={onToggleFavorite}
            onToggleReminder={onToggleReminder}
          />
        ))}
        {favoriteEvents.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No tienes eventos favoritos aún.
          </div>
        )}
      </div>
    </div>
  );
};