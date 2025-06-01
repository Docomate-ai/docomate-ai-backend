import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { createCipheriv, createDecipheriv } from 'crypto';
import { TempUser } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { EmailService } from 'src/communications/email/email.service';
import { otpMailTemplate } from './templates/otpHtml.temp';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(TempUser)
    private tempUserRepo: MongoRepository<TempUser>,
    private usersService: UsersService,
    private emailService: EmailService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async whoAmI(token: string) {
    const data = this.jwtService.verify(token);
    const user = await this.usersService.findByMail(data.email);
    if (!user) {
      return new NotFoundException('User does not exist');
    }
    // secrets to decrypt api keys
    const algorithm = this.configService.get<string>('CRYPTO_ALGORITHM');
    const secretKeyString = this.configService.get<string>('CRYPTO_SECRET_KEY');
    const ivString = this.configService.get<string>('CRYPTO_IV');
    if (!algorithm || !secretKeyString || !ivString) {
      throw new InternalServerErrorException(
        'Encryption configuration is missing',
      );
    }
    const secretKey = Buffer.from(secretKeyString, 'hex');
    const iv = Buffer.from(ivString, 'hex');
    const decipherGroq = createDecipheriv(algorithm, secretKey, iv);
    let decryptedGroqAPI =
      decipherGroq.update(user.groqApi, 'hex', 'utf8') +
      decipherGroq.final('utf8');
    const decipherJina = createDecipheriv(algorithm, secretKey, iv);
    let decryptedJinaAPI =
      decipherJina.update(user.jinaApi, 'hex', 'utf8') +
      decipherJina.final('utf8');

    return {
      name: user.name,
      groqApi: decryptedGroqAPI,
      jinaApi: decryptedJinaAPI,
    };
  }

  async registerAccount(
    name: string,
    email: string,
    password: string,
    groqApi: string,
    jinaApi: string,
  ) {
    try {
      // searching if users exist in Users collection
      const user = await this.usersService.findByMail(email);
      // If user is there (not null), then throw error that user already exist
      if (user) {
        throw new BadRequestException('Use Already Exist');
      }
      // Removing previous instances of TempUser of same mail
      await this.tempUserRepo.deleteMany({ email });
      // ## Generating OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpExpires = new Date(Date.now() + 3600000).getTime();
      // ## Create new User
      // salt and hash password
      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(password, salt);
      // Encrypt the APIs
      const algorithm = this.configService.get<string>('CRYPTO_ALGORITHM');
      const secretKeyString =
        this.configService.get<string>('CRYPTO_SECRET_KEY');
      const ivString = this.configService.get<string>('CRYPTO_IV');
      if (!algorithm || !secretKeyString || !ivString) {
        throw new InternalServerErrorException(
          'Encryption configuration is missing',
        );
      }
      const secretKey = Buffer.from(secretKeyString, 'hex');
      const iv = Buffer.from(ivString, 'hex');
      const cipherGroq = createCipheriv(algorithm, secretKey, iv);
      const encryptGroqApi =
        cipherGroq.update(groqApi, 'utf8', 'hex') + cipherGroq.final('hex');
      const cipherJina = createCipheriv(algorithm, secretKey, iv);
      const encryptJinaApi =
        cipherJina.update(jinaApi, 'utf8', 'hex') + cipherJina.final('hex');
      // creating user data
      const newUser = this.tempUserRepo.create({
        name: name,
        email: email,
        password: hashPass,
        groqApi: encryptGroqApi,
        jinaApi: encryptJinaApi,
        otp: otp,
        otpExpires: otpExpires,
      });

      // saving the user
      await this.tempUserRepo.save(newUser);

      // sending the email to the user
      const sendMailData = {
        to: newUser.email,
        subject: `Verification mail for Docomate AI`,
        textMessage: `Hello ${newUser.name} \n Your OTP for Docomate AI is ${otp}`,
        htmlMessage: otpMailTemplate(newUser.name, otp),
      };

      this.emailService.sendEmail(sendMailData);
    } catch (error) {
      console.error(
        `Error in authService: registerAccount: \n ${error.message}`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async verifyAccount(otp: number, email: string) {
    try {
      const tempUser = await this.tempUserRepo.findOne({ where: { email } });
      if (!tempUser) {
        throw new BadRequestException(
          'Account does not exist, please register again.',
        );
      }
      // if otp expires
      const currentTime =
        new Date(Date.now()).getTime() <
        new Date(tempUser.otpExpires).getTime();

      if (!currentTime) {
        throw new BadRequestException('Otp expires, please register again');
      }

      // check if otp matches
      if (tempUser.otp !== otp) {
        throw new BadRequestException('Otp does not matches');
      }

      // add new user and delete temp user
      const user = {
        name: tempUser.name,
        email: tempUser.email,
        password: tempUser.password,
        groqApi: tempUser.groqApi,
        jinaApi: tempUser.jinaApi,
      };

      await this.tempUserRepo.deleteMany({ email });
      const createdUser = await this.usersService.createUser(user);

      // Create JWT token with user id and email
      const token = this.jwtService.sign(
        {
          sub: createdUser._id,
          email: createdUser.email,
        },
        { secret: this.configService.get('JWT_SECRET') },
      );

      return token;
    } catch (err) {
      console.error(`Error verifying user: in Authservice - \n ${err.message}`);
      throw new InternalServerErrorException(err.message);
    }
  }

  async loginAndSendJwt(email: string, password: string) {
    try {
      const user = await this.usersService.findByMail(email);
      if (!user) {
        throw new NotFoundException('User does not exist');
      }

      const comparePass = await bcrypt.compare(password, user.password);
      if (!comparePass) {
        throw new NotFoundException('User does not exist');
      }

      const token = this.jwtService.sign(
        {
          sub: user._id,
          email: user.email,
        },
        { secret: this.configService.get('JWT_SECRET') },
      );

      return token;
    } catch (error) {
      console.error(`error in AuthService: loginAndSendJwt \n ${error}`);
      throw new InternalServerErrorException(error.message);
    }
  }
}
