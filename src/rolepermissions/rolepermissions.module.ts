import { Module } from '@nestjs/common';
import { RolepermissionsService } from './rolepermissions.service';
import { RolepermissionsController } from './rolepermissions.controller';

@Module({
  controllers: [RolepermissionsController],
  providers: [RolepermissionsService],
})
export class RolepermissionsModule {}
