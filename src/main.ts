import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const frontendUrl = configService.get('FRONTEND_URL');
  if (frontendUrl) {
    app.enableCors({
      origin: frontendUrl,
      credentials: true,
    });
  }
  app.enableCors();
  await app.listen(8085); 
  console.log(`frontend url ${frontendUrl}:8085`)
}
bootstrap();
