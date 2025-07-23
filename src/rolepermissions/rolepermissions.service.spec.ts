import { Test, TestingModule } from '@nestjs/testing';
import { RolepermissionsService } from './rolepermissions.service';

describe('RolepermissionsService', () => {
  let service: RolepermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolepermissionsService],
    }).compile();

    service = module.get<RolepermissionsService>(RolepermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
