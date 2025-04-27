import { useState, useEffect } from 'react';
import { useCultural } from '../context/CulturalContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const useNotifications = () => {
  const { state, dispatch } = useCultural();
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  useEffect(() => {
    checkNotificationPermission();
    const checkInterval = setInterval(checkForDueEvents, 60000); // Check every minute
    return () => clearInterval(checkInterval);
  }, []);

  const checkNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.warn('Este navegador no soporta notificaciones');
      return;
    }

    const permission = await Notification.requestPermission();
    setIsPermissionGranted(permission === 'granted');
  };

  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.play().catch(error => {
      console.warn('Error reproduciendo sonido:', error);
    });
  };

  const checkForDueEvents = () => {
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');

    // Check events
    state.events.forEach(event => {
      const eventDate = format(event.date, 'yyyy-MM-dd');
      if (eventDate === today) {
        const notification = {
          id: crypto.randomUUID(),
          title: '¡Evento Hoy!',
          message: `${event.title} comienza a las ${format(event.date, 'HH:mm')}`,
          type: 'event' as const,
          read: false,
          date: new Date(),
          entityId: event.id
        };

        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: notification
        });

        if (isPermissionGranted) {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/icon.png'
          });
          playNotificationSound();
        }
      }
    });

    // Check birthdays
    state.birthdays.forEach(birthday => {
      const birthDate = format(birthday.birthDate, 'MM-dd');
      const todayDate = format(now, 'MM-dd');
      
      if (birthDate === todayDate) {
        const notification = {
          id: crypto.randomUUID(),
          title: '¡Cumpleaños Hoy!',
          message: `¡${birthday.name} está cumpliendo años hoy!`,
          type: 'birthday' as const,
          read: false,
          date: new Date(),
          entityId: birthday.id
        };

        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: notification
        });

        if (isPermissionGranted) {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/icon.png'
          });
          playNotificationSound();
        }
      }
    });

    // Check tasks
    state.tasks.forEach(task => {
      const taskDate = format(task.dueDate, 'yyyy-MM-dd');
      if (taskDate === today && task.status !== 'completed') {
        const notification = {
          id: crypto.randomUUID(),
          title: '¡Tarea para Hoy!',
          message: `La tarea "${task.title}" vence hoy`,
          type: 'task' as const,
          read: false,
          date: new Date(),
          entityId: task.id
        };

        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: notification
        });

        if (isPermissionGranted) {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/icon.png'
          });
          playNotificationSound();
        }
      }
    });
  };

  return {
    notifications: state.notifications,
    unreadCount: state.notifications.filter(n => !n.read).length,
    isPermissionGranted,
    checkNotificationPermission
  };
};