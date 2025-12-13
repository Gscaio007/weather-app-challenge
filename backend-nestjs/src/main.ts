import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Importe este

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CRÍTICO: Adiciona o ValidationPipe para validar os DTOs em todas as rotas
  app.useGlobalPipes(new ValidationPipe()); 

  app.enableCors({
    origin: 'http://localhost:5173', // Altere para a porta correta do seu frontend, se for diferente
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // O NestJS deve rodar na porta 3000 por padrão, mas você pode definir outra porta aqui.
  await app.listen(3000); 
}
bootstrap();