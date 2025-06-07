import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { SetPasswordDto } from './dto/setPassword.dto';
import { AdminSigninDto } from './dto/adminSignin.dto';
import { TempUserGuard } from 'src/common/guard/tempUser.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("/signin")
    async signin(@Body() signinDto: SigninDto): Promise<ResponseDto<any>> {
        return this.authService.signin(signinDto);
    }

    @Post("/admin/signin")
    async adminSignin(@Body() adminSigninDto: AdminSigninDto): Promise<ResponseDto<any>> {
        return this.authService.adminSignin(adminSigninDto);
    }

    @Post("/register")
    async register(@Body() registerDto: RegisterDto): Promise<ResponseDto<any>> {
        return this.authService.register(registerDto);
    }

    @Post("/set_password")
    @UseGuards(TempUserGuard)
    async setPassword(@Req() req: Request, @Body() setPasswordDto: SetPasswordDto): Promise<ResponseDto<any>> {
        return this.authService.setPassword(req, setPasswordDto);
    }

    @Get("/confirm/")
    async confirm(@Res() res: Response, @Query('nic') nic: string, @Query('otp') otp: string) {
        return this.authService.confirm(res, nic, otp);
    }
}
