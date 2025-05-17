import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ImageUpload } from '../ui/ImageUpload';
import type { PressArticle } from '../../types/cultural';

const articleSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  content: z.string().min(1, "El contenido es requerido"),
  category: z.enum([
    'CINE Y MEDIOS AUDIOVISUALES',
    'ARTES VISUALES',
    'ARTES ESCÉNICAS Y MUSICALES',
    'PROMOCIÓN DEL LIBRO Y LA LECTURA',
    'PATRIMONIO CULTURAL',
    'ECONOMÍA CULTURAL',
    'OTROS'
  ]),
  tags: z.string().transform((tags) => 
    tags.split(',').map(tag => tag.trim())
  ), // Coma añadida aquí
  image: z.instanceof(File).optional(),
  isFavorite: z.boolean().default(false)
});

interface PressArticleFormProps {
  article?: PressArticle;
  onComplete?: () => void;
}

export const PressArticleForm: React.FC<PressArticleFormProps> = ({ article, onComplete }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<z.infer<typeof pressArticleSchema>>({
    resolver: zodResolver(pressArticleSchema),
    defaultValues: article ? {
      ...article,
      tags: article.tags.join(', '),
      image: undefined,
      isFavorite: article.isFavorite
    } : {
      tags: '',
      isFavorite: false
    }
  });

  const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('press_images')
      .upload(fileName, file);

    if (data) {
      return supabase.storage.from('press_images').getPublicUrl(data.path).data.publicUrl;
    }
    return null;
  };

  const onSubmit = async (data: z.infer<typeof pressArticleSchema>) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    let imageUrl = article?.image_url || null;
    if (data.image) {
      imageUrl = await uploadImage(data.image);
    }

    const payload = {
      user_id: userData.user.id,
      title: data.title,
      author: data.author,
      summary: data.summary,
      content: data.content,
      category: data.category,
      tags: data.tags,
      image_url: imageUrl,
      is_favorite: data.isFavorite,
      date: new Date().toISOString()
    };

    if (article) {
      // Actualizar artículo existente
      const { error } = await supabase
        .from('press_articles')
        .update(payload)
        .eq('id', article.id);
      
      if (!error) onComplete?.();
    } else {
      // Crear nuevo artículo
      const { error } = await supabase
        .from('press_articles')
        .insert(payload);
      
      if (!error) onComplete?.();
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-cultural-escenicas text-white">
        <h2 className="text-xl font-bold">{article ? 'Editar' : 'Nuevo'} Artículo de Prensa</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Imagen Principal
          </label>
          <ImageUpload
            onChange={(file) => setValue('image', file)}
            initialImage={article?.image_url}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Título
            </label>
            <input
              type="text"
              {...register('title')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Autor
            </label>
            <input
              type="text"
              {...register('author')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Categoría
            </label>
            <select
              {...register('category')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
            >
              <option value="">Seleccionar categoría...</option>
              <option value="CINE Y MEDIOS AUDIOVISUALES">Cine y Medios Audiovisuales</option>
              <option value="ARTES VISUALES">Artes Visuales</option>
              <option value="ARTES ESCÉNICAS Y MUSICALES">Artes Escénicas y Musicales</option>
              <option value="PROMOCIÓN DEL LIBRO Y LA LECTURA">Promoción del Libro y la Lectura</option>
              <option value="PATRIMONIO CULTURAL">Patrimonio Cultural</option>
              <option value="ECONOMÍA CULTURAL">Economía Cultural</option>
              <option value="OTROS">Otros</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Etiquetas (separadas por comas)
            </label>
            <input
              type="text"
              {...register('tags')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
              placeholder="Ej: cultura, arte, sociedad"
            />
            {errors.tags && (
              <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Resumen
          </label>
          <textarea
            {...register('summary')}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
          />
          {errors.summary && (
            <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Contenido
          </label>
          <textarea
            {...register('content')}
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => onComplete?.()}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cultural-escenicas hover:bg-cultural-escenicas/90"
          >
            {article ? 'Guardar Cambios' : 'Publicar'}
          </button>
        </div>
      </form>
    </div>
  );
};