import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { Send, Image, Video, FileText } from 'lucide-react';
import type { Database } from '../../types/supabase';

type Post = Database['public']['Tables']['posts']['Insert'];

export const QuickPost: React.FC = () => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) toast.error('Error de autenticación');
      setUserId(user?.id || null);
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return toast.error('Escribe algo antes de publicar');
    if (!userId) return toast.error('Debes iniciar sesión');

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: userId,
          content: content.trim(),
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      setContent('');
      toast.success('¡Publicado exitosamente!');
      
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex gap-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="¿Qué está pasando en la escena cultural?"
          className="flex-1 resize-none border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-cultural-escenicas focus:border-cultural-escenicas"
          rows={3}
          disabled={isSubmitting}
          maxLength={2000}
        />
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="flex gap-2">
          <button type="button" className="p-2 text-gray-400 cursor-not-allowed" disabled>
            <Image className="h-5 w-5" />
          </button>
          <button type="button" className="p-2 text-gray-400 cursor-not-allowed" disabled>
            <Video className="h-5 w-5" />
          </button>
          <button type="button" className="p-2 text-gray-400 cursor-not-allowed" disabled>
            <FileText className="h-5 w-5" />
          </button>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="px-4 py-2 bg-cultural-escenicas text-white rounded-lg hover:bg-cultural-escenicas/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Publicando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Publicar
            </span>
          )}
        </button>
      </div>
    </form>
  );
};