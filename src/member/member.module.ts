import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/typeorm/entities/member.entity';
import { PartyModule } from 'src/party/party.module';
import { User } from 'src/typeorm/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Member]), PartyModule],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService]
})
export class MemberModule { }
