import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolepermissionsService } from './rolepermissions.service';
import { CreateRolepermissionDto } from './dto/create-rolepermission.dto';
import { UpdateRolepermissionDto } from './dto/update-rolepermission.dto';

@Controller('rolepermissions')
export class RolepermissionsController {
  constructor(private readonly rolepermissionsService: RolepermissionsService) {}

  @Post()
  create(@Body() createRolepermissionDto: CreateRolepermissionDto) {
    return this.rolepermissionsService.create(createRolepermissionDto);
  }

  @Get()
  findAll() {
    return this.rolepermissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolepermissionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRolepermissionDto: UpdateRolepermissionDto) {
    return this.rolepermissionsService.update(+id, updateRolepermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolepermissionsService.remove(+id);
  }
}
