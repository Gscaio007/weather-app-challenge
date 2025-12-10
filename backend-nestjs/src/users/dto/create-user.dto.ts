import { IsString, IsNotEmpty, MinLength } from 'class-validator';

// Você deve instalar o pacote de validação de dados
// Se não o fez: npm install class-validator class-transformer
// Depois, adicione o ValidationPipe no main.ts

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}