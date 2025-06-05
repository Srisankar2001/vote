import { Module } from '@nestjs/common';
import { PartyController } from './party.controller';
import { PartyService } from './party.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Party } from 'src/typeorm/entities/party.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Party])],
  controllers: [PartyController],
  providers: [PartyService],
  exports: [PartyService]
})
export class PartyModule { }
