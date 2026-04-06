/**
 * Beach-related types and interfaces
 */

export interface Beach {
  id: string;
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  description: string;
  created_at: string;
}

export interface BeachList {
  total: number;
  beaches: Beach[];
}

/**
 * Wave data from Open-Meteo API
 */
export interface WaveData {
  height: number;
  direction?: number | null;
  period?: number | null;
  swell_height?: number | null;
  swell_period?: number | null;
}

/**
 * Wind data from Open-Meteo API
 */
export interface WindData {
  speed: number;
  direction?: number | null;
  gusts?: number | null;
}

/**
 * Weather data from Open-Meteo API
 */
export interface WeatherData {
  temperature: number;
  condition: string;
  weather_code: number;
  visibility?: number | null;
  precipitation?: number | null;
  cloud_cover?: number | null;
  humidity?: number | null;
}

/**
 * Activity ratings (0-10 scale)
 */
export interface ActivityRating {
  surf_rating: number;
  swim_rating: number;
  fishing_rating: number;
  overall_rating: number;
}

/**
 * AI Analysis from Groq
 */
export interface AIReview {
  summary: string;
  recommendation: string;
  ideal_time?: string;
  warnings?: string[];
  highlights?: string[];
}

/**
 * Complete beach conditions (current)
 */
export interface BeachCondition {
  beach_id: string;
  beach_name: string;
  timestamp: string;
  wave: WaveData;
  wind: WindData;
  weather: WeatherData;
  ratings: ActivityRating;
  ai_review?: AIReview;
}

/**
 * Hourly forecast data
 */
export interface ForecastHour {
  time: string;
  wave_height: number;
  wind_speed: number;
  temperature: number;
  weather_code: number;
}

/**
 * Daily forecast data
 */
export interface ForecastDay {
  date: string;
  hours: ForecastHour[];
  max_wave_height: number;
  avg_wind_speed: number;
  max_temperature: number;
  min_temperature: number;
}

/**
 * Forecast response
 */
export interface BeachForecast {
  beach_id: string;
  beach_name: string;
  forecast: ForecastDay[];
}
