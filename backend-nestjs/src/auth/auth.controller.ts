import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth') // Rota base: /auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local')) // Usa a LocalStrategy para verificar credenciais
  @Post('login') // Endpoint: POST /auth/login
  async login(@Request() req) {
    // O usuário validado pela LocalStrategy está em req.user
    // Chama o serviço para gerar o JWT
    return this.authService.login(req.user);
  }
}