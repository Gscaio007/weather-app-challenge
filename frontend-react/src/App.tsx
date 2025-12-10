// frontend-react/src/App.tsx

import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { useAuth } from './context/AuthContext';
import { WeatherSearch } from './pages/WeatherSearch'; // CRÍTICO: Importa a página de busca

// O componente Dashboard temporário foi removido, 
// pois agora ele é substituído pelo WeatherSearch.

function App() {
  const { isAuthenticated } = useAuth(); // Pega o estado do contexto

  return (
    <Routes>
      {/* Rota de Login: Acessível a todos */}
      <Route path="/login" element={<Login />} />
      
      {/* Rota Protegida (Raiz /): Exibe WeatherSearch se autenticado */}
      <Route 
        path="/" 
        // Se estiver autenticado, exibe o componente de busca de clima
        element={isAuthenticated ? <WeatherSearch /> : <Navigate to="/login" replace />} 
      />
      
      {/* Redireciona qualquer rota desconhecida para /login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;