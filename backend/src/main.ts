import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS engedélyezése a frontend számára
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // Globális hibakezelő regisztrálása
  app.useGlobalFilters(new AllExceptionsFilter());

  // Globális validáció bekapcsolása
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Csak a DTO-ban definiált mezőket engedi át
      forbidNonWhitelisted: true, // Hiba, ha extra mező van
      transform: true, // Automatikus típuskonverzió
    }),
  );

  await app.listen(3000);
}
bootstrap();
