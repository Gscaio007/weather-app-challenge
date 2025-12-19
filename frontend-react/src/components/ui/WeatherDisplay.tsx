// Define a estrutura dos dados que vêm do Backend
interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
}

// Define o tipo das props do componente
interface WeatherDisplayProps {
    data: WeatherData;
}

export function WeatherDisplay({ data }: WeatherDisplayProps) {
  return (
    <div className="p-4 border rounded shadow bg-white max-w-lg w-full">
      <h2 className="text-2xl font-semibold mb-2 text-gray-800">
        Clima em {data.city}
      </h2>
      <p className="text-lg">🌡️ Temperatura: {data.temperature} °C</p>
      <p className="text-lg">☁️ Descrição: {data.description.charAt(0).toUpperCase() + data.description.slice(1)}</p>
      <p className="text-lg">💧 Umidade: {data.humidity}%</p>
    </div>
  );
}