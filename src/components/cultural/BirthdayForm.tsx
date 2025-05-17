import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ImageUpload } from '../ui/ImageUpload';

const birthdaySchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  birth_date: z.string().min(1, 'La fecha es requerida'),
  role: z.string().min(3, 'El rol es requerido'),
  trajectory: z.string().min(10, 'La trayectoria debe tener al menos 10 caracteres'),
  discipline: z.enum(['Teatro', 'Danza', 'Artes Visuales', 'Música', 'Literatura']),
  contact_info: z.object({
    email: z.string().email('Email inválido'),
    phone: z.string().min(6, 'El teléfono es requerido')
  }),
  image_url: z.string().optional(),
  is_favorite: z.boolean().default(false)
});

interface BirthdayFormProps {
  birthday?: z.infer<typeof birthdaySchema> & { id?: string };
  onComplete?: () => void;
}

export const BirthdayForm: React.FC<BirthdayFormProps> = ({ birthday, onComplete }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<z.infer<typeof birthdaySchema>>({
    resolver: zodResolver(birthdaySchema),
    defaultValues: birthday ? {
      ...birthday,
      birth_date: birthday.birth_date.split('T')[0]
    } : {
      is_favorite: false
    }
  });

  const uploadImage = async (file: File) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const filePath = `birthdays/${userData.user.id}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('birthdays')
      .upload(filePath, file);

    if (data) {
      return supabase.storage.from('birthdays').getPublicUrl(data.path).data.publicUrl;
    }
    return null;
  };

  const handleImageChange = async (file: File | undefined) => {
    if (!file) {
      setValue('image_url', undefined);
      return;
    }
    
    const imageUrl = await uploadImage(file);
    if (imageUrl) setValue('image_url', imageUrl);
  };

  const onSubmit = async (data: z.infer<typeof birthdaySchema>) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    try {
      const payload = {
        ...data,
        user_id: userData.user.id,
        birth_date: new Date(data.birth_date).toISOString()
      };

      if (birthday?.id) {
        await supabase
          .from('birthdays')
          .update(payload)
          .eq('id', birthday.id);
      } else {
        await supabase
          .from('birthdays')
          .insert(payload);
      }

      onComplete?.();
    } catch (error) {
      console.error('Error al guardar el cumpleaños:', error);
      alert('Error al guardar el registro. Por favor, intente nuevamente.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-cultural-visuales text-white">
        <h2 className="text-xl font-bold">{birthday ? 'Editar' : 'Nuevo'} Cumpleaños</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-800 mb-2">
            Imagen
          </label>
          <ImageUpload
            onChange={handleImageChange}
            initialImage={birthday?.image_url}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Nombre</label>
            <input
              type="text"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-visuales focus:ring focus:ring-cultural-visuales focus:ring-opacity-50"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Fecha de Nacimiento</label>
            <input
              type="date"
              {...register('birth_date')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-visuales focus:ring focus:ring-cultural-visuales focus:ring-opacity-50"
            />
            {errors.birth_date && (
              <p className="mt-1 text-sm text-red-600">{errors.birth_date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Rol</label>
            <input
              type="text"
              {...register('role')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-visuales focus:ring focus:ring-cultural-visuales focus:ring-opacity-50"
              placeholder="Ej: Actor, Director, Músico..."
            />
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Disciplina Artística</label>
            <select
              {...register('discipline')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-visuales focus:ring focus:ring-cultural-visuales focus:ring-opacity-50"
            >
              <option value="">Seleccionar disciplina...</option>
              <option value="Teatro">Teatro</option>
              <option value="Danza">Danza</option>
              <option value="Artes Visuales">Artes Visuales</option>
              <option value="Música">Música</option>
              <option value="Literatura">Literatura</option>
            </select>
            {errors.discipline && (
              <p className="mt-1 text-sm text-red-600">{errors.discipline.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
            <input
              type="email"
              {...register('contact_info.email')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-visuales focus:ring focus:ring-cultural-visuales focus:ring-opacity-50"
            />
            {errors.contact_info?.email && (
              <p className="mt-1 text-sm text-red-600">{errors.contact_info.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Teléfono</label>
            <input
              type="tel"
              {...register('contact_info.phone')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-visuales focus:ring focus:ring-cultural-visuales focus:ring-opacity-50"
            />
            {errors.contact_info?.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.contact_info.phone.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Trayectoria</label>
          <textarea
            {...register('trajectory')}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-cultural-visuales focus:ring focus:ring-cultural-visuales focus:ring-opacity-50"
          />
          {errors.trajectory && (
            <p className="mt-1 text-sm text-red-600">{errors.trajectory.message}</p>
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
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cultural-visuales hover:bg-cultural-visuales/90"
          >
            {birthday ? 'Guardar Cambios' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};