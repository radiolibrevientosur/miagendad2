import { useState, useEffect } from 'react';
import { EventFormData, EventFilters } from '../types';
import { toast } from 'react-hot-toast';

const STORAGE_KEY = 'cultural-events';
const FAVORITES_KEY = 'favorite-events';
const REMINDERS_KEY = 'event-reminders';

const alarmSound = new Audio('/alarm.mp3');

export const useEvents = () => {
  const [events, setEvents] = useState<EventFormData[]>([]);
  const [filters, setFilters] = useState<EventFilters>({
    search: '',
    category: undefined,
    eventType: undefined,
    date: undefined,
  });

  useEffect(() => {
    const storedEvents = localStorage.getItem(STORAGE_KEY);
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    const storedReminders = localStorage.getItem(REMINDERS_KEY);
    
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      if (storedFavorites) {
        const favorites = JSON.parse(storedFavorites);
        parsedEvents.forEach((event: EventFormData) => {
          event.isFavorite = favorites.includes(event.id);
        });
      }
      if (storedReminders) {
        const reminders = JSON.parse(storedReminders);
        parsedEvents.forEach((event: EventFormData) => {
          event.reminder = reminders[event.id];
        });
      }
      setEvents(parsedEvents);
    }
  }, []);

  useEffect(() => {
    const checkReminders = () => {
      events.forEach(event => {
        if (event.reminder?.enabled) {
          const eventTime = new Date(event.datetime).getTime();
          const reminderTime = eventTime - (event.reminder.minutesBefore * 60 * 1000);
          const now = new Date().getTime();

          if (now >= reminderTime && now < eventTime) {
            // Play sound
            alarmSound.play().catch(console.error);

            // Show notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Recordatorio de Evento', {
                body: `El evento "${event.title}" comenzará en ${event.reminder.minutesBefore} minutos`,
                icon: '/icon.png'
              });
            }

            // Disable reminder after it's triggered
            toggleReminder(event.id, event.reminder.minutesBefore, false);
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [events]);

  const saveEvents = (newEvents: EventFormData[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
    
    const favorites = newEvents
      .filter(event => event.isFavorite)
      .map(event => event.id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    
    const reminders = newEvents.reduce((acc, event) => {
      if (event.reminder) {
        acc[event.id] = event.reminder;
      }
      return acc;
    }, {} as Record<string, { enabled: boolean; minutesBefore: number }>);
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
    
    setEvents(newEvents);
  };

  const addEvent = (event: Omit<EventFormData, 'id'>) => {
    const newEvent = {
      ...event,
      id: crypto.randomUUID(),
      isFavorite: false,
    };
    const newEvents = [...events, newEvent];
    saveEvents(newEvents);
    toast.success('Evento creado exitosamente');
  };

  const updateEvent = (event: EventFormData) => {
    const newEvents = events.map(e => e.id === event.id ? event : e);
    saveEvents(newEvents);
    toast.success('Evento actualizado exitosamente');
  };

  const deleteEvent = (id: string) => {
    const newEvents = events.filter(e => e.id !== id);
    saveEvents(newEvents);
    toast.success('Evento eliminado exitosamente');
  };

  const toggleFavorite = (id: string) => {
    const newEvents = events.map(event =>
      event.id === id
        ? { ...event, isFavorite: !event.isFavorite }
        : event
    );
    saveEvents(newEvents);
    const event = newEvents.find(e => e.id === id);
    toast.success(
      event?.isFavorite
        ? 'Evento agregado a favoritos'
        : 'Evento eliminado de favoritos'
    );
  };

  const toggleReminder = (id: string, minutesBefore: number, enabled = true) => {
    // Request notification permission if needed
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const newEvents = events.map(event =>
      event.id === id
        ? {
            ...event,
            reminder: {
              enabled,
              minutesBefore,
            },
          }
        : event
    );
    saveEvents(newEvents);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      event.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = !filters.category || event.category === filters.category;
    const matchesType = !filters.eventType || event.eventType === filters.eventType;
    const matchesDate = !filters.date || event.datetime.startsWith(filters.date);

    return matchesSearch && matchesCategory && matchesType && matchesDate;
  });

  return {
    events: filteredEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleFavorite,
    toggleReminder,
    filters,
    setFilters,
  };
};