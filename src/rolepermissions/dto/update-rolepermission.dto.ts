import { PartialType } from '@nestjs/swagger';
import { CreateRolepermissionDto } from './create-rolepermission.dto';

export class UpdateRolepermissionDto extends PartialType(CreateRolepermissionDto) {}
