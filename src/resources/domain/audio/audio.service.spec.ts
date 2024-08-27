import { Test, TestingModule } from '@nestjs/testing';
import { AudioService } from './audio.service';
import { MetaService } from '../../../resources/client/meta.service';
import { ConfigService } from '@nestjs/config';
import * as nock from 'nock';

describe('AudioService', () => {
  let service: AudioService;
  let mockMetaService: MetaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AudioService,
        {
          provide: MetaService,
          useValue: {
            getAudioUrl: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('token'),
          },
        },
      ],
    }).compile();

    service = module.get<AudioService>(AudioService);
    mockMetaService = module.get<MetaService>(MetaService);
  });

  it('should get audio', async () => {
    const mockAudioId = '1234567890';
    jest.spyOn(mockMetaService, 'getAudioUrl').mockImplementation(() =>
      Promise.resolve({
        url: 'https://audio-url.com',
      }),
    );
    nock('https://audio-url.com').get('/').reply(200, {
      data: 'audio',
    });

    const response = await service.get(mockAudioId);
    expect(mockMetaService.getAudioUrl).toBeCalledWith(mockAudioId);
    expect(response).toMatchObject({ url: 'https://audio-url.com' });
  });
});
