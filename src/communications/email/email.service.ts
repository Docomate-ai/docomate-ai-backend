import { Injectable } from '@nestjs/common';
import { SendEmailDto } from '../dtos/send-email.dto';
import * as nodemailer from 'nodemailer';
import * as sgTransport from 'nodemailer-sendgrid-transport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const options = {
      auth: {
        api_key: configService.get<string>('SENDGRID_API'),
      },
    };

    this.transporter = nodemailer.createTransport(sgTransport(options));
  }

  async sendEmail(data: SendEmailDto) {
    const mailOptions = {
      from: this.configService.get<string>('SENDGRID_MAIL'),
      to: data.to,
      subject: data.subject,
      text: data.textMessage,
      html: data.htmlMessage,
    };

    try {
      const sendInfo = await this.transporter.sendMail(mailOptions);
      console.log(sendInfo);
    } catch (error) {
      console.error(`Error sending Mail: in EmailService - \n ${error}`);
    }
  }
}
