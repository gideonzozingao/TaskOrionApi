import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateAuthenticationDto } from './dto/create-authentication.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateAuthenticationDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.usersService.create({ ...dto, password: hashedPassword });
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}
