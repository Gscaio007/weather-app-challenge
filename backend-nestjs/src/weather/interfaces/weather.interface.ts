export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  // Inclua os arrays de previsão, mesmo que vazios no momento da busca no Mongo
  hourlyForecast: { time: string; temp: number; chanceOfRain: number; }[]; 
  dailyRecords: { id: number; dateTime: string; condition: string; temp: number; humidity: number; }[]; 
  insights: { text: string; alert: string; }; 
}