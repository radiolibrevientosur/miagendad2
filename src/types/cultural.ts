// Add to the User interface
export interface User {
  id: string;
  username: string; // Add this line
  name: string;
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