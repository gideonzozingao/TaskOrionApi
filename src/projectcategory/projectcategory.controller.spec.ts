import { Test, TestingModule } from '@nestjs/testing';
import { ProjectcategoryController } from './projectcategory.controller';
import { ProjectcategoryService } from './projectcategory.service';

describe('ProjectcategoryController', () => {
  let controller: ProjectcategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectcategoryController],
      providers: [ProjectcategoryService],
    }).compile();

    controller = module.get<ProjectcategoryController>(ProjectcategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
