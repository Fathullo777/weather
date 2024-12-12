import React from 'react';
import { WiDaySunny, WiRain, WiSnow, WiCloud, WiStrongWind } from 'react-icons/wi';

export const CurrentWeather = ({ weatherData, city }) => {
  const getWeatherIcon = (condition) => {
    if (condition.includes('sun')) return <WiDaySunny className="w-12 h-12 text-yellow-500" />;
    if (condition.includes('rain')) return <WiRain className="w-12 h-12 text-blue-500" />;
    if (condition.includes('snow')) return <WiSnow className="w-12 h-12 text-blue-300" />;
    if (condition.includes('cloud')) return <WiCloud className="w-12 h-12 text-gray-500" />;
    return <WiStrongWind className="w-12 h-12 text-gray-400" />;
  };

  return (
    <div className="text-center">
      <h2 className="text-xl font-bold text-blue-900">
        {city.name}, {city.country}
      </h2>
      <div className="flex justify-center items-center gap-4 mt-4">
        {getWeatherIcon(weatherData.condition.toLowerCase())}
        <div>
          <p className="text-4xl font-semibold text-blue-800">
            {Math.round(weatherData.temperature)}°C
          </p>
          <p className="text-blue-700">{weatherData.condition}</p>
        </div>
      </div>
      <p className="text-blue-600 mt-4">
        Ощущается как: {Math.round(weatherData.feelsLike)}°C
      </p>
    </div>
  );
};
