import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Sun } from 'lucide-react';
import { CurrentWeather } from './components/CurrentWeather';
import { WeatherForecast } from './components/WeatherForecast';
import { HourlyWeather } from './components/HourlyWeather';
import { getDynamicCondition } from './utils/weather';
import 'leaflet/dist/leaflet.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [city, setCity] = useState(null);
  const [position, setPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cityInput, setCityInput] = useState('');

  const getCityFromGeolocation = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${import.meta.env.VITE_OPENCAGE_API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results[0]) {
        const { city, country } = data.results[0].components;
        setCity({ name: city, country });
        setPosition([latitude, longitude]);
        fetchWeatherData(city);
      }
    } catch (error) {
      console.error('Error fetching city data:', error);
      setError('Unable to determine city');
    }
  };

  const fetchWeatherData = async (cityName) => {
    if (!import.meta.env.VITE_API_KEY) {
      setError('API key is missing');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${import.meta.env.VITE_API_KEY}&units=metric&lang=ru`
      );
      if (!weatherRes.ok) {
        throw new Error('City not found');
      }
      const weatherJson = await weatherRes.json();

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${import.meta.env.VITE_API_KEY}&units=metric&lang=ru`
      );
      const forecastJson = await forecastRes.json();

      setWeatherData({
        temperature: Math.round(weatherJson.main.temp),
        feelsLike: Math.round(weatherJson.main.feels_like),
        pressure: Math.round(weatherJson.main.pressure),
        precipitation: weatherJson.weather[0].description,
        windSpeed: Math.round(weatherJson.wind.speed),
        windDirection: getWindDirection(weatherJson.wind.deg),
        condition: getDynamicCondition(weatherJson.main.temp),
      });
      

      const forecastDays = forecastJson.list
      .filter((entry: any, index: number) => index % 8 === 0)
      .map((entry: any) => {
        const date = new Date(entry.dt * 1000);
        const dayNumber = date.getDay(); // 0 (воскресенье) - 6 (суббота)
    
        // Сдвиг, чтобы понедельник был первым днем
        const adjustedDayNumber = (dayNumber === 0 ? 7 : dayNumber) - 1;
    
        const daysOfWeek = [
          'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье',
        ];
    
        return {
          date: date.toLocaleDateString('ru-RU'),
          dayName: daysOfWeek[adjustedDayNumber],
          temperature: Math.round(entry.main.temp),
          minTemp: Math.round(entry.main.temp_min),
          condition: getDynamicCondition(entry.main.temp),
        };
      });
    
    

      const hourlyData = forecastJson.list.map((entry: any) => ({
        time: new Date(entry.dt * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        temperature: Math.round(entry.main.temp),
        condition: getDynamicCondition(entry.main.temp),
      }));
      

      setForecast(forecastDays);
      setHourlyForecast(hourlyData);
    } catch (error) {
      setError('Failed to load weather data');
      console.error('Weather fetch error:', error);
    } finally {
      setIsLoading(false);
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
          console.error('Geolocation error', error);
          setError('Unable to get location');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  }, []);

  const getWindDirection = (deg) => {
    const directions = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  const handleCityInput = (event) => {
    const newCity = event.target.value;
    setCityInput(newCity);
    if (newCity.trim()) {
      setCity({ name: newCity, country: '' });
      fetchWeatherData(newCity);
    }
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
            <input
              type="text"
              value={cityInput}
              onChange={handleCityInput}
              placeholder="Choose a city"
              className="border border-blue-300 px-4 py-2 rounded-lg"
            />
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
                <HourlyWeather hourlyForecast={hourlyForecast} />
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
