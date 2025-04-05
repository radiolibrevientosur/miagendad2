import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { EventForm } from './components/EventForm';
import { EventList } from './components/EventList';
import { EventDetails } from './components/EventDetails';
import { Navbar } from './components/Navbar';
import { FavoritesSection } from './components/FavoritesSection';
import { ProfileEditor } from './components/ProfileEditor';
import { useEvents } from './hooks/useEvents';
import { EventFormData, ActiveSection } from './types';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const [editingEvent, setEditingEvent] = useState<EventFormData | undefined>();
  const { events, addEvent, updateEvent, deleteEvent, toggleFavorite, filters, setFilters } = useEvents();

  const handleEdit = (event: EventFormData) => {
    setEditingEvent(event);
    setActiveSection('create');
  };

  const handleSubmit = (eventData: Omit<EventFormData, 'id'>) => {
    if (editingEvent) {
      updateEvent({ ...eventData, id: editingEvent.id });
    } else {
      addEvent(eventData);
    }
    setActiveSection(null);
  };

  const handleCloseForm = () => {
    setActiveSection(null);
    setEditingEvent(undefined);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'search':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-16 left-0 right-0 bg-white shadow-lg p-4 z-40"
          >
            <EventList
              events={events}
              onEdit={handleEdit}
              onDelete={deleteEvent}
              filters={filters}
              onFilterChange={setFilters}
              onToggleFavorite={toggleFavorite}
            />
          </motion.div>
        );
      case 'favorites':
        return (
          <FavoritesSection
            events={events}
            onEdit={handleEdit}
            onDelete={deleteEvent}
            onToggleFavorite={toggleFavorite}
          />
        );
      case 'create':
        return (
          <EventForm
            onSubmit={handleSubmit}
            onClose={handleCloseForm}
            initialData={editingEvent}
          />
        );
      case 'profile':
        return <ProfileEditor />;
      default:
        return null;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 pb-16">
        <Toaster position="top-right" />
        
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Agenda Cultural</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route
              path="/"
              element={
                <EventList
                  events={events}
                  onEdit={handleEdit}
                  onDelete={deleteEvent}
                  filters={filters}
                  onFilterChange={setFilters}
                  onToggleFavorite={toggleFavorite}
                />
              }
            />
            <Route
              path="/event/:id"
              element={
                <EventDetails
                  events={events}
                  onEdit={handleEdit}
                  onDelete={deleteEvent}
                  onToggleFavorite={toggleFavorite}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Active Section */}
        <AnimatePresence>
          {activeSection && renderActiveSection()}
        </AnimatePresence>

        {/* Bottom Navigation */}
        <Navbar activeSection={activeSection} onSectionChange={setActiveSection} />
      </div>
    </Router>
  );
}

export default App;