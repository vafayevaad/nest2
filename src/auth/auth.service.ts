import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto, CreateLoginDto, verifyDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Auth } from './entities/auth.entity';
import * as nodemailer from 'nodemailer'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthService {
    constructor(@InjectModel(Auth) private authModel:typeof Auth) {}

    private transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "dianavafoyeva220@gmail.com",
        pass: process.env.GOOGLE_PASS
      }
    })
  async register(createAuthDto: CreateAuthDto): Promise<string> {
    const {username, email, password } = createAuthDto

    const foundedUser = await this.authModel.findOne({where: {email}})

    if(foundedUser?.dataValues) throw new UnauthorizedException("User already exist")

    const randomCode = Array.from({length: 6}, () => Math.floor(Math.random() * 10)).join("")

    const hashPassword = await bcrypt.hash(password, 12)

    await this.authModel.create({username, email, password: hashPassword, code: randomCode, otpTime: Date.now() + 120000})

    await this.transporter.sendMail({
      from: "dianavafoyeva220@gmail.com",
      to: email,
      subject: "lesson",
      text: `${randomCode}`,
    })
     return "Registered"
    }


  async login(createLoginDto: CreateLoginDto): Promise<string> {
      const { email, password } = createLoginDto;

      const foundedUser = await this.authModel.findOne({ where: { email }})

      if (!foundedUser) throw new NotFoundException("User already exist")

      const randomCode = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("")

      const compare = await bcrypt.compare(password, foundedUser.dataValues.password)

      if(compare) {
        await this.authModel.update({ code: randomCode, otpTime: Date.now() + 120000}, {where: {email}})

      await this.transporter.sendMail({
      from: "dianavafoyeva220@gmail.com",
      to: email,
      subject: "lesson",
      text: `${randomCode}`,
    })
    return "Please check your email"
      }else {
        throw new UnauthorizedException("Invalid password")
      }
  }


  async verify(verifyDto: verifyDto) {
      const { email, code } = verifyDto;

      const foundedUser = await this.authModel.findOne({ where: { email }})

      if (!foundedUser) throw new NotFoundException("User already exist")

      if(!foundedUser.dataValues.code) throw new UnauthorizedException("Code not found")

      if(foundedUser.dataValues.otpTime && foundedUser.dataValues.otpTime < Date.now()) throw new UnauthorizedException("Otp expired")

      if(foundedUser.dataValues.code !== code) throw new UnauthorizedException("Wrong otp")

      await this.authModel.update({ code: "", otpTime: 0}, {where: {email}})

      const payload = {email: foundedUser.dataValues.email }

      const token = jwt.sign(payload, "hsdiguey", {expiresIn: "1h"})

      return token
  }
}