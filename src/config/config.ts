import { IConfig } from './interface/config.interface';

export default (): IConfig => ({
  port: parseInt(process.env.PORT, 10 || 3000),
  wb: {
    url: process.env.WB_URL,
    verifyToken: process.env.WEBHOOK_VERIFY_TOKEN,
    graphApiToken: process.env.GRAPH_API_TOKEN,
    phoneNumberId: process.env.GRAPH_PHONE_NUMBER_ID,
  },
  twitter: {
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
  },
  bsky: {
    identifier: process.env.BSKY_IDENTIFIER,
    password: process.env.BSKY_PASSWORD,
    service: 'https://bsky.social',
  },
  betterStack: {
    url: process.env.BETTERSTACK_URL,
    token: process.env.BETTERSTACK_TOKEN,
    monitorId1: process.env.MONITOR_ID_1,
    monitorId2: process.env.MONITOR_ID_2,
  },
});
