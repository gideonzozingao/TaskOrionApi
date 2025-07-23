import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mysecretkey2025', // Move to env file
      signOptions: { expiresIn: '1d' }, // Token expiration
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
