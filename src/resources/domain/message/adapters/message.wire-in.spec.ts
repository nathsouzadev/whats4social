import { mockMetaPayload } from '../../../../__mocks__/meta-message.mock';
import { WBPayloadToMessageWireIn } from './message.wire-in';

describe('WBPayloadToMessageWireIn', () => {
  it('should be return message wire in', () => {
    const mockData = mockMetaPayload('message').entry;
    const result = WBPayloadToMessageWireIn(mockData);
    expect(result).toEqual({
      from: '5511999991234',
      message: 'New post',
      phoneNumberId: '123456789012345',
      type: 'text',
    });
  });

  it('should be return message wire in with audio id', () => {
    const mockData = mockMetaPayload('audio').entry;
    const result = WBPayloadToMessageWireIn(mockData);
    expect(result).toEqual({
      from: '5511999991234',
      message: '1898677717865005',
      phoneNumberId: '123456789012345',
      type: 'audio',
    });
  })
});
