import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
@Get('starwars/people')
  async getStarWarsPeople() {
    try {
        const response = await fetch('https://swapi.dev/api/people/');
        
        if (!response.ok) {
            throw new HttpException('A API SWAPI está indisponível.', HttpStatus.SERVICE_UNAVAILABLE);
        }
        
        const data = await response.json();
        
        // Mapeia para simplificar os dados
        return data.results.map(person => ({
            name: person.name,
            gender: person.gender,
            films_count: person.films.length,
        }));
    } catch (error) {
        throw new HttpException('Erro ao buscar dados da SWAPI.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


}
