import { Module } from '@nestjs/common';
import { MessageModule } from './message/message.module';
import { RouterModule } from '@nestjs/core';
import { router } from './config/router';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/interface/config.schema';
import { SocialModule } from './social/social.module';
import { HealthModule } from './health/health.module';
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [config],
    }),
    MessageModule,
    RouterModule.register(router),
    SocialModule,
    HealthModule,
  ],
})
export class AppModule {}
