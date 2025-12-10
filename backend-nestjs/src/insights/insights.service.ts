import { Injectable } from '@nestjs/common';
import { WeatherDocument } from '../weather/schemas/weather.schema'; 
// Assumindo que você pode importar WeatherDocument, ou defina uma interface aqui.

@Injectable()
export class InsightsService {

    // Função de lógica pura para gerar o Insight de IA (simulado)
    generateAiInsight(data: WeatherDocument): { summary: string; detail: string } {
        // --- Pegando dados do objeto WeatherDocument (do MongoDB) ---
        const { temperature, humidity, wind_speed, description } = data;
        
        let summary = 'Condição Geral';
        let detail = 'O clima está estável e sem grandes alertas.';

        // 1. Condição de Temperatura
        if (temperature > 30) {
            summary = 'Alerta de Calor Extremo';
            detail = `Com ${temperature}°C, o risco de exaustão térmica é alto. Beba água e evite o sol entre 10h e 16h.`;
        } else if (temperature < 10) {
            summary = 'Alerta de Frio';
            detail = `A temperatura está em ${temperature}°C. Vista-se em camadas, especialmente se o vento estiver forte.`;
        }
        
        // 2. Condição de Umidade (Prioridade)
        if (humidity > 75) {
            summary = 'Alta Umidade';
            detail = `A alta umidade (${humidity}%) pode dificultar a dispersão de poluentes. O clima está abafado, ideal para o crescimento de plantas.`;
        } else if (humidity < 30) {
            summary = 'Baixa Umidade';
            detail = `A umidade está muito baixa (${humidity}%). Isso pode causar ressecamento nas vias aéreas. Recomenda-se umidificador.`;
        }

        // 3. Condição de Vento
        if (wind_speed > 30) {
            summary = 'Vento Forte';
            detail = `O vento está em ${wind_speed} km/h. Proteja objetos leves e atenção à sensação térmica, que pode ser significativamente menor.`;
        }
        
        // Se não houver alertas, usa a descrição principal
        if (summary === 'Condição Geral') {
            summary = description.toUpperCase();
            detail = `O tempo é de ${description}. Mantenha-se atento a mudanças bruscas e aproveite o dia.`;
        }

        return { summary, detail };
    }
}