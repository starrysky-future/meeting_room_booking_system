import { Global, Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Global()
@Module({
  providers: [
    MinioService,
    {
      provide: 'MINIO_CLIENT',
      async useFactory(configService: ConfigService) {
        const client = await new Minio.Client({
          endPoint: configService.get('minio_endpoint'),
          port: +configService.get('minio_port'),
          useSSL: false,
          accessKey: configService.get('minio_access_key'),
          secretKey: configService.get('minio_secret_key'),
        });

        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [MinioService],
})
export class MinioModule {}
