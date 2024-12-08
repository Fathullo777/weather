import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Sun } from 'lucide-react';
import { CurrentWeather } from './components/CurrentWeather';
import { WeatherForecast } from './components/WeatherForecast';
import { CitySelector } from './components/CitySelector';
import { WeatherData, ForecastDay, City } from './types/weather';
import { getDynamicCondition } from './utils/weather';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [city, setCity] = useState<City | null>(null);
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getCityFromGeolocation = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${import.meta.env.VITE_OPENCAGE_API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results[0]) {
        const { city, country } = data.results[0].components;
        setCity({ name: city, country: country });
        setPosition([latitude, longitude]);
        fetchWeatherData(city);
      }
    } catch (error) {
      console.error('Ошибка получения данных о городе:', error);
      setError('Не удалось определить город');
    }
  };

  const fetchWeatherData = async (cityName: string) => {
    if (!import.meta.env.VITE_API_KEY) {
      setError('Отсутствует ключ API');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${import.meta.env.VITE_API_KEY}&units=metric&lang=ru`
      );
      
      if (!weatherRes.ok) {
        throw new Error('Город не найден');
      }

      const weatherJson = await weatherRes.json();

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${import.meta.env.VITE_API_KEY}&units=metric&lang=ru`
      );
      const forecastJson = await forecastRes.json();

      setWeatherData({
        temperature: weatherJson.main.temp,
        feelsLike: weatherJson.main.feels_like,
        pressure: weatherJson.main.pressure,
        precipitation: weatherJson.weather[0].description,
        windSpeed: weatherJson.wind.speed,
        windDirection: getWindDirection(weatherJson.wind.deg),
        condition: getDynamicCondition(weatherJson.main.temp),
      });

      const forecastDays = forecastJson.list
        .filter((entry: any, index: number) => index % 8 === 0)
        .map((entry: any) => ({
          date: new Date(entry.dt * 1000).toLocaleDateString('ru-RU'),
          dayName: new Date(entry.dt * 1000)
            .toLocaleDateString('ru-RU', { weekday: 'long' })
            .replace(/^[А-Я]/, (c) => c.toLowerCase()),
          temperature: entry.main.temp,
          minTemp: entry.main.temp_min,
          condition: getDynamicCondition(entry.main.temp),
        }));

      setForecast(forecastDays);
    } catch (error) {
      setError('Не удалось загрузить данные о погоде');
      console.error('Ошибка загрузки погоды:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySelect = () => {
    const newCity = prompt('Введите название города:');
    if (newCity) {
      setCity({ name: newCity, country: '' });
      fetchWeatherData(newCity);
    }
  };

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getCityFromGeolocation(latitude, longitude);
        },
        (error) => {
          console.error('Ошибка получения геолокации', error);
          setError('Не удалось получить местоположение');
          setCity({ name: '', country: '' });
        }
      );
    } else {
      setError('Геолокация не поддерживается браузером');
      setCity({ name: '', country: '' });
    }
  }, []);

  const getWindDirection = (deg: number): string => {
    const directions = ['северный', 'северо-восточный', 'восточный', 'юго-восточный', 'южный', 'юго-западный', 'западный', 'северо-западный'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Sun className="w-8 h-8 text-blue-500" />
            <h1 className="text-xl font-bold text-blue-900">React Weather</h1>
          </div>
          <div className="flex items-center gap-2">
            {city && city.name && (
              <p className="text-lg text-blue-800">
                {city.name} {city.country && `, ${city.country}`}
              </p>
            )}
            <CitySelector onSelectCity={handleCitySelect} />
          </div>
        </header>

        <main className="space-y-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
            </div>
          ) : (
            weatherData && city && (
              <>
                <CurrentWeather weatherData={weatherData} city={city} />
                <WeatherForecast forecast={forecast} />
              </>
            )
          )}

          {position && !isLoading && (
            <div className="mt-8 rounded-lg overflow-hidden shadow-lg">
              <MapContainer 
                center={position} 
                zoom={13} 
                style={{ height: '400px', width: '100%' }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                  <Popup>
                    {city?.name} {city?.country && `, ${city.country}`}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
