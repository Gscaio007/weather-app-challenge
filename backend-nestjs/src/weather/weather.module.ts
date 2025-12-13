// backend-nestjs/src/weather/weather.module.ts
import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherSchema } from './schemas/weather.schema'; // Importe o schema após criá-lo

@Module({
  imports: [
    // Define qual coleção o módulo de clima usará no banco de dados
    MongooseModule.forFeature([{ name: 'Weather', schema: WeatherSchema }]),
  ],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}