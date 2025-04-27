import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { CulturalEvent, ArtistBirthday, CulturalTask, Contact, CulturalContextType, CulturalAction, Notification } from '../types/cultural';

const initialState: CulturalContextType['state'] = {
  events: [],
  birthdays: [],
  tasks: [],
  contacts: [],
  notifications: []
};

const CulturalContext = createContext<CulturalContextType | null>(null);

const loadInitialState = (): CulturalContextType['state'] => {
  try {
    const savedState = localStorage.getItem('cultural_management_state');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      return {
        events: (parsedState.events || []).map((event: any) => ({
          ...event,
          date: new Date(event.date)
        })),
        birthdays: (parsedState.birthdays || []).map((birthday: any) => ({
          ...birthday,
          birthDate: new Date(birthday.birthDate)
        })),
        tasks: (parsedState.tasks || []).map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate)
        })),
        contacts: (parsedState.contacts || []).map((contact: any) => ({
          ...contact,
          whatsapp: contact.whatsapp || undefined,
          instagram: contact.instagram || undefined,
          facebook: contact.facebook || undefined
        })),
        notifications: (parsedState.notifications || []).map((notification: any) => ({
          ...notification,
          date: new Date(notification.date)
        }))
      };
    }
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
  }
  return initialState;
};

const culturalReducer = (state: CulturalContextType['state'], action: CulturalAction): CulturalContextType['state'] => {
  let newState: CulturalContextType['state'];

  try {
    switch (action.type) {
      case 'ADD_EVENT':
        newState = { ...state, events: [...state.events, action.payload] };
        break;
      case 'UPDATE_EVENT':
        newState = {
          ...state,
          events: state.events.map(event =>
            event.id === action.payload.id ? action.payload : event
          )
        };
        break;
      case 'DELETE_EVENT':
        newState = {
          ...state,
          events: state.events.filter(event => event.id !== action.payload)
        };
        break;
      case 'ADD_BIRTHDAY':
        newState = { ...state, birthdays: [...state.birthdays, action.payload] };
        break;
      case 'UPDATE_BIRTHDAY':
        newState = {
          ...state,
          birthdays: state.birthdays.map(birthday =>
            birthday.id === action.payload.id ? action.payload : birthday
          )
        };
        break;
      case 'DELETE_BIRTHDAY':
        newState = {
          ...state,
          birthdays: state.birthdays.filter(birthday => birthday.id !== action.payload)
        };
        break;
      case 'ADD_TASK':
        newState = { ...state, tasks: [...state.tasks, action.payload] };
        break;
      case 'UPDATE_TASK':
        newState = {
          ...state,
          tasks: state.tasks.map(task =>
            task.id === action.payload.id ? action.payload : task
          )
        };
        break;
      case 'DELETE_TASK':
        newState = {
          ...state,
          tasks: state.tasks.filter(task => task.id !== action.payload)
        };
        break;
      case 'ADD_CONTACT':
        newState = { ...state, contacts: [...state.contacts, action.payload] };
        break;
      case 'UPDATE_CONTACT':
        newState = {
          ...state,
          contacts: state.contacts.map(contact =>
            contact.id === action.payload.id ? action.payload : contact
          )
        };
        break;
      case 'DELETE_CONTACT':
        newState = {
          ...state,
          contacts: state.contacts.filter(contact => contact.id !== action.payload)
        };
        break;
      case 'ADD_MULTIPLE_CONTACTS':
        newState = {
          ...state,
          contacts: [
            ...state.contacts,
            ...action.payload.map(contact => ({
              ...contact,
              id: contact.id || crypto.randomUUID()
            }))
          ]
        };
        break;
      case 'ADD_NOTIFICATION':
        newState = {
          ...state,
          notifications: [action.payload, ...state.notifications]
        };
        break;
      case 'MARK_NOTIFICATION_READ':
        newState = {
          ...state,
          notifications: state.notifications.map(notification =>
            notification.id === action.payload
              ? { ...notification, read: true }
              : notification
          )
        };
        break;
      case 'DELETE_NOTIFICATION':
        newState = {
          ...state,
          notifications: state.notifications.filter(
            notification => notification.id !== action.payload
          )
        };
        break;
      case 'LOAD_STATE':
        newState = action.payload;
        break;
      default:
        return state;
    }

    localStorage.setItem('cultural_management_state', JSON.stringify(newState));
    return newState;
  } catch (error) {
    console.error('Error in reducer:', error);
    return state;
  }
};

export const CulturalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(culturalReducer, initialState, loadInitialState);

  useEffect(() => {
    const savedState = loadInitialState();
    if (savedState !== initialState) {
      dispatch({ type: 'LOAD_STATE', payload: savedState });
    }
  }, []);

  return (
    <CulturalContext.Provider value={{ state, dispatch }}>
      {children}
    </CulturalContext.Provider>
  );
};

export const useCultural = () => {
  const context = useContext(CulturalContext);
  if (!context) {
    throw new Error('useCultural must be used within a CulturalProvider');
  }
  return context;
};