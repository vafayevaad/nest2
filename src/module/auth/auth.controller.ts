import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, CreateLoginDto, verifyDto } from './dto/create-auth.dto';
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiInternalServerErrorResponse({ description: "Internal server error" })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiUnauthorizedResponse({ description: "User already exists"})
  @ApiOkResponse({ description: "Registered", type: CreateAuthDto})
  @ApiOperation({description: "Ro'yxatdan o'tish uchun"})
  @HttpCode(201)
  @Post("register")
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @ApiNotFoundResponse({ description: "User not found" })
  @ApiUnauthorizedResponse({ description: "Invalid password"})
  @ApiOkResponse({ description: "Please check your email"})
  @HttpCode(200)
  @Post("login")
  login(@Body() createloginDto: CreateLoginDto) {
    return this.authService.login(createloginDto);
  }

  @ApiNotFoundResponse({ description: "User not found" })
  @ApiUnauthorizedResponse({ description: "Code not found"})
  @ApiUnauthorizedResponse({ description: "Otp expired"})
  @ApiUnauthorizedResponse({ description: "Wrong otp"})
  @HttpCode(200)
  @Post("verify")
  verify(@Body() VerifyDto: verifyDto) {
    return this.authService.verify(VerifyDto);
  }
} 