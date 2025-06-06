import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports:[TypeOrmModule.forFeature([User]), MailModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
