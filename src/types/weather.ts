export interface WeatherData {
  temperature: number;
  feelsLike: number;
  pressure: number;
  precipitation: string;
  windSpeed: number;
  windDirection: string;
  condition?: string;
}

export interface ForecastDay {
  date: string;
  dayName: string;
  temperature: number;
  minTemp: number;
  condition: string;
}

export interface City {
  name: string;
  country: string;
}
