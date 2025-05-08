export type Category = 
  | "CINE Y MEDIOS AUDIOVISUALES"
  | "ARTES VISUALES"
  | "ARTES ESCÉNICAS Y MUSICALES"
  | "PROMOCIÓN DEL LIBRO Y LA LECTURA"
  | "PATRIMONIO CULTURAL"
  | "ECONOMÍA CULTURAL"
  | "OTROS";

export interface WorkItem {
  id: string;
  title: string;
  description: string;
  date: Date;
  category: Category;
  image?: { data: string; type: string };
  url?: string;
  isCurrent: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: Date;
  institution: string;
  type: 'award' | 'recognition' | 'certification';
}

export interface CulturalPortfolio {
  works: WorkItem[];
  achievements: Achievement[];
  gallery: {
    id: string;
    image: { data: string; type: string };
    title: string;
    description: string;
    date: Date;
  }[];
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar?: { data: string; type: string };
  coverImage?: { data: string; type: string };
  bio?: string;
  extendedBio?: string;
  followers: string[];
  following: string[];
  posts: string[];
  portfolio?: CulturalPortfolio;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
    youtube?: string;
    linkedin?: string;
  };
}

export interface CulturalEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  locationUrl?: string;
  category: Category;
  eventType: string;
  targetAudience: 'Infantil' | 'Adultos' | 'Todos';
  cost: {
    type: 'free' | 'paid';
    amount?: number;
  };
  responsiblePerson: {
    name: string;
    phone: string;
    socialMedia?: string;
  };
  technicalRequirements: string[];
  image?: { data: string; type: string };
  tags: string[];
  isFavorite: boolean;
  recurrence?: {
    type: 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';
    interval?: number;
    endDate?: string;
    daysOfWeek?: number[];
  };
  reactions: Record<ReactionType, number>;
  customReactions: CustomReaction[];
  comments: Comment[];
  shares: number;
}

export interface ArtistBirthday {
  id: string;
  name: string;
  birthDate: Date;
  role: string;
  discipline: string;
  trajectory: string;
  contactInfo: {
    email: string;
    phone: string;
  };
  image?: { data: string; type: string };
  isFavorite: boolean;
}

export interface CulturalTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  dueDate: Date;
  checklist: {
    id: string;
    task: string;
    completed: boolean;
  }[];
  isFavorite: boolean;
}

export interface Contact {
  id: string;
  name: string;
  role?: string;
  discipline?: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  notes?: string;
  image?: { data: string; type: string };
  isFavorite: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'event' | 'birthday' | 'task';
  read: boolean;
  date: Date;
  entityId: string;
}

export interface PressArticle {
  id: string;
  title: string;
  author: string;
  summary: string;
  content: string;
  category: Category;
  tags: string[];
  image?: { data: string; type: string };
  date: Date;
  isFavorite: boolean;
  reactions: Record<ReactionType, number>;
  customReactions: CustomReaction[];
  comments: Comment[];
}

export interface Post {
  id: string;
  content: string;
  author: string;
  userId: string;
  date: Date;
  media?: {
    type: 'image' | 'video' | 'document' | 'voice';
    url: string;
    thumbnail?: string;
    duration?: number;
  }[];
  reactions: Record<ReactionType, number>;
  customReactions: CustomReaction[];
  comments: Comment[];
  shares: number;
  isFavorite: boolean;
}

export type ReactionType = 'like' | 'love' | 'celebrate' | 'interesting';

export interface CustomReaction {
  id: string;
  emoji: string;
  name: string;
  count: number;
  users: string[];
}

export interface Comment {
  id: string;
  postId?: string;
  eventId?: string;
  author: string;
  text: string;
  date: Date;
  parentId?: string;
  replies?: Comment[];
}

export interface CulturalContextType {
  state: {
    events: CulturalEvent[];
    birthdays: ArtistBirthday[];
    tasks: CulturalTask[];
    contacts: Contact[];
    notifications: Notification[];
    pressArticles: PressArticle[];
    posts: Post[];
    currentUser: User;
    users: User[];
  };
  dispatch: React.Dispatch<CulturalAction>;
}

export type CulturalAction =
  | { type: 'ADD_EVENT'; payload: CulturalEvent }
  | { type: 'UPDATE_EVENT'; payload: CulturalEvent }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'ADD_BIRTHDAY'; payload: ArtistBirthday }
  | { type: 'UPDATE_BIRTHDAY'; payload: ArtistBirthday }
  | { type: 'DELETE_BIRTHDAY'; payload: string }
  | { type: 'ADD_TASK'; payload: CulturalTask }
  | { type: 'UPDATE_TASK'; payload: CulturalTask }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_CONTACT'; payload: Contact }
  | { type: 'UPDATE_CONTACT'; payload: Contact }
  | { type: 'DELETE_CONTACT'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'ADD_PRESS_ARTICLE'; payload: PressArticle }
  | { type: 'UPDATE_PRESS_ARTICLE'; payload: PressArticle }
  | { type: 'DELETE_PRESS_ARTICLE'; payload: string }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'UPDATE_POST'; payload: Post }
  | { type: 'DELETE_POST'; payload: string }
  | { type: 'ADD_REACTION'; payload: { entityId: string; reactionType: ReactionType | CustomReaction } }
  | { type: 'ADD_COMMENT'; payload: { entityId: string; comment: Comment } }
  | { type: 'FOLLOW_USER'; payload: string }
  | { type: 'UNFOLLOW_USER'; payload: string };