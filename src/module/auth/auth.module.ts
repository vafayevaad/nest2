import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Auth } from './entities/auth.entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt-strategy';
import { GoogleStrategy } from './google-strategy';
import { GithubStrategy } from './github-strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Auth]),
  PassportModule,
  JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      secret: config.get<string>('SECRET_KEY'),
      signOptions: {expiresIn: '6000s'}
    })
  })
],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, GithubStrategy],
  exports: [JwtModule], 
})
export class AuthModule {} 