import { Test, TestingModule } from '@nestjs/testing';
import { CronjobService } from './cronjob.service';
import { ConfigService } from '@nestjs/config';
import * as nock from 'nock';
import { randomUUID } from 'crypto';

describe('CronjobService', () => {
  let service: CronjobService;
  const mockMonitorId1 = randomUUID()
  const mockMonitorId2 = randomUUID()

  beforeEach(async () => {
    Object.defineProperty(global, 'performance', {
      writable: true,
    });
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CronjobService,
        {
          provide: ConfigService,
          useValue: {
            get: jest
              .fn()
              .mockReturnValueOnce(
                'https://my-service.com',
              )
              .mockReturnValueOnce(
                'my-token',
              )
              .mockReturnValueOnce(
                mockMonitorId1,
              )
              .mockReturnValueOnce(
                mockMonitorId2,
              ),
          },
        },
      ],
    }).compile();

    service = module.get<CronjobService>(CronjobService);
  });

  it('should not update health check', async() => {
    jest.spyOn<any, any>(global, 'Date').mockImplementation(() => ({
      getDate: jest.fn().mockImplementation(() => 31),
      getMonth: jest.fn().mockImplementation(() => 3),
      getFullYear: jest.fn().mockImplementation(() => 2022),
    }));
    
    const response = await service.offHealthCheck();
    expect(response).toMatchObject({ message: 'Health check not updated' });
  })

  it('should pause health checks', async () => {
    jest.spyOn(global, 'Date').mockImplementation(() => {
      return 'Mon, 14 May 2024 01:00:00 GMT';
    });

    jest.spyOn<any, any>(global, 'Date').mockImplementation(() => ({
      getDate: jest.fn().mockImplementation(() => 14),
      getMonth: jest.fn().mockImplementation(() => 4),
      getFullYear: jest.fn().mockImplementation(() => 2022),
    }));

    for (const id of [mockMonitorId1, mockMonitorId2]) {
        nock(`https://my-service.com/api/v2/monitors/${id}`)  
        .patch('')
         .reply(200, {
          data: {
            id,
            type: 'monitor',
            attributes: {
              pronounceable_name: 'Health check',
              paused_at: '2024-05-14T01:00:00Z',
            }
          }
         });
      }
      
    const response = await service.offHealthCheck();
    expect(response).toMatchObject({ 
      message: 'Health check updated',
      changes: [
        {
          id: mockMonitorId1,
          attributes: {
            pronounceable_name: 'Health check',
            paused_at: '2024-05-14T01:00:00Z',
          }
        },
        {
          id: mockMonitorId2,
          attributes: {
            pronounceable_name: 'Health check',
            paused_at: '2024-05-14T01:00:00Z',
          }
        }
      ]
    });
  });

  it('should resume health check', async () => {
    jest.spyOn(global, 'Date').mockImplementation(() => {
      return 'Mon, 14 May 2024 01:00:00 GMT';
    });

    jest.spyOn<any, any>(global, 'Date').mockImplementation(() => ({
      getDate: jest.fn().mockImplementation(() => 14),
      getMonth: jest.fn().mockImplementation(() => 4),
      getFullYear: jest.fn().mockImplementation(() => 2022),
    }));
    

    for (const id of [mockMonitorId1, mockMonitorId2]) {
        nock(`https://my-service.com/api/v2/monitors/${id}`)  
        .patch('')
         .reply(200, {
          data: {
            id,
            type: 'monitor',
            attributes: {
              pronounceable_name: 'Health check',
              paused_at: '2024-05-14T02:00:00Z',
            }
          }
         });
      }
      
    const response = await service.onHealthCheck();
    expect(response).toMatchObject({ 
      message: 'Health check updated',
      changes: [
        {
          id: mockMonitorId1,
          attributes: {
            pronounceable_name: 'Health check',
            paused_at: '2024-05-14T02:00:00Z',
          }
        },
        {
          id: mockMonitorId2,
          attributes: {
            pronounceable_name: 'Health check',
            paused_at: '2024-05-14T02:00:00Z',
          }
        }
      ]
    });
  });
});
