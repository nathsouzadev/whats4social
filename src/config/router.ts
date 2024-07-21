import { HealthModule } from '../health/health.module';
import { MessageModule } from '../message/message.module';
import { SocialModule } from '../social/social.module';

export const router = [
  {
    path: 'api',
    children: [
      {
        path: 'social',
        module: SocialModule,
      },
      {
        path: 'health',
        module: HealthModule,
      },
    ],
  },
  {
    path: 'message',
    module: MessageModule,
  },
];
