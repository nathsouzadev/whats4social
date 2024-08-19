import { HealthModule } from '../health/health.module';
import { MessageModule } from '../resources/message/message.module';
import { SocialModule } from '../resources/social/social.module';

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
