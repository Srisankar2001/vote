import { Module } from '@nestjs/common';
import { PartyController } from './party.controller';
import { PartyService } from './party.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Party } from 'src/typeorm/entities/party.entity';
import { User } from 'src/typeorm/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Party])],
  controllers: [PartyController],
  providers: [PartyService],
  exports: [PartyService]
})
export class PartyModule { }
