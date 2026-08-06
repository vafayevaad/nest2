import { Controller, Post, Body, HttpCode, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, CreateLoginDto, verifyDto } from './dto/create-auth.dto';
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

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
  //google
  @Get("google")
  @UseGuards(AuthGuard("google"))
  async google(@Req() req) {

  }

  @Get("google/callback") 
  @UseGuards(AuthGuard("google"))
  async googleRedrict(@Req() req) {
    
    return this.authService.openId(req.user)
  }


  //github
  @Get("github")
  @UseGuards(AuthGuard("github"))
  async github(@Req() req) {

  }

  @Get("github/callback") 
  @UseGuards(AuthGuard("github"))
  async githubRedrict(@Req() req) {
    
    return this.authService.openId(req.user)
  }
}
