import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/schemas'; 
import type { LoginFormData } from '@/lib/schemas'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; // CRÍTICO: Importa o hook do contexto

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // <--- Usa a função de login do contexto
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormData) {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        form.setError("root.serverError", {
            type: "401",
            message: errorData.message || "Erro desconhecido ao tentar fazer login."
        });
        return;
      }

      // Login bem-sucedido (Status 201 Created)
      const result: { access_token: string } = await response.json();
      
      // MUDANÇA CRÍTICA: Chama a função do Contexto para salvar o token e atualizar o estado
      login(result.access_token); 
      
      // Redireciona, e agora o App.tsx saberá que isAuthenticated é true
      navigate('/', { replace: true }); 
      
    } catch (error) {
      console.error("Erro de rede/conexão:", error);
      form.setError("root.serverError", {
          type: "manual",
          message: "Falha na conexão com o servidor. Verifique se o Backend está rodando (porta 3000)."
      });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-xl border border-gray-200">
        <h2 className="text-2xl font-extrabold text-center text-gray-800">
          Acesso Administrativo
        </h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Exibe o erro geral (do servidor) se houver */}
            {form.formState.errors.root?.serverError && (
                <p className="text-red-600 text-sm text-center">
                    {form.formState.errors.root.serverError.message}
                </p>
            )}
            
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuário</FormLabel>
                  <FormControl>
                    <Input placeholder="admin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" 
                    disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}