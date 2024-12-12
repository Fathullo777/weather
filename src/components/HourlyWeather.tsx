import React from 'react';

export const HourlyWeather = ({ hourlyForecast }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-blue-900 text-center">Почасовой прогноз</h2>
      <div className="grid grid-cols-3 gap-4">
        {hourlyForecast.map((hour, index) => (
          <div key={index} className="bg-blue-50 p-4 rounded-lg shadow text-center">
            <p className="text-blue-700">{hour.time}</p>
            <p className="text-2xl font-bold text-blue-800">{hour.temperature}°C</p>
            <p className="text-blue-600">{hour.condition}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
