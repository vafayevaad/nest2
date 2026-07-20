import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, CreateLoginDto, verifyDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(201)
  @Post("register")
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @HttpCode(200)
  @Post("login")
  login(@Body() createloginDto: CreateLoginDto) {
    return this.authService.login(createloginDto);
  }

  @HttpCode(200)
  @Post("verify")
  verify(@Body() VerifyDto: verifyDto) {
    return this.authService.verify(VerifyDto);
  }
}