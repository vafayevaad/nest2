import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Auth } from './entities/auth.entities';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateAuthDto, CreateLoginDto, verifyDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(Auth) private authRepo: Repository<Auth>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.config.get<string>('GOOGLE_EMAIL'),
        pass: this.config.get<string>('GOOGLE_PASS'),
      },
    });
  }

  async register(createAuthDto: CreateAuthDto): Promise<string> {
    const { username, email, password } = createAuthDto;

    const foundedUser = await this.authRepo.findOne({ where: { email } });

    if (foundedUser) throw new UnauthorizedException('User already exist');

    const randomCode = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');

    const hashPassword = await bcrypt.hash(password, 12);

    const user = this.authRepo.create({
      username,
      email,
      password: hashPassword,
      code: randomCode,
      otpTime: Date.now() + 120000,
    });

    await this.authRepo.save(user);

    await this.transporter.sendMail({
      from: 'dianavafoyeva220@gmail.com',
      to: email,
      subject: 'lesson',
      text: `${randomCode}`,
    });

    return 'Registered';
  }

  async login(createLoginDto: CreateLoginDto): Promise<string> {
    const { email, password } = createLoginDto;

    const foundedUser = await this.authRepo.findOne({ where: { email } });

    if (!foundedUser) throw new NotFoundException('User not found');

    const randomCode = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');

    const compare = await bcrypt.compare(password, foundedUser.password);

    if (!compare) throw new UnauthorizedException('Invalid password');

    await this.authRepo.update(foundedUser.id, {
      code: randomCode,
      otpTime: Date.now() + 120000,
    });

    await this.transporter.sendMail({
      from: 'dianavafoyeva220@gmail.com',
      to: email,
      subject: 'lesson',
      text: `${randomCode}`,
    });

    return 'Please check your email';
  }

  async verify(verifyDto: verifyDto) {
    const { email, code } = verifyDto;

    const foundedUser = await this.authRepo.findOne({ where: { email } });

    if (!foundedUser) throw new NotFoundException('User not found');

    if (!foundedUser.code) throw new UnauthorizedException('Code not found');

    if (foundedUser.otpTime && foundedUser.otpTime < Date.now())
      throw new UnauthorizedException('Otp expired');

    if (foundedUser.code !== code) throw new UnauthorizedException('Wrong otp');

    await this.authRepo.update(foundedUser.id, { code: '', otpTime: 0 });

    const payload = { email: foundedUser.email, role: foundedUser.role };

    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}