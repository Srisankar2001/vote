import { Module } from '@nestjs/common';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { Vote } from 'src/typeorm/entities/vote.entity';
import { UserModule } from 'src/user/user.module';
import { PartyModule } from 'src/party/party.module';
import { MemberModule } from 'src/member/member.module';
import { DistrictModule } from 'src/district/district.module';

@Module({
  imports:[TypeOrmModule.forFeature([User,Vote]),UserModule,PartyModule,MemberModule,DistrictModule],
  controllers: [VoteController],
  providers: [VoteService]
})
export class VoteModule {}
