import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather, WeatherDocument } from './schemas/weather.schema'; 
import { WeatherData } from './interfaces/weather.interface';

@Injectable()
export class WeatherService {
    private readonly logger = new Logger(WeatherService.name);

    constructor(@InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>) {}

    async fetchWeather(city: string): Promise<WeatherData> {
        const latestRecord = await this.getRawDataForInsight(city);

        if (!latestRecord) {
            this.logger.warn(`Dados não encontrados para a cidade: ${city}`);
            throw new HttpException(`Dados de clima não encontrados para "${city}" no banco de dados.`, HttpStatus.NOT_FOUND);
        }
        
        const result: WeatherData = {
            city: latestRecord.city,
            temperature: latestRecord.temperature,
            description: latestRecord.description,
            humidity: latestRecord.humidity,
            windSpeed: latestRecord.wind_speed,
            
            hourlyForecast: [], 
            dailyRecords: [], 

            insights: { 
                text: 'Insight será buscado pelo endpoint /insights/latest. O texto aqui é apenas um fallback.',
                alert: 'Alerta não disponível',
            },
        };

        return result;
    }

    async getRawDataForInsight(city: string): Promise<WeatherDocument | null> {
        const normalizedCity = city.trim().toLowerCase();
        
        try {
            const latestRecord = await this.weatherModel.findOne({
                city: { $regex: new RegExp(`^${normalizedCity}$`, 'i') } 
            })
            .sort({ timestamp: -1 })
            .limit(1)
            .exec();

            return latestRecord;

        } catch (error) {
            this.logger.error(`[MONGOOSE ERROR] Falha ao buscar no Atlas: ${error.message}`, error.stack);
            throw new HttpException('Falha na comunicação com o banco de dados (MongoDB Atlas).', HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
}