import { WeatherData, ForecastDay } from '../types/weather';

export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}°`;
};

export const getWindDescription = (speed: number): string => {
  if (speed < 2) return 'штиль';
  if (speed < 5) return 'легкий ветер';
  if (speed < 10) return 'умеренный ветер';
  return 'сильный ветер';
};

export const getPressureDescription = (pressure: number): string => {
  if (pressure < 760) return 'пониженное';
  if (pressure > 770) return 'повышенное';
  return 'нормальное';
};
export const getDynamicCondition = (temp: number): string => {
  if (temp > 25) return 'sunny'; // Тепло и ясно
  if (temp > 15) return 'partly-cloudy'; // Переменная облачность
  if (temp > 5) return 'cloudy'; // Облачная погода
  if (temp > 0) return 'rain'; // Дождь
  return 'snow'; // Снег
};
