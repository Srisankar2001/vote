import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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

@Module({
  imports: [TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "20011112",
      database: "vote",
      entities:[District,User,Party,Member,Vote],
      synchronize: true
    }), AuthModule, UserModule, DistrictModule, PartyModule, MemberModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
