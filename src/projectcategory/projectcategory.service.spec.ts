import { Test, TestingModule } from '@nestjs/testing';
import { ProjectcategoryService } from './projectcategory.service';

describe('ProjectcategoryService', () => {
  let service: ProjectcategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectcategoryService],
    }).compile();

    service = module.get<ProjectcategoryService>(ProjectcategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
