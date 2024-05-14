import { IBetterStack } from './betterstack.interface';
import { IBSky } from './bsky.interface';
import { ITwitter } from './twitter.interface';
import { IWB } from './wb.interface';

export interface IConfig {
  port: number;
  wb: IWB;
  twitter: ITwitter;
  bsky: IBSky;
  betterStack: IBetterStack;
}
