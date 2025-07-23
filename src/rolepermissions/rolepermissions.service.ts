import { Injectable } from '@nestjs/common';
import { CreateRolepermissionDto } from './dto/create-rolepermission.dto';
import { UpdateRolepermissionDto } from './dto/update-rolepermission.dto';

@Injectable()
export class RolepermissionsService {
  create(createRolepermissionDto: CreateRolepermissionDto) {
    return 'This action adds a new rolepermission';
  }

  findAll() {
    return `This action returns all rolepermissions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rolepermission`;
  }

  update(id: number, updateRolepermissionDto: UpdateRolepermissionDto) {
    return `This action updates a #${id} rolepermission`;
  }

  remove(id: number) {
    return `This action removes a #${id} rolepermission`;
  }
}
