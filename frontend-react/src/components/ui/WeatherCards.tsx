// Assumindo que você tem os componentes Card, CardContent, etc.
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Ícones da biblioteca lucide-react
import { Droplet, Thermometer, Wind, Zap } from 'lucide-react';

interface WeatherCardsProps {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
}

export function WeatherCards({ temperature, description, humidity, windSpeed }: WeatherCardsProps) {
  // Converte a descrição para a primeira letra maiúscula
  const formattedDescription = description.charAt(0).toUpperCase() + description.slice(1);
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      
      {/* Card 1: Temperatura */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Temperatura</CardTitle>
          <Thermometer className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          {/* ✅ Usa temperature real */}
          <div className="text-4xl font-bold">{temperature.toFixed(1)}°C</div>
          <p className="text-xs text-gray-500 mt-1">{formattedDescription}</p>
        </CardContent>
      </Card>
      
      {/* Card 2: Humidade */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Umidade do Ar</CardTitle>
          <Droplet className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          {/* ✅ Usa humidity real */}
          <div className="text-4xl font-bold">{humidity}%</div>
          <p className="text-xs text-gray-500 mt-1">Nível de umidade atual.</p>
        </CardContent>
      </Card>
      
      {/* Card 3: Velocidade do Vento */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vento</CardTitle>
          <Wind className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          {/* ✅ Usa windSpeed real */}
          <div className="text-4xl font-bold">{windSpeed.toFixed(2)} km/h</div>
          {/* 🚨 CORRIGIDO: Removido o mock "Dados mockados do vento." */}
          <p className="text-xs text-gray-500 mt-1">Velocidade atual do vento.</p>
        </CardContent>
      </Card>

      {/* Card 4: Condição / Descrição */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          {/* 🚨 CORRIGIDO: Mudado de "Mock Status" para "Condição" */}
          <CardTitle className="text-sm font-medium">Condição</CardTitle>
          <Zap className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          {/* ✅ Usa formattedDescription real */}
          <div className="text-2xl font-semibold mt-2">{formattedDescription}</div>
          {/* 🚨 CORRIGIDO: Descrição informativa */}
          <p className="text-xs text-gray-500 mt-1">Status atual do tempo.</p>
        </CardContent>
      </Card>
    </div>
  );
}