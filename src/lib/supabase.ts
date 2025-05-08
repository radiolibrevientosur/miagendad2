import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Hybrid storage helper functions
export const hybridStorage = {
  async set(key: string, value: any) {
    try {
      // Store in localStorage
      localStorage.setItem(key, JSON.stringify(value));
      
      // If online, sync to Supabase
      if (navigator.onLine) {
        const { error } = await supabase.storage
          .from('cache')
          .upload(`${key}.json`, JSON.stringify(value), {
            upsert: true,
            contentType: 'application/json'
          });
          
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error storing data:', error);
    }
  },

  async get(key: string) {
    try {
      // Try localStorage first
      const localData = localStorage.getItem(key);
      
      // If online, try to get from Supabase
      if (navigator.onLine) {
        const { data, error } = await supabase.storage
          .from('cache')
          .download(`${key}.json`);
          
        if (!error && data) {
          const text = await data.text();
          const parsed = JSON.parse(text);
          // Update localStorage with latest data
          localStorage.setItem(key, JSON.stringify(parsed));
          return parsed;
        }
      }
      
      return localData ? JSON.parse(localData) : null;
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  },

  async clear() {
    try {
      localStorage.clear();
      if (navigator.onLine) {
        const { error } = await supabase.storage
          .from('cache')
          .empty();
          
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
};