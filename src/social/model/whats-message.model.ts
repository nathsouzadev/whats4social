export interface MessageModel {
  from: string;
  message: string;
  phoneNumberId: string;
  content: TextContent | ButtonContent;
}

export interface TextContent {
  text: { body: string };
}

interface ButtonData {
  type: string; // 'reply'
  reply: {
    title: string;
    id: string;
  };
}

export interface ButtonContent {
  type: string; // 'interactive'
  recipient_type: string; // 'individual'
  interactive: {
    type: string; // 'button'
    body: {
      text: string;
    };
    footer: {
      text: string;
    };
    action: {
      buttons: ButtonData[];
    };
  };
}
