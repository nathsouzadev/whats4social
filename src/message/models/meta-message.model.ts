interface MetaMessage {
  messaging_product: 'whatsapp';
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
}

interface Contact {
  profile: {
    name: string;
  };
  wa_id: string;
}

export interface MessageReceived extends MetaMessage {
  contacts: Contact[];
  messages: Array<{
    from: string;
    id: string;
    timestamp: number;
    text: {
      body: string;
    };
    type: string;
  }>;
}

export interface UpdateStatus extends MetaMessage {
  statuses: Array<{
    id: string;
    status: string;
    timestamp: number;
    recipient_id: string;
    conversation: {
      id: string;
      expiration_timestamp: string;
      origin: {
        type: string;
      };
    };
    pricing: {
      billable: boolean;
      pricing_model: string;
      category: string;
    };
  }>;
}

export interface QuickReplyReceived extends MetaMessage {
  contacts: Contact[];
  messages: Array<{
    context: {
      from: string;
      id: string;
    };
    from: string;
    id: string;
    timestamp: number;
    button: {
      text: string;
      payload: string;
    };
    type: string;
  }>;
}
