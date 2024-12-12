import React, { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  feelsLike: number;
  pressure: number;
  windSpeed: number;
  windDirection: string;
  condition: string;
}

interface CityData {
  name: string;
  country: string;
}

interface ForecastItem {
  date: string;
  dayName: string;
  temperature: number;
  minTemp: number;
  condition: string;
}

interface HourlyForecastItem {
  time: string;
  temperature: number;
  condition: string;
}

const getWindDirection = (deg: number): string => {
  if (deg >= 0 && deg < 45) return 'Северный';
  if (deg >= 45 && deg < 135) return 'Восточный';
  if (deg >= 135 && deg < 225) return 'Южный';
  if (deg >= 225 && deg < 315) return 'Западный';
  return 'Северный';
};

const formatTemperature = (temp: number): string => `${Math.round(temp)}°C`;

const WeatherIcon: React.FC<{ condition: string }> = ({ condition }) => {
  // Здесь можете подключить иконки для разных погодных условий
  return <span>{condition}</span>;
};

const WeatherApp: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState<CityData | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastItem[]>([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Москва&appid=YOUR_API_KEY&units=metric&lang=ru`);
        const data = await res.json();
        setWeatherData({
          temperature: data.main.temp,
          feelsLike: data.main.feels_like,
          pressure: data.main.pressure,
          windSpeed: data.wind.speed,
          windDirection: getWindDirection(data.wind.deg),
          condition: data.weather[0].description,
        });

        setCity({
          name: data.name,
          country: data.sys.country,
        });

        // Подгрузка прогноза на 7 дней
        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=current,minutely,hourly&appid=YOUR_API_KEY&units=metric&lang=ru`);
        const forecastData = await forecastRes.json();
        setForecast(forecastData.daily.map((item: any) => ({
          date: new Date(item.dt * 1000).toLocaleDateString('ru-RU'),
          dayName: new Date(item.dt * 1000).toLocaleDateString('ru-RU', { weekday: 'long' }),
          temperature: item.temp.day,
          minTemp: item.temp.min,
          condition: item.weather[0].description,
        })));

        // Подгрузка почасового прогноза
        const hourlyRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=YOUR_API_KEY&units=metric&lang=ru`);
        const hourlyData = await hourlyRes.json();
        setHourlyForecast(hourlyData.list.slice(0, 24).map((item: any) => ({
          time: new Date(item.dt * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          temperature: item.main.temp,
          condition: item.weather[0].description,
        })));
      } catch (error) {
        console.error('Ошибка при загрузке данных о погоде:', error);
      }
    };

    fetchWeatherData();
  }, []);

  return (
    <div className="weather-app">
      <div className="current-weather">
        {weatherData && city && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-5xl font-bold">{formatTemperature(weatherData.temperature)}</h2>
                <p className="text-gray-600">{city.name}, {city.country}</p>
              </div>
              <WeatherIcon condition={weatherData.condition} className="w-16 h-16 text-yellow-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <span>Ощущается как {formatTemperature(weatherData.feelsLike)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span>{weatherData.pressure} мм рт.ст.</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span>{weatherData.windSpeed} м/с, {weatherData.windDirection}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="forecast">
        <h3 className="text-3xl font-bold mb-6">Прогноз на 7 дней</h3>
        <div className="grid grid-cols-7 gap-4">
          {forecast.map((item) => (
            <div key={item.date} className="bg-white rounded-lg shadow-lg p-4">
              <h4 className="text-xl font-bold">{item.dayName}</h4>
              <p className="text-gray-600">{item.date}</p>
              <p className="text-lg">{formatTemperature(item.temperature)}</p>
              <p className="text-sm">{item.condition}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="hourly-forecast">
        <h3 className="text-3xl font-bold mb-6">Почасовой прогноз</h3>
        <div className="grid grid-cols-4 gap-4">
          {hourlyForecast.map((item) => (
            <div key={item.time} className="bg-white rounded-lg shadow-lg p-4">
              <h4 className="text-lg font-bold">{item.time}</h4>
              <p className="text-lg">{formatTemperature(item.temperature)}</p>
              <p className="text-sm">{item.condition}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
