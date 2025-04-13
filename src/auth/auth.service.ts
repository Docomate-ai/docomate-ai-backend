import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { TempUser } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { EmailService } from 'src/communications/email/email.service';
import { otpMailTemplate } from './templates/otpHtml.temp';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(TempUser)
    private tempUserRepo: MongoRepository<TempUser>,
    private usersService: UsersService,
    private emailService: EmailService,
  ) {}

  async registerAccount(name: string, email: string, password: string) {
    try {
      // searching if users exist in Users collection
      const user = await this.usersService.findByMail(email);
      console.log(user);
      // If user is there (not null), then throw error that user already exist
      if (user) {
        throw new BadRequestException('Use Already Exist');
      }
      // Removing previous instances of TempUser of same mail
      await this.tempUserRepo.deleteMany({ email });
      // ## Generating OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpExpires = new Date(Date.now() + 3600000).getTime();
      console.log(new Date());
      console.log(new Date(otpExpires));
      // ## Create new User
      // salt and hash password
      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(password, salt);
      // creating user data
      const newUser = this.tempUserRepo.create({
        name: name,
        email: email,
        password: hashPass,
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

      return { message: 'Mail has been sent to your email' };
    } catch (error) {
      console.error(
        `Error in authService: registerAccount: \n ${error.message}`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
