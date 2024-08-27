import { MessageWireIn } from '../models/message.wire-in.model';
import { WBPayloadEntry } from '../models/meta-message.model';

export const WBPayloadToMessageWireIn = (
  data: WBPayloadEntry[],
): MessageWireIn => {
  if (Object.keys(data[0].changes[0].value).includes('messages')) {
    const message = data[0].changes[0]?.value?.['messages'][0];

    if (
      Object.keys(message).includes('text') ||
      Object.keys(message).includes('audio')
    ) {
      return {
        from: message.from,
        message: Object.keys(message).includes('text')
          ? message.text.body
          : message.audio.id,
        phoneNumberId: data[0].changes[0].value.metadata.phone_number_id,
        type: message.type,
      };
    }
  }

  return null;
};
