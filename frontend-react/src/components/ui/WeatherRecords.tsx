import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DailyRecord {
  id: number;
  dateTime: string;
  condition: string;
  temp: number;
  humidity: number;
}

interface WeatherRecordsProps {
  data: DailyRecord[];
}

export function WeatherRecords({ data }: WeatherRecordsProps) {
  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
      {/* 🚨 CORRIGIDO: O título agora reflete o uso real de dados de previsão. */}
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Previsão Detalhada (Próximas 36 Horas)</h3>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Data/Hora</TableHead>
            <TableHead>Condição</TableHead>
            <TableHead className="text-right">Temperatura</TableHead>
            <TableHead className="text-right">Umidade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.id}</TableCell>
              <TableCell>{record.dateTime}</TableCell>
              <TableCell>{record.condition}</TableCell>
              <TableCell className="text-right font-bold">{record.temp.toFixed(1)}°C</TableCell>
              <TableCell className="text-right">{record.humidity}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {data.length === 0 && (
        <p className="text-center text-gray-500 mt-4">Nenhum registro encontrado.</p>
      )}
    </div>
  );
}