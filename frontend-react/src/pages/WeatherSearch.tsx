import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { WeatherCards } from '@/components/ui/WeatherCards';
import { WeatherCharts } from '@/components/ui/WeatherCharts'; 
import { WeatherRecords } from '@/components/ui/WeatherRecords'; 

// Interface para os dados principais de clima (NÃO inclui mais insights)
interface WeatherData {
    city: string;
    temperature: number;
    description: string;
    humidity: number;
    windSpeed: number; 
    hourlyForecast: { time: string; temp: number; chanceOfRain: number; }[];
    dailyRecords: { id: number; dateTime: string; condition: string; temp: number; humidity: number; }[];
}

// Interface para o Insight de IA
interface AiInsight {
    summary: string;
    detail: string;
}

const API_BASE_URL = 'http://localhost:3000';

export function WeatherSearch() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [aiInsight, setAiInsight] = useState<AiInsight | null>(null); // NOVO ESTADO
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token, logout } = useAuth();

    const fetchAiInsight = async (city: string) => {
        try {
            const insightResponse = await fetch(`${API_BASE_URL}/insights/latest?city=${city}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, 
                },
            });

            const insightJson = await insightResponse.json();

            if (insightResponse.ok) {
                setAiInsight(insightJson as AiInsight);
            } else {
                setAiInsight({ summary: 'Erro de Insight', detail: insightJson.message || 'Não foi possível gerar a análise de IA.' });
            }
        } catch (err) {
            console.error('Falha ao buscar insights de IA:', err);
            setAiInsight({ summary: 'Erro de Conexão', detail: 'Falha ao conectar com o serviço de insights.' });
        }
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!city.trim()) return;

        setLoading(true);
        setError(null);
        setWeather(null);
        setAiInsight(null); // Limpa o insight ao iniciar nova busca

        try {
            // 1. Busca de Dados de Clima Principal
            const weatherResponse = await fetch(`${API_BASE_URL}/weather/search?city=${city}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, 
                },
            });

            if (weatherResponse.status === 401) {
                logout(); 
                throw new Error('Sessão expirada. Faça o login novamente.');
            }
            if (!weatherResponse.ok) {
                const errorData = await weatherResponse.json();
                throw new Error(errorData.message || 'Erro ao buscar dados de clima.');
            }

            const result = await weatherResponse.json();
            setWeather(result.data as WeatherData); 
            
            // 2. Chamada Separada para Insights
            await fetchAiInsight(city);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro de conexão inesperado.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleLogout = () => {
        logout();
    };

    return (
        <div className="p-4 max-w-6xl mx-auto min-h-screen bg-gray-50">
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Busca de Clima</h1>
                <Button onClick={handleLogout} variant="destructive">
                    Sair / Logout
                </Button>
            </div>

            <form onSubmit={handleSearch} className="flex w-full max-w-lg space-x-2 mb-8">
                <Input
                    type="text"
                    placeholder="Digite o nome da cidade (Ex: Salvador)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={loading}
                />
                <Button type="submit" disabled={loading}>
                    {loading ? 'Buscando...' : 'Buscar'}
                </Button>
            </form>

            {error && <p className="text-red-600 text-lg mb-4">⚠️ {error}</p>}
            {loading && !error && <p className="text-blue-600 text-lg mb-4">Carregando dados...</p>}

            {weather && !loading && (
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                        Dashboard do Clima em {weather.city}
                    </h2>

                    <WeatherCards 
                        temperature={weather.temperature}
                        humidity={weather.humidity}
                        windSpeed={weather.windSpeed} 
                        description={weather.description}
                    />
                    
                    {/* Exibição do Insight Dinâmico */}
                    {aiInsight ? (
                        <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-lg shadow-sm">
                            <p className="font-semibold text-sm mb-1">💡 Insight de IA: {aiInsight.summary}</p>
                            <p className="text-base">{aiInsight.detail}</p>
                        </div>
                    ) : (
                         <div className="mt-6 p-4 bg-gray-100 border-l-4 border-gray-400 text-gray-800 rounded-lg shadow-sm">
                            <p className="font-semibold text-sm mb-1">... Gerando Insight de IA ...</p>
                        </div>
                    )}
                    
                    <WeatherCharts data={weather.hourlyForecast} />

                    <WeatherRecords data={weather.dailyRecords} />
                </div>
            )}
        </div>
    );
}