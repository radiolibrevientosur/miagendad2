import React from 'react';
import { Home, Heart, PlusCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { ActiveSection } from '../types';

interface NavbarProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onSectionChange }) => {
  const handleClick = (section: ActiveSection) => {
    onSectionChange(activeSection === section ? null : section);
  };

  const navItems = [
    { id: 'search', icon: Home, label: 'Inicio' },
    { id: 'favorites', icon: Heart, label: 'Favoritos' },
    { id: 'create', icon: PlusCircle, label: 'Crear' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => handleClick(id as ActiveSection)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                activeSection === id
                  ? 'text-purple-600'
                  : 'text-gray-500 hover:text-purple-600'
              }`}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Icon className="h-6 w-6" />
              </motion.div>
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};