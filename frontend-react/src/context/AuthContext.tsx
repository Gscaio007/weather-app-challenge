import React, { createContext, useContext, useState } from 'react';


type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  login: (newToken: string) => void;
  logout: () => void;
};

// Valor padrão do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  // CRÍTICO: Inicializa o estado lendo o localStorage. 
  // Usa 'accessToken' como chave.
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));

  // Define a autenticação: true se houver um token
  const isAuthenticated = !!token;

  // Método chamado após o login bem-sucedido
  const login = (newToken: string) => {
    // Salva o token no localStorage
    localStorage.setItem('accessToken', newToken);
    // Atualiza o estado
    setToken(newToken);
  };

  // Método chamado para logout
  const logout = () => {
    // Remove o token do localStorage
    localStorage.removeItem('accessToken');
    // Limpa o estado
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para fácil uso do contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};