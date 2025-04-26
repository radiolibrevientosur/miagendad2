import React, { useState } from 'react';
import { CulturalProvider } from './context/CulturalContext';
import { Calendar, Heart, Users, Home, PlusCircle, Sun, Moon } from 'lucide-react';
import { EventoCulturalForm } from './components/cultural/EventoCulturalForm';
import { BirthdayForm } from './components/cultural/BirthdayForm';
import { TaskForm } from './components/cultural/TaskForm';
import { EventCard } from './components/cultural/EventCard';
import { BirthdayCulturalCard } from './components/cultural/BirthdayCulturalCard';
import { TaskCulturalKanban } from './components/cultural/TaskCulturalKanban';
import { CalendarView } from './components/cultural/CalendarView';
import { ContactList } from './components/cultural/ContactList';
import { OfflineIndicator } from './components/ui/OfflineIndicator';
import { useTheme } from './hooks/useTheme';
import { useCultural } from './context/CulturalContext';
import type { CulturalEvent } from './types/cultural';

type ActiveView = 'inicio' | 'crear' | 'favoritos' | 'contactos' | 'nuevo-evento' | 'nuevo-cumpleanos' | 'nueva-tarea' | 'calendario';

function Dashboard() {
  const { state } = useCultural();
  const [editingEvent, setEditingEvent] = useState<CulturalEvent | null>(null);
  
  return (
    <div className="space-y-8">
      {editingEvent ? (
        <EventoCulturalForm 
          event={editingEvent} 
          onComplete={() => setEditingEvent(null)} 
        />
      ) : (
        <div className="space-y-12">
          {/* Eventos Culturales */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Eventos Culturales</h2>
              <button
                onClick={() => setEditingEvent(null)}
                className="px-4 py-2 bg-cultural-escenicas text-white rounded-lg hover:bg-cultural-escenicas/90 transition-colors flex items-center gap-2"
              >
                <PlusCircle className="h-5 w-5" />
                Nuevo Evento
              </button>
            </div>
            {state.events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.events.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onEdit={setEditingEvent}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No hay eventos creados</p>
                <button
                  onClick={() => setEditingEvent(null)}
                  className="mt-4 px-4 py-2 text-cultural-escenicas hover:text-cultural-escenicas/90 font-medium"
                >
                  Crear primer evento
                </button>
              </div>
            )}
          </section>

          {/* Próximos Cumpleaños */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Próximos Cumpleaños</h2>
              <button
                onClick={() => {}}
                className="px-4 py-2 bg-cultural-visuales text-white rounded-lg hover:bg-cultural-visuales/90 transition-colors flex items-center gap-2"
              >
                <PlusCircle className="h-5 w-5" />
                Nuevo Cumpleaños
              </button>
            </div>
            {state.birthdays.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.birthdays.map(birthday => (
                  <BirthdayCulturalCard key={birthday.id} birthday={birthday} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No hay cumpleaños registrados</p>
                <button
                  onClick={() => {}}
                  className="mt-4 px-4 py-2 text-cultural-visuales hover:text-cultural-visuales/90 font-medium"
                >
                  Registrar primer cumpleaños
                </button>
              </div>
            )}
          </section>

          {/* Tareas */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tareas</h2>
              <button
                onClick={() => {}}
                className="px-4 py-2 bg-cultural-musicales text-white rounded-lg hover:bg-cultural-musicales/90 transition-colors flex items-center gap-2"
              >
                <PlusCircle className="h-5 w-5" />
                Nueva Tarea
              </button>
            </div>
            {state.tasks.length > 0 ? (
              <TaskCulturalKanban />
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No hay tareas creadas</p>
                <button
                  onClick={() => {}}
                  className="mt-4 px-4 py-2 text-cultural-musicales hover:text-cultural-musicales/90 font-medium"
                >
                  Crear primera tarea
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function CreateMenu({ onSelectOption }: { onSelectOption: (view: ActiveView) => void }) {
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Crear Nuevo</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => onSelectOption('nuevo-evento')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-lg text-cultural-escenicas">Evento Cultural</h3>
            <Calendar className="h-6 w-6 text-cultural-escenicas opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Crear un nuevo evento cultural con todos los detalles</p>
        </button>

        <button 
          onClick={() => onSelectOption('nuevo-cumpleanos')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-lg text-cultural-visuales">Cumpleaños</h3>
            <Calendar className="h-6 w-6 text-cultural-visuales opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Agregar un nuevo cumpleaños al calendario</p>
        </button>

        <button 
          onClick={() => onSelectOption('nueva-tarea')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-lg text-cultural-musicales">Tarea</h3>
            <Calendar className="h-6 w-6 text-cultural-musicales opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Crear una nueva tarea o recordatorio</p>
        </button>
      </div>
    </div>
  );
}

function Favorites() {
  const { state } = useCultural();
  
  const favoriteEvents = state.events.filter(event => event.isFavorite);
  const favoriteBirthdays = state.birthdays.filter(birthday => birthday.isFavorite);
  const favoriteTasks = state.tasks.filter(task => task.isFavorite);
  const favoriteContacts = state.contacts?.filter(contact => contact.isFavorite) || [];
  
  return (
    <div className="p-4 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Favoritos</h2>
      
      {/* Eventos Favoritos */}
      <section>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Eventos Favoritos</h3>
        {favoriteEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event}
                onEdit={() => {}} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No hay eventos favoritos</p>
          </div>
        )}
      </section>

      {/* Cumpleaños Favoritos */}
      <section>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Cumpleaños Favoritos</h3>
        {favoriteBirthdays.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteBirthdays.map(birthday => (
              <BirthdayCulturalCard key={birthday.id} birthday={birthday} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No hay cumpleaños favoritos</p>
          </div>
        )}
      </section>

      {/* Tareas Favoritas */}
      <section>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Tareas Favoritas</h3>
        {favoriteTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteTasks.map(task => (
              <div key={task.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{task.description}</p>
                <div className="mt-4">
                  <span className={`inline-block px-2 py-1 text-sm rounded ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No hay tareas favoritas</p>
          </div>
        )}
      </section>

      {/* Contactos Favoritos */}
      <section>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Contactos Favoritos</h3>
        {favoriteContacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteContacts.map(contact => (
              <div key={contact.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h4 className="font-medium text-gray-900 dark:text-white">{contact.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{contact.role}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{contact.discipline}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No hay contactos favoritos</p>
          </div>
        )}
      </section>
    </div>
  );
}

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('inicio');
  const { theme, toggleTheme } = useTheme();

  const renderView = () => {
    switch (activeView) {
      case 'crear':
        return <CreateMenu onSelectOption={setActiveView} />;
      case 'nuevo-evento':
        return <EventoCulturalForm onComplete={() => setActiveView('inicio')} />;
      case 'nuevo-cumpleanos':
        return <BirthdayForm onComplete={() => setActiveView('inicio')} />;
      case 'nueva-tarea':
        return <TaskForm onComplete={() => setActiveView('inicio')} />;
      case 'favoritos':
        return <Favorites />;
      case 'contactos':
        return <ContactList />;
      case 'calendario':
        return <CalendarView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <CulturalProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <OfflineIndicator />
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex-shrink-0 flex items-center">
                <Calendar className="h-8 w-8 text-cultural-escenicas" />
                <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">Gestión Cultural</span>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8 mb-16">
          <div className="px-4 py-6 sm:px-0">
            {renderView()}
          </div>
        </main>

        <nav className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 fixed bottom-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-around h-16">
              <button
                onClick={() => setActiveView('inicio')}
                className={`flex flex-col items-center justify-center w-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  activeView === 'inicio' ? 'text-cultural-escenicas' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Home className="h-6 w-6" />
                <span className="mt-1 text-xs">Inicio</span>
              </button>
              <button
                onClick={() => setActiveView('crear')}
                className={`flex flex-col items-center justify-center w-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  activeView === 'crear' ? 'text-cultural-escenicas' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <PlusCircle className="h-6 w-6" />
                <span className="mt-1 text-xs">Crear</span>
              </button>
              <button
                onClick={() => setActiveView('favoritos')}
                className={`flex flex-col items-center justify-center w-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  activeView === 'favoritos' ? 'text-cultural-visuales' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Heart className="h-6 w-6" />
                <span className="mt-1 text-xs">Favoritos</span>
              </button>
              <button
                onClick={() => setActiveView('calendario')}
                className={`flex flex-col items-center justify-center w-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  activeView === 'calendario' ? 'text-cultural-musicales' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Calendar className="h-6 w-6" />
                <span className="mt-1 text-xs">Calendario</span>
              </button>
              <button
                onClick={() => setActiveView('contactos')}
                className={`flex flex-col items-center justify-center w-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  activeView === 'contactos' ? 'text-cultural-musicales' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Users className="h-6 w-6" />
                <span className="mt-1 text-xs">Contactos</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </CulturalProvider>
  );
}

export default App;
