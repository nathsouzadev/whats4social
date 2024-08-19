import { SocialModule } from '../resources/domain/social/social.module';
import { HealthModule } from '../health/health.module';
import { MessageModule } from '../resources/domain/message/message.module';

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
