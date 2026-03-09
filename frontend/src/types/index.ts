// Types para a API SwellWise

export interface Beach {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  region: string;
  latitude: number;
  longitude: number;
  description: string;
  surf_quality: string;
  best_season: string;
  has_infrastructure: boolean;
  has_parking: boolean;
  has_restaurants: boolean;
  has_surf_schools: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
  view_count: number;
}

export interface BeachListResponse {
  beaches: Beach[];
  total: number;
  page: number;
  page_size: number;
}

export interface WaveData {
  height_m: number;
  direction_deg: number;
  period_s: number;
  swell_height_m: number;
}

export interface WindData {
  speed_kmh: number;
  direction_deg: number;
  gusts_kmh: number;
}

export interface WeatherData {
  temperature_c: number;
  feels_like_c: number;
  weather_code: number;
  weather_description: string;
  precipitation_mm: number;
  cloud_cover_percent: number;
}

export interface ActivityRating {
  surf: number;
  swim: number;
  fishing: number;
}

export interface AIReview {
  review_pt: string;
  recommendations: string[];
  warnings: string[];
  best_time: string;
  rating: ActivityRating;
}

export interface BeachCondition {
  beach_id: string;
  beach_name: string;
  timestamp: string;
  wave: WaveData;
  wind: WindData;
  weather: WeatherData;
  ai_review: AIReview;
}

export interface ForecastHour {
  hour: string;
  wave_height_m: number;
  temperature_c: number;
  wind_speed_kmh: number;
  weather_description: string;
}

export interface BeachForecast {
  beach_id: string;
  beach_name: string;
  forecast: ForecastHour[];
}
