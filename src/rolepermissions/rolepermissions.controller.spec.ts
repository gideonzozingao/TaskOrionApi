import { Test, TestingModule } from '@nestjs/testing';
import { RolepermissionsController } from './rolepermissions.controller';
import { RolepermissionsService } from './rolepermissions.service';

describe('RolepermissionsController', () => {
  let controller: RolepermissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolepermissionsController],
      providers: [RolepermissionsService],
    }).compile();

    controller = module.get<RolepermissionsController>(RolepermissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
