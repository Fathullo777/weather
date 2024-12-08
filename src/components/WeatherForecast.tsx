import React from 'react';
import { ForecastDay } from '../types/weather';
import { ForecastCard } from './ForecastCard';

interface WeatherForecastProps {
  forecast: ForecastDay[];
}

export const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecast }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {forecast.map((day) => (
        <ForecastCard key={day.date} forecast={day} />
      ))}
    </div>
  );
};