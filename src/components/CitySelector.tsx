import React from 'react';
import { MapPin } from 'lucide-react';

interface CitySelectorProps {
  onSelectCity: () => void;
}

export const CitySelector: React.FC<CitySelectorProps> = ({ onSelectCity }) => {
  return (
    <button
      onClick={onSelectCity}
      className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
      aria-label="Выбрать город"
    >
      <MapPin className="w-4 h-4" />
      <span>Выбрать город</span>
    </button>
  );
};
