import { Module } from '@nestjs/common';
import { ProjectcategoryService } from './projectcategory.service';
import { ProjectcategoryController } from './projectcategory.controller';

@Module({
  controllers: [ProjectcategoryController],
  providers: [ProjectcategoryService],
})
export class ProjectcategoryModule {}
