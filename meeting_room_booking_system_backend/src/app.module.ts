import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './guard/login.guard';
import { PermissionGuard } from './guard/permission.guard';
import { MeetingRoomModule } from './meeting-room/meeting-room.module';
import { BookingModule } from './booking/booking.module';
import { StatisticModule } from './statistic/statistic.module';
import {
  WINSTON_MODULE_NEST_PROVIDER,
  WinstonModule,
  utilities,
  WinstonLogger,
} from 'nest-winston';
import 'winston-daily-rotate-file';
import * as winston from 'winston';
import { CustomTypeOrmLogger } from './CustomTypeOrmLogger';
import { MinioModule } from './minio/minio.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.join(__dirname, '.env'),
        path.join(__dirname, '.dev.env'),
      ],
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt_secret'),
          signOptions: {
            expiresIn: '30m',
          },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService, logger: WinstonLogger) {
        return {
          type: 'mysql',
          host: configService.get('mysql_server_host'),
          port: configService.get('mysql_server_port'),
          username: configService.get('mysql_server_username'),
          password: configService.get('mysql_server_password'),
          database: configService.get('mysql_server_database'),
          poolSize: 10,
          synchronize: true,
          logging: true,
          logger: new CustomTypeOrmLogger(logger),
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService, WINSTON_MODULE_NEST_PROVIDER],
    }),
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        level: 'debug',
        transports: [
          new winston.transports.DailyRotateFile({
            level: configService.get('winston_log_level'),
            dirname: configService.get('winston_log_dirname'),
            filename: configService.get('winston_log_filename'),
            datePattern: configService.get('winston_log_date_pattern'),
            maxSize: configService.get('winston_log_max_size'),
          }),
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              utilities.format.nestLike(),
            ),
          }),
          // new winston.transports.Http({
          //   host: configService.get('winston_log_host'),
          //   port: configService.get('winston_log_port'),
          //   path: configService.get('winston_log_path'),
          // }),
        ],
      }),
      inject: [ConfigService],
    }),
    UserModule,
    RedisModule,
    EmailModule,
    MeetingRoomModule,
    BookingModule,
    StatisticModule,
    MinioModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
