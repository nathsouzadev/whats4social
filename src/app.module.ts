import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MessageModule } from './message/message.module';
import { RouterModule } from '@nestjs/core';
import { router } from './config/router';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/interface/config.schema';
import { SocialModule } from './social/social.module';
import { HealthModule } from './health/health.module';
import config from './config/config';
import { LoggerMiddleware } from './config/logger-middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobModule } from './cronjob/cronjob.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [config],
    }),
    ScheduleModule.forRoot(),
    MessageModule,
    RouterModule.register(router),
    SocialModule,
    HealthModule,
    CronjobModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
