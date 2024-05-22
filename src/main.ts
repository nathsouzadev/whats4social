import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './config/http-exception';
import { svix } from './config/svix.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      process.env.META_ORIGIN, 
      process.env.BETTERSTACK,
      ...svix.eu,
      ...svix['us-east'],
      ...svix.in,
      ...svix.us
    ],
    methods: 'POST, GET'
  });

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Whats4Social API Documentation')
      .setDescription('Service to integrate Whatsapp with Social Media Platforms')
      .setVersion('1.0')
      .build(),
  );
  SwaggerModule.setup('api', app, document);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT);
}
bootstrap();
