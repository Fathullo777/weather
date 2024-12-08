import React from 'react';
import { Thermometer, Droplets, Wind } from 'lucide-react';
import { WeatherData, City } from '../types/weather';
import { formatTemperature, getWindDescription, getPressureDescription } from '../utils/weather';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherProps {
  weatherData: WeatherData;
  city: City;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weatherData, city }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-5xl font-bold">{formatTemperature(weatherData.temperature)}</h2>
          <p className="text-gray-600">Сегодня</p>
        </div>
        <WeatherIcon condition={weatherData.condition} className="w-16 h-16 text-yellow-400" />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Thermometer className="w-5 h-5" />
          <span>Ощущается как {formatTemperature(weatherData.feelsLike)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <Droplets className="w-5 h-5" />
          <span>{weatherData.pressure} мм рт.ст. - {getPressureDescription(weatherData.pressure)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <Wind className="w-5 h-5" />
          <span>{weatherData.windSpeed} м/с {weatherData.windDirection} - {getWindDescription(weatherData.windSpeed)}</span>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t">
        <p className="text-gray-600">Город: {city.name}, {city.country}</p>
      </div>
    </div>
  );
};
