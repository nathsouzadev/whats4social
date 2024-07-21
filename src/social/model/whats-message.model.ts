export interface MessageModel {
  from: string;
  message: string;
  phoneNumberId: string;
  content: TextContent | ButtonContent;
}

interface TextContent {
  text: { body: string };
}

interface ButtonData {
  type: 'reply';
  reply: {
    title: string;
    id: string;
  };
}

interface ButtonContent {
  type: 'interactive';
  interactive: {
    body: {
      text: string;
    };
    footer: {
      text: string;
    };
    type: 'button';
    action: {
      buttons: ButtonData[];
    };
  };
}
