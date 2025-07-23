import { PartialType } from '@nestjs/swagger';
import { CreateProjectcategoryDto } from './create-projectcategory.dto';

export class UpdateProjectcategoryDto extends PartialType(CreateProjectcategoryDto) {}
