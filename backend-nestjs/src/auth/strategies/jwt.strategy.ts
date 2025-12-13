import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Payload } from './payload.interface'; 

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1. Extrai o token JWT do cabeçalho Authorization como 'Bearer token'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      
      // 2. Define que o Passport (framework de autenticação) não deve ignorar a expiração do token
      ignoreExpiration: false,
      
      // 3. A chave secreta deve ser a MESMA que você usou no JwtModule.register no AuthModule
      secretOrKey: "SEGREDO_SUPER_SECRETO_DO_JWT", 
    });
  }

  // Este método é chamado após o token ser validado (assinado e não expirado).
  // Ele retorna o payload decodificado, que será anexado ao objeto 'req.user' no controller.
  async validate(payload: Payload) {
    // O payload que você está retornando é o que foi assinado no login.
    // Exemplo: { username: 'admin', userId: 1 }
    return { userId: payload.sub, username: payload.username };
  }
}

