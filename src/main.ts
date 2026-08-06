import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express  from 'express';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 3000

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }))

  app.useGlobalFilters(new HttpExceptionFilter)

  const config = new DocumentBuilder()
  .setTitle("Maqolalar sayti")
  .setDescription("Dars uchun maqolalar sayti")
  .setVersion("1.0.0")
  .addBearerAuth(
    {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    name: "JWT",
    description: "Token saqlash uchun",
    in: "header",
  },
  "JWT-auth",
)
  .build()
  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup("api-docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    }
  })

  app.use("/uploads", express.static("uploads"))

  await app.listen(PORT, () => {
    console.log(`Server is running at://localhost:${PORT}`)
    console.log(`Documantation://localhost:${PORT}/api-docs`)
  });
}
bootstrap();
