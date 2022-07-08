import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './config/config';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import Container from 'typedi';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const config = new DocumentBuilder()
  //   .setTitle('Api')
  //   .setDescription('The API description')
  //   .setVersion('1.0')
  //   .addTag('Api')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);
  //const configService = app.get(ConfigService);
  app.setGlobalPrefix(process.env.PATH_API);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe({transform: true}));
  app.use(bodyParser.json({limit: '1000mb'}));
  app.use(bodyParser.urlencoded({limit: '1000mb', extended: true}));
  app.enableCors();
  var post = process.env.PORT || 3000;

  //Swagger UI
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Allocation-Model')
    .setDescription('The cats API description')
    .setVersion('1.0')
    // .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(post);
  // console.info(process.env.NODE_ENV);
  // console.info(configService.get('PATH_API'));
}
bootstrap();
