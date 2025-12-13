import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy'; // Importe a classe

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: "SEGREDO_SUPER_SECRETO_DO_JWT", // Garanta que esta chave está correta
      signOptions: { expiresIn: '600s' },
    }),
  ],
  controllers: [AuthController],
  // 🚨 CRÍTICO: Ambas as estratégias DEVEM estar listadas nos providers
  providers: [AuthService, LocalStrategy, JwtStrategy], 
  exports: [AuthService], 
})
export class AuthModule {}