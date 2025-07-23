// main.ts
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create NestJS app with Fastify adapter
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Enable CORS if needed
  app.enableCors();

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('api')
    .addBearerAuth() // Add if you need JWT authentication
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger UI at /api/docs
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT ?? 8087;
  await app.listen(port, '0.0.0.0');

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(
    `Swagger documentation available at: http://localhost:${port}/api/docs`,
  );
}
bootstrap();
