import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/typeorm/entities/member.entity';
import { PartyService } from 'src/party/party.service';
import { PartyModule } from 'src/party/party.module';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), PartyModule],
  controllers: [MemberController],
  providers: [MemberService]
})
export class MemberModule { }
