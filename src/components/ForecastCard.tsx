import React from 'react';
import { ForecastDay } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { formatTemperature } from '../utils/weather';

interface ForecastCardProps {
  forecast: ForecastDay;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  return (
    <div className="bg-white/80 backdrop-blur rounded-lg p-4 text-center">
      <p className="font-medium">{forecast.dayName}</p>
      <p className="text-sm text-gray-500">{forecast.date}</p>
      <WeatherIcon condition={forecast.condition} className="w-8 h-8 mx-auto my-2" />
      <p className="font-bold">{formatTemperature(forecast.temperature)}</p>
      <p className="text-sm text-gray-500">{formatTemperature(forecast.minTemp)}</p>
    </div>
  );
};
