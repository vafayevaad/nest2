import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable() 
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super ({
    clientID: configService.get<string>("GOOGLE_CLIENT_ID")!,
    clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET")!,
    callbackURL: "http://localhost:4001/auth/google/callback",
    scope: ["email", "profile"]
    })
  }
  validate(access_token:string, refresh_token:string, profile: any, done: VerifyCallback) {
    const { name, emails, photos } = profile

    if (!emails[0].value) throw new UnauthorizedException("Email not found")

    const userData = {
      lastname: name.familyName,
      firstname: name.familyName,
      email: emails[0].value,
      profilePicture: photos[0].value,
      access_token
    }
    
    done(null, userData) 
  } 
}