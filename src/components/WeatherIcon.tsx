import React from 'react';
import { Sun, Cloud, CloudRain, Snowflake } from 'lucide-react';

interface WeatherIconProps {
  condition: string;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ condition, className }) => {
  const lowerCaseCondition = condition.toLowerCase();

  switch (lowerCaseCondition) {
    case 'солнечно':
      return <Sun className={className} />;
    case 'облачно':
      return <Cloud className={className} />;
    case 'дождь':
      return <CloudRain className={className} />;
    case 'снег':
      return <Snowflake className={className} />;
    default:
      return <Sun className={className} />;
  }
};
