import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global para todas las rutas de la API
  app.setGlobalPrefix('api');

  // Habilitar validación global con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Habilitar CORS para el frontend
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Servir archivos estáticos (imágenes de posters)
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  const puerto = process.env.PORT || 3000;
  await app.listen(puerto);
  console.log(`🎬 Servidor backend ejecutándose en http://localhost:${puerto}`);
  console.log(`📁 Archivos estáticos en http://localhost:${puerto}/uploads`);
}
bootstrap();
