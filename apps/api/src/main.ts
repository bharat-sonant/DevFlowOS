import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import open from 'open';
import { TokenAuthGuard } from './modules/auth/token-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3001'], // Vite dev server
    credentials: false,
  });

  // Add global auth guard
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new TokenAuthGuard(reflector));

  // ✅ Swagger config with Bearer Auth
  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('API documentation for Task Management')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token', // name of security scheme
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const swaggerPath = 'api/docs';
  SwaggerModule.setup(swaggerPath, app, document);

  await app.listen(3000);

  // Auto-open browser on Swagger docs
  await open(`http://localhost:3000/${swaggerPath}`);
}
bootstrap();
