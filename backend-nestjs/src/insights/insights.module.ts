import { Module } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { InsightsController } from './insights.controller';
import { WeatherModule } from '../weather/weather.module'; // Importa o módulo de clima

@Module({
    imports: [WeatherModule], // Permite usar WeatherService
    controllers: [InsightsController],
    providers: [InsightsService],
})
export class InsightsModule {}