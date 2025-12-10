import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
// Nota: Você não precisa do 'import React from "react";' nos componentes modernos.

interface HourlyForecast {
  time: string; // Ex: '15:00'
  temp: number; // Ex: 28
  chanceOfRain: number; // Ex: 0.2 (Provavelmente já está vindo como 0-100 do Backend)
}

interface WeatherChartsProps {
  data: HourlyForecast[];
}

export function WeatherCharts({ data }: WeatherChartsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
        <p className="text-center text-gray-500">Nenhum dado de previsão horária disponível.</p>
      </div>
    );
  }
  
  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
      {/* 🚨 CORRIGIDO: O título agora reflete dados reais de Previsão */}
      <h3 className="text-xl font-semibold mb-6 text-gray-700">Previsão Horária (Próximas 24h)</h3>
      
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Gráfico 1: Temperatura ao Longo do Tempo (Area Chart) */}
        <div>
          <h4 className="text-lg font-medium mb-3 text-gray-600">Temperatura (°C)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="time" stroke="#71717a" />
              <YAxis domain={['auto', 'auto']} stroke="#71717a" />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}°C`, 'Temperatura']}
                labelFormatter={(label) => `Hora: ${label}`}
              />
              {/* O Area usa a propriedade 'temp' do array data */}
              <Area type="monotone" dataKey="temp" stroke="#ef4444" fillOpacity={1} fill="url(#colorTemp)" />
              
              {/* Definição do gradiente de cor para a área */}
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fca5a5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#fee2e2" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 2: Probabilidade de Chuva (Line Chart) */}
        <div>
          <h4 className="text-lg font-medium mb-3 text-gray-600">Probabilidade de Chuva (%)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="time" stroke="#71717a" />
              {/* Define o domínio de 0 a 100 para o percentual de chuva */}
              <YAxis domain={[0, 100]} stroke="#71717a" /> 
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(0)}%`, 'Chuva']}
                labelFormatter={(label) => `Hora: ${label}`}
              />
              {/* O Line usa a propriedade 'chanceOfRain' do array data */}
              <Line type="monotone" dataKey="chanceOfRain" stroke="#3b82f6" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
      
    </div>
  );
}