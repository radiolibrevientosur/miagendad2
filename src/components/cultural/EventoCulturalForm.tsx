import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ImageUpload } from '../ui/ImageUpload';
import { CalendarDays, Users, Tags, FileText, Phone, AtSign, DollarSign, RefreshCw, HelpCircle } from 'lucide-react';

const CATEGORIES = [
  'CINE Y MEDIOS AUDIOVISUALES',
  'ARTES VISUALES',
  'ARTES ESCÉNICAS Y MUSICALES',
  'PROMOCIÓN DEL LIBRO Y LA LECTURA',
  'PATRIMONIO CULTURAL',
  'ECONOMÍA CULTURAL',
  'OTROS'
] as const;

const EVENT_TYPES: Record<typeof CATEGORIES[number], string[]> = {
  'CINE Y MEDIOS AUDIOVISUALES': ['cine foro', 'proyección de cine', 'radio', 'realización audiovisual'],
  'ARTES VISUALES': ['dibujo y pintura', 'escultura', 'fotografía', 'constructivismo', 'arte conceptual', 'muralismo'],
  'ARTES ESCÉNICAS Y MUSICALES': ['teatro', 'danza', 'música', 'circo'],
  'PROMOCIÓN DEL LIBRO Y LA LECTURA': ['creación y expresividad literaria', 'promoción de lectura', 'club de libros'],
  'PATRIMONIO CULTURAL': ['historia local', 'historia general', 'costumbres y tradiciones', 'cultura popular', 'identidad cultural'],
  'ECONOMÍA CULTURAL': ['industrias culturales', 'proyectos culturales', 'portafolios culturales (emprendimientos)', 'finanzas culturales'],
  'OTROS': []
};

const recurrenceSchema = z.object({
  type: z.enum(['none', 'daily', 'weekly', 'monthly', 'custom']),
  interval: z.number().optional(),
  end_date: z.string().optional(),
  days_of_week: z.array(z.number().min(0).max(6)).optional(),
});

const eventSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  category: z.enum(CATEGORIES),
  event_type: z.string().min(1, 'Selecciona un tipo de evento'),
  date: z.string().min(1, 'La fecha es requerida'),
  location: z.string().min(3, 'La ubicación es requerida'),
  target_audience: z.enum(['Infantil', 'Adultos', 'Todos']),
  cost: z.object({
    type: z.enum(['free', 'paid']),
    amount: z.number().optional()
  }),
  responsible_person: z.object({
    name: z.string().min(3, 'El nombre es requerido'),
    phone: z.string().min(6, 'El teléfono es requerido'),
    social_media: z.string().optional()
  }),
  technical_requirements: z.array(z.string()).default([]),
  image_url: z.string().optional(),
  tags: z.array(z.string()).default([]),
  recurrence: recurrenceSchema.default({ type: 'none' })
});

interface EventFormProps {
  event?: z.infer<typeof eventSchema> & { id?: string };
  onComplete?: () => void;
}

export const EventoCulturalForm: React.FC<EventFormProps> = ({ event, onComplete }) => {
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[number] | ''>('');
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: event || {
      cost: { type: 'free' },
      technical_requirements: [],
      tags: [],
      recurrence: { type: 'none' }
    }
  });

  const costType = watch('cost.type');
  const recurrenceType = watch('recurrence.type');
  const category = watch('category');

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as typeof CATEGORIES[number];
    setSelectedCategory(newCategory);
    setValue('category', newCategory);
    setValue('event_type', '');
  };

  const uploadImage = async (file: File) => {
    const fileName = `events/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('event_images')
      .upload(fileName, file);

    if (data) {
      return supabase.storage.from('event_images').getPublicUrl(data.path).data.publicUrl;
    }
    return null;
  };

  const onSubmit = async (formData: z.infer<typeof eventSchema>) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    try {
      const payload = {
        ...formData,
        user_id: userData.user.id,
        date: new Date(formData.date).toISOString(),
        recurrence: {
          ...formData.recurrence,
          end_date: formData.recurrence.end_date ? new Date(formData.recurrence.end_date).toISOString() : null
        }
      };

      if (event?.id) {
        const { error } = await supabase
          .from('events')
          .update(payload)
          .eq('id', event.id);
      } else {
        const { error } = await supabase
          .from('events')
          .insert(payload);
      }

      if (!error) onComplete?.();
    } catch (error) {
      console.error('Error al guardar el evento:', error);
      alert('Error al guardar el evento. Por favor, intente nuevamente.');
    }
  };

  const handleImageChange = async (file: File | undefined) => {
    if (!file) {
      setValue('image_url', undefined);
      return;
    }
    
    const imageUrl = await uploadImage(file);
    if (imageUrl) setValue('image_url', imageUrl);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-cultural-escenicas text-white">
        <h2 className="text-xl font-bold">{event ? 'Editar' : 'Nuevo'} Evento Cultural</h2>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Se mantienen todos los elementos del formulario anteriores */}
        {/* ... */}
        
        {/* Imagen */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Imagen del Evento
          </label>
          <ImageUpload
            onChange={handleImageChange}
            initialImage={event?.image_url}
            className="w-full"
          />
        </div>

        {/* Resto del formulario */}
        {/* ... */}

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
            {event ? 'Guardar Cambios' : 'Crear Evento'}
          </button>
        </div>
      </form>
    </div>
  );
};