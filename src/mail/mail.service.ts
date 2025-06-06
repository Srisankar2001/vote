import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendMail(to: string, nic: string, otp: string) {
        const backendUrl = process.env.BACKEND_URL;
        const link = `${backendUrl}/auth/confirm?nic=${nic}&otp=${otp}`;
        await this.mailerService.sendMail({
            to,
            subject: 'Verify Your Account',
            html: `
        <p>Hello,</p>
        <p>Please click the link below to verify your account:</p>
        <a href="${link}">${link}</a>
      `,
        });
    }
}
