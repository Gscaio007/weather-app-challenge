import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // MÉTODO 1: Validação de Credenciais (Deve estar no seu arquivo)
 async validateUser(username: string, pass: string): Promise<any> {
    // Tipagem da variável user como UserDocument para acessar .toObject()
    const user: UserDocument | null = await this.usersService.findOne(username); 

    if (!user) {
        return null;
    }

    // Compara a senha fornecida com o hash salvo
    const isPasswordValid = await compare(pass, user.password);

    if (isPasswordValid) {
        // Acessa .toObject() agora que está tipado como UserDocument
        const { password, ...result } = user.toObject(); 
        return result;
    }
    
    return null; 
}

  // MÉTODO 2: Geração do JWT (Este é o método que o TypeScript não está encontrando!)
  async login(user: any) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}