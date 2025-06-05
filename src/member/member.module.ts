import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/typeorm/entities/member.entity';
import { PartyService } from 'src/party/party.service';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), PartyService],
  controllers: [MemberController],
  providers: [MemberService]
})
export class MemberModule { }
