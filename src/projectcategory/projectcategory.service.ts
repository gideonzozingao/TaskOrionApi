import { Injectable } from '@nestjs/common';
import { CreateProjectcategoryDto } from './dto/create-projectcategory.dto';
import { UpdateProjectcategoryDto } from './dto/update-projectcategory.dto';

@Injectable()
export class ProjectcategoryService {
  create(createProjectcategoryDto: CreateProjectcategoryDto) {
    return 'This action adds a new projectcategory';
  }

  findAll() {
    return `This action returns all projectcategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} projectcategory`;
  }

  update(id: number, updateProjectcategoryDto: UpdateProjectcategoryDto) {
    return `This action updates a #${id} projectcategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectcategory`;
  }
}
