import React from 'react';

export const WeatherForecast = ({ forecast }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-blue-900 text-center">Прогноз на неделю</h2>
      <div className="grid grid-cols-2 gap-4">
        {forecast.map((day, index) => (
          <div key={index} className="bg-blue-50 p-4 rounded-lg shadow text-center">
            <p className="text-blue-900 font-semibold">{day.dayName}</p>
            <p className="text-blue-700">{day.date}</p>
            <p className="text-2xl font-bold text-blue-800">{day.temperature}°C</p>
            <p className="text-blue-600">{day.condition}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
