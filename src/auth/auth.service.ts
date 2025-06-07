import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SigninDto } from './dto/signin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import { ResponseDto } from '../common/dto/response.dto';
import { ResponseAuthDto } from './dto/responseAuthDto.dto';
import { Request, Response } from 'express';
import { MailService } from 'src/mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { SetPasswordDto } from './dto/setPassword.dto';
import { AdminSigninDto } from './dto/adminSignin.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly mailService: MailService
    ) { }

    async getUserById(id: number): Promise<User | null> {
        return this.userRepo.findOne({ where: { userId: id } });
    }

    async getUserByNIC(nic: string): Promise<User | null> {
        return this.userRepo.findOne({ where: { userNIC: nic } });
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return this.userRepo.findOne({ where: { userEmail: email } });
    }


    async register(registerDto: RegisterDto): Promise<ResponseDto<any>> {
        try {
            const user = await this.getUserByNIC(registerDto.nic);
            if (!user) {
                return new ResponseDto(400, 'Your NIC is Not Registerd', null);
            }

            if (user.isVerified) {
                return new ResponseDto(400, 'Your Account is Already verified', null);
            }

            await this.mailService.sendMail(user.userEmail, user.userNIC, user.otp);

            return new ResponseDto(200, 'Verification Mail Send Successfully', null);
        } catch (error) {
            return new ResponseDto(500, 'Internal Server Error', error);
        }
    }

    async signin(signinDto: SigninDto): Promise<ResponseDto<any>> {
        try {
            const user = await this.getUserByNIC(signinDto.nic);
            if (!user) {
                return new ResponseDto(400, 'Your NIC is Not Registerd', null);
            }

            if (!user.isVerified) {
                return new ResponseDto(400, 'Your Account is Not Verified Yet', null);
            }

            if (user.isVoted) {
                return new ResponseDto(400, 'You Already Voted', null);
            }

            const match = compare(signinDto.password, user.userPassword)
            if (!match) {
                return new ResponseDto(400, 'Password is Incorrect', null);
            }

            const data = {
                id: user.userId,
                nic: user.userNIC,
                role: user.userRole
            }

            const duration = parseInt(process.env.DURATION || "86400000")

            const expireAt = new Date(Date.now() + duration).toISOString();

            const token = sign(data, process.env.SECRET_KEY, { expiresIn: duration });

            const response = new ResponseAuthDto(token, expireAt);

            return new ResponseDto(200, 'Login Successful', response);
        } catch (error) {
            return new ResponseDto(500, 'Internal Server Error', null);
        }
    }

    async adminSignin(adminSigninDto: AdminSigninDto): Promise<ResponseDto<any>> {
        try {
            const user = await this.getUserByEmail(adminSigninDto.email);
            if (!user) {
                return new ResponseDto(400, 'Email Not Found', null);
            }

            const match = compare(adminSigninDto.password, user.userPassword)
            if (!match) {
                return new ResponseDto(400, 'Password is Incorrect', null);
            }

            const data = {
                id: user.userId,
                nic: user.userNIC,
                role: user.userRole
            }

            const duration = parseInt(process.env.DURATION || "86400000")

            const expireAt = new Date(Date.now() + duration).toISOString();

            const token = sign(data, process.env.SECRET_KEY, { expiresIn: duration });

            const response = new ResponseAuthDto(token, expireAt);

            return new ResponseDto(200, 'Login Successful', response);
        } catch (error) {
            return new ResponseDto(500, 'Internal Server Error', null);
        }
    }

    async confirm(res: Response, nic: string, otp: string) {
        try {
            const frontendBaseURL = process.env.FRONTEND_URL
            const user = await this.getUserByNIC(nic);
            if (!user) {
                const status = false
                const message = encodeURIComponent("Your Account is Not Registered");
                const link = `${frontendBaseURL}/verified?status=${status}&message=${message}`;
                return res.redirect(link);
            }

            if (user.isVerified) {
                const status = false
                const message = encodeURIComponent("Your Account is Already verified");
                const link = `${frontendBaseURL}/verified?status=${status}&message=${message}`;
                return res.redirect(link);
            }

            if (user.otp !== otp) {
                const status = false
                const message = encodeURIComponent("Incorrect OTP");
                const link = `${frontendBaseURL}/verified?status=${status}&message=${message}`;
                return res.redirect(link);
            }

            user.isVerified = true;
            user.otp = "";

            await this.userRepo.save(user);

            const data = {
                id: user.userId,
                nic: user.userNIC
            }

            const duration = parseInt(process.env.DURATION || "86400000")

            const expireAt = new Date(Date.now() + duration).toISOString();

            const token = sign(data, process.env.TEMP_SECRET_KEY, { expiresIn: duration });

            const status = true
            const message = encodeURIComponent("Account Verified Successfully");
            const link = `${frontendBaseURL}/verified?status=${status}&message=${message}&token=${token}&expireAt=${expireAt}`;
            return res.redirect(link);
        } catch (error) {
            return new ResponseDto(500, 'Internal Server Error', null);
        }
    }

    async setPassword(req: Request, setPasswordDto: SetPasswordDto): Promise<ResponseDto<any>> {
        try {
            const user = await this.getUserById(Number(req.id));
            if (!user) {
                return new ResponseDto(400, 'Your NIC is Not Registerd', null);
            }

            if (!user.isVerified) {
                return new ResponseDto(400, 'Your Account is Not Verified Yet', null);
            }


            const hashed = await hash(setPasswordDto.password, 10)

            user.userPassword = hashed
            await this.userRepo.save(user);
            return new ResponseDto(200, 'Password Set Successfully', null);
        } catch (error) {
            return new ResponseDto(500, 'Internal Server Error', null);
        }
    }
}
