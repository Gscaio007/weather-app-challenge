import { Controller, Get, Query, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; 
import { WeatherService } from './weather.service';
// 🚨 CRÍTICO: Importe a interface de dados para tipagem
import { WeatherData } from './interfaces/weather.interface'; 
// Importe o tipo Request para tipagem mais clara
import { Request as ExpressRequest } from 'express'; 

// Define uma interface para o usuário no objeto Request (payload do JWT)
interface AuthenticatedRequest extends ExpressRequest {
    user: {
        username: string;
        sub: number; // O ID do usuário
    };
}

@Controller('weather') 
@UseGuards(AuthGuard('jwt')) // CRÍTICO: Aplica o Guard JWT
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('search')
  // 🚨 CORREÇÃO DE TIPAGEM: Define o tipo de retorno completo com Promise<...>
  async getWeatherByCity(
    @Query('city') city: string, 
    @Request() req: AuthenticatedRequest // Usa a interface tipada para acessar 'req.user'
  ): Promise<{ user: string; city: string; data: WeatherData }> { 
    
    if (!city) {
      // 🚨 MELHORIA: Lança uma exceção HTTP padrão para erros
      throw new HttpException('Por favor, forneça o nome da cidade.', HttpStatus.BAD_REQUEST);
    }
    
    try {
        // Chama o serviço para buscar os dados (com mocks)
        const weatherData = await this.weatherService.fetchWeather(city);
        
        return {
            user: req.user.username, // Usa o usuário do payload JWT
            city: city,
            data: weatherData,
        };
    } catch (error) {
        // Trata erros que vêm do WeatherService (como cidade não encontrada)
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}