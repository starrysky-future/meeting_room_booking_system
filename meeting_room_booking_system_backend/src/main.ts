import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './interceptor/format-response.interceptor';
import { InvokeRecordInterceptor } from './interceptor/invoke-record.interceptor';
import { CustomExceptionFilter } from './filter/custom-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  app.useGlobalFilters(new CustomExceptionFilter());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const config = new DocumentBuilder()
    .setTitle('会议室预定系统')
    .setDescription('api 接口文档')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      description: '基于 jwt 的认证',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  const configService = app.get(ConfigService);

  app.enableCors();

  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
