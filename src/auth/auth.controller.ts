import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { ResponseDto } from 'src/commonDto/response.dto';
import { RegisterDto } from './dto/register.dto';
import { ConfirmDto } from './dto/confirm.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("/signin")
    async signin(@Body() signinDto: SigninDto): Promise<ResponseDto<any>> {
        return this.authService.signin(signinDto);
    }

    @Post("/register")
    async register(@Body() registerDto: RegisterDto): Promise<ResponseDto<any>> {
        return this.authService.register(registerDto);
    }

    @Post("/confirm")
    async confirm(@Body() confirmDto:ConfirmDto): Promise<ResponseDto<any>> {
        return this.authService.confirm(confirmDto);
    }
}
