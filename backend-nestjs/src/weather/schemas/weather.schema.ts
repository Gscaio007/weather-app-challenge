import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// 🚨 1. Define a Interface que será usada pelo Mongoose
export interface Weather extends Document { // É a mesma interface 'Weather' que o service tentou importar
  city: string;
  timestamp: Date;
  temperature: number;
  humidity: number;
  wind_speed: number;
  description: string;
  // Adicione outros campos que o Go Worker irá salvar do OpenWeatherMap
}

// 🚨 2. Define o Schema
@Schema({ collection: 'weather_data' })
export class Weather {
  @Prop({ required: true, index: true })
  city: string;

  @Prop({ required: true })
  timestamp: Date;
  
  @Prop()
  temperature: number;

  @Prop()
  humidity: number;

  @Prop()
  wind_speed: number;

  @Prop()
  description: string;
}

// 🚨 3. Exporta o Document (Tipo usado para injeção no Service) e o Schema
export type WeatherDocument = Weather & Document;
export const WeatherSchema = SchemaFactory.createForClass(Weather);