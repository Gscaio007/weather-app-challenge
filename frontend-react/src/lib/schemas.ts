import * as z from 'zod';

// Esquema de validação para o formulário de Login
export const loginSchema = z.object({
  username: z.string().min(4, 'O nome de usuário deve ter pelo menos 4 caracteres.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

export type LoginFormData = z.infer<typeof loginSchema>;