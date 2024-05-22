import { IBSky } from './bsky.interface';
import { IClerk } from './clerk.interface';
import { ITwitter } from './twitter.interface';
import { IWB } from './wb.interface';

export interface IConfig {
  port: number;
  wb: IWB;
  twitter: ITwitter;
  bsky: IBSky;
  clerk: IClerk
}
