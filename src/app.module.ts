import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DistrictModule } from './district/district.module';
import { PartyModule } from './party/party.module';
import { MemberModule } from './member/member.module';
import { User } from './typeorm/entities/user.entity';
import { District } from './typeorm/entities/district.entity';
import { Party } from './typeorm/entities/party.entity';
import { Member } from './typeorm/entities/member.entity';
import { Vote } from './typeorm/entities/vote.entity';
import { MailModule } from './mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AdminModule } from './admin/admin.module';
config()

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [District, User, Party, Member, Vote],
      synchronize: true
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    })
    , AuthModule, UserModule, DistrictModule, PartyModule, MemberModule, MailModule, AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
