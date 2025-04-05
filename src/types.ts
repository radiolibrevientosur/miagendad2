export interface EventFormData {
  id: string;
  title: string;
  eventType: 'Taller' | 'Festival' | 'Exposicion' | 'Toma Cultural' | 'Encuentros' | 'Proyeccion de cine' | 'Otros';
  description: string;
  category: 'Artes Escenicas y Musicales' | 'Artes Visuales y del espacio' | 'Cine y medios audiovisual' | 'Promocion del Libro y la Lectura' | 'Patrimonio cultural';
  datetime: string;
  location: string;
  mapLink?: string;
  responsibleName: string;
  phone: string;
  socialMedia: string;
  image?: string;
  targetAudience: 'Infantil' | 'Adultos' | 'Todos';
  cost: {
    isFree: boolean;
    amount?: number;
  };
  isFavorite?: boolean;
  reminder?: {
    enabled: boolean;
    minutesBefore: number;
  };
}

export type EventFilters = {
  search: string;
  category?: string;
  eventType?: string;
  date?: string;
}

export interface UserProfile {
  name: string;
  bio: string;
  photo?: string;
  theme?: 'light' | 'dark';
}

export type ActiveSection = 'search' | 'favorites' | 'create' | 'profile' | null;