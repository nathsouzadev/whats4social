import { TextContent, ButtonContent } from './whats-message.model';

export interface WhatsPostModel {
  message: string;
  from: string;
  phoneNumberId: string;
  service: string;
  content?: TextContent | ButtonContent;
}
