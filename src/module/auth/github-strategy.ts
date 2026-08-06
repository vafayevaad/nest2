import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile } from "passport";
import { Strategy } from "passport-github2";

@Injectable() 
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(configService: ConfigService) {
    super ({
    clientID: configService.get<string>("GITHUB_CLIENT_ID")!,
    clientSecret: configService.get<string>("GITHUB_CLIENT_SECRET")!,
    callbackURL: "http://localhost:4001/auth/github/callback",
    scope: ["user:email"]
    })
  }
  validate(access_token: string, refresh_token: string, profile: Profile, done: Function) {
    const { username, emails, photos } = profile

    

    const user = {
      lastname: profile.id,
      username: username,
      email: emails?.[0]?.value || null,
      profilePicture: photos?.[0]?.value || null,
      access_token
    }
    
    done(null, user) 
  } 
}