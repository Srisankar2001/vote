import { Module } from '@nestjs/common';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District } from 'src/typeorm/entities/district.entity';
import { User } from 'src/typeorm/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,District])],
  controllers: [DistrictController],
  providers: [DistrictService],
  exports: [DistrictService]
})
export class DistrictModule{ }
