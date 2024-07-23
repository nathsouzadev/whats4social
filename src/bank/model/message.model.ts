interface TextContent {
  body: string;
}

interface QuickReplyContent {
  type: string;
  button_reply: {
    title: string;
    id: string;
  };
}

export interface BankMessageModel {
  from: string;
  phoneNumberId: string;
  contentReply: TextContent | QuickReplyContent;
}
