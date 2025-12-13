import { Controller, Get, Query, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; 
import { InsightsService } from './insights.service';
import { WeatherService } from '../weather/weather.service'; // Precisa buscar dados de clima

@Controller('insights')
@UseGuards(AuthGuard('jwt')) 
export class InsightsController {
    constructor(
        private readonly insightsService: InsightsService,
        private readonly weatherService: WeatherService // Para buscar dados brutos
    ) {}

    @Get('latest')
    async getLatestInsight(@Query('city') city: string) {
        if (!city) {
            throw new HttpException('A cidade é obrigatória para gerar insights.', HttpStatus.BAD_REQUEST);
        }

        // 1. Busca os dados brutos de clima (reutilizando a lógica do WeatherService)
        // OBS: Aqui, você precisa de um método no WeatherService que retorne o WeatherDocument
        // ou adapte o fetchWeather para retornar o documento completo.
        
        const weatherData = await this.weatherService.getRawDataForInsight(city);

        if (!weatherData) {
            throw new HttpException(`Dados brutos de clima não encontrados para ${city}.`, HttpStatus.NOT_FOUND);
        }
        
        // 2. Passa os dados brutos para o InsightsService gerar a frase
        const insight = this.insightsService.generateAiInsight(weatherData);

        return insight;
    }
}