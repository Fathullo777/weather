import React from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudSun } from 'lucide-react';

interface WeatherIconProps {
  condition: string;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ condition, className = 'w-8 h-8' }) => {
  const icons = {
    sunny: <Sun className={className} />,
    cloudy: <Cloud className={className} />,
    rain: <CloudRain className={className} />,
    snow: <CloudSnow className={className} />,
    'partly-cloudy': <CloudSun className={className} />,
  };

  return icons[condition as keyof typeof icons] || <Cloud className={className} />;
};
