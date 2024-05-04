import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('WhatsHome API Documentation')
      .setVersion('1.0')
      .build(),
  );
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT);
}
bootstrap();
