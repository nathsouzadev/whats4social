export interface WhatsPostResponseModel {
    twitter: {
      id: string;
    } | { message: string };
    bsky: {
      cid: string;
    } | { message: string };
  }