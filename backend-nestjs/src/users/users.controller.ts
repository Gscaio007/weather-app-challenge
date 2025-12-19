import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport'; // Importa o Guard de Autenticação

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Endpoint protegido que retorna o perfil do usuário logado.
   * Requer um Token JWT válido no cabeçalho 'Authorization: Bearer <token>'.
   */
  @UseGuards(AuthGuard('jwt')) // CRÍTICO: Aplica o Guard JWT (a estratégia que criamos)
  @Get('profile')
  getProfile(@Request() req) {
    // O objeto 'req.user' é preenchido pela estratégia JWT com o payload do token
    
    // NOTA: O payload geralmente contém: { userId: '...', username: '...' }
    return { 
        message: "Acesso autorizado ao perfil!",
        user: req.user 
    };
  }
}